import { completeJSON } from "./llm.service.js";

const SYSTEM_PROMPT = `You are a resume writing assistant. You rewrite a candidate's existing resume
bullet points so they speak more directly to a specific job description — using
the job description's own terminology where it's honestly applicable — WITHOUT
inventing new experience, employers, tools, or achievements that aren't
supported by the original bullet.

Rules:
- Never fabricate metrics, technologies, or responsibilities not implied by the original bullet.
- Prefer active, specific verbs.
- Keep each tailored bullet to roughly one line (under ~30 words).
- If a gap (a JD requirement the candidate doesn't have) can't honestly be tied to a bullet, don't force it in.

Respond with JSON only, no prose, no markdown fences, using this exact shape:
{
  "bullets": [
    { "original": string, "tailored": string, "targetsGap": string | null }
  ]
}`;

export async function generateTailoredBullets({ resumeText, jdText, gaps = [], matches = [] }) {
  const originalBullets = extractBulletCandidates(resumeText);

  const user = `JOB DESCRIPTION:
${jdText}

CANDIDATE'S EXISTING RESUME BULLETS:
${originalBullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

REQUIREMENTS THE CANDIDATE IS MISSING (do not fabricate these, only tie in if honestly supported by a bullet):
${gaps.join(", ") || "none"}

REQUIREMENTS THE CANDIDATE ALREADY MATCHES (safe to emphasize with JD language):
${matches.join(", ") || "none"}

Rewrite each numbered bullet above.`;

  const result = await completeJSON({
    system: SYSTEM_PROMPT,
    user,
    maxTokens: 2000,
  });

  return (result.bullets || []).map((b, i) => ({
    id: `bullet-${i}`,
    original: b.original,
    tailored: b.tailored,
    targetsGap: b.targetsGap || null,
  }));
}

/**
 * Pulls plausible bullet-point lines out of raw resume text (lines with
 * enough content to be an experience bullet, skipping headers/short lines).
 */
function extractBulletCandidates(resumeText, limit = 8) {
  return resumeText
    .split("\n")
    .map((l) => l.replace(/^[\s•\-*]+/, "").trim())
    .filter((l) => l.length > 25)
    .slice(0, limit);
}
