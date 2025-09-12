# Architecture Overview

This document outlines the high-level architecture of the HETIC Crypto API, focusing on how requests flow through the system, the core layers (routing, controllers, services), and the authentication workflow.

## Table of Contents

- Routing
- Controllers
- Services
- Security & Tokens
- Database Layer
- Middleware
- Request Flows

---

## Routing

All HTTP endpoints are registered in `backend/src/routes/index.ts`:

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

- `/auth` handles login, registration, token refresh, email verification, and logout.
- Protected routes (wallet, history, profile) require a valid access token via `verifyAccessToken` middleware.
- The portfolio routes are currently public.

---

## Controllers

Controllers handle HTTP requests, validate inputs (with [Zod schemas](../backend/src/schemas/auth.schemas.ts)), set secure headers, and delegate to services.

**Key file**: `backend/src/controllers/auth.controller.ts`

```ts
// Example: Login endpoint
login = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const { accessToken, refreshToken } = await this.authService.login({ email, password });

  res
    .cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: JWT_REFRESH_TOKEN_EXPIRATION_TIME })
    .json({ accessToken });
};
```

Each controller method wraps service calls in try/catch to handle:
- **Validation errors** (Zod → 400 Bad Request)
- **Auth errors** (invalid credentials → 401 Unauthorized)
- **Server errors** (500 Internal Server Error)

---

## Services

Services encapsulate business logic, data access, and interactions with third-party libraries.

### AuthService

`backend/src/services/auth.service.ts` manages user authentication:

- **login**:  
  1. Fetch user by email  
  2. Check email verification & password validity  
  3. Generate JWT access & refresh tokens via `TokenService`  
  4. Store hashed refresh token in the database  

- **register**:  
  1. Ensure email is not already registered  
  2. Hash password (bcrypt)  
  3. Insert new user (unverified)  
  4. Generate a verification JWT and send it via `EmailService`

- **verifyEmail**:  
  Validate token, mark user as verified.

- **refreshAccessToken**:  
  1. Lookup stored refresh token  
  2. Check expiration  
  3. Issue new access token

- **logout**:  
  Delete refresh token from the database.

### TokenService & EmailService

- `TokenService` handles signing/verifying JWTs and saving refresh tokens to the database.
- `EmailService` sends verification emails.  

> Note: Token secrets and expirations are defined in `backend/src/constants.ts`.

---

## Security & Tokens

- **Access Tokens**  
  - Short-lived JWTs (stored on the client side, in memory or local storage).  
  - Used in `Authorization: Bearer <token>` headers (via `verifyAccessToken` middleware).

- **Refresh Tokens**  
  - Long-lived tokens stored as **httpOnly** cookies.  
  - Rotated and stored hashed in the database for replay protection.  
  - Expiration controlled by `JWT_REFRESH_TOKEN_EXPIRATION_TIME`.

- **Headers & Cookies**  
  Controllers set security headers:
  ```http
  Cache-Control: no-store
  Pragma: no-cache
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  ```
  Cookies use `httpOnly`, `secure` (in production), and `sameSite: strict`.

---

## Database Layer

The project uses [Prisma](https://www.prisma.io/) as an ORM:

- **User** table: stores credentials, verification status.  
- **RefreshToken** table: stores hashed tokens with expiry.

Prisma client is imported from `lib/prisma`.

---

## Middleware

`backend/src/middleware/auth.ts` (not shown) exports `verifyAccessToken`:

- Verifies the JWT access token.  
- Attaches `req.user = { id, email }` for downstream handlers.  
- Returns 401 Unauthorized if the token is missing or invalid.

---

## Request Flows

### 1. Registration

1. `POST /auth/register`  
2. `AuthController.register` → validate input  
3. `AuthService.register` → hash password, create user, send verification email  
4. Client receives 201 Created

### 2. Email Verification

1. User clicks link: `/auth/verify-email/:token`  
2. `AuthController.verifyEmail` → parse token  
3. `AuthService.verifyEmail` → update `isEmailVerified`

### 3. Login

1. `POST /auth/login`  
2. `AuthController.login` → validate input  
3. `AuthService.login` → check credentials, generate tokens  
4. Response:  
   - **Header**: secure refresh token cookie  
   - **Body**: `{ accessToken }`

### 4. Token Refresh

1. `POST /auth/refresh`  
2. `AuthController.refreshAccessToken` → read refresh cookie, validate  
3. `AuthService.refreshAccessToken` → verify in DB, issue new access token  

### 5. Logout

1. `POST /auth/logout`  
2. `AuthController.logout` → delete refresh token, clear cookie  

---

For more details on controllers and schemas, explore the corresponding files under `backend/src/controllers` and `backend/src/schemas`.