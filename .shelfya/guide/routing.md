# Routing Guide

This document walks you through the main routing setup of the HETIC Crypto API. You’ll learn how routes are mounted, which endpoints are available under each route, and how to authenticate your requests.

## Table of Contents

- [Main Router](#main-router)  
- [Authentication Routes (`/auth`)](#authentication-routes-auth)  
- [Protected Routes](#protected-routes)  
  - [Wallet (`/wallet`)](#wallet-wallet)  
  - [History (`/history`)](#history-history)  
  - [Profile (`/profile`)](#profile-profile)  
- [Public Routes](#public-routes)  
  - [Portfolio (`/portfolio`)](#portfolio-portfolio)  

---

## Main Router

All API routes are registered in `backend/src/routes/index.ts`:

```ts
import express from "express";
import { verifyAccessToken } from "middleware/auth";
import { authRouter }     from "./auth";
import { walletRouter }   from "./wallet";
import { historyRouter }  from "./history";
import { portfolioRouter }from "./portfolio";
import { profileRouter }  from "./profile";

export const router = express.Router();

router.use("/auth",    authRouter);
router.use("/wallet",  verifyAccessToken, walletRouter);
router.use("/history", verifyAccessToken, historyRouter);
router.use("/portfolio", portfolioRouter);
router.use("/profile", verifyAccessToken, profileRouter);
```

- `/auth` → Unprotected — handles registration, login, token refresh, etc.  
- `/wallet`, `/history`, `/profile` → Protected — require a valid JWT access token in `Authorization` header.  
- `/portfolio` → Public — no authentication required.

All routes are prefixed by the API’s base path (e.g., `https://api.your-domain.com`).

---

## Authentication Routes (`/auth`)

Defined in `backend/src/routes/auth.ts`, the auth router exposes:

| Method | Path                         | Description                                        | Rate Limiter       |
| ------ | ---------------------------- | -------------------------------------------------- | ------------------ |
| POST   | `/auth/login`                | Log in and receive access + refresh tokens         | loginLimiter       |
| POST   | `/auth/register`             | Create a new user account                         | registerLimiter    |
| POST   | `/auth/refresh-access-token` | Rotate expired access token using a refresh token  | —                  |
| GET    | `/auth/verify-email/:token`  | Verify user email with a one-time token            | —                  |
| POST   | `/auth/logout`               | Invalidate current refresh token (log out)         | —                  |

### Examples

Login and receive tokens:

```bash
curl -X POST https://api.your-domain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "hunter2"
  }'
```

Register a new user:

```bash
curl -X POST https://api.your-domain.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "s3cretPass!"
  }'
```

Refresh your access token:

```bash
curl -X POST https://api.your-domain.com/auth/refresh-access-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<yourRefreshTokenHere>"
  }'
```

Verify an email:

```bash
curl https://api.your-domain.com/auth/verify-email/<verificationToken>
```

Log out:

```bash
curl -X POST https://api.your-domain.com/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

---

## Protected Routes

For the following routers, you **must** include the HTTP header:

```
Authorization: Bearer <accessToken>
```

### Wallet (`/wallet`)

All wallet-related endpoints are grouped under `/wallet`.  
*(See `backend/src/routes/wallet.ts` for details.)*

Example:

```bash
curl https://api.your-domain.com/wallet/balance \
  -H "Authorization: Bearer <accessToken>"
```

### History (`/history`)

Endpoints to fetch transaction or price history live under `/history`.  
*(See `backend/src/routes/history.ts`.)*

Example:

```bash
curl https://api.your-domain.com/history/transactions \
  -H "Authorization: Bearer <accessToken>"
```

### Profile (`/profile`)

User profile management is available under `/profile`.  
*(See `backend/src/routes/profile.ts`.)*

Example:

```bash
curl https://api.your-domain.com/profile/me \
  -H "Authorization: Bearer <accessToken>"
```

---

## Public Routes

### Portfolio (`/portfolio`)

Portfolio endpoints are mounted at `/portfolio` and do **not** require authentication.  
*(See `backend/src/routes/portfolio.ts`.)*

Example:

```bash
curl https://api.your-domain.com/portfolio/overview
```

---

For more details on request and response payloads, consult each controller’s JSDoc comments in `backend/src/controllers/`.