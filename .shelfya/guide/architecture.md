# Architecture Overview

This guide explains the high-level architecture of the Hetic Crypto API backend, including its middleware stack, routing organization, and security layers.

## Table of Contents

- [Server Setup](#server-setup)  
- [Middleware Stack](#middleware-stack)  
- [API Versioning](#api-versioning)  
- [Routing Structure](#routing-structure)  
- [Authentication & Authorization](#authentication--authorization)  
- [Environment Variables](#environment-variables)  

---

## Server Setup

The backend is implemented with Express. The entry point is `backend/src/index.ts`:

```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";
import { verifyEnv } from "utils/verify-env";
import { router } from "routes";

const app = express();
const port = process.env.PORT;

// ...middleware registration...

app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
```

- Initializes an Express app  
- Loads environment variables via a custom `verifyEnv` check  
- Starts listening on `process.env.PORT`  

---

## Middleware Stack

Middleware is applied in this order:

1. **cookie-parser**  
   Parses HTTP cookies into `req.cookies`.

2. **cors**  
   Configures [CORS](https://github.com/expressjs/cors) with:
   ```js
   {
     origin: process.env.CLIENT_URL || "http://localhost:3000",
     credentials: true
   }
   ```
3. **helmet**  
   Adds security headers via [Helmet](https://github.com/helmetjs/helmet).

4. **express.json**  
   Parses JSON payloads into `req.body`.

5. **request-ip**  
   Attaches the client IP address to `req.clientIp`.

6. **Router mount**  
   All routes are prefixed with `/api/v1`:
   ```ts
   app.use("/api/v1", router);
   ```

---

## API Versioning

All endpoints live under the `/api/v1` prefix to allow future versioning:

```
https://your-domain.com/api/v1/...
```

---

## Routing Structure

The router configuration (`backend/src/routes/index.ts`) breaks down as follows:

- `/auth`  
  Handles user sign-up, sign-in, token refresh, etc.  
  Public: no token required.  

- `/wallet`  
  Manages user wallets (create, list, balance).  
  Protected by `verifyAccessToken`.  

- `/history`  
  Retrieves transaction history.  
  Protected by `verifyAccessToken`.  

- `/portfolio`  
  Public endpoints for retrieving market data or public portfolios.  

- `/profile`  
  User profile management (view, update).  
  Protected by `verifyAccessToken`.  

Example router setup:
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

---

## Authentication & Authorization

- **verifyAccessToken** middleware checks for a valid JWT in the `Authorization` header:
  
  ```
  Authorization: Bearer <access-token>
  ```

- Endpoints under protected routes return `401 Unauthorized` when the token is missing or invalid.

---

## Environment Variables

The server requires the following environment variables:

- `PORT` – Port for Express to listen on  
- `CLIENT_URL` – Allowed origin for CORS  
- Other JWT and database variables as defined in your `.env` (validated by `verifyEnv`)

Ensure `.env` includes all required values before starting the server.