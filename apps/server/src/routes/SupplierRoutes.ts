import { Router } from "express";
import {
  getAllSuppliers,
  getSupplierById,
  getProductsBySupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/SupplierController";
import { protect, authorize } from "../middleware/Auth";

const router = Router();

router.get("/", protect, getAllSuppliers);
router.get("/:id", protect, getSupplierById);
router.get("/:id/products", protect, getProductsBySupplier);
router.post("/", protect, authorize("admin", "manager"), createSupplier);
router.put("/:id", protect, authorize("admin", "manager"), updateSupplier);
router.delete("/:id", protect, authorize("admin"), deleteSupplier);

export default router;