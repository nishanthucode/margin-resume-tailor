import asyncHandler from "express-async-handler";
import Application from "../models/Application.js";
import { badRequest, notFound } from "../utils/ApiError.js";

/**
 * GET /api/applications
 * Optional query: ?status=Applied
 */
export const listApplications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const apps = await Application.find(filter).sort({ createdAt: -1 });
  res.json(apps.map((a) => a.toJSON()));
});

/**
 * GET /api/applications/:id
 */
export const getApplication = asyncHandler(async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) throw notFound("Application not found");
  res.json(app.toJSON());
});

/**
 * POST /api/applications
 * Body: { company, role, status?, matchScore?, jobDescription?, resumeSnapshot?, savedBullets?, matches?, gaps?, date? }
 */
export const createApplication = asyncHandler(async (req, res) => {
  const { company, role } = req.body || {};
  if (!company || !role) {
    throw badRequest("company and role are required.");
  }

  const app = await Application.create({
    ...req.body,
    date: req.body.date || new Date().toISOString().slice(0, 10),
  });
  res.status(201).json(app.toJSON());
});

/**
 * PATCH /api/applications/:id
 * Body: any subset of application fields (e.g. { status: "Interviewing" })
 */
export const updateApplication = asyncHandler(async (req, res) => {
  const app = await Application.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!app) throw notFound("Application not found");
  res.json(app.toJSON());
});

/**
 * DELETE /api/applications/:id
 */
export const deleteApplication = asyncHandler(async (req, res) => {
  const app = await Application.findByIdAndDelete(req.params.id);
  if (!app) throw notFound("Application not found");
  res.status(204).send();
});
