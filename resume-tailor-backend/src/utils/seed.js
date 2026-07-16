import { connectDB } from "../config/db.js";
import Application from "../models/Application.js";
import mongoose from "mongoose";

const sample = [
  {
    company: "Northwind Analytics",
    role: "Senior Frontend Engineer",
    status: "Applied",
    matchScore: 78,
    matches: ["React", "TypeScript", "REST APIs"],
    gaps: ["GraphQL", "System Design"],
    date: new Date().toISOString().slice(0, 10),
  },
  {
    company: "Fieldstone Health",
    role: "Full Stack Engineer",
    status: "Interviewing",
    matchScore: 84,
    matches: ["Node.js", "MongoDB", "Express"],
    gaps: ["Kubernetes"],
    date: new Date().toISOString().slice(0, 10),
  },
];

async function seed() {
  await connectDB();
  await Application.deleteMany({});
  await Application.insertMany(sample);
  console.log(`[seed] inserted ${sample.length} sample applications`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
