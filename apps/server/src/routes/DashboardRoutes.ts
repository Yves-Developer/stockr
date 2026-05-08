import { Router } from "express";
import { getDashboardStats } from "../controllers/DashboardController";
import { protect } from "../middleware/Auth";

const router: Router = Router();

router.get("/", protect, getDashboardStats);

export default router;