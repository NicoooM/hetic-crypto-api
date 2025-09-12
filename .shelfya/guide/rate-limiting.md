# Rate Limiting Guide

This guide explains how rate limiting works in the Hetic Crypto API backend, how it’s configured out of the box, and how you can customize it to protect authentication endpoints against abuse.

## Overview

We apply rate limiting on:

- **Login endpoint**: maximum of 5 requests per IP per 15 minutes  
- **Register endpoint**: maximum of 3 requests per IP per 15 minutes  

When the limit is exceeded, the API responds with HTTP 429 (Too Many Requests) and a standard message.

## Why Rate Limiting?

Rate limiting helps:

- Prevent brute-force attacks on login and registration  
- Reduce spam and automated account creation  
- Protect server resources from accidental overload  

## Built-in Configuration

All limiter settings live in `backend/src/constants.ts`:

```ts
export const LOGIN_LIMITER_MAX_REQUESTS    = 5;
export const REGISTER_LIMITER_MAX_REQUESTS = 3;
export const AUTH_LIMITER_WINDOW_MS        = 15 * 60 * 1000; // 15 minutes
```

The middleware itself is defined in `backend/src/middleware/rate-limiter.ts`:

```ts
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import { StatusCodes } from "http-status-codes";
import {
  AUTH_LIMITER_WINDOW_MS,
  LOGIN_LIMITER_MAX_REQUESTS,
  REGISTER_LIMITER_MAX_REQUESTS,
} from "../constants";

const getClientIp = (req: Request): string => requestIp.getClientIp(req) || "";

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

## Applying the Middleware

Attach the limiters to your Express routes:

```ts
import express from "express";
import { loginLimiter, registerLimiter } from "./middleware/rate-limiter";
import { loginHandler, registerHandler } from "./controllers/auth";

const router = express.Router();

router.post("/login", loginLimiter, loginHandler);
router.post("/register", registerLimiter, registerHandler);

export default router;
```

## Customization

You can modify limits or window size by adjusting the constants:

1. Open `backend/src/constants.ts`.
2. Update `LOGIN_LIMITER_MAX_REQUESTS`, `REGISTER_LIMITER_MAX_REQUESTS` or `AUTH_LIMITER_WINDOW_MS`.
3. Restart the server.

To change the client-identification strategy, you can replace `keyGenerator` in the limiter options. By default, it uses the IP detected by the `request-ip` package.

## Handling Rate Limit Errors

When the limit is hit, the API returns:

- HTTP Status: `429 Too Many Requests`  
- Response body:  
  ```json
  {
    "statusCode": 429,
    "message": "Too many requests from this IP, please try again after 15 minutes"
  }
  ```

Ensure your frontend catches this error and displays an appropriate message or disables retry buttons until the window resets.

## Further Reading

- express-rate-limit: https://github.com/nfriedly/express-rate-limit  
- request-ip: https://github.com/pbojinov/request-ip  