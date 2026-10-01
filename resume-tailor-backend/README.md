# Resume Tailor Backend

![GitHub license](https://img.shields.io/github/license/nishanthucode/margin-resume-tailor?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/nishanthucode/margin-resume-tailor?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/nishanthucode/margin-resume-tailor?style=flat-square)

## Overview

The **Resume Tailor Backend** powers a smart service that customises resumes to match specific job descriptions using AI. It provides a clean, high‑performance REST API built with **Node.js**, **Express**, and **TypeScript**, and integrates with the **OpenAI** (or compatible) language model to generate tailored content.

## Features

- **AI‑driven resume customisation** – Generates personalised bullet points, summaries and highlights.
- **Secure JWT authentication** – Protects the API endpoints.
- **Rate limiting & validation** – Prevents abuse and ensures clean input data.
- **Docker ready** – Easy to spin up locally or in production.
- **Extensible architecture** – Plug‑in support for different LLM providers.

## Getting Started

### Prerequisites

- **Node.js** (v18 or later) – [Download](https://nodejs.org/)
- **npm** (comes with Node) or **yarn**
- **Docker** (optional, for containerised deployment)
- An **OpenAI API key** (or compatible LLM endpoint)

### Installation

```bash
# Clone the repository
git clone https://github.com/nishanthucode/margin-resume-tailor.git
cd margin-resume-tailor/resume-tailor-backend

# Install dependencies
npm install   # or `yarn install`
```

### Environment Configuration

Create a `.env` file in the project root:

```dotenv
PORT=3000
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key_here
# Optional – specify a different LLM endpoint
# LLM_ENDPOINT=https://api.your-llm.com/v1
```

> **Note**: Keep the `.env` file out of version control.

### Running the Server

```bash
# Development mode (with hot‑reloading)
npm run dev

# Production mode
npm run build && npm start
```

The API will be available at `http://localhost:3000/api`.

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Obtain a JWT token.
| `/api/auth/register` | POST | Register a new user.
| `/api/resume/tailor` | POST | Submit a resume and a job description to receive a tailored version. **Protected** – requires `Authorization: Bearer <token>` header.
| `/api/health` | GET | Simple health‑check endpoint.

For full request/response schemas, see the generated OpenAPI spec at `http://localhost:3000/api/docs`.

## Docker

A ready‑to‑use Dockerfile is included.

```bash
# Build the image
docker build -t resume-tailor-backend .

# Run the container
docker run -d -p 3000:3000 \
  --env-file .env \
  --name resume-tailor-backend \
  resume-tailor-backend
```

## Testing

```bash
# Run unit & integration tests
npm test
```

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on how to submit pull requests, report issues, and follow the code of conduct.

## License

This project is licensed under the **MIT License** – see the [LICENSE](../LICENSE) file for details.

## Contact

For questions or support, open an issue or contact the maintainer at **nishanthucode@example.com**.
