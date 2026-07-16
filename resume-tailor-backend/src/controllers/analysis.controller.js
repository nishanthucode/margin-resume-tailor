import asyncHandler from "express-async-handler";
import { runGapAnalysis } from "../services/analysis.service.js";
import { badRequest } from "../utils/ApiError.js";

/**
 * POST /api/analysis
 * Body: { resumeParsed: { skills[], rawText }, jdParsed: { requirements[], rawText } }
 */
export const analyze = asyncHandler(async (req, res) => {
  const { resumeParsed, jdParsed } = req.body || {};

  if (!resumeParsed || !jdParsed) {
    throw badRequest("Provide both resumeParsed and jdParsed (from /api/parse/*).");
  }
  if (!Array.isArray(jdParsed.requirements)) {
    throw badRequest("jdParsed.requirements must be an array.");
  }

  const result = await runGapAnalysis(resumeParsed, jdParsed);
  res.json(result);
});
