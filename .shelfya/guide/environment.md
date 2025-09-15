# Environment Setup

Ensure all required environment variables are defined before starting the backend. Missing or empty variables will cause the application to throw an error at startup.

## 1. Create a `.env` File

At the root of your project, create a file named `.env`:

```bash
touch .env
```

Add the following variables with your own values:

```ini
# JWT secrets & expiration (in milliseconds)
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000        # e.g. 15 minutes
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000    # e.g. 7 days

# SMTP (for transactional emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=yourSmtpUser
SMTP_PASS=yourSmtpPassword

# URLs
API_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000

# Third-party API keys
CRYPTOCOMPARE_API_KEY=yourCryptoCompareKey
ETHERSCAN_API_KEY=yourEtherscanKey

# Database (PostgreSQL)
DATABASE_URL=postgres://user:password@localhost:5432/yourdb
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=yourdb

# Server port
PORT=4000
```

## 2. Required Variables

The code enforces the presence of these variables (`backend/src/constants.ts`):

- **JWT_ACCESS_SECRET**  
- **JWT_REFRESH_SECRET**  
- **JWT_ACCESS_TOKEN_EXPIRATION_TIME**  
- **JWT_REFRESH_TOKEN_EXPIRATION_TIME**  
- **SMTP_HOST**  
- **SMTP_PORT**  
- **SMTP_USER**  
- **SMTP_PASS**  
- **API_URL**  
- **CLIENT_URL**  
- **CRYPTOCOMPARE_API_KEY**  
- **ETHERSCAN_API_KEY**  
- **DATABASE_URL**  
- **POSTGRES_USER**  
- **POSTGRES_PASSWORD**  
- **POSTGRES_DB**  
- **PORT**  

If any variable is missing or empty, the helper `verifyEnv()` will throw:

```ts
// backend/src/utils/verify-env.ts
import { REQUIRED_ENV_VARS } from "../constants";

export function verifyEnv() {
  const missingVars = REQUIRED_ENV_VARS.filter(
    (envVar) => !process.env[envVar] || process.env[envVar].trim() === ""
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing or empty required environment variables: ${missingVars.join(", ")}`
    );
  }
}
```

## 3. Load & Verify Environment Variables

Install [dotenv](https://www.npmjs.com/package/dotenv) if you haven’t already:

```bash
npm install dotenv
```

In your entry point (e.g. `backend/src/index.ts`), load and verify:

```ts
import "dotenv/config";
import { verifyEnv } from "./utils/verify-env";

verifyEnv();
// proceed to initialize your server…
```

## 4. Additional Constants

Aside from env vars, the following constants are defined in code (`backend/src/constants.ts`):

- `BCRYPT_SALT_ROUNDS = 10`  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000` (7 days)  
- Rate limiter settings for login/register endpoints  

These can be adjusted directly in the constants file if needed.