import { completeJSON } from "./llm.service.js";

const RESUME_SYSTEM_PROMPT = `You are a resume parsing engine. Given raw resume text, extract structured
data. Respond with JSON only — no prose, no markdown fences. Use this exact shape:

{
  "skills": string[],           // technical + soft skills, deduplicated, title-cased
  "experience": [
    { "title": string, "company": string, "duration": string, "bullets": string[] }
  ],
  "education": [
    { "degree": string, "school": string, "year": string }
  ],
  "summary": string             // 1-2 sentence neutral summary of the candidate
}

If a field can't be determined, use an empty array or empty string. Do not invent employers or degrees that aren't in the text.`;

const JD_SYSTEM_PROMPT = `You are a job description parsing engine. Given a raw job posting, extract structured
requirements. Respond with JSON only — no prose, no markdown fences. Use this exact shape:

{
  "titleGuess": string,         // best guess at the job title
  "requirements": string[],     // all skills/technologies/qualifications mentioned, deduplicated, title-cased
  "mustHave": string[],         // subset of requirements explicitly framed as required
  "niceToHave": string[],       // subset of requirements explicitly framed as preferred/bonus
  "seniority": string           // e.g. "Junior", "Mid", "Senior", "Lead", or "" if unclear
}

Every item in mustHave and niceToHave must also appear in requirements.`;

export async function parseResumeText(resumeText) {
  const parsed = await completeJSON({
    system: RESUME_SYSTEM_PROMPT,
    user: resumeText,
  });
  return {
    skills: parsed.skills || [],
    experience: parsed.experience || [],
    education: parsed.education || [],
    summary: parsed.summary || "",
    rawText: resumeText,
  };
}

export async function parseJobDescriptionText(jdText) {
  const parsed = await completeJSON({
    system: JD_SYSTEM_PROMPT,
    user: jdText,
  });
  return {
    titleGuess: parsed.titleGuess || "",
    requirements: parsed.requirements || [],
    mustHave: parsed.mustHave || [],
    niceToHave: parsed.niceToHave || [],
    seniority: parsed.seniority || "",
    rawText: jdText,
  };
}
