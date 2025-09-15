# Shelfya CI/CD Configuration

This directory holds credentials and example configurations for deploying the Hetic Crypto API backend via Shelfya’s CI/CD pipelines.

## Overview

The Hetic Crypto API is an Express-based TypeScript backend exposing all endpoints under the `/api/v1` prefix. Shelfya pipelines in this folder install dependencies, compile TypeScript, and start the server with the proper environment variables.

## Getting Started

1. Create a `shelfya.yaml` (or use the example below) in this folder.
2. Define your environment variables in Shelfya’s project settings or via encrypted files.
3. Commit and push to trigger the pipeline.

## Environment Variables

Configure these in Shelfya’s environment settings:

- `PORT`  
  Port on which the Express server listens (e.g., `4000`).

- `CLIENT_URL`  
  Origin allowed by CORS (e.g., `http://localhost:3000` or your production front-end URL).

> Note: Other required variables (e.g., database credentials, JWT secrets) should be set here as well—verify against your local `.env` or docs.

## Example `shelfya.yaml`

```yaml
pipeline:
  install:
    image: node:18
    commands:
      - npm ci

  build:
    image: node:18
    commands:
      - npm run build

  deploy:
    image: node:18
    environment:
      PORT: ${PORT}
      CLIENT_URL: ${CLIENT_URL}
      # Add other secrets here
    commands:
      - npm start
    ports:
      - ${PORT}
```

## Quick Commands

If you’re experimenting locally before pushing to Shelfya:

```bash
# Install dependencies
npm ci

# Start in development mode (with ts-node/auto-reload)
npm run dev

# Build for production
npm run build

# Launch the compiled server
npm start
```

## API Endpoints Reference

All routes are mounted under `/api/v1`:

- `POST /api/v1/auth/...`  
- `GET /api/v1/wallet/...` (protected)  
- `GET /api/v1/history/...` (protected)  
- `GET /api/v1/portfolio/...`  
- `GET /api/v1/profile/...` (protected)  

Protected routes require a valid access token (handled by `verifyAccessToken` middleware).

---

Keep this document up-to-date with any changes to your build, deploy steps, or environment requirements.