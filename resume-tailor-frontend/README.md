# Margin — Resume Tailoring Studio

The React frontend for Margin, a resume-tailoring workspace that compares a
candidate's resume with a job description, identifies gaps, generates tailored
resume bullet suggestions, and tracks applications.

This app is designed to run alongside the sibling
`resume-tailor-backend` Express API.

## Features

- Paste resume text or upload a `.pdf`, `.docx`, or `.txt` resume.
- Paste a complete job description for analysis.
- View matched requirements, gaps, and an overall match score.
- Generate suggested resume bullet edits using the configured LLM provider.
- Copy suggested bullets to the clipboard.
- Save roles, match scores, statuses, dates, and tailored bullets in the
	application tracker.
- Responsive layouts for desktop and mobile screens.

## Tech stack

- React 19
- Vite
- React Router
- Tailwind CSS
- lucide-react icons

## Requirements

- Node.js 18 or newer
- npm
- The sibling `resume-tailor-backend` project running locally or at a deployed
	API URL

## Getting started

From this directory:

```bash
npm install
npm run dev
```

Vite will print the local URL, normally:

```text
http://localhost:5173
```

In a second terminal, start the backend:

```bash
cd ../resume-tailor-backend
npm install
npm run dev
```

The backend normally runs at `http://localhost:5000` and must be configured
with MongoDB and an LLM provider. See the backend README for provider keys and
server-side environment variables.

## Configuration

The frontend reads the API URL from `VITE_API_BASE_URL`. Create a `.env` file
in this directory only when the backend is not running at its default local
address:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Vite exposes only variables prefixed with `VITE_` to browser code. Restart the
development server after changing the file.

If `VITE_API_BASE_URL` is omitted, the frontend defaults to:

```text
http://localhost:5000/api
```

## Application flow

1. **Upload** (`/`) — provide the resume and job description, then run the
	 analysis.
2. **Analysis** (`/analysis`) — review matched requirements, gaps, and the
	 match score.
3. **Tailor** (`/tailor`) — generate and copy suggested resume edits.
4. **Tracker** (`/tracker`) — save applications and update their status.

Analysis and tailoring data is held in the React context for the current page
session. The tracker is persisted by the backend API in MongoDB.

## API calls

The API client in `src/lib/api.js` uses these backend endpoints:

| Purpose | Method | Endpoint |
| --- | --- | --- |
| Parse resume | `POST` | `/api/parse/resume` |
| Parse job description | `POST` | `/api/parse/jd` |
| Run gap analysis | `POST` | `/api/analysis` |
| Generate tailored bullets | `POST` | `/api/tailor/bullets` |
| List applications | `GET` | `/api/applications` |
| Create or update an application | `POST` / `PATCH` | `/api/applications` or `/api/applications/:id` |
| Delete an application | `DELETE` | `/api/applications/:id` |

## Available scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
npm run lint      # Run oxlint
```

## Troubleshooting

- **Network request failed:** confirm the backend is running and that
	`VITE_API_BASE_URL` includes the `/api` suffix.
- **CORS errors:** set the backend `CORS_ORIGIN` value to the frontend URL,
	normally `http://localhost:5173`.
- **Parsing or tailoring errors:** check the backend logs and confirm the
	selected LLM provider has a valid API key.
- **Uploads rejected:** the backend accepts `.pdf`, `.docx`, and `.txt` files
	with an 8 MB limit.

## Project structure

```text
src/
	App.jsx                 Routes and application provider
	main.jsx                React entry point
	index.css               Global styles and Tailwind layers
	components/             Shared shell and navigation components
	context/                Resume, analysis, and tailoring session state
	lib/api.js              Backend API client
	pages/                  Upload, analysis, tailoring, and tracker screens
```
