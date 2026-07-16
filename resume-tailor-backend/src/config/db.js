import mongoose from "mongoose";
import { config } from "./env.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`[db] connected -> ${mongoose.connection.name}`);
  } catch (err) {
    console.error("[db] connection failed:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] disconnected");
  });
}
