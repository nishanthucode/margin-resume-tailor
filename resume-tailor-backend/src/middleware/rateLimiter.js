import rateLimit from "express-rate-limit";

export const llmRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20, // 20 LLM-backed requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests to AI endpoints. Try again in a minute." },
});
