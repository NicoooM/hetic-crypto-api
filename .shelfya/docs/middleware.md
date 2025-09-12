# Middleware

This document covers the built-in middleware provided by the API for authentication and rate limiting. Use these helpers to protect routes, verify JWTs, and throttle abusive requests.

## Authentication Middleware: `verifyAccessToken`

### What it does
- Checks for an `Authorization` header in the format `Bearer <token>`
- Verifies the JWT against the `JWT_ACCESS_SECRET` environment variable
- Parses and validates the payload with a Zod schema (`middlewareSchema`)
- On success, attaches `req.user` (the decoded payload) and calls `next()`
- On failure:
  - Returns HTTP 401 if the header is missing or malformed
  - Returns HTTP 403 if the token is invalid or expired

### Setup

1. Define your secret in `.env`:
   ```
   JWT_ACCESS_SECRET=your-secret-key
   ```

2. Mount `verifyAccessToken` on routes you want to protect:
   ```ts
   import express from "express";
   import { verifyAccessToken } from "./middleware/auth";

   const app = express();

   app.get(
     "/api/profile",
     verifyAccessToken,
     (req, res) => {
       // req.user is now available
       res.json({ user: req.user });
     }
   );
   ```

3. Handle errors on the client side:
   - 401 Unauthorized: missing or malformed token
   - 403 Forbidden: invalid or expired token

## Rate Limiting Middleware: `loginLimiter` & `registerLimiter`

To prevent brute-force attempts, the API provides two Express rate limiters. Both use IP addresses as keys.

### Features
- Time window: `AUTH_LIMITER_WINDOW_MS` (milliseconds)
- Maximum requests:
  - `LOGIN_LIMITER_MAX_REQUESTS` for `/login`
  - `REGISTER_LIMITER_MAX_REQUESTS` for `/register`
- On limit exceed: HTTP 429 Too Many Requests with a friendly message

### Setup

```ts
import express from "express";
import {
  loginLimiter,
  registerLimiter
} from "./middleware/rate-limiter";
import { loginHandler } from "./controllers/auth";
import { registerHandler } from "./controllers/auth";

const app = express();

app.post("/login", loginLimiter, loginHandler);
app.post("/register", registerLimiter, registerHandler);
```

### Configuration Constants

Adjust limits in your constants file (`backend/src/constants.ts`):

```ts
export const AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const LOGIN_LIMITER_MAX_REQUESTS = 5;
export const REGISTER_LIMITER_MAX_REQUESTS = 5;
```

## Related Links
- express-rate-limit: https://www.npmjs.com/package/express-rate-limit  
- jsonwebtoken: https://github.com/auth0/node-jsonwebtoken  
- Zod schemas (for payload validation): `backend/src/schemas/auth.schemas.ts`  
- http-status-codes: https://www.npmjs.com/package/http-status-codes