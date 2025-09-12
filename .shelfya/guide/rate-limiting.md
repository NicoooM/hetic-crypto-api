# Rate Limiting Guide

This guide explains how rate limiting is implemented in the HETIC Crypto API to protect authentication endpoints from abuse. We use the `express-rate-limit` package, tracking clients by IP address.

## Why Rate Limiting?

- Prevent brute-force attacks on login and registration routes  
- Reduce API abuse and ensure fair usage  
- Automatically block excessive requests for a configurable period  

## Core Implementation

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

// Extract client IP from request
const getClientIp = (req: Request): string => {
  return requestIp.getClientIp(req) || "";
};

// Rate limiter for login endpoint
export const loginLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: LOGIN_LIMITER_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes",
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  keyGenerator: getClientIp,
});

// Rate limiter for registration endpoint
export const registerLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: REGISTER_LIMITER_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes",
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  keyGenerator: getClientIp,
});
```

### Key Points

- `windowMs`  
  Time frame for limiting requests (in milliseconds).  
- `max`  
  Maximum number of requests allowed within the window.  
- `keyGenerator`  
  Uses the client’s IP address to track unique requesters.  
- `message` & `statusCode`  
  Custom response sent when the limit is exceeded (HTTP 429).

## Applying the Middleware

Attach the rate limiter to your Express routes:

```ts
import express from "express";
import { loginLimiter, registerLimiter } from "./middleware/rate-limiter";
import { loginHandler, registerHandler } from "./controllers/auth";

const router = express.Router();

// Protect /login with request limits
router.post("/login", loginLimiter, loginHandler);

// Protect /register with request limits
router.post("/register", registerLimiter, registerHandler);

export default router;
```

## Configuration Constants

The following constants can be found in `backend/src/constants.ts`. Adjust them as needed:

- `AUTH_LIMITER_WINDOW_MS` (e.g., `15 * 60 * 1000` for 15 minutes)  
- `LOGIN_LIMITER_MAX_REQUESTS` (max login attempts per window)  
- `REGISTER_LIMITER_MAX_REQUESTS` (max registrations per window)  

Consider exposing them as environment variables if you need dynamic control in production.

## Testing Rate Limits

1. Use a tool like [curl](https://curl.se/) or [Postman](https://www.postman.com/) to send repeated requests to `/login` or `/register`.  
2. After exceeding `max` within `windowMs`, you should receive a 429 response:

```jsonc
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

## Further Reading

- express-rate-limit documentation: https://github.com/express-rate-limit/express-rate-limit  
- request-ip for client IP extraction: https://github.com/pbojinov/request-ip