import OpenAI from "openai";
import { config } from "../config/env.js";

let openaiClient = null;
function getOpenAIClient() {
  if (!openaiClient) {
    if (!config.llm.openaiApiKey) {
      throw new Error(
        "EMBEDDINGS_PROVIDER is 'openai' but OPENAI_API_KEY is not set in .env"
      );
    }
    openaiClient = new OpenAI({ apiKey: config.llm.openaiApiKey });
  }
  return openaiClient;
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with",
  "is", "are", "was", "were", "be", "been", "as", "at", "by", "this",
  "that", "it", "from", "we", "you", "your", "our", "will", "have", "has",
]);

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9+.#]+/g) || []).filter(
    (t) => t.length > 1 && !STOPWORDS.has(t)
  );
}

/**
 * Free, dependency-free embedding: a fixed-size hashed bag-of-words vector
 * with simple term-frequency weighting. Deterministic, works fully offline,
 * no API key required. Meaningfully worse than a real embeddings model but
 * good enough to drive an approximate semantic similarity score.
 */
function localEmbedding(text, dims = config.embeddings.localDims) {
  const vec = new Array(dims).fill(0);
  const tokens = tokenize(text);
  if (tokens.length === 0) return vec;

  for (const token of tokens) {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
    }
    vec[hash % dims] += 1;
  }

  // L2-normalize so vector length doesn't bias cosine similarity by doc length
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

async function openaiEmbedding(text) {
  const client = getOpenAIClient();
  const response = await client.embeddings.create({
    model: config.embeddings.openaiModel,
    input: text.slice(0, 8000), // guard against oversized inputs
  });
  return response.data[0].embedding;
}

/**
 * Returns an embedding vector for the given text using whichever provider
 * is configured (EMBEDDINGS_PROVIDER=openai|local).
 */
export async function getEmbedding(text) {
  if (config.embeddings.provider === "openai") {
    return openaiEmbedding(text);
  }
  return localEmbedding(text);
}

export async function getEmbeddings(texts) {
  return Promise.all(texts.map((t) => getEmbedding(t)));
}
