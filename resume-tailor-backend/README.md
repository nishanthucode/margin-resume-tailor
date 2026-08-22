# Margin — Resume Tailoring Studio (Backend)

Express + MongoDB API powering the resume-tailoring app: LLM-based resume/JD
parsing, embeddings-based gap analysis and match scoring, tailored bullet
generation, and application tracking.

Pairs with the sibling `resume-tailor-frontend` React app.

## Stack

- Node.js (ESM) + Express 5
- MongoDB + Mongoose
- Anthropic (Claude) or OpenAI for parsing/generation — pick via `LLM_PROVIDER`
- Embeddings for match scoring — OpenAI's embeddings API, **or** a free,
  dependency-free local hashed bag-of-words embedding (`EMBEDDINGS_PROVIDER=local`)
- multer + pdf-parse + mammoth for resume file uploads (.pdf / .docx / .txt)

## Getting started

```bash
cp .env.example .env
```

Edit `.env`:
- Set `MONGODB_URI` to a local MongoDB instance or an Atlas connection string.
- Pick `LLM_PROVIDER` (`anthropic` or `openai`) and set the matching API key.
- Leave `EMBEDDINGS_PROVIDER=local` to run with **no API key at all** for
  match scoring, or set it to `openai` (with `OPENAI_API_KEY`) for
  higher-quality semantic matching.

```bash
npm install
npm run dev      # nodemon, auto-restarts on change
# or
npm start        # plain node
```

Server boots on `http://localhost:5000` by default. Check it's alive:

```bash
curl http://localhost:5000/api/health
```

Optional: seed a couple of sample tracker rows —

```bash
npm run seed
```

## Architecture

```
src/
  server.js                 Express app wiring, middleware, route mounting
  config/
    env.js                  centralized env var loading + validation
    db.js                   Mongoose connection
  models/
    Application.js           tracker row schema (company, role, status, matchScore, savedBullets…)
  routes/                    thin route -> controller wiring, one file per resource
  controllers/                request/response handling, input validation, calls services
  services/
    llm.service.js            provider-agnostic LLM call wrapper (Anthropic or OpenAI), enforces JSON-only replies
    parsing.service.js         resume/JD parsing prompts, built on llm.service
    tailoring.service.js       tailored bullet generation prompt, built on llm.service
    embeddings.service.js      embedding vectors — OpenAI API or free local fallback
    analysis.service.js        gap analysis: per-requirement semantic matching + overall match score
    fileExtraction.service.js  PDF/DOCX/TXT -> plain text
  middleware/
    upload.js                  multer config (memory storage, 8MB limit, pdf/docx/txt only)
    rateLimiter.js              rate limit on LLM/embeddings-backed routes
    errorHandler.js             centralized error responses (ApiError -> proper status codes)
  utils/
    ApiError.js                 typed HTTP errors (badRequest/notFound/serverError)
    cosineSimilarity.js          vector similarity math
    seed.js                     optional sample data script
```

## How the gap analysis actually works

1. `POST /api/parse/resume` and `POST /api/parse/jd` each send the raw text
   to the configured LLM with a strict JSON-only system prompt, extracting
   structured skills / requirements.
2. `POST /api/analysis` takes both parsed objects and, for **every JD
   requirement**, embeds it and finds the resume skill it's semantically
   closest to (cosine similarity), not just an exact string match — so
   "Node.js" on the JD will match "NodeJS" on the resume. A similarity
   threshold (0.72) decides match vs. gap.
3. The overall match score blends whole-document semantic similarity (40%)
   with per-requirement coverage (60%) into a single 0-100 score.
4. `POST /api/tailor/bullets` sends the JD, the candidate's actual bullet
   lines, and the computed gaps/matches to the LLM with instructions to
   rewrite bullets using the JD's language **without fabricating experience**.

## Endpoints

| Method | Path                     | Body / Notes |
|--------|---------------------------|----------------|
| GET    | /api/health                | — |
| POST   | /api/parse/resume           | JSON `{ text }` **or** multipart `file` (.pdf/.docx/.txt) |
| POST   | /api/parse/jd                | JSON `{ text }` |
| POST   | /api/analysis                 | JSON `{ resumeParsed, jdParsed }` (from the two parse calls above) |
| POST   | /api/tailor/bullets             | JSON `{ resumeText, jdText, gaps?, matches? }` |
| GET    | /api/applications                 | optional `?status=` filter |
| GET    | /api/applications/:id               | — |
| POST   | /api/applications                     | JSON `{ company, role, status?, matchScore?, savedBullets?, … }` |
| PATCH  | /api/applications/:id                   | partial update, e.g. `{ status: "Interviewing" }` |
| DELETE | /api/applications/:id                     | — |

All LLM- and embeddings-backed routes (`/parse/*`, `/analysis`, `/tailor/*`)
are rate-limited to 20 requests/minute/IP by default (`rateLimiter.js`) since
they're the expensive calls.

## Scaling notes

- **Embeddings at scale**: the local fallback and the current in-memory
  cosine similarity comparison are fine for one resume vs. one JD per
  request. If you later want to search across many stored resumes/JDs (e.g.
  "find applications similar to this one"), store embeddings on the
  `Application` document and switch to **MongoDB Atlas Vector Search**
  (free tier available) instead of computing similarity in memory.
- **LLM provider swap**: `llm.service.js` is the only place that talks to
  Anthropic/OpenAI directly — swapping models or adding a third provider
  only touches that one file.

## Environment variables

See `.env.example` for the full list with comments. Key ones:

- `LLM_PROVIDER` — `anthropic` or `openai`
- `EMBEDDINGS_PROVIDER` — `local` (free, no key) or `openai` (higher quality)
- `MONGODB_URI` — local or Atlas connection string
- `CORS_ORIGIN` — should match the frontend's dev URL (`http://localhost:5173` by default)
