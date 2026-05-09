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

const router: Router = Router();

router.get("/", protect, getAllSuppliers);
router.get("/:id", protect, getSupplierById);
router.get("/:id/products", protect, getProductsBySupplier);
router.post("/", protect, authorize("admin", "manager", "staff"), createSupplier);
router.put("/:id", protect, authorize("admin", "manager", "staff"), updateSupplier);
router.delete("/:id", protect, authorize("admin"), deleteSupplier);

export default router;