# Rate Limiting Guide

This guide explains how HTTP rate limiting is applied to authentication endpoints (login and register) in the HETIC Crypto API. Rate limiting helps prevent brute-force attacks and abuse by restricting the number of requests a client can make within a time window.

## Overview

- Each client (identified by IP address) is allowed a maximum number of requests within a fixed time window.
- When the limit is exceeded, the API responds with HTTP 429 (Too Many Requests) and a clear error message.
- Configuration is centralized in middleware and constants for easy tuning.

## Configuration Constants

Rate limiting parameters are defined in `backend/src/constants.ts`:

```ts
// window duration in milliseconds (default: 15 minutes)
export const AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000;

// maximum requests allowed per window
export const LOGIN_LIMITER_MAX_REQUESTS = 5;
export const REGISTER_LIMITER_MAX_REQUESTS = 3;
```

Adjust these values to suit your security and usability requirements.

## Middleware Implementation

The middleware uses `express-rate-limit` and `request-ip` to:

- Identify client IP addresses.
- Enforce per-IP request caps.
- Return a 429 status code with a friendly message.

```ts
// File: backend/src/middleware/rate-limiter.ts
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import { StatusCodes } from "http-status-codes";

import {
  AUTH_LIMITER_WINDOW_MS,
  LOGIN_LIMITER_MAX_REQUESTS,
  REGISTER_LIMITER_MAX_REQUESTS,
} from "../constants";

// Extract client IP or fallback to empty string
const getClientIp = (req: Request): string => {
  return requestIp.getClientIp(req) || "";
};

export const loginLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: LOGIN_LIMITER_MAX_REQUESTS,
  message: "Too many login attempts from this IP, please try again after 15 minutes",
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  keyGenerator: getClientIp,
});

export const registerLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: REGISTER_LIMITER_MAX_REQUESTS,
  message: "Too many registration attempts from this IP, please try again after 15 minutes",
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  keyGenerator: getClientIp,
});
```

## Applying Rate Limiters to Routes

Attach the `loginLimiter` and `registerLimiter` middleware to the corresponding routes in your Express app:

```ts
import express from "express";
import { loginLimiter, registerLimiter } from "./middleware/rate-limiter";
import { loginHandler, registerHandler } from "./controllers/auth";

const router = express.Router();

// POST /auth/login
router.post("/login", loginLimiter, loginHandler);

// POST /auth/register
router.post("/register", registerLimiter, registerHandler);

export default router;
```

## Error Response

When a client exceeds the allowed number of requests, the API returns:

Status Code: `429 Too Many Requests`

Response Body:
```json
{
  "status": 429,
  "error": "Too many requests from this IP, please try again after 15 minutes"
}
```

You can customize the error message or add additional response fields as needed.

## Customizing Limits

1. Update the constants in `backend/src/constants.ts`:
   - `AUTH_LIMITER_WINDOW_MS`
   - `LOGIN_LIMITER_MAX_REQUESTS`
   - `REGISTER_LIMITER_MAX_REQUESTS`
2. Restart your server for changes to take effect.

## Further Reading

- express-rate-limit: https://github.com/nfriedly/express-rate-limit
- Best practices for API security: https://owasp.org/www-project-api-security/