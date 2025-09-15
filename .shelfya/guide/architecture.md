# Architecture

This document outlines the high-level architecture of the Hetic Crypto API, covering both the backend (Express API) and the client (React + Axios). It describes key components, data flows, and how authentication is managed end-to-end.

## Table of Contents

- [Backend](#backend)  
  - [Entry Point & Middlewares](#entry-point--middlewares)  
  - [Routing & Controllers](#routing--controllers)  
  - [Authentication Flow](#authentication-flow)  
- [Client](#client)  
  - [API Service](#api-service)  
  - [Token Refresh Logic](#token-refresh-logic)  
- [Environment Variables](#environment-variables)

---

## Backend

### Entry Point & Middlewares

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

// Allow credentials and client origin
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(helmet());           // Basic security headers
app.use(express.json());     // Parse JSON bodies
app.use(requestIp.mw());     // Capture client IP
app.use("/api/v1", router);  // Mount main router

app.listen(port, () => {
  verifyEnv();               // Ensure required ENV vars
  console.log(`Listening on port ${port}...`);
});
```

### Routing & Controllers

File: `backend/src/routes/index.ts`

- `/api/v1/auth` → `authRouter`  
- `/api/v1/wallet` → `walletRouter` (protected)  
- `/api/v1/history` → `historyRouter` (protected)  
- `/api/v1/portfolio` → `portfolioRouter`  
- `/api/v1/profile` → `profileRouter` (protected)  

Protected routes use `verifyAccessToken` middleware to validate JWT.

```ts
router.use("/auth", authRouter);
router.use("/wallet", verifyAccessToken, walletRouter);
router.use("/history", verifyAccessToken, historyRouter);
router.use("/portfolio", portfolioRouter);
router.use("/profile", verifyAccessToken, profileRouter);
```

### Authentication Flow

File: `backend/src/controllers/auth.controller.ts`

1. **Register**  
   - Validate input via Zod (`registerSchema`)  
   - Create user, send verification email  
   - Respond with `201 Created`  

2. **Verify Email**  
   - Accepts a token in URL params  
   - Marks user as verified  

3. **Login**  
   - Validate input (`loginSchema`)  
   - On success, return  
     - `accessToken` in JSON  
     - `refreshToken` as HttpOnly cookie  

4. **Refresh Access Token**  
   - Read `refreshToken` cookie  
   - Hash + verify via service  
   - Return new `accessToken`  

5. **Logout**  
   - Clear `refreshToken` cookie  
   - Invalidate token in store  

```ts
// Example: setting the refreshToken cookie
res
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  })
  .json({ accessToken });
```

---

## Client

### API Service

File: `client/src/services/api.ts`

- Uses Axios with `baseURL` pointing to `REACT_APP_API_BASE_URL` or `http://localhost:5000/api/v1`.  
- `withCredentials: true` to include HttpOnly cookies.

```ts
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});
```

**Request Interceptor**  
Automatically attaches `Authorization: Bearer <token>` from `localStorage`.

```ts
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Token Refresh Logic

- On `401`/`403`, the response interceptor attempts to refresh the access token.  
- Ensures only one refresh call at a time (`isRefreshing` flag).  
- Queues pending requests until a new token is issued.

```ts
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if ((error.response.status === 401 || error.response.status === 403)
      && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        const { data } = await axios.post(
          `${API.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        TokenService.setToken(data.accessToken);
        API.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        onRefreshed(data.accessToken);
        isRefreshing = false;
      }
      return new Promise(resolve => {
        addRefreshSubscriber(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(API(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);
```

Helper `TokenService`:

```ts
const TokenService = {
  getToken:    () => localStorage.getItem("token"),
  setToken:    (t: string) => localStorage.setItem("token", t),
  removeToken: () => localStorage.removeItem("token"),
};
```

---

## Environment Variables

Backend:
- `PORT` – server port  
- `CLIENT_URL` – allowed CORS origin  
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` – secrets for signing tokens  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME` – cookie TTL  

Client:
- `REACT_APP_API_BASE_URL` – API endpoint (e.g., `http://localhost:5000/api/v1`)

– – –  
This architecture ensures secure, stateless authentication with JWT, ease of scaling routes/controllers, and a resilient client-side API layer that transparently refreshes access tokens.