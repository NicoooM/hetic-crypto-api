# Frequently Asked Questions

## Environment & Setup

### Q: I get an error like “Missing or empty required environment variables: …”. How do I fix this?  
A: The `verifyEnv()` utility (located in `backend/src/utils/verify-env.ts`) checks for a set of required environment variables at startup. If any are missing or empty, the app will throw an error listing the missing keys.  

Ensure you have a `.env` file (or your deployment’s environment) with all of these keys defined:

```
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TOKEN_EXPIRATION_TIME=
JWT_REFRESH_TOKEN_EXPIRATION_TIME=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
API_URL=
CRYPTOCOMPARE_API_KEY=
ETHERSCAN_API_KEY=
CLIENT_URL=
DATABASE_URL=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
PORT=
```

Example `.env` snippet:
```dotenv
# JWT
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000         # in milliseconds (e.g., 15 minutes)
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000     # in ms (7 days)

# SMTP (for password resets, email verification)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=yourUser
SMTP_PASS=yourPass

# App URLs
API_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000

# Third-party API keys
CRYPTOCOMPARE_API_KEY=xxxxxx
ETHERSCAN_API_KEY=yyyyyy

# Database
DATABASE_URL=postgres://
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=dbpass
POSTGRES_DB=dbname

# Server port
PORT=4000
```

## Authentication & Tokens

### Q: How do I control JWT token lifetimes?  
- **Access token** lifetime is driven by `JWT_ACCESS_TOKEN_EXPIRATION_TIME` (in ms).  
- **Refresh token** lifetime is driven by `JWT_REFRESH_TOKEN_EXPIRATION_TIME` (in ms).  

Both values must be set in your environment to override the defaults in `backend/src/constants.ts`.

### Q: What is the default refresh-token expiration?  
By default, the code sets `JWT_REFRESH_TOKEN_EXPIRATION_TIME` to 7 days (7 × 24 × 60 × 60 × 1000 ms). You can override this via the environment variable.

### Q: How many salt rounds does bcrypt use?  
The starter uses 10 salt rounds (`BCRYPT_SALT_ROUNDS = 10`). To increase or decrease workload, adjust that constant in `backend/src/constants.ts` before starting the server.

## Rate Limiting

The API applies rate limits on authentication routes to prevent abuse:

- **Login**: max 5 requests per 15 minutes  
- **Register**: max 3 requests per 15 minutes  

These settings live in `backend/src/constants.ts` as:
```ts
export const LOGIN_LIMITER_MAX_REQUESTS = 5;
export const REGISTER_LIMITER_MAX_REQUESTS = 3;
export const AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
```

## Email Configuration

### Q: Why am I not receiving emails?  
Ensure your SMTP settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) are correct. Test connectivity with a tool like `telnet` or an SMTP client. If you’re using Mailtrap or SendGrid, double-check credentials and allowlist your server IP if needed.

## Third-Party APIs

- **CryptoCompare**: Used for fetching real-time cryptocurrency prices. Requires `CRYPTOCOMPARE_API_KEY`.  
- **Etherscan**: Used for Ethereum on-chain data. Requires `ETHERSCAN_API_KEY`.

## Database & ORM

### Q: How do I connect to my Postgres database?  
Set `DATABASE_URL` to your Postgres connection string (e.g., `postgres://user:pass@host:port/dbname`). You’ll also need `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` defined, although some ORMs may infer these from `DATABASE_URL`.

## Miscellaneous

### Q: How do I change the server port?  
Set the `PORT` environment variable to any available port number. The default is `4000` if not specified.

---

If your question isn’t covered here, please check the source code under `backend/src/utils/verify-env.ts` and `backend/src/constants.ts`, or open an issue in the repository.