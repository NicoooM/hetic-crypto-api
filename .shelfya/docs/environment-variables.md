# Environment Variables

The Crypto API backend requires several environment variables to run correctly. These settings cover JWT secrets, email (SMTP), external APIs, database connections, and server configuration. Use a `.env` file in your project root, or configure your deployment environment accordingly.

## Using a `.env` File

Install `dotenv` (or your preferred loader) and add the following at the top of your entrypoint (e.g., `index.ts`):

```typescript
import dotenv from "dotenv";
dotenv.config();
import { verifyEnv } from "./src/utils/verify-env";

verifyEnv();
// ...rest of your app bootstrap
```

## Required Variables

| Variable                             | Description                                                                                     | Example                           |
|--------------------------------------|-------------------------------------------------------------------------------------------------|-----------------------------------|
| `JWT_ACCESS_SECRET`                  | Secret key for signing access tokens.                                                          | `s3cr3tAcc3ssK3y`                 |
| `JWT_REFRESH_SECRET`                 | Secret key for signing refresh tokens.                                                         | `s3cr3tR3fr3shK3y`                |
| `JWT_ACCESS_TOKEN_EXPIRATION_TIME`   | Access token lifespan in milliseconds.                                                         | `900000` (15 minutes)             |
| `JWT_REFRESH_TOKEN_EXPIRATION_TIME`  | Refresh token lifespan in milliseconds (default 7 days = `604800000`).                         | `604800000`                       |
| `SMTP_HOST`                          | SMTP server hostname (for user verification emails, password resets, etc.).                     | `smtp.gmail.com`                  |
| `SMTP_PORT`                          | SMTP server port.                                                                               | `587`                             |
| `SMTP_USER`                          | SMTP authentication username.                                                                   | `no-reply@yourdomain.com`         |
| `SMTP_PASS`                          | SMTP authentication password or app-specific token.                                             | `emailPassword123`                |
| `API_URL`                            | Public base URL for the backend API (used in email links).                                     | `https://api.yourdomain.com`      |
| `CRYPTOCOMPARE_API_KEY`              | API key for CryptoCompare (crypto price and data).                                             | `abcdef1234567890`                |
| `ETHERSCAN_API_KEY`                  | API key for Etherscan (blockchain data).                                                       | `XYZ987654321`                    |
| `CLIENT_URL`                         | Frontend application URL (for redirects and CORS).                                             | `https://app.yourdomain.com`      |
| `DATABASE_URL`                       | Full PostgreSQL connection URI (overrides individual POSTGRES_* vars if present).              | `postgres://user:pass@host:5432/db` |
| `POSTGRES_USER`                      | PostgreSQL username (used when `DATABASE_URL` is not provided).                                | `dbuser`                          |
| `POSTGRES_PASSWORD`                  | PostgreSQL password.                                                                            | `dbpassword`                      |
| `POSTGRES_DB`                        | PostgreSQL database name.                                                                       | `cryptodb`                        |
| `PORT`                               | Port for the backend server to listen on.                                                      | `4000`                            |

> Note: The code will throw an error on startup if any variable is missing or empty (`verifyEnv()`).

## Example `.env` Snippet

```dotenv
JWT_ACCESS_SECRET=yourAccessSecretHere
JWT_REFRESH_SECRET=yourRefreshSecretHere
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=no-reply@yourdomain.com
SMTP_PASS=superSecurePassword

API_URL=https://api.yourdomain.com
CRYPTOCOMPARE_API_KEY=abcdef1234567890
ETHERSCAN_API_KEY=XYZ987654321
CLIENT_URL=https://app.yourdomain.com

# Either use DATABASE_URL...
DATABASE_URL=postgres://dbuser:dbpassword@localhost:5432/cryptodb
# ...or set these individually:
# POSTGRES_USER=dbuser
# POSTGRES_PASSWORD=dbpassword
# POSTGRES_DB=cryptodb

PORT=4000
```

## Tips

- Keep your secrets out of version control.  
- Use a secrets manager or environment-specific deployment settings in production.  
- Rotate and revoke API keys and JWT secrets regularly.