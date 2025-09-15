# Architecture Overview

This guide describes the high-level structure of the **Hetic Crypto API** backend. You’ll learn how requests flow through middleware, how routes are organized, and where to plug in new functionality.

## Table of Contents

- [Project Structure](#project-structure)  
- [Server Initialization](#server-initialization)  
- [Middleware Stack](#middleware-stack)  
- [API Versioning & Routing](#api-versioning--routing)  
- [Authentication Flow](#authentication-flow)  
- [Adding New Routes](#adding-new-routes)  

---

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── routes/
│   │   ├── index.ts          # Main router
│   │   ├── auth.ts           # /auth endpoints
│   │   ├── wallet.ts         # /wallet endpoints
│   │   ├── history.ts        # /history endpoints
│   │   ├── portfolio.ts      # /portfolio endpoints
│   │   └── profile.ts        # /profile endpoints
│   ├── middleware/           # Authentication, logging, etc.
│   └── utils/                # Helpers (e.g. env verification)
└── package.json
```

---

## Server Initialization

All incoming HTTP requests start in **`backend/src/index.ts`**:

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

// Configure CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
};

// Register middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(requestIp.mw());

// Mount API router
app.use("/api/v1", router);

// Start server
app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
```

Key points:

- Environment variables are validated on startup via `verifyEnv()`.
- The entire API is exposed under the `/api/v1` path.
- Middleware is applied globally before any route handling.

---

## Middleware Stack

1. **cookieParser**  
   Parses `Cookie` header into `req.cookies`.

2. **cors**  
   Enables CORS with credentials support. By default, it allows requests from `CLIENT_URL` or `http://localhost:3000`.

3. **helmet**  
   Sets secure HTTP headers.

4. **express.json**  
   Parses incoming JSON payloads.

5. **request-ip**  
   Attaches client IP address to `req.clientIp`.

6. **verifyAccessToken** (route-specific)  
   Checks for a valid JWT in the `Authorization` header.

---

## API Versioning & Routing

All routes are declared in **`backend/src/routes/index.ts`**:

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

- **/auth**: Public endpoints for login, signup, token refresh.  
- **/wallet** & **/history** & **/profile**: Protected; require a valid access token.  
- **/portfolio**: Public (e.g., fetch market data or user portfolios).

---

## Authentication Flow

1. Client calls `POST /api/v1/auth/login` (or `/signup`).  
2. Server issues an access token (and refresh token) stored in an HTTP-only cookie.  
3. For protected routes, `verifyAccessToken`:
   - Reads token from `Authorization` header or cookie.
   - Validates signature & expiry.
   - Attaches user info to `req.user`.
4. Downstream handlers read `req.user` to perform user-specific operations.

---

## Adding New Routes

1. **Create** a new file in `backend/src/routes`, e.g. `transactions.ts`.  
2. **Define** an Express router:

   ```ts
   import { Router } from "express";
   export const transactionsRouter = Router();

   transactionsRouter.get("/", (req, res) => {
     // ...
   });
   ```

3. **Mount** it in `backend/src/routes/index.ts`:

   ```ts
   import { transactionsRouter } from "./transactions";
   // ...
   router.use(
     "/transactions",
     verifyAccessToken,     // if protected
     transactionsRouter
   );
   ```

4. **Implement** any needed middleware under `backend/src/middleware`.  
5. **Test** your endpoints via Postman or curl:

   ```bash
   curl http://localhost:4000/api/v1/transactions
   ```

---

For more details on route handlers and utilities, see the individual files under `backend/src/routes` and `backend/src/utils`.