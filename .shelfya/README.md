# Environment & Constants Reference

This document outlines the environment variables and constants used by the HETIC Crypto API backend. It lives under `.shelfya/README.md` for quick reference.

## Required Environment Variables

These variables must be set before starting the server. The `verifyEnv()` utility will throw an error if any are missing.

- `JWT_ACCESS_SECRET`  
- `JWT_REFRESH_SECRET`  
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME`  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME`  
- `SMTP_HOST`  
- `SMTP_PORT`  
- `SMTP_USER`  
- `SMTP_PASS`  
- `API_URL`  
- `CRYPTOCOMPARE_API_KEY`  
- `ETHERSCAN_API_KEY`  
- `CLIENT_URL`  
- `DATABASE_URL`  
- `POSTGRES_USER`  
- `POSTGRES_PASSWORD`  
- `POSTGRES_DB`  
- `PORT`  

## Key Constants

```ts
// backend/src/constants.ts

// Refresh token valid for 7 days (in milliseconds)
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;

// bcrypt rounds for hashing passwords
export const BCRYPT_SALT_ROUNDS = 10;

// Rate-limiter settings (window = 15 minutes)
export const AUTH_LIMITER_WINDOW_MS      = 15 * 60 * 1000;
export const LOGIN_LIMITER_MAX_REQUESTS  = 5;
export const REGISTER_LIMITER_MAX_REQUESTS = 3;
```

## Server Bootstrap

The entrypoint is `backend/src/index.ts`. Key middleware and configuration:

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

// CORS allows your frontend at CLIENT_URL to make requests
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

- Runs on `process.env.PORT`.  
- Exposes all API routes under `/api/v1`.  
- Uses `helmet` for basic security, `cookie-parser` for cookies, and `request-ip` to capture client IP.  
- CORS is restricted to your frontend origin and supports cookies.  

## Next Steps

1. Populate all **Required Environment Variables**.  
2. Install dependencies and compile (if using TypeScript).  
3. Start the server and ensure `Listening on port ...` appears in logs.  
4. Begin making requests to `http://localhost:<PORT>/api/v1/...`.