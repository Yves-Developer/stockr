import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController";
import { protect, authorize } from "../middleware/Auth";

const router = Router();

router.get("/", protect, getAllProducts);
router.get("/:id", protect, getProductById);
router.post("/", protect, authorize("admin", "manager"), createProduct);
router.put("/:id", protect, authorize("admin", "manager"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;