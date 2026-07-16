import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import parseRoutes from "./routes/parse.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import tailorRoutes from "./routes/tailor.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    llmProvider: config.llm.provider,
    embeddingsProvider: config.embeddings.provider,
  });
});

app.use("/api/parse", parseRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/tailor", tailorRoutes);
app.use("/api/applications", applicationsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`[server] listening on http://localhost:${config.port}`);
    console.log(`[server] LLM provider: ${config.llm.provider}`);
    console.log(`[server] Embeddings provider: ${config.embeddings.provider}`);
  });
}

start().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
