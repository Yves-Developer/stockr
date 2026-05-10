import { Router } from "express";
import { generateMagicToken, magicLogin } from "../controllers/AuthController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/magic-token", protect, generateMagicToken);
router.post("/magic-login", magicLogin);

export default router;
