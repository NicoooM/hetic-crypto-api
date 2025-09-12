# Middleware

This document describes the built-in Express middleware functions for authentication and rate limiting in the backend.

## 1. Authentication Middleware

### verifyAccessToken

Validates a JWT access token on protected routes, attaches the decoded payload to `req.user`, or rejects the request.

#### Usage

```ts
import express from 'express';
import { verifyAccessToken } from 'backend/src/middleware/auth';

const app = express();

app.get(
  '/protected',
  verifyAccessToken,
  (req, res) => {
    // req.user contains the parsed JWT payload
    res.json({ message: 'Access granted', user: req.user });
  }
);
```

#### Behavior

- Reads the `Authorization` header and expects a value like `Bearer <token>`.
- Verifies the token using the `JWT_ACCESS_SECRET` environment variable.
- Parses the decoded payload against `middlewareSchema` (from `schemas/auth.schemas`).
- On success, sets `req.user = parsedPayload` and calls `next()`.
- On failure:
  - Returns **401 Unauthorized** if the header is missing or malformed.
  - Returns **403 Forbidden** if the token is invalid or expired.

#### Environment Variable

- `JWT_ACCESS_SECRET`  
  Secret key used to sign and verify JWT access tokens.

---

## 2. Rate Limiting Middleware

Protects authentication endpoints from brute-force and abuse by limiting the number of requests per IP.

### Constants

```ts
import {
  AUTH_LIMITER_WINDOW_MS,      // e.g. 15 * 60 * 1000 (15 minutes)
  LOGIN_LIMITER_MAX_REQUESTS,  // max attempts for login
  REGISTER_LIMITER_MAX_REQUESTS // max attempts for register
} from '../constants';
```

Both limiters use the client IP (via [request-ip](https://www.npmjs.com/package/request-ip)) to identify unique clients.

### loginLimiter

Limits login attempts per IP to `LOGIN_LIMITER_MAX_REQUESTS` within `AUTH_LIMITER_WINDOW_MS`.

```ts
import { loginLimiter } from 'backend/src/middleware/rate-limiter';

app.post('/login', loginLimiter, loginHandler);
```

- On exceeding the limit, responds with **429 Too Many Requests** and the message:  
  `"Too many requests from this IP, please try again after 15 minutes"`.

### registerLimiter

Limits registration attempts per IP to `REGISTER_LIMITER_MAX_REQUESTS` within `AUTH_LIMITER_WINDOW_MS`.

```ts
import { registerLimiter } from 'backend/src/middleware/rate-limiter';

app.post('/register', registerLimiter, registerHandler);
```

- Behavior and error response are identical to `loginLimiter`.

---

By integrating these middleware functions, you enforce secure access control and protect your authentication endpoints from abuse.