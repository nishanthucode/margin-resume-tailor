import { Router } from "express";
import { tailorBullets } from "../controllers/tailor.controller.js";
import { llmRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/bullets", llmRateLimiter, tailorBullets);

export default router;
