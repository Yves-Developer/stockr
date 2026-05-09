import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

export interface AuthRequest extends Request {
  user?: any;
  session?: any;
}

import { fromNodeHeaders } from "better-auth/node";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Headers:", req.headers.cookie);
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    console.log("Session found:", !!session);

    if (!session || !session.user) {
      console.log("Auth failed: No session or user found");
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized",
        debug: { hasSession: !!session, hasUser: !!session?.user }
      });
    }

    req.user = session.user;
    if (req.user && !req.user.role) {
      req.user.role = "staff";
    }
    req.session = session.session;
    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Not authorized, invalid session",
      error: error.message 
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Default to 'staff' if role is missing (common for users created before role schema)
    if (req.user && !req.user.role) {
      req.user.role = "staff";
    }
    console.log("CHECKING ROLE:", req.user?.role, "REQUIRED:", roles);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user?.role} is not authorized to access this route`,
      });
    }
    next();
  };
};