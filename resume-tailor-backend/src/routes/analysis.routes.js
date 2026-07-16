import { Router } from "express";
import { analyze } from "../controllers/analysis.controller.js";
import { llmRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", llmRateLimiter, analyze);

export default router;
