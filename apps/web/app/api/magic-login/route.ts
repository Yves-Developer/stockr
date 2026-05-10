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

    // 2. Create a session on the Vercel side
    const session = await (auth.api as any).createSession({
        body: {
            userId: userId,
        }
    });

    if (!session || !session.session) {
        return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 });
    }

    // 3. Prepare the response
    const response = NextResponse.json({ 
        success: true, 
        message: "Logged in successfully",
        sessionToken: session.session.token, // Return this so client can put it in localStorage
        user: session.user
    });

    // 4. Manually set the cookie so the browser recognizes the session for Vercel
    // We use the same settings as better-auth (secure, httpOnly, etc.)
    const cookieName = process.env.NODE_ENV === "production" 
        ? "__Secure-better-auth.session_token" 
        : "better-auth.session_token";

    response.cookies.set(cookieName, session.session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

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
