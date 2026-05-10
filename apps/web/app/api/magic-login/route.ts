import { auth, db } from "../../../lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://stockr-server.onrender.com/api",
});

export async function POST(req: Request) {
  console.log("[MagicLogin] Received request");
  try {
    const { token } = await req.json();

    if (!token) {
      console.warn("[MagicLogin] Missing token in request");
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
    }

    console.log("[MagicLogin] Verifying token with Render backend...");
    // 1. Verify the token with the Render backend
    const verifyRes = await api.post("/auth/verify-magic-token", { token });
    
    if (!verifyRes.data.success || !verifyRes.data.userId) {
      console.error("[MagicLogin] Token verification failed on backend:", verifyRes.data);
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const userId = verifyRes.data.userId;
    console.log("[MagicLogin] Token verified for userId:", userId);

    const authApi = auth.api as any;
    const createSessionFn = authApi?.createSession;

    let sessionData: any;
    let userData: any = null;
    let finalSessionToken: string;

    if (typeof createSessionFn === "function") {
        console.log("[MagicLogin] Using Better Auth API to create session...");
        const session = await createSessionFn({
            body: {
                userId: userId,
            }
        });

        if (!session) {
            console.error("[MagicLogin] Failed to create session in Better Auth (session is null)");
            return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 });
        }

        // Handle both { session, user } and direct session object structures
        sessionData = (session as any).session || session;
        userData = (session as any).user || null;
        finalSessionToken = sessionData?.token || (sessionData as any).id;
    } else {
        console.warn("[MagicLogin] createSession not found. Falling back to MANUAL database insertion...");
        
        finalSessionToken = crypto.randomBytes(40).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        const newSession = {
            token: finalSessionToken,
            userId: userId,
            expiresAt: expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
            userAgent: req.headers.get("user-agent") || "unknown",
            ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        };

        await db.collection("session").insertOne(newSession);
        console.log("[MagicLogin] Manual session record created in 'session' collection");
    }

    if (!finalSessionToken) {
        console.error("[MagicLogin] No token generated");
        return NextResponse.json({ success: false, message: "Session token missing" }, { status: 500 });
    }

    console.log("[MagicLogin] Session created successfully. Token:", `...${finalSessionToken.slice(-6)}`);

    // 3. Prepare the response
    const response = NextResponse.json({ 
        success: true, 
        message: "Logged in successfully",
        sessionToken: finalSessionToken,
        user: userData
    });

    // 4. Manually set the cookie
    // We set both the standard and the secure prefixed version to ensure compatibility
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    response.cookies.set("better-auth.session_token", finalSessionToken, cookieOptions);
    if (process.env.NODE_ENV === "production") {
        response.cookies.set("__Secure-better-auth.session_token", finalSessionToken, cookieOptions);
    }

    console.log(`[MagicLogin] Cookies set for token ...${finalSessionToken.slice(-6)}`);

    return response;
  } catch (error: any) {
    console.error("[MagicLogin] Critical Error:", error.response?.data || error.message);
    return NextResponse.json({ 
        success: false, 
        message: "Magic login failed",
        error: error.message 
    }, { status: 500 });
  }
}
