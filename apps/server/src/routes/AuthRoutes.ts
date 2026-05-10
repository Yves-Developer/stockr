import { Router } from "express";
import { generateMagicToken, magicLogin } from "../controllers/AuthController";
import { protect } from "../middleware/Auth";

const router: Router = Router();

router.get("/magic-token", protect as any, generateMagicToken as any);
router.post("/magic-login", magicLogin as any);

export default router;
