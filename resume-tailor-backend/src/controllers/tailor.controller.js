import asyncHandler from "express-async-handler";
import { generateTailoredBullets } from "../services/tailoring.service.js";
import { badRequest } from "../utils/ApiError.js";

/**
 * POST /api/tailor/bullets
 * Body: { resumeText: string, jdText: string, gaps?: string[], matches?: string[] }
 */
export const tailorBullets = asyncHandler(async (req, res) => {
  const { resumeText, jdText, gaps = [], matches = [] } = req.body || {};

  if (!resumeText || resumeText.trim().length < 20) {
    throw badRequest("Provide resumeText (min 20 characters).");
  }
  if (!jdText || jdText.trim().length < 20) {
    throw badRequest("Provide jdText (min 20 characters).");
  }

  const bullets = await generateTailoredBullets({ resumeText, jdText, gaps, matches });
  res.json({ bullets });
});
