# Environment Setup

This guide explains how to configure the environment variables required by the HETIC Crypto API backend. All variables listed below are mandatory—missing or empty values will cause the application to fail on startup.

## 1. Create a `.env` File

At the root of your project, create a file named `.env`. This file will hold your environment-specific settings.

Example:

```
# JSON Web Token secrets and expirations
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000            # in milliseconds (15 minutes)
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000        # in milliseconds (7 days)

# SMTP (email) configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=email@example.com
SMTP_PASS=your_email_password

# API endpoints
API_URL=http://localhost:4000                      # Backend base URL
CLIENT_URL=http://localhost:3000                   # Frontend URL

# Third-party API keys
CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Database (PostgreSQL)
DATABASE_URL=postgres://localhost:5432/mydatabase
POSTGRES_USER=my_db_user
POSTGRES_PASSWORD=my_db_password
POSTGRES_DB=my_db_name

# Server
PORT=4000
```

## 2. Required Environment Variables

The backend enforces the following variables via `verifyEnv()`:

- **JWT_ACCESS_SECRET**: Secret key for signing access tokens.
- **JWT_REFRESH_SECRET**: Secret key for signing refresh tokens.
- **JWT_ACCESS_TOKEN_EXPIRATION_TIME**: Access token lifespan in milliseconds.
- **JWT_REFRESH_TOKEN_EXPIRATION_TIME**: Refresh token lifespan in milliseconds.
- **SMTP_HOST**: SMTP server hostname.
- **SMTP_PORT**: SMTP server port.
- **SMTP_USER**: Username for SMTP authentication.
- **SMTP_PASS**: Password for SMTP authentication.
- **API_URL**: Base URL of the backend API (used in email links).
- **CRYPTOCOMPARE_API_KEY**: API key for CryptoCompare price data.
- **ETHERSCAN_API_KEY**: API key for Etherscan blockchain queries.
- **CLIENT_URL**: Frontend application URL (used in email callbacks).
- **DATABASE_URL**: Full connection URI for your PostgreSQL database.
- **POSTGRES_USER**: Database username.
- **POSTGRES_PASSWORD**: Database password.
- **POSTGRES_DB**: Name of the database to connect to.
- **PORT**: TCP port on which the server listens.

## 3. How It’s Verified

On application start, the function `verifyEnv()` checks that none of these variables are missing or empty:

```ts
import { verifyEnv } from "./utils/verify-env";

async function main() {
  verifyEnv();
  // ... start server
}

main();
```

If one or more variables are unset, the server throws an error listing the missing entries.

## 4. Tips & Best Practices

- Do **not** commit your `.env` file to version control. Add it to your `.gitignore`.
- Generate strong, random secrets for `JWT_*_SECRET`.
- Keep API keys and database credentials secure; consider using a vault or CI/CD secret manager in production.
- Adjust token expiration values according to your security requirements.

Once your `.env` is populated, start the backend:

```bash
npm install
npm run start:dev
```

Your API should now run on the port specified by `PORT`.