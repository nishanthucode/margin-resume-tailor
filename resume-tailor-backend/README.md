# Resume Tailor Backend

## Overview
The **Resume Tailor Backend** powers the intelligent resume customization service. It provides a set of RESTful APIs that analyze job descriptions, extract key skills, and generate tailored resume bullet points using advanced language models.

## Features
- **Job Description Parsing** – Extracts required skills, responsibilities, and keywords.
- **Resume Scoring** – Evaluates existing resumes against a target job posting.
- **Bullet Point Generation** – Generates concise, impact‑focused bullet points using LLMs (e.g., OpenAI GPT, Anthropic Claude).
- **User Management** – Secure authentication with JWT and role‑based access.
- **Rate Limiting & Caching** – Protects the service and speeds up repeated requests.

## Tech Stack
- **Node.js** (v20) with **Express**
- **TypeScript** for type safety
- **PostgreSQL** with **Prisma** ORM
- **Docker** for containerised development and deployment
- **OpenAI / Anthropic** SDK for LLM integration
- **Jest** & **Supertest** for testing

## Prerequisites
- Node.js (>=20) and npm
- Docker & Docker‑Compose (optional but recommended)
- PostgreSQL instance (local or remote) – connection URL set via `DATABASE_URL`
- OpenAI/Anthropic API key exported as `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

## Installation
```bash
# Clone the repository
git clone https://github.com/nishanthucode/margin-resume-tailor.git
cd margin-resume-tailor/resume-tailor-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DB credentials and API keys
```

## Running the Service
### Development (with hot‑reload)
```bash
npm run dev
```
The API will be available at `http://localhost:3000/api`.

### Production (Docker)
```bash
docker compose up --build -d
```

## API Documentation
The API follows OpenAPI 3.0. After starting the server, visit:
- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/openapi.json`

### Core Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `POST` | `/api/auth/register` | Create a new user |
| `POST` | `/api/jobs/analyze` | Submit a job description and get extracted skills |
| `POST` | `/api/resume/score` | Score a resume against a job posting |
| `POST` | `/api/resume/generate` | Generate tailored bullet points |
| `GET`  | `/api/users/me` | Retrieve current user profile |

## Development Guide
1. **Run tests**
   ```bash
   npm test
   ```
2. **Lint & format**
   ```bash
   npm run lint   # ESLint
   npm run format # Prettier
   ```
3. **Database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Write tests for your changes.
4. Ensure all linting and tests pass.
5. Submit a Pull Request with a clear description of your changes.

## License
This project is licensed under the **MIT License**. See the `LICENSE` file for details.
