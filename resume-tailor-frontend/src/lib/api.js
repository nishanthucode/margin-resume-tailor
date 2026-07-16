/**
 * Real API client for the resume-tailoring backend.
 *
 * Base URL comes from VITE_API_BASE_URL (see .env.example) and defaults to
 * http://localhost:5000/api for local development against the Express
 * backend in the sibling `resume-tailor-backend` project.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: options.body instanceof FormData
      ? undefined
      : { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

/**
 * Parses resume text (or an uploaded file) into structured data via the
 * backend's LLM-powered parsing endpoint.
 */
export async function parseResume(resumeTextOrFile) {
  if (resumeTextOrFile instanceof File) {
    const form = new FormData();
    form.append("file", resumeTextOrFile);
    return request("/parse/resume", { method: "POST", body: form });
  }
  return request("/parse/resume", {
    method: "POST",
    body: JSON.stringify({ text: resumeTextOrFile }),
  });
}

export async function parseJD(jdText) {
  return request("/parse/jd", {
    method: "POST",
    body: JSON.stringify({ text: jdText }),
  });
}

/**
 * Runs the embeddings-based gap analysis between parsed resume and JD data.
 */
export async function runGapAnalysis(resumeParsed, jdParsed) {
  return request("/analysis", {
    method: "POST",
    body: JSON.stringify({ resumeParsed, jdParsed }),
  });
}

export async function generateTailoredBullets(resumeText, jdText, gaps = [], matches = []) {
  const result = await request("/tailor/bullets", {
    method: "POST",
    body: JSON.stringify({ resumeText, jdText, gaps, matches }),
  });
  return result.bullets;
}

export async function listApplications() {
  return request("/applications");
}

export async function saveApplication(app) {
  if (app.id) {
    return request(`/applications/${app.id}`, {
      method: "PATCH",
      body: JSON.stringify(app),
    });
  }
  return request("/applications", {
    method: "POST",
    body: JSON.stringify(app),
  });
}

export async function deleteApplication(id) {
  await request(`/applications/${id}`, { method: "DELETE" });
  return true;
}
