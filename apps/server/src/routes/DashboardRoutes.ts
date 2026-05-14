import { Router } from "express";
import { getDashboardStats, getChartData } from "../controllers/DashboardController";
import { protect } from "../middleware/Auth";

const router: Router = Router();

router.get("/", protect, getDashboardStats);
router.get("/chart", protect, getChartData);

export default router;