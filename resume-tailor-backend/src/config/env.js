import dotenv from "dotenv";
dotenv.config();

function required(name, fallback = undefined) {
  const val = process.env[name] ?? fallback;
  return val;
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/resume_tailor"),

  llm: {
    provider: (process.env.LLM_PROVIDER || "anthropic").toLowerCase(), // "anthropic" | "openai"
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    anthropicModel: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  },

  embeddings: {
    // "openai" uses the real embeddings API (requires OPENAI_API_KEY).
    // "local" uses a free, dependency-free hashed bag-of-words vector —
    // lower quality, but works fully offline with no API key.
    provider: (process.env.EMBEDDINGS_PROVIDER || "local").toLowerCase(),
    openaiModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    localDims: Number(process.env.LOCAL_EMBEDDING_DIMS) || 256,
  },

  upload: {
    maxFileSizeMb: Number(process.env.MAX_UPLOAD_MB) || 8,
  },
};

export function assertLLMConfigured() {
  const { provider, anthropicApiKey, openaiApiKey } = config.llm;
  if (provider === "anthropic" && !anthropicApiKey) {
    throw new Error(
      "LLM_PROVIDER is 'anthropic' but ANTHROPIC_API_KEY is not set in .env"
    );
  }
  if (provider === "openai" && !openaiApiKey) {
    throw new Error(
      "LLM_PROVIDER is 'openai' but OPENAI_API_KEY is not set in .env"
    );
  }
}
