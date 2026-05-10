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
    // Use the internal API to create a session and get the headers
    const session = await auth.api.createSession({
        body: {
            userId: userId,
        },
        asResponse: true // This is key: it returns a Response object with Set-Cookie headers
    });

    return session; // This returns the response directly with the Set-Cookie headers
  } catch (error: any) {
    console.error("Magic login error:", error);
    return NextResponse.json({ 
        success: false, 
        message: "Magic login failed",
        error: error.message 
    }, { status: 500 });
  }
}
