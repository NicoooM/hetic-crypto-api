# Routing Guide

This guide explains how HTTP routes are organized in the backend and how to work with them. You’ll learn:

- How routes are mounted and protected  
- Available authentication and wallet endpoints  
- How to add or extend routes  

---

## 1. Route Structure

All routes live under `backend/src/routes`. The main router is defined in **index.ts**:

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

- `/auth` – Public endpoints for login, registration, token refresh, email verification and logout.  
- `/wallet` – Protected wallet CRUD endpoints.  
- `/history` & `/profile` – Protected; require a valid access token.  
- `/portfolio` – Public or limited-protected endpoints (implementation-specific).

All routes are mounted on your main `Express` app:

```ts
import express from "express";
import { router as apiRouter } from "./routes";

const app = express();
app.use("/api", apiRouter);
```

---

## 2. Authentication Routes (`/auth`)

File: `backend/src/routes/auth.ts`

```ts
authRouter.post("/login", loginLimiter, authController.login);
authRouter.post("/register", registerLimiter, authController.register);
authRouter.post("/refresh-access-token", authController.refreshAccessToken);
authRouter.get("/verify-email/:token", authController.verifyEmail);
authRouter.post("/logout", authController.logout);
```

Endpoints:

- **POST** `/api/auth/login`  
  Rate-limited. Body: `{ email, password }`  
- **POST** `/api/auth/register`  
  Rate-limited. Body: `{ name, email, password }`  
- **POST** `/api/auth/refresh-access-token`  
  Body: `{ refreshToken }`  
- **GET** `/api/auth/verify-email/:token`  
  Params: `token` (email verification token)  
- **POST** `/api/auth/logout`  
  Body: `{ refreshToken }`

Example: user login via curl

```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

---

## 3. Wallet Routes (`/wallet`)

File: `backend/src/routes/wallet.ts`

```ts
walletRouter.delete("/:id", walletController.delete);
walletRouter.post("/", walletController.create);
walletRouter.get("/", walletController.all);
```

Endpoints (all require a valid access token):

- **GET** `/api/wallet`  
  List all wallets for the authenticated user.  
- **POST** `/api/wallet`  
  Create a new wallet. Body: `{ name, balance, currency }`  
- **DELETE** `/api/wallet/:id`  
  Delete wallet by ID. Param: `id`

Example: create a wallet

```bash
curl -X POST https://your-domain.com/api/wallet \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Savings","balance":1000,"currency":"USD"}'
```

---

## 4. Middleware & Protection

- **verifyAccessToken**: Checks the `Authorization` header for a valid JWT.  
- **loginLimiter / registerLimiter**: Rate-limits repeated requests to prevent brute force attacks.

All protected endpoints are defined in `backend/src/middleware/auth.ts` and `backend/src/middleware/rate-limiter.ts`.

---

## 5. Extending Routes

To add a new resource:

1. Create `backend/src/routes/yourResource.ts`:

   ```ts
   import { Router } from "express";
   import { YourController } from "controllers/your.controller";

   const yourRouter = Router();
   const yourController = new YourController();

   yourRouter.get("/", yourController.list);
   yourRouter.post("/", yourController.create);

   export { yourRouter };
   ```

2. Mount it in `index.ts`:

   ```ts
   import { yourRouter } from "./yourResource";
   router.use("/your-resource", verifyAccessToken, yourRouter);
   ```

3. Implement business logic in `backend/src/controllers/your.controller.ts`.  

---

For more details on Express routing and middleware, see the official documentation:  
https://expressjs.com/en/guide/routing.html