# Routing Guide

This guide walks you through the HTTP routes exposed by the backend API. Routes are organized into logical groups and, in some cases, guarded by middleware (e.g., `verifyAccessToken`).

All routes are registered on the main Express router:
```ts
// backend/src/routes/index.ts
import express from "express";
import { verifyAccessToken } from "middleware/auth";
import { authRouter }      from "./auth";
import { walletRouter }    from "./wallet";
import { historyRouter }   from "./history";
import { portfolioRouter } from "./portfolio";
import { profileRouter }   from "./profile";

export const router = express.Router();

router.use("/auth",  authRouter);
router.use("/wallet",   verifyAccessToken, walletRouter);
router.use("/history",  verifyAccessToken, historyRouter);
router.use("/portfolio", portfolioRouter);
router.use("/profile", verifyAccessToken, profileRouter);
```

## Authentication Routes (`/auth`)

No authentication required to access these endpoints.

### POST /auth/login
Authenticate a user.
- Rate-limited by `loginLimiter`.
- Body:
  - `email` (string)
  - `password` (string)
- Response: Access & refresh tokens (JSON).

Example:
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

### POST /auth/register
Register a new user.
- Rate-limited by `registerLimiter`.
- Body:
  - `email` (string)
  - `password` (string)
  - other profile fields as required
- Response: Confirmation message or verification instructions.

### POST /auth/refresh-access-token
Issue a new access token using a valid refresh token.
- Body:
  - `refreshToken` (string)
- Response: New access token (JSON).

### GET /auth/verify-email/:token
Validate an email verification token.
- Params:
  - `token` (string)

### POST /auth/logout
Invalidate current refresh token / session.
- Body:
  - `refreshToken` (string)

## Wallet Routes (`/wallet`)

All wallet routes require an authenticated user (via `verifyAccessToken`).

### GET /wallet
List all wallets belonging to the authenticated user.
- Response: Array of wallet objects.

### POST /wallet
Create a new wallet.
- Body:
  - `name` (string)
  - `currency` (string)
  - initial `balance` (number, optional)
- Response: Created wallet object.

### DELETE /wallet/:id
Delete a wallet by ID.
- Params:
  - `id` (string)
- Response: Deletion confirmation.

## History Routes (`/history`)

Protected by `verifyAccessToken`.

### GET /history/:id
Fetch transaction history for a specific wallet.
- Params:
  - `id` (string) — wallet ID
- Response: Array of transactions.

## Portfolio Routes (`/portfolio`)

No token guard applied here (check your security requirements).

### GET /portfolio/:id
Retrieve portfolio details for a given portfolio ID.
- Params:
  - `id` (string)
- Response: Portfolio summary.

## Profile Routes (`/profile`)

Protected by `verifyAccessToken`.

### GET /profile
Get the authenticated user’s profile.
- Response: User profile object.

### PATCH /profile
Update user profile fields.
- Body: any allowed profile fields (e.g., `name`, `avatarUrl`).
- Response: Updated profile.

### PATCH /profile/password
Change the authenticated user’s password.
- Body:
  - `currentPassword` (string)
  - `newPassword` (string)
- Response: Confirmation of password change.