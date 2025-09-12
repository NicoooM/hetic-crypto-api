# Crypto API Architecture

This document outlines the high-level structure of the HETIC Crypto API backend, detailing its core layers, technology choices, routing strategy and database integration.

## 1. Project Structure

```
backend/
└── src/
    ├── index.ts           # Server bootstrap
    ├── routes/
    │   ├── index.ts       # Central router
    │   ├── auth.ts        # /auth endpoints
    │   ├── wallet.ts      # /wallet endpoints
    │   ├── history.ts     # /history endpoints
    │   ├── portfolio.ts   # /portfolio endpoints
    │   └── profile.ts     # /profile endpoints
    └── lib/
        └── prisma.ts      # Prisma client initialization
```

## 2. Server Bootstrap (`index.ts`)

The entry point configures and starts an Express server on `process.env.PORT`:

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
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
};

// Security & parsing middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(requestIp.mw());

// Mount API routes under /api/v1
app.use("/api/v1", router);

// Validate env vars then start listening
app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
```

Key middleware:
- **cookieParser**: parses HTTP cookies  
- **cors**: allows cross-origin requests from your frontend  
- **helmet**: secures HTTP headers  
- **express.json**: parses JSON bodies  
- **request-ip**: attaches client IP to requests  

## 3. Routing Layer (`routes/index.ts`)

All routes are grouped by resource and versioned under `/api/v1`. Protected routes use `verifyAccessToken` middleware:

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

- `/auth`: signup, login, token refresh  
- `/wallet`, `/history`, `/profile`: protected routes require a valid JWT  
- `/portfolio`: publicly accessible portfolio data  

## 4. Database Integration (`lib/prisma.ts`)

Prisma is used as the ORM to interact with the database. A single `PrismaClient` instance is shared across the application:

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

Usage in a route/controller:

```ts
import { prisma } from "lib/prisma";

async function getUserWallet(userId: string) {
  return prisma.wallet.findMany({ where: { userId } });
}
```

## 5. Environment Validation

Before processing requests, the API calls `verifyEnv()` (from `utils/verify-env`) to ensure all required environment variables—such as `PORT`, `DATABASE_URL`, and `CLIENT_URL`—are set and valid.

## 6. Extending the Architecture

- Add new resources by creating a router in `routes/` and mounting it in `routes/index.ts`.  
- For shared logic, leverage middlewares or utility functions under `middleware/` and `utils/`.  
- Reuse the global `prisma` client for transactional operations, data migrations or seeding scripts.  

With this layered design—bootstrap, middleware, routing and database client—the Crypto API remains modular, secure and easy to maintain.