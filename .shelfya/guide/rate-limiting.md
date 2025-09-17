# Rate Limiting Middleware

## Overview
The Rate Limiting middleware provides protection against brute-force attacks and abuse by restricting the number of requests a client can make to authentication endpoints (login and register) within a fixed time window. It helps ensure the security and availability of authentication services by blocking excessive attempts from individual clients.

## Key Features
- **Per-IP Rate Limiting**: Limits are enforced based on each client's IP address, ensuring fair access for users and blocking potential abusers.
- **Endpoint-Specific Limits**: Distinct rate limits for `/login` (5 attempts) and `/register` (3 attempts) endpoints.
- **Customizable Time Window**: Requests are counted within a 15-minute window for each IP.
- **Automatic Blocking and Messaging**: Users exceeding the limit receive a clear error message and are temporarily blocked from further requests.

## System Errors
- **429 Too Many Requests**: Triggered when a client exceeds the permitted number of attempts for login or registration within the 15-minute window.
  - **Description**: The client (based on IP) makes more than the allowed number of requests to either `/login` or `/register`.
  - **Resolution**: Wait 15 minutes before making additional requests. If running into this frequently, check for shared IP environments or adjust limit constants in configuration as appropriate.

## Usage Examples

```typescript
import express from "express";
import { loginLimiter, registerLimiter } from "middleware/rate-limiter";
import { AuthController } from "controllers/auth.controller";

const router = express.Router();
const authController = new AuthController();

router.post("/login", loginLimiter, authController.login);
router.post("/register", registerLimiter, authController.register);

// Other authentication endpoints...
```

When a client (by IP) exceeds:
- **5 login attempts** in 15 minutes: receives HTTP 429 with message "Too many requests from this IP, please try again after 15 minutes"
- **3 register attempts** in 15 minutes: receives the same HTTP 429 with the corresponding message

## System Integration

```
┌────────────────┐
│   Express App  │
└───────┬────────┘
        │
        ▼                             
┌────────────────────┐   (applies per route)
│  Rate Limiting     │◀───────────────┬─────────┐
│  Middleware        │                │         │
└───────┬────────────┘                │         │
        │                ┌────────────┴─────┐   │
        │                │/login (POST)     │   │
        ├───────────────▶│  loginLimiter    │   │
        │                └─────┬───────────┘   │
        │                      │               │
        │                ┌─────▼───────────┐   │
        │                │/register (POST) │   │
        ├───────────────▶│registerLimiter  │   │
        │                └─────┬───────────┘   │
        │                      │               │
        ▼                      ▼               │
┌────────────────────┐  ┌─────────────────┐   │
│ AuthController     │◀─┤  Handles actions│<───┘
└────────────────────┘  └─────────────────┘
        │
        ▼
┌────────────────────┐
│  Response to user  │
└────────────────────┘
```

- **Dependencies**: Express, express-rate-limit, request-ip, configuration constants
- **Consumers**: Any authentication endpoints (primarily `/login` & `/register`)
- **Process**: Middleware intercepts requests; applies per-IP, per-endpoint rate limiting; forwards or blocks based on usage

This modular middleware can be integrated with any route requiring rate limiting (not only authentication), providing adaptable and consistent protection from abuse at the API gateway level.