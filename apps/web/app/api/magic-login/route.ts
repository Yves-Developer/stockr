import { auth } from "@/lib/auth";
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
    const session = await (auth.api as any).createSession({
        body: {
            userId: userId,
        }
    });

    if (!session || !session.session) {
        console.error("[MagicLogin] Failed to create session in Better Auth");
        return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 });
    }

    console.log("[MagicLogin] Session created successfully:", session.session.id);

    // 3. Prepare the response
    const response = NextResponse.json({ 
        success: true, 
        message: "Logged in successfully",
        sessionToken: session.session.token,
        user: session.user
    });

    // 4. Manually set the cookie
    const cookieName = process.env.NODE_ENV === "production" 
        ? "__Secure-better-auth.session_token" 
        : "better-auth.session_token";

    console.log(`[MagicLogin] Setting cookie: ${cookieName}`);
    response.cookies.set(cookieName, session.session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

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
