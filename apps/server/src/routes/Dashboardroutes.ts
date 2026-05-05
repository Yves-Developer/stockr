import { Router } from "express";
import { getDashboardStats } from "../controllers/Dashboardcontroller";
import { protect } from "../middleware/Auth";

const router = Router();

router.get("/", protect, getDashboardStats);

export default router;