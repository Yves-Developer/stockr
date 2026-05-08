import { Router } from "express";
import {
  getAllStockMovements,
  getStockMovementById,
  getMovementsByProduct,
  createStockMovement,
  deleteStockMovement,
} from "../controllers/StockMovementContRoller";
import { protect, authorize } from "../middleware/Auth";

const router = Router();

router.get("/", protect, getAllStockMovements);
router.get("/:id", protect, getStockMovementById);
router.get("/product/:productId", protect, getMovementsByProduct);
router.post("/", protect, authorize("admin", "manager"), createStockMovement);
router.delete("/:id", protect, authorize("admin"), deleteStockMovement);

export default router;