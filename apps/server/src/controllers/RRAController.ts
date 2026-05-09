import { Request, Response } from "express";
import { RRAService } from "../services/RRAService";

// POST /api/rra/initialize
export const initializeRRA = async (_req: Request, res: Response) => {
  try {
    const data = await RRAService.initializeDevice();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/rra/codes
export const getRRACodes = async (_req: Request, res: Response) => {
  try {
    const data = await RRAService.getStandardCodes();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
