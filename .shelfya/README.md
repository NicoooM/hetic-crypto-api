# Shelfya Deployment Guide

This document explains how to configure and deploy the **Hetic Crypto API** on the Shelfya platform. The API is built with Express.js, TypeScript, and uses JWT-based authentication with PostgreSQL as its backing database.

## Prerequisites

- A Shelfya account
- A PostgreSQL add-on attached to your Shelfya app
- Environment variables (see below)
- CryptoCompare and Etherscan API keys

## Environment Variables

The API will validate that all required environment variables are present at startup. Configure the following in your Shelfya **Settings → Environment**:

Required variables  
```text
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_TOKEN_EXPIRATION_TIME    # e.g. "900000"  (in milliseconds)
JWT_REFRESH_TOKEN_EXPIRATION_TIME   # e.g. "604800000" (7 days in ms)
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
API_URL                             # e.g. "https://api.your-domain.com"
CRYPTOCOMPARE_API_KEY
ETHERSCAN_API_KEY
CLIENT_URL                          # e.g. "https://app.your-domain.com"
DATABASE_URL                        # provided by your Postgres add-on
POSTGRES_USER                       # provided by your Postgres add-on
POSTGRES_PASSWORD                   # provided by your Postgres add-on
POSTGRES_DB                         # provided by your Postgres add-on
PORT                                # e.g. "3000"
```

## Build & Run Commands

1. **Install dependencies & build**  
   In your Shelfya dashboard, set the build command to:
   ```bash
   npm install
   npm run build
   ```

2. **Start the server**  
   Set the run command to:
   ```bash
   npm start
   ```

The Express server will listen on the port you specify in `PORT`. All API routes are prefixed with `/api/v1`.

## CORS & Security

- CORS is configured to allow your `CLIENT_URL` and support credentials.
- Helmet is enabled for common HTTP header hardening.
- Cookies are parsed via `cookie-parser`.
- Client IPs are captured using `request-ip` middleware.

## Verifying Configuration

On startup, the app runs a quick environment check. If any required variable is missing, the process will exit with an error. Monitor your Shelfya logs to confirm:

```bash
> Listening on port 3000...
> All required environment variables are set.
```

Once deployed, you can test your health-check or any public endpoint under:

```
https://<your-app>.shelfya.app/api/v1/<route>
```

---
For more information about configuring Express or JWT tokens, refer to the official Express docs:  
https://expressjs.com/  
https://www.npmjs.com/package/jsonwebtoken