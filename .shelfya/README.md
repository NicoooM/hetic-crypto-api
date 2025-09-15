# HETIC Crypto API

This document will help you get up and running with the HETIC Crypto API backend. It covers prerequisites, environment configuration, installation steps, and basic usage.

## Prerequisites

- Node.js ≥ 16.x
- npm ≥ 8.x (or yarn)
- Git

## Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/NicoooM/hetic-crypto-api.git
   cd hetic-crypto-api
   ```

2. Install dependencies  
   ```bash
   cd backend
   npm install
   ```

## Environment Variables

The server uses several required environment variables. Before starting, create a `.env` file in `backend/`:

```dotenv
# backend/.env
PORT=5000
CLIENT_URL=http://localhost:3000

# Other required vars (see backend/src/constants.ts):
# DATABASE_URL=...
# JWT_SECRET=...
# API_KEY=...
```

When the server starts, it will verify that all variables listed in `REQUIRED_ENV_VARS` are present and non-empty. If any are missing, the process will exit with an error:
```text
Error: Missing or empty required environment variables: DATABASE_URL, JWT_SECRET
```

## Available Scripts

From the `backend/` folder:

- `npm run dev`  
  Launches the server in watch mode with hot reload (uses `ts-node-dev`).
- `npm run build`  
  Transpiles TypeScript into `dist/`.
- `npm start`  
  Runs the compiled code from `dist/`.

## Starting the Server

```bash
# development
npm run dev

# production
npm run build
npm start
```

You should see:
```
Listening on port 5000...
```

## API Basics

All routes are mounted under `/api/v1`. Incoming requests are processed with:

- express.json()
- helmet for security headers
- cookie-parser
- CORS (allowed origin from `CLIENT_URL`)
- request-ip middleware

Example request:

```bash
curl http://localhost:5000/api/v1/health
# → { "status": "ok" }
```

Replace `/health` with any router path defined in `backend/src/routes`.

## Troubleshooting

- **Port already in use**: Change `PORT` in your `.env`.
- **Missing env vars**: Double-check your `.env` matches `REQUIRED_ENV_VARS`.
- **CORS errors**: Ensure `CLIENT_URL` matches your frontend origin.

---

For detailed route listings and business logic, refer to the source under `backend/src/routes` and `backend/src/controllers`.