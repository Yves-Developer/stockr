import { Router } from "express";
import { register, login, getMe, updatePassword } from "../controllers/Authcontroller";
import { protect } from "../middleware/Auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-password", protect, updatePassword);

export default router;