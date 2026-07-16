import { getEmbedding, getEmbeddings } from "./embeddings.service.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

const MATCH_THRESHOLD = 0.72; // similarity above this counts as "covered"

/**
 * For each JD requirement, find the resume skill it's semantically closest
 * to. This catches near-matches that plain keyword comparison misses —
 * "Node.js" vs "NodeJS", "REST APIs" vs "RESTful services", etc.
 */
export async function runGapAnalysis(resumeParsed, jdParsed) {
  const requirements = jdParsed.requirements?.length
    ? jdParsed.requirements
    : [];
  const skills = resumeParsed.skills?.length ? resumeParsed.skills : [];

  if (requirements.length === 0) {
    return {
      matchScore: 0,
      matches: [],
      gaps: [],
      requirementScores: [],
      documentSimilarity: 0,
    };
  }

  const [requirementEmbeddings, skillEmbeddings, resumeDocEmbedding, jdDocEmbedding] =
    await Promise.all([
      getEmbeddings(requirements),
      skills.length ? getEmbeddings(skills) : Promise.resolve([]),
      getEmbedding(resumeParsed.rawText || ""),
      getEmbedding(jdParsed.rawText || ""),
    ]);

  const matches = [];
  const gaps = [];
  const requirementScores = [];

  requirements.forEach((requirement, i) => {
    let bestSkill = null;
    let bestScore = 0;

    skillEmbeddings.forEach((skillVec, j) => {
      const score = cosineSimilarity(requirementEmbeddings[i], skillVec);
      if (score > bestScore) {
        bestScore = score;
        bestSkill = skills[j];
      }
    });

    const isMatch = bestScore >= MATCH_THRESHOLD;
    requirementScores.push({
      requirement,
      bestSkill,
      similarity: Number(bestScore.toFixed(3)),
      isMatch,
    });

    if (isMatch) matches.push(requirement);
    else gaps.push(requirement);
  });

  const documentSimilarity = cosineSimilarity(resumeDocEmbedding, jdDocEmbedding);
  const overlapScore = matches.length / requirements.length;

  // Weighted blend: overall document semantic fit (40%) + per-requirement
  // coverage (60%). Coverage is weighted higher since it's more actionable
  // and interpretable than a single whole-document similarity number.
  const rawScore = documentSimilarity * 0.4 + overlapScore * 0.6;
  const matchScore = Math.round(Math.min(99, Math.max(rawScore * 100, 5)));

  return {
    matchScore,
    matches,
    gaps,
    requirementScores,
    documentSimilarity: Number(documentSimilarity.toFixed(3)),
  };
}
