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
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, invalid session" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role is not authorized to access this route`,
      });
    }
    next();
  };
};