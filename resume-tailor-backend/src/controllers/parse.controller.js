import asyncHandler from "express-async-handler";
import { parseResumeText, parseJobDescriptionText } from "../services/parsing.service.js";
import { extractTextFromFile } from "../services/fileExtraction.service.js";
import { badRequest } from "../utils/ApiError.js";

/**
 * POST /api/parse/resume
 * Accepts either:
 *  - multipart/form-data with a `file` field (.pdf, .docx, .txt), or
 *  - application/json with a `text` field
 */
export const parseResume = asyncHandler(async (req, res) => {
  let resumeText = req.body?.text;

  if (req.file) {
    resumeText = await extractTextFromFile(req.file);
  }

  if (!resumeText || resumeText.trim().length < 20) {
    throw badRequest("Provide resume text (min 20 characters) or upload a file.");
  }

  const parsed = await parseResumeText(resumeText);
  res.json(parsed);
});

/**
 * POST /api/parse/jd
 * Body: { text: string }
 */
export const parseJD = asyncHandler(async (req, res) => {
  const { text } = req.body || {};
  if (!text || text.trim().length < 20) {
    throw badRequest("Provide job description text (min 20 characters).");
  }

  const parsed = await parseJobDescriptionText(text);
  res.json(parsed);
});
