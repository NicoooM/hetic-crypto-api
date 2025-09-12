# Architecture Guide

This document outlines the high-level architecture of the HETIC Crypto API. It describes how requests flow through routes, controllers, and services, and highlights key components such as authentication, token management, and database interactions.

## Table of Contents

- Tech Stack  
- Folder Structure  
- Routing & Middleware  
- Controller Layer  
- Service Layer  
- Data Persistence (Prisma)  
- JWT & Token Management  
- Error Handling  

---

## Tech Stack

- Node.js & Express  
- TypeScript  
- Zod for schema validation  
- JSON Web Tokens (JWT)  
- Bcrypt for password hashing  
- Prisma ORM  
- PostgreSQL (or your preferred database)

---

## Folder Structure

```
backend/
 ├─ src/
 │   ├─ routes/           # Express routers
 │   │   └─ index.ts
 │   ├─ controllers/      # Request handlers
 │   │   └─ auth.controller.ts
 │   ├─ services/         # Business logic
 │   │   ├─ auth.service.ts
 │   │   ├─ token.service.ts
 │   │   └─ email.service.ts
 │   ├─ schemas/          # Zod validation schemas
 │   ├─ constants.ts
 │   └─ utils/            # Helpers (e.g., hashing)
 └─ lib/
     └─ prisma.ts         # Prisma client
```

---

## Routing & Middleware

All routes are mounted in **`routes/index.ts`**:

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

- Public endpoints live under `/auth`.  
- Protected resources (wallet, history, profile) use a `verifyAccessToken` middleware.  

---

## Controller Layer

Controllers parse and validate incoming requests, call services, and format responses.

### AuthController (auth.controller.ts)

Key methods:
- **login**: Validates credentials, returns JWT access token and sets HTTP-only refresh token cookie.
- **register**: Creates a new user and sends a verification email.
- **verifyEmail**: Confirms email via token.
- **refreshAccessToken**: Issues a new access token using a valid refresh token.
- **logout**: Deletes the stored refresh token and clears the cookie.

Example (login):

```ts
const { email, password } = req.body;
const { accessToken, refreshToken } = await this.authService.login({ email, password });

res
  .cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" })
  .json({ accessToken });
```

---

## Service Layer

Services encapsulate business logic and interact with external systems.

### AuthService (auth.service.ts)

Responsibilities:
- User lookup & validation (`prisma.user.findUnique`)
- Password hashing & verification (`bcrypt`)
- Token generation & storage (`TokenService`)
- Email verification flow (`EmailService`)

#### Login Flow

1. Fetch user by email.
2. Check `isEmailVerified`.
3. Compare password with `bcrypt.compare`.
4. Generate:
   - **Access Token** (`generateAccessToken`)
   - **Refresh Token** (`generateRefreshToken`)
5. Store hashed refresh token in DB (`saveRefreshToken`).
6. Return both tokens.

### TokenService

- `generateAccessToken(payload)` – Creates a short-lived JWT.  
- `generateRefreshToken(payload)` – Creates a longer-lived JWT.  
- `saveRefreshToken(token, userId)` – Persists token hash and expiry.  

### EmailService

- Sends verification emails using a third-party SMTP provider.  

---

## Data Persistence (Prisma)

Prisma models define `User` and `RefreshToken` schemas. The client is exposed via `lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

Prisma queries are used in services for CRUD operations.

---

## JWT & Token Management

- **Access Token**  
  - Short expiry (e.g., 15 min).  
  - Stored client-side (in memory).  
  - Sent on each protected request in `Authorization` header.

- **Refresh Token**  
  - Longer expiry (configured by `JWT_REFRESH_TOKEN_EXPIRATION_TIME`).  
  - Delivered as an HTTP-only, Secure cookie.  
  - Stored hashed in DB for rotation & revocation.

Token flow:
1. **Login** → issue both tokens.  
2. **Access** protected routes → use `Authorization: Bearer <token>`.  
3. **Refresh** on expiry → POST to `/auth/refresh`, using cookie.  
4. **Logout** → delete refresh token record and clear cookie.

---

## Error Handling

- Validation errors from Zod return **400 Bad Request**.  
- Authentication failures return **401 Unauthorized**.  
- Unexpected errors default to **500 Internal Server Error**.  

Controllers catch exceptions and map them to appropriate HTTP status codes, ensuring consistent client feedback.

---

References:

- Express.js: https://expressjs.com/  
- Zod: https://github.com/colinhacks/zod  
- Prisma: https://www.prisma.io/  
- JSON Web Tokens: https://jwt.io/  
- Bcrypt: https://github.com/kelektiv/node.bcrypt.js  