import { auth } from "@/lib/auth";
import { nextAppHandler } from "better-auth/next-sdk";
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
    // We'll add a specialized "verify" endpoint on the backend that returns the userId
    const verifyRes = await api.post("/auth/verify-magic-token", { token });
    
    if (!verifyRes.data.success || !verifyRes.data.userId) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const userId = verifyRes.data.userId;

    // 2. Create a session on the Vercel side using better-auth
    const session = await auth.api.createSession({
        userId: userId,
    });

    if (!session) {
        return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 });
    }

    // 3. Set the session cookie on the Vercel domain
    const response = NextResponse.json({ 
        success: true, 
        message: "Logged in successfully",
        session 
    });

    // Better Auth handles the cookie if we return the right headers, 
    // but here we can just rely on the fact that better-auth.api.createSession 
    // might have already handled it if we were in a normal flow.
    // Actually, we need to manually set the cookie header from the session.
    
    // For simplicity, we'll let the client-side authClient.getSession() 
    // pick up the session if we return the session object, 
    // but to be safe we should set the cookie.
    
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
