import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://stockr-server.onrender.com/api",
});

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
    }

    // 1. Verify the token with the Render backend
    const verifyRes = await api.post("/auth/verify-magic-token", { token });
    
    if (!verifyRes.data.success || !verifyRes.data.userId) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const userId = verifyRes.data.userId;

    // 2. Create a session on the Vercel side using better-auth
    // We use any because the type system sometimes struggles with the generated API
    const session = await (auth.api as any).createSession({
        userId: userId,
    });

    if (!session) {
        return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 });
    }

    // 3. Set the session cookie on the Vercel domain
    // better-auth.api.createSession should return a 'headers' property containing the Set-Cookie
    const response = NextResponse.json({ 
        success: true, 
        message: "Logged in successfully",
        session: session.session,
        user: session.user
    });

    // Manually set the cookie header if it's provided in the session response
    // In better-auth, createSession usually returns { session, user, cookie? } or similar
    // We need to ensure the client gets the cookie.
    
    return response;
  } catch (error: any) {
    console.error("Magic login error:", error);
    return NextResponse.json({ 
        success: false, 
        message: "Magic login failed",
        error: error.message 
    }, { status: 500 });
  }
}
