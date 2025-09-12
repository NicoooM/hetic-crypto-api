# Environment Configuration

This guide covers all the required environment variables for running the HETIC Crypto API backend. Missing or empty variables will cause the application to crash on startup.

## Prerequisites

- Node.js (>=14)
- A running PostgreSQL instance
- A `.env` file at your project root or environment variables set in your deployment platform
- Install dependencies:  
  ```bash
  npm install
  # or
  yarn install
  ```

## Required Environment Variables

| Variable                                | Description                                                      | Example                                      |
| --------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| JWT_ACCESS_SECRET                       | Secret key for signing access tokens                            | `myAccessSecret`                             |
| JWT_REFRESH_SECRET                      | Secret key for signing refresh tokens                           | `myRefreshSecret`                            |
| JWT_ACCESS_TOKEN_EXPIRATION_TIME        | Access token lifespan (ms)                                       | `900000`                                     |
| JWT_REFRESH_TOKEN_EXPIRATION_TIME       | Refresh token lifespan (ms; default 7 days → `604800000`)        | `604800000`                                  |
| SMTP_HOST                                | SMTP server host                                                 | `smtp.gmail.com`                             |
| SMTP_PORT                                | SMTP server port                                                 | `587`                                        |
| SMTP_USER                                | SMTP authentication username                                     | `no-reply@yourapp.com`                      |
| SMTP_PASS                                | SMTP authentication password                                     | `smtpPassword`                               |
| API_URL                                 | Base URL of this API                                             | `http://localhost:4000`                      |
| CLIENT_URL                              | Frontend application URL                                         | `http://localhost:3000`                      |
| CRYPTOCOMPARE_API_KEY                   | CryptoCompare API key                                            | `abc123crypto`                               |
| ETHERSCAN_API_KEY                       | Etherscan API key                                                | `xyz789etherscan`                            |
| DATABASE_URL                            | Full Postgres connection URI                                     | `postgresql://user:pass@localhost:5432/db`   |
| POSTGRES_USER                           | Postgres username                                                | `user`                                       |
| POSTGRES_PASSWORD                       | Postgres password                                                | `pass`                                       |
| POSTGRES_DB                             | Postgres database name                                           | `db`                                         |
| PORT                                    | Port for the server to listen on                                 | `4000`                                       |

## Example `.env` File

Create a file named `.env` in your project root:

```env
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=mailer@example.com
SMTP_PASS=supersecret

API_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000

CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
ETHERSCAN_API_KEY=your_etherscan_key

DATABASE_URL=postgresql://postgres:password@localhost:5432/crypto_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=crypto_db

PORT=4000
```

## Verification at Startup

The function `verifyEnv()` in `backend/src/utils/verify-env.ts` enforces that all required variables are present and non-empty:

```ts
import { verifyEnv } from "./utils/verify-env";

verifyEnv();
// ...initialize server
```

If any variables are missing, the application will throw an error listing them:

```
Error: Missing or empty required environment variables: JWT_ACCESS_SECRET, DATABASE_URL
```

## Next Steps

1. Ensure your database is running and reachable.  
2. Run in development mode:  
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Head over to the [Getting Started Guide](getting-started.md) to learn about API endpoints and workflows.