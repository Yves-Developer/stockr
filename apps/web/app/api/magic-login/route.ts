import { auth } from "../../../lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";

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

    // 2. Create a session on the Vercel side
    console.log("[MagicLogin] Creating session in Better Auth...");
    
    const authApi = auth.api as any;
    const createSessionFn = authApi?.createSession;

    if (typeof createSessionFn !== "function") {
        const methods = Object.keys(authApi || {}).join(", ");
        console.error(`[MagicLogin] createSession is not a function. Available: ${methods}`);
        return NextResponse.json({ 
            success: false, 
            message: "Auth configuration error",
            debug: { methods }
        }, { status: 500 });
    }

    const session = await createSessionFn({
        body: {
            userId: userId,
        }
    });

    // Handle both { session, user } and direct session object structures
    const sessionData = (session as any).session || session;
    const userData = (session as any).user || null;
    const finalSessionToken = sessionData?.token || (sessionData as any).id;

    if (!finalSessionToken) {
        console.error("[MagicLogin] No token found in session object:", JSON.stringify(session));
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
