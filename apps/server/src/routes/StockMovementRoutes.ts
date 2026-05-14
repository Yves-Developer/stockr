import { Router } from "express";
import {
  getAllStockMovements,
  getStockMovementById,
  getMovementsByProduct,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement,
} from "../controllers/StockMovementController";
import { protect, authorize } from "../middleware/Auth";

const router: Router = Router();

router.get("/", protect, getAllStockMovements);
router.get("/:id", protect, getStockMovementById);
router.get("/product/:productId", protect, getMovementsByProduct);
router.post("/", protect, authorize("admin", "manager", "staff"), createStockMovement);
router.put("/:id", protect, authorize("admin", "manager", "staff"), updateStockMovement);
router.delete("/:id", protect, authorize("admin"), deleteStockMovement);

export default router;