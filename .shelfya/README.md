# Shelfya Configuration

This directory contains all Shelfya (deployment & preview) configurations for the HETIC Crypto API backend. Place pipeline definitions, secret mappings, and environment overrides here to manage automatic deployments and preview environments.

## Directory Contents

- `pipeline.yml` (or `pipeline.yaml`): Defines services, build steps, and deployment targets.
- `env/`: Folder containing environment‐specific variable files (e.g., `staging.env`, `prod.env`).
- `secrets/`: Encrypted secret definitions (e.g., SMTP credentials, JWT secrets).

> Note: File names and structure may vary based on your Shelfya setup. Adjust paths accordingly.

## Required Environment Variables

The backend expects the following environment variables. Define them either in `env/*.env` or as Shelfya secrets:

- JWT_ACCESS_SECRET  
- JWT_REFRESH_SECRET  
- JWT_ACCESS_TOKEN_EXPIRATION_TIME  
- JWT_REFRESH_TOKEN_EXPIRATION_TIME  
- SMTP_HOST  
- SMTP_PORT  
- SMTP_USER  
- SMTP_PASS  
- API_URL  
- CRYPTOCOMPARE_API_KEY  
- ETHERSCAN_API_KEY  
- CLIENT_URL  
- DATABASE_URL  
- POSTGRES_USER  
- POSTGRES_PASSWORD  
- POSTGRES_DB  
- PORT  

## Sample `pipeline.yml`

```yaml
version: 1
services:
  crypto-api:
    path: backend
    image: node:18-alpine
    commands:
      - npm ci
      - npm run build
      - npm run start
    env:
      file: env/staging.env
    secrets:
      - SMTP_PASS
      - JWT_ACCESS_SECRET
      - JWT_REFRESH_SECRET
```

## Usage

1. Populate all required environment variables in `env/<environment>.env` or via Shelfya secret management.
2. Define your deployment pipeline in `pipeline.yml`.
3. Push changes to Git — Shelfya will automatically build and deploy according to your pipeline.
4. Monitor builds and logs in the Shelfya dashboard.

## Resources

- Shelfya Docs: https://docs.shelfya.com  
- Crypto API Reference: See `backend/src/index.ts` and `backend/src/constants.ts` for server entrypoint and constants.