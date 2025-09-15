# Architecture

This guide provides an overview of the backend architecture for the HETIC Crypto API. The server is built on Node.js and Express, organized into modular routes and middleware for security, request parsing, and environment validation.

## Tech Stack

- Node.js – JavaScript runtime  
- Express – Web framework  
- Helmet – Security headers  
- CORS – Cross-origin resource sharing  
- cookie-parser – Cookie handling  
- request-ip – Client IP extraction  
- TypeScript – Static typing  

## Project Structure

```
backend/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── wallet.ts
│   │   ├── history.ts
│   │   ├── portfolio.ts
│   │   ├── profile.ts
│   │   └── index.ts
│   └── middleware/
│       └── auth.ts
└── .env
```

## Server Setup (src/index.ts)

1. Load environment variables and validate with `verifyEnv()`.  
2. Initialize Express and configure global middleware.  
3. Mount the API router under `/api/v1`.  
4. Start the HTTP server on `process.env.PORT`.

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

### Environment Variables

Ensure these are set in your `.env` before starting the server:

- `PORT` – HTTP port (e.g. 4000)  
- `CLIENT_URL` – Allowed CORS origin  
- `JWT_SECRET` – Signing key for access tokens  
- _…any additional variables validated in `verifyEnv()`_

## Middleware Pipeline

Requests flow through:

1. **cookie-parser** – Parses cookies into `req.cookies`.  
2. **CORS** – Restricts origins and allows credentials.  
3. **Helmet** – Sets security headers.  
4. **express.json()** – Parses JSON bodies.  
5. **request-ip** – Attaches client IP to `req.clientIp`.  
6. **Auth middleware** (per-route) – Validates JWT access tokens.

## Routing Structure (src/routes/index.ts)

All routes are namespaced under `/api/v1`:

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

- **/auth** – Sign-up, sign-in, token refresh.  
- **/wallet** – CRUD operations on user wallets (protected).  
- **/history** – Transaction history (protected).  
- **/portfolio** – Public portfolio data.  
- **/profile** – User profile management (protected).

## Request Flow Example

1. Client sends `POST /api/v1/auth/login` with JSON credentials.  
2. On success, server issues an HTTP-only cookie and access token.  
3. Client calls `GET /api/v1/wallet` with the cookie; `verifyAccessToken` checks validity.  
4. Wallet data is returned as JSON.

```http
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/json

{ "email": "user@example.com", "password": "secret" }
```

```http
GET /api/v1/wallet HTTP/1.1
Cookie: accessToken=<jwt-token>
```

## Further Reading

- Express.js Guides: https://expressjs.com/  
- Helmet Documentation: https://github.com/helmetjs/helmet  
- CORS Middleware: https://github.com/expressjs/cors  
- request-ip: https://github.com/pbojinov/request-ip