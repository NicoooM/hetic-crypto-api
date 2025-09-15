# Architecture Overview

This document outlines the high-level architecture of the HETIC Crypto API backend. It covers how the server is bootstrapped, which middleware layers are applied, and how routes are organized and versioned.

## 1. Entry Point

File: `backend/src/index.ts`

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

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(requestIp.mw());

// Mount all API routes under /api/v1
app.use("/api/v1", router);

app.listen(port, () => {
  verifyEnv();
  console.log(`Listening on port ${port}...`);
});
```

Key points:
- **Environment verification** (`verifyEnv`) ensures required variables are set at startup.
- **Security** is enforced with `helmet`, `cors`, and `cookie-parser`.
- **Request parsing** uses JSON body parsing and IP detection (`request-ip`).
- All routes are namespaced under `/api/v1` for versioning.

---

## 2. Route Organization

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

Routes breakdown:

- **/auth**  
  Public endpoints for user registration, login, and token issuance.

- **/wallet** (Protected)  
  CRUD operations on user wallets. Requires a valid access token.

- **/history** (Protected)  
  Access and manage transaction history. Secured by the same auth guard.

- **/portfolio**  
  Endpoints to view public portfolio data. Currently unprotected.

- **/profile** (Protected)  
  User account settings and profile management.

---

## 3. Middleware Flow

1. **cookieParser** → read cookies (e.g., refresh tokens)  
2. **cors** → enforce cross-origin policies, allowing the frontend client URL  
3. **helmet** → secure HTTP headers  
4. **express.json** → parse incoming JSON payloads  
5. **requestIp.mw()** → capture request IP for logging or rate-limiting  
6. **verifyAccessToken** (on protected routes) → validate JWT and attach user context  

---

## 4. Adding a New Module

1. Create a new router file under `backend/src/routes/`, e.g. `alerts.ts`.
2. Export an Express router and define endpoints:

   ```ts
   import express from "express";
   export const alertsRouter = express.Router();

   alertsRouter.get("/", (req, res) => {
     // fetch alerts
   });
   ```

3. Import and mount in `backend/src/routes/index.ts`:

   ```ts
   import { alertsRouter } from "./alerts";
   router.use("/alerts", verifyAccessToken, alertsRouter);
   ```

4. Write corresponding controller and service logic as needed.

---

## 5. Next Steps

- Dive into each module’s guide under `.shelfya/guide/` for detailed usage and API contracts.
- Review middleware implementations (e.g., `middleware/auth.ts`) to customize authentication flows.
- Ensure your environment variables are listed and documented in the root README.