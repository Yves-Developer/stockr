import { Request, Response } from "express";
import User from "../models/User";
import { auth } from "../lib/auth";
import crypto from "crypto";

// ─── GET /api/auth/magic-token ───────────────────────────────────────────────
// Generate a magic token for the current logged-in user
export const generateMagicToken = async (req: any, res: Response) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

    if (!req.user || !req.user.id) {
      console.warn("[Auth] Magic token requested without session");
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    console.log(`[Auth] Attempting to save token ...${token.slice(-6)} for user ID: ${req.user.id}`);
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      magicToken: token,
      magicTokenExpires: expires,
    }, { new: true });

    if (!updatedUser) {
      console.error(`[Auth] FAILED to find/update user ${req.user.id} with token`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`[Auth] Token ...${token.slice(-6)} successfully saved to DB for ${updatedUser.email}`);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("[Auth] Generate magic token error:", error);
    res.status(500).json({ success: false, message: "Failed to generate magic token" });
  }
};

// ─── POST /api/auth/magic-login ──────────────────────────────────────────────
// Login using a magic token (Directly to backend - rarely used now with Vercel bridge)
export const magicLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    console.log(`[Auth] Direct magic login attempt with token: ${token?.substring(0, 8)}...`);

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const user = await User.findOne({
      magicToken: token,
      magicTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      console.warn("[Auth] Invalid or expired magic token");
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const session = await (auth.api as any).createSession({
        userId: user.id
    });

    console.log(`[Auth] Successful magic login for user: ${user.id}`);
    res.status(200).json({ 
        success: true, 
        session,
        message: "Magic login successful" 
    });
  } catch (error) {
    console.error("[Auth] Magic login error:", error);
    res.status(500).json({ success: false, message: "Magic login failed" });
  }
};

// ─── POST /api/auth/verify-magic-token ──────────────────────────────────────
// Verify a magic token and return the userId (used by Vercel frontend)
export const verifyMagicToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    console.log(`[Auth] Verifying magic token: ...${token?.slice(-6)}`);

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    // Use lean() and explicit projection to bypass any schema hidden field issues
    const user = await User.findOne({ magicToken: token })
      .select("_id email magicToken magicTokenExpires")
      .lean();

    if (!user) {
      console.warn(`[Auth] Token ...${token?.slice(-6)} not found in database`);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const now = new Date();
    if (!user.magicTokenExpires || user.magicTokenExpires < now) {
      console.warn(`[Auth] Token ...${token?.slice(-6)} has expired at ${user.magicTokenExpires}`);
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    console.log(`[Auth] Token verified for user: ${user._id} (${user.email})`);
    
    res.status(200).json({ 
        success: true, 
        userId: user._id.toString(),
        message: "Token verified" 
    });
  } catch (error) {
    console.error("[Auth] Token verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
