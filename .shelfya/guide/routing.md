# Routing Guide

This document walks through the main HTTP routes exposed by the `hetic-crypto-api` backend. All routes are mounted on an Express router in `backend/src/routes/index.ts`. Use this guide to discover endpoints, required middleware, and typical request examples.

## Root Router

File: `backend/src/routes/index.ts`

```ts
import express from "express";
import { verifyAccessToken } from "middleware/auth";
import { authRouter } from "./auth";
import { walletRouter } from "./wallet";
import { historyRouter } from "./history";
import { portfolioRouter } from "./portfolio";
import { profileRouter } from "./profile";

export const router = express.Router();

router.use("/auth", authRouter);
router.use("/wallet", verifyAccessToken, walletRouter);
router.use("/history", verifyAccessToken, historyRouter);
router.use("/portfolio", portfolioRouter);
router.use("/profile", verifyAccessToken, profileRouter);
```

- `/auth` — authentication (no token required)  
- `/wallet` — wallet management (requires valid access token)  
- `/history` — transaction history (requires valid access token)  
- `/portfolio` — portfolio overview (public)  
- `/profile` — user profile (requires valid access token)

---

## 1. Auth Routes

File: `backend/src/routes/auth.ts`

```ts
const authRouter = express.Router();
authRouter.post("/login", loginLimiter, authController.login);
authRouter.post("/register", registerLimiter, authController.register);
authRouter.post("/refresh-access-token", authController.refreshAccessToken);
authRouter.get("/verify-email/:token", authController.verifyEmail);
authRouter.post("/logout", authController.logout);
```

### Endpoints

- **POST /auth/login**  
  Rate‐limited.  
  Body: `{ email: string, password: string }`  
  Returns: `{ accessToken, refreshToken }`

  ```bash
  curl -X POST https://api.example.com/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"john@doe.com","password":"s3cret"}'
  ```

- **POST /auth/register**  
  Rate‐limited.  
  Body: `{ email: string, password: string, name: string }`

- **POST /auth/refresh-access-token**  
  Body: `{ refreshToken: string }`  
  Issues new access token.

- **GET /auth/verify-email/:token**  
  Verifies registration email via token in URL.

- **POST /auth/logout**  
  Invalidates current refresh token.

---

## 2. Wallet Routes

File: `backend/src/routes/wallet.ts`  
All routes require `verifyAccessToken` middleware.

```ts
walletRouter
  .delete("/:id", walletController.delete)
  .post("/", walletController.create)
  .get("/", walletController.all);
```

### Endpoints

- **GET /wallet**  
  List all wallets for authenticated user.

- **POST /wallet**  
  Create a new wallet.  
  Body: `{ name: string, currency: string }`

- **DELETE /wallet/:id**  
  Delete a wallet by its `id`.

Example:

```bash
curl -X POST https://api.example.com/wallet \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Savings","currency":"EUR"}'
```

---

## 3. History Routes

File: `backend/src/routes/history.ts`  
Protected by `verifyAccessToken`.

```ts
historyRouter.get("/:id", historyController.get);
```

### Endpoint

- **GET /history/:id**  
  Retrieve transaction history for wallet with `id`.

Example:

```bash
curl https://api.example.com/history/abc123 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 4. Portfolio Routes

File: `backend/src/routes/portfolio.ts`

```ts
portfolioRouter.get("/:id", portfolioController.get);
```

### Endpoint

- **GET /portfolio/:id**  
  Public endpoint. Fetch overview for portfolio with `id`.

Example:

```bash
curl https://api.example.com/portfolio/user123
```

---

## 5. Profile Routes

File: `backend/src/routes/profile.ts`  
Protected by `verifyAccessToken`.

```ts
profileRouter
  .get("/", profileController.get)
  .patch("/", profileController.edit)
  .patch("/password", profileController.resetPassword);
```

### Endpoints

- **GET /profile**  
  Fetch current user profile.

- **PATCH /profile**  
  Update profile fields.  
  Body example: `{ name?: string, email?: string }`

- **PATCH /profile/password**  
  Change password.  
  Body: `{ oldPassword: string, newPassword: string }`

Example:

```bash
curl -X PATCH https://api.example.com/profile/password \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword":"old","newPassword":"newStrong1"}'
```

---

For more in-depth usage, refer to each controller under `backend/src/controllers/*`.