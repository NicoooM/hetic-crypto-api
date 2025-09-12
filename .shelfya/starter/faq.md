# Frequently Asked Questions

## What environment variables do I need to run the API?
The application enforces a set of required environment variables at startup. If any are missing or empty, it will throw an error and refuse to start. Here’s the full list:

- `JWT_ACCESS_SECRET`  
- `JWT_REFRESH_SECRET`  
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME`  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME`  
- `SMTP_HOST`  
- `SMTP_PORT`  
- `SMTP_USER`  
- `SMTP_PASS`  
- `API_URL`  
- `CRYPTOCOMPARE_API_KEY`  
- `ETHERSCAN_API_KEY`  
- `CLIENT_URL`  
- `DATABASE_URL`  
- `POSTGRES_USER`  
- `POSTGRES_PASSWORD`  
- `POSTGRES_DB`  
- `PORT`  

### Example `.env`
```dotenv
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=supersecret
API_URL=https://api.yourdomain.com
CRYPTOCOMPARE_API_KEY=abc123
ETHERSCAN_API_KEY=def456
CLIENT_URL=https://app.yourdomain.com
DATABASE_URL=postgres://user:pass@localhost:5432/yourdb
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=yourdb
PORT=4000
```

## How does the app check for missing/empty variables?
On startup, the `verifyEnv()` utility runs automatically. It scans the required list and throws an error if any variable is missing or blank:

```ts
import { REQUIRED_ENV_VARS } from "../constants";

export function verifyEnv() {
  const missing = REQUIRED_ENV_VARS.filter(
    v => !process.env[v] || process.env[v].trim() === ""
  );
  if (missing.length) {
    throw new Error(
      `Missing or empty required environment variables: ${missing.join(", ")}`
    );
  }
}
```

Make sure to load your `.env` (via [dotenv](https://www.npmjs.com/package/dotenv) or similar) before calling `verifyEnv()`.

## What are the token expiration settings?
- **Access Token TTL**: Configured via `JWT_ACCESS_TOKEN_EXPIRATION_TIME` (e.g., `"15m"`, `"1h"`).  
- **Refresh Token TTL**: Defaults to 7 days (in milliseconds) as defined by `JWT_REFRESH_TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000`.

```ts
// 7 days in ms
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;
```

## How are user passwords hashed?
We use bcrypt with a salt rounds factor of 10:

```ts
export const BCRYPT_SALT_ROUNDS = 10;
```

Before saving a password:
```ts
import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../constants";

const hashed = await bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
```

## How is rate limiting configured?
There are three rate-limit settings to protect authentication endpoints:

- `LOGIN_LIMITER_MAX_REQUESTS`: 5 requests  
- `REGISTER_LIMITER_MAX_REQUESTS`: 3 requests  
- `AUTH_LIMITER_WINDOW_MS`: 15 minutes (in milliseconds)

```ts
export const LOGIN_LIMITER_MAX_REQUESTS = 5;
export const REGISTER_LIMITER_MAX_REQUESTS = 3;
export const AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000; // 15m
```

Use these constants when applying rate-limiting middleware (e.g., [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)).

---

Still have questions? Please check the [getting-started guide](../getting-started.md) or open an issue on GitHub.