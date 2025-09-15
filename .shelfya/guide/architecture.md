# Architecture Overview

This document outlines the architecture of the HETIC Crypto API, covering its directory structure, request flow, layers, and key components.

## Directory Structure

```
backend/
└── src/
    ├── index.ts                # Application entry point
    ├── routes/
    │   ├── index.ts            # Main router composition
    │   ├── auth.ts             # /auth routes
    │   ├── wallet.ts           # /wallet routes
    │   ├── history.ts          # /history routes
    │   ├── portfolio.ts        # /portfolio routes
    │   └── profile.ts          # /profile routes
    ├── controllers/
    │   └── auth.controller.ts  # Auth business endpoints
    ├── services/
    │   └── auth.service.ts     # Auth business logic
    ├── middleware/
    │   └── auth.ts             # verifyAccessToken
    ├── schemas/
    │   └── auth.schemas.ts     # Zod validation schemas
    └── utils/
        ├── verify-env.ts       # Env checker
        └── hash-refresh-token.ts
```

## Layers & Flow

1. **Entry Point (`index.ts`)**  
   - Boots up Express server on `process.env.PORT`.  
   - Applies global middleware:
     - `cookie-parser`  
     - `cors` (configured with `CLIENT_URL`)  
     - `helmet`  
     - `express.json()`  
     - `request-ip`  
   - Mounts all routes under `/api/v1`.  
   - Calls `verifyEnv()` to ensure required environment variables are set.

2. **Routing (`routes/index.ts`)**  
   - Aggregates feature routers:
     - `/auth` (public)  
     - `/wallet`, `/history`, `/profile` (protected by `verifyAccessToken`)  
     - `/portfolio` (currently public)  
   - Example:
     ```ts
     router.use("/auth", authRouter);
     router.use("/wallet", verifyAccessToken, walletRouter);
     // ...
     ```

3. **Controllers**  
   - Validate incoming requests using Zod schemas (`auth.schemas.ts`).  
   - Delegate to services for business logic.  
   - Handle security headers, HTTP-only cookies, and status codes.

   Example from `AuthController.login`:
   ```ts
   const { email, password } = loginSchema.parse(req.body);
   const { accessToken, refreshToken } = await authService.login({ email, password });

   res
     .cookie("refreshToken", refreshToken, { httpOnly: true, secure: isProd, sameSite: "strict" })
     .json({ accessToken });
   ```

4. **Services**  
   - Encapsulate business rules and data-access (e.g., user lookup, password hashing, JWT generation).  
   - `AuthService` exposes methods: `register()`, `login()`, `verifyEmail()`, `refreshAccessToken()`, `logout()`.

5. **Security & Utilities**  
   - **JWT Tokens**  
     - Access tokens are returned in JSON.  
     - Refresh tokens are stored in secure, HTTP-only cookies.  
   - **Token Hashing**  
     - Refresh tokens are hashed via `hashToken()` before persistence.  
   - **Environment Verification**  
     - `verifyEnv()` ensures critical variables (e.g., `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`) are defined.

## Request Sequence: Login Flow

1. **Client** → POST `/api/v1/auth/login`  
2. **AuthController**
   - Parses request (`loginSchema`).  
   - Calls `AuthService.login()`.  
3. **AuthService**  
   - Verifies credentials.  
   - Issues `accessToken` & `refreshToken`.  
4. **AuthController**  
   - Sets `refreshToken` cookie.  
   - Responds with `{ accessToken }`.

## Environment Variables

Ensure the following are set before starting the server:

- `PORT`  
- `CLIENT_URL`  
- `NODE_ENV`  
- `JWT_ACCESS_SECRET`  
- `JWT_REFRESH_SECRET`  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME`  

---  
For more details on controllers, services, and schemas, refer to their respective modules in `backend/src/`.