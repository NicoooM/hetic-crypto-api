# Environment Variables

The HETIC Crypto API relies on a set of environment variables to configure authentication, email delivery, external API access, database connections, and server settings. All variables must be defined and non-empty; the application will throw an error on startup if any are missing. The verification logic lives in [`backend/src/utils/verify-env.ts`](../../backend/src/utils/verify-env.ts).

## Required Variables

### Authentication
- `JWT_ACCESS_SECRET`  
  Secret key for signing access tokens.
- `JWT_REFRESH_SECRET`  
  Secret key for signing refresh tokens.
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME`  
  Access token lifetime in milliseconds (e.g. `3600000` for 1 hour).
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME`  
  Refresh token lifetime in milliseconds. Default in code is 7 days (`7 * 24 * 60 * 60 * 1000`), but you may override it via this variable.

### Email (SMTP)
- `SMTP_HOST`  
  Hostname of your SMTP server (e.g. `smtp.gmail.com`).
- `SMTP_PORT`  
  Port number of your SMTP server (usually `587` or `465`).
- `SMTP_USER`  
  SMTP username (often your email address).
- `SMTP_PASS`  
  SMTP password or app-specific password.

### External APIs
- `API_URL`  
  Base URL of your running Crypto API (e.g. `https://api.myapp.com`).
- `CRYPTOCOMPARE_API_KEY`  
  Your [CryptoCompare](https://www.cryptocompare.com/) API key.
- `ETHERSCAN_API_KEY`  
  Your [Etherscan](https://etherscan.io/) API key.
- `CLIENT_URL`  
  Frontend URL, used in email links (e.g. `https://app.myapp.com`).

### Database (PostgreSQL)
- `DATABASE_URL`  
  Full connection string for PostgreSQL (e.g. `postgresql://user:pass@host:5432/dbname`).
- `POSTGRES_USER`  
  PostgreSQL username.
- `POSTGRES_PASSWORD`  
  PostgreSQL password.
- `POSTGRES_DB`  
  PostgreSQL database name.

### Server
- `PORT`  
  Port on which the API server listens (e.g. `3000`).

## Example `.env` File

Create a `.env` file in your project root:

```bash
# Authentication
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=3600000    # 1 hour
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000 # 7 days

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=no-reply@myapp.com
SMTP_PASS=supersecretpassword

# External APIs
API_URL=https://api.myapp.com
CRYPTOCOMPARE_API_KEY=abcdef123456
ETHERSCAN_API_KEY=12345ABCDE
CLIENT_URL=https://app.myapp.com

# Database
DATABASE_URL=postgresql://postgres:secret@localhost:5432/crypto_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret
POSTGRES_DB=crypto_db

# Server
PORT=3000
```

## Runtime Verification

At startup, the application calls `verifyEnv()` from [`backend/src/utils/verify-env.ts`](../../backend/src/utils/verify-env.ts) to ensure all required variables are set:

```ts
import { verifyEnv } from "./utils/verify-env";

verifyEnv();
// If any required vars are missing or empty, the process will exit with an error.
```

Make sure to load your `.env` (e.g. using [dotenv](https://github.com/motdotla/dotenv)) before calling `verifyEnv()`.