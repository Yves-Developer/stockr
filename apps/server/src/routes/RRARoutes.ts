import { Router } from "express";
import { initializeRRA, getRRACodes } from "../controllers/RRAController";
import { protect } from "../middleware/Auth";

const router: Router = Router();

router.post("/initialize", protect, initializeRRA);
router.get("/codes", protect, getRRACodes);
router.post("/report-sale", protect, (req, res) => {
  // Mock RRA Sale Reporting
  res.status(200).json({
    success: true,
    message: "Sale reported to RRA successfully",
    ebmNumber: `EBM-${Math.random().toString(36).substring(7).toUpperCase()}`,
    receiptUrl: "https://rra.gov.rw/receipt/mock-id"
  });
});
router.get("/sync-status", protect, (req, res) => {
  res.status(200).json({
    success: true,
    lastSync: new Date().toISOString(),
    status: "Healthy",
    pendingTransactions: 0
  });
});

export default router;
