# Architecture

This document outlines the high-level structure of the HETIC Crypto API, showing how requests flow from the client to the database and how the main components (Express server, middleware, routers, and Prisma) interact.

## 1. System Overview

Client → Express Server → Middleware → Router (/api/v1) → Route Handlers → Prisma → Database

```
┌────────────┐
│   Client   │
└──────┬─────┘
       │ HTTP
       ▼
┌────────────┐
│ Express    │
│ Server     │
│ (index.ts) │
└──────┬─────┘
       │
       │ middleware (CORS, Helmet, JSON, cookie, IP)
       ▼
┌────────────┐
│ /api/v1    │
│ router     │
└──────┬─────┘
       │
       │ route-specific middleware
       ▼
┌────────────┐
│ Route      │───┐
│ Handlers   │   │
└──────┬─────┘   │
       │         │ Prisma client calls
       ▼         ▼
   ┌──────────────┐
   │ PostgreSQL / │
   │ MySQL / etc. │
   └──────────────┘
```

## 2. Express Server Setup

**File:** `backend/src/index.ts`

- **Port & CORS options**  
  Reads `PORT` and `CLIENT_URL` (`http://localhost:3000` default) from environment.
- **Middleware**  
  - `cookie-parser`  
  - `cors`  
  - `helmet`  
  - `express.json()`  
  - `request-ip`  

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
const corsOptions = { origin: process.env.CLIENT_URL, credentials: true };

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(requestIp.mw());
app.use("/api/v1", router);

app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
```

- **Environment Verification**  
  `verifyEnv()` checks required environment variables at startup.

## 3. Routing Layer

**File:** `backend/src/routes/index.ts`

The `/api/v1` router composes feature routers and applies authentication middleware:

```ts
import express from "express";
import { verifyAccessToken } from "middleware/auth";
import { authRouter } from "./auth";
import { walletRouter } from "./wallet";
import { historyRouter } from "./history";
import { portfolioRouter } from "./portfolio";
import { profileRouter } from "./profile";

export const router = express.Router();

router.use("/auth", authRouter);                            // Public
router.use("/wallet", verifyAccessToken, walletRouter);     // Protected
router.use("/history", verifyAccessToken, historyRouter);   // Protected
router.use("/portfolio", portfolioRouter);                  // Public
router.use("/profile", verifyAccessToken, profileRouter);   // Protected
```

- **verifyAccessToken**  
  JWT-based middleware to protect sensitive routes.
- **Feature Routers**  
  Each feature (auth, wallet, history, portfolio, profile) lives in its own module under `routes/`.

## 4. Database Access

**File:** `backend/src/lib/prisma.ts`

A single `PrismaClient` instance is exported and used throughout route handlers for database operations.

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

- **Prisma**  
  Type-safe ORM for querying and mutating your database.  
- **Usage**  
  Inject `prisma` into your services or route handlers to perform CRUD operations.

## 5. Extending the Architecture

1. **Add a new feature**  
   - Create `backend/src/routes/<feature>` folder  
   - Define `<feature>Router` and handlers  
   - Import and mount it in `routes/index.ts`
2. **Protect routes**  
   - Use `verifyAccessToken` before mounting your router
3. **Database models & migrations**  
   - Modify `schema.prisma`  
   - Run `npx prisma migrate dev` and regenerate your client

---

For more details, see:
- Express: https://expressjs.com/
- Prisma: https://www.prisma.io/docs
- Helmet: https://helmetjs.github.io/