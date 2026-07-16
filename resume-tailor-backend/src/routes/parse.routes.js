import { Router } from "express";
import { parseResume, parseJD } from "../controllers/parse.controller.js";
import { upload } from "../middleware/upload.js";
import { llmRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/resume", llmRateLimiter, upload.single("file"), parseResume);
router.post("/jd", llmRateLimiter, parseJD);

export default router;
