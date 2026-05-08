import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController";
import { protect, authorize } from "../middleware/Auth";

const router: Router = Router();

router.get("/", protect, getAllCategories);
router.get("/:id", protect, getCategoryById);
router.post("/", protect, authorize("admin", "manager"), createCategory);
router.put("/:id", protect, authorize("admin", "manager"), updateCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;