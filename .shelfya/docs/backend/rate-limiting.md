# Rate Limiting

This document covers how to apply rate limiting to your authentication endpoints using the built-in `loginLimiter` and `registerLimiter` middleware.

## Overview

We use [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) together with [request-ip](https://github.com/pbojinov/request-ip) to:

- Limit repeated login attempts
- Limit repeated registration attempts
- Throttle by client IP
- Return HTTP 429 (Too Many Requests) on violations

## Middleware Definitions

File: `backend/src/middleware/rate-limiter.ts`

```ts
import {
  AUTH_LIMITER_WINDOW_MS,
  LOGIN_LIMITER_MAX_REQUESTS,
  REGISTER_LIMITER_MAX_REQUESTS,
} from "../constants";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import { StatusCodes } from "http-status-codes";
import type { Request } from "express";

const getClientIp = (req: Request): string => {
  return requestIp.getClientIp(req) || "";
};

export const loginLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: LOGIN_LIMITER_MAX_REQUESTS,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes",
  keyGenerator: getClientIp,
});

export const registerLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: REGISTER_LIMITER_MAX_REQUESTS,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes",
  keyGenerator: getClientIp,
});
```

### Constants

Defined in `backend/src/constants.ts` (example values):

```ts
export const AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const LOGIN_LIMITER_MAX_REQUESTS = 10;         // max 10 login attempts per window
export const REGISTER_LIMITER_MAX_REQUESTS = 5;       // max 5 registrations per window
```

Adjust these values as needed for your security requirements.

## Applying the Middleware

In your Express router or app setup, import and mount the limiters:

```ts
import express from "express";
import { loginLimiter, registerLimiter } from "./middleware/rate-limiter";
import { loginHandler, registerHandler } from "./controllers/auth";

const router = express.Router();

// Apply rate limiting to login endpoint
router.post(
  "/auth/login",
  loginLimiter,
  loginHandler
);

// Apply rate limiting to register endpoint
router.post(
  "/auth/register",
  registerLimiter,
  registerHandler
);

export default router;
```

## Customization

If you need custom behavior:

- Override the `message` or `statusCode` in the options.
- Use other express-rate-limit options like `headers`, `skipFailedRequests`, etc.
- Provide a custom `keyGenerator` for different identification strategies (e.g., user ID, API key).

```ts
const customLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  headers: true,       // sends RateLimit-* headers
  skipFailedRequests: true,
});
```

For full configuration options, refer to the [express-rate-limit documentation](https://github.com/express-rate-limit/express-rate-limit#options).