# Rate Limiting Guide

This guide shows how to protect authentication endpoints against brute-force attacks by limiting repeated requests per client IP.

## 1. Why Rate Limiting?

- Prevent credential stuffing and brute-force attempts.
- Throttle abusive clients.
- Improve your API’s security and reliability.

## 2. Configuration

### Constants (backend/src/constants.ts)

```ts
// 15 minutes window
export const AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000;

// Max attempts per window
export const LOGIN_LIMITER_MAX_REQUESTS = 5;
export const REGISTER_LIMITER_MAX_REQUESTS = 3;
```

Adjust these values to your desired time window and maximum requests.

### Middleware (backend/src/middleware/rate-limiter.ts)

```ts
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import {
  AUTH_LIMITER_WINDOW_MS,
  LOGIN_LIMITER_MAX_REQUESTS,
  REGISTER_LIMITER_MAX_REQUESTS,
} from "../constants";
import { StatusCodes } from "http-status-codes";

const getClientIp = req => requestIp.getClientIp(req) || "";

export const loginLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: LOGIN_LIMITER_MAX_REQUESTS,
  keyGenerator: getClientIp,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message:
    "Too many requests from this IP, please try again after 15 minutes",
});

export const registerLimiter = rateLimit({
  windowMs: AUTH_LIMITER_WINDOW_MS,
  max: REGISTER_LIMITER_MAX_REQUESTS,
  keyGenerator: getClientIp,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message:
    "Too many requests from this IP, please try again after 15 minutes",
});
```

- `windowMs`: duration of rate-limit window in milliseconds.
- `max`: maximum number of requests per IP per window.
- `keyGenerator`: identifies clients by IP (via `request-ip`).
- `message` / `statusCode`: custom response on limit exceeded.

## 3. Applying to Routes

Attach the middleware to any route you wish to protect.  
In **backend/src/routes/auth.ts**:

```ts
import { loginLimiter, registerLimiter } from "middleware/rate-limiter";

authRouter.post("/login", loginLimiter, authController.login);
authRouter.post("/register", registerLimiter, authController.register);
```

Requests to `/api/v1/auth/login` and `/api/v1/auth/register` will be limited accordingly.

## 4. Handling Rate Limit Responses

When a client exceeds the limit, the API responds:

- HTTP status: **429 Too Many Requests**
- JSON body:
  
  ```json
  {
    "message": "Too many requests from this IP, please try again after 15 minutes"
  }
  ```

You can catch this client-side and show an appropriate error or cooldown timer.

## 5. Customization & Extension

- To protect other routes (e.g., password resets), import and apply your limiter:

  ```ts
  import { loginLimiter } from "middleware/rate-limiter";
  someRouter.post("/reset-password", loginLimiter, controller.resetPassword);
  ```

- To create specialized limiters, duplicate the pattern with different `windowMs`, `max` or `message`.
- You can whitelist certain IPs or skip limiting authenticated users by adding callbacks to `skip` or `handler` options; see the [express-rate-limit docs](https://github.com/express-rate-limit/express-rate-limit).

## 6. Installing Dependencies

Ensure you have these packages installed:

```bash
npm install express-rate-limit request-ip
```

---

With rate limiting in place, your authentication endpoints become more resilient to automated abuse and help keep your users’ data safer.