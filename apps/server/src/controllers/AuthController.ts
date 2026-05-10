import { Request, Response } from "express";
import User from "../models/User";
import { auth } from "../lib/auth";
import crypto from "crypto";

// ─── GET /api/auth/magic-token ───────────────────────────────────────────────
// Generate a magic token for the current logged-in user
export const generateMagicToken = async (req: any, res: Response) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    await User.findByIdAndUpdate(req.user.id, {
      magicToken: token,
      magicTokenExpires: expires,
    });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Generate magic token error:", error);
    res.status(500).json({ success: false, message: "Failed to generate magic token" });
  }
};

// ─── POST /api/auth/magic-login ──────────────────────────────────────────────
// Login using a magic token
export const magicLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const user = await User.findOne({
      magicToken: token,
      magicTokenExpires: { $gt: new Date() },
    }).select("+magicToken +magicTokenExpires");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Create a new session in better-auth
    // Use any cast to bypass strict InferAPI issues if createSession isn't found in types
    const session = await (auth.api as any).createSession({
        userId: user.id
    });

    // Clear the token after use
    await User.findByIdAndUpdate(user.id, {
      magicToken: null,
      magicTokenExpires: null,
    });

    res.status(200).json({ 
        success: true, 
        session,
        message: "Magic login successful" 
    });
  } catch (error) {
    console.error("Magic login error:", error);
    res.status(500).json({ success: false, message: "Magic login failed" });
  }
};
