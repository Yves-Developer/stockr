import { Router } from "express";
import { generateMagicToken, magicLogin, verifyMagicToken } from "../controllers/AuthController";
import { protect } from "../middleware/Auth";

const router: Router = Router();

router.get("/magic-token", protect as any, generateMagicToken as any);
router.post("/magic-login", magicLogin as any);
router.post("/verify-magic-token", verifyMagicToken as any);

export default router;
