# Middleware Guide

This guide covers the built-in middleware for authentication and rate limiting in the HETIC Crypto API backend. You’ll learn how to protect routes, validate JWTs, and throttle requests per IP.

## 1. Authentication Middleware

### verifyAccessToken

Blocks access to protected routes by verifying a JSON Web Token in the `Authorization` header.

#### How It Works
1. Checks for an `Authorization` header with the `Bearer <token>` format.  
2. Verifies the token using `jsonwebtoken` and the `JWT_ACCESS_SECRET` environment variable.  
3. Validates decoded payload against a Zod schema (`middlewareSchema`).  
4. Attaches parsed user data to `req.user`.  
5. Sends a `401 Unauthorized` if no token is present, or `403 Forbidden` if token validation fails.

#### Setup

1. Make sure you have `JWT_ACCESS_SECRET` set in your environment.
2. Import and apply `verifyAccessToken` to protected routes.

```ts
// app.ts or routes.ts
import express from "express";
import { verifyAccessToken } from "./middleware/auth";
import { getProfile } from "./controllers/user.controller";

const app = express();

app.get("/profile", verifyAccessToken, getProfile);
```

#### Error Responses

- 401 Unauthorized  
  `{ "message": "Unauthorized" }`  
- 403 Forbidden  
  `{ "message": "Invalid token" }`

---

## 2. Rate Limiting Middleware

Built with `express-rate-limit` and `request-ip` to throttle login/register attempts and mitigate brute-force attacks.

### Key Constants

- `AUTH_LIMITER_WINDOW_MS`: Time window in milliseconds (e.g., 15 minutes).  
- `LOGIN_LIMITER_MAX_REQUESTS`: Max attempts allowed per window for login.  
- `REGISTER_LIMITER_MAX_REQUESTS`: Max attempts allowed per window for registration.

These are defined in `backend/src/constants`.

### loginLimiter & registerLimiter

Both limiters use the client’s IP as the key and share the same time window and error message.

```ts
import { loginLimiter, registerLimiter } from "./middleware/rate-limiter";

app.post("/auth/login", loginLimiter, loginController);
app.post("/auth/register", registerLimiter, registerController);
```

#### Default Behavior

- window: `AUTH_LIMITER_WINDOW_MS`  
- max: `LOGIN_LIMITER_MAX_REQUESTS` or `REGISTER_LIMITER_MAX_REQUESTS`  
- status code: 429 Too Many Requests  
- message:  
  `"Too many requests from this IP, please try again after 15 minutes"`

### Customization

If you need different limits, override the options:

```ts
import rateLimit from "express-rate-limit";

const customLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,      // 5 minutes
  max: 20,                      // 20 requests per window
  message: "Slow down—you hit the limit!",
  keyGenerator: (req) => req.ip
});
```

---

For more details on configuration options, see the [express-rate-limit docs](https://github.com/nfriedly/express-rate-limit).