# Margin — Resume Tailoring Studio (Frontend)

A React + Tailwind frontend for the resume-tailoring app: upload a resume and
a job description, get a gap analysis with a semantic match score, generate
tailored bullet points, and track applications.

This talks to the sibling `resume-tailor-backend` Express API for everything
that needs real intelligence: LLM-based resume/JD parsing, embeddings-based
match scoring, tailored bullet generation, and MongoDB-backed application
tracking.

## Design direction

The UI leans into an editorial/manuscript metaphor rather than a generic SaaS
dashboard: your resume and the job posting are treated like a draft being
marked up by an editor. Matches get underlined in green, gaps get circled in
red, and the semantic match score is rendered as a stamped wax seal. Sidebar
nav reads like a card-catalog tab index (fol. I-IV).

- Display type: Fraunces (serif)
- Body type: Inter
- Data/mono type: IBM Plex Mono
- Dark ink background (#14181A) with warm paper-colored cards (#F5F1E6)
- Accents: proofreader red #B23A2F, editor green #4C7A63, gold rule #C9A227

## Getting started

```bash
cp .env.example .env    # points at the backend, defaults to localhost:5000/api
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173). Make sure
`resume-tailor-backend` is running first (see its own README) — this app has
no offline/mock mode anymore; every action calls the real API.

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Project structure

```
src/
  pages/
    Upload.jsx      Step I - paste/upload resume + JD
    Analysis.jsx     Step II - gap analysis + match score
    Tailor.jsx        Step III - tailored bullet generation
    Tracker.jsx        Step IV - applications ledger
  components/
    Sidebar.jsx       left nav / tab index
    PageShell.jsx     shared "manuscript page" card wrapper
  context/
    AppContext.jsx    shared state: resume text, JD text, parsed data, analysis
  lib/
    api.js            real API client — talks to resume-tailor-backend
```

## API contract

`src/lib/api.js` calls these backend endpoints:

| Function                  | Endpoint |
|----------------------------|-------------------|
| parseResume(textOrFile)     | POST /api/parse/resume (JSON `{text}` or multipart `file`) |
| parseJD(text)               | POST /api/parse/jd |
| runGapAnalysis(rp, jp)       | POST /api/analysis |
| generateTailoredBullets     | POST /api/tailor/bullets |
| listApplications             | GET /api/applications |
| saveApplication               | POST /api/applications, PATCH /api/applications/:id |
| deleteApplication              | DELETE /api/applications/:id |

Resume upload accepts `.pdf`, `.docx`, and `.txt` — text extraction happens
server-side (pdf-parse / mammoth) before the LLM parsing step.

## Stack

- React 19 + Vite
- React Router 7
- Tailwind CSS 3
- lucide-react (icons)
