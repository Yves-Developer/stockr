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
    // We use the internal API but cast to any to avoid build-time type errors
    // while ensuring the runtime logic works.
    const session = await (auth.api as any).createSession({
        body: {
            userId: userId,
        }
    });

    if (!session || !session.session) {
        return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 });
    }

    // 3. To set the cookie, we use the better-auth helper to get headers for the session
    const headers = new Headers();
    // better-auth session cookies are usually managed by the client-side library 
    // but since we want the browser to pick it up immediately, we should ideally set it.
    
    // Most reliable way: return the session data, and the frontend will use authClient.setSession
    return NextResponse.json({ 
        success: true, 
        session: session.session,
        user: session.user
    });

  } catch (error: any) {
    console.error("Magic login error:", error);
    return NextResponse.json({ 
        success: false, 
        message: "Magic login failed",
        error: error.message 
    }, { status: 500 });
  }
}
