# Architecture

This document outlines the core architecture of the HETIC Crypto API, a full‐stack application that provides authenticated endpoints for managing Ethereum wallets, viewing portfolio data, and tracking transaction history.

---

## System Overview

- **Backend**  
  - Built on **Express.js**  
  - **JWT**‐based authentication (access & refresh tokens)  
  - **Prisma** ORM for PostgreSQL  
  - **Zod** for input validation  
  - Rate limiting on login/register  
  - Email verification via **Nodemailer**  
  - External integrations: CryptoCompare & Etherscan APIs  

- **Client**  
  - Axios instance with automatic token injection & refresh  
  - Stores access token in `localStorage`  
  - Sends refresh requests via HTTP‐only cookies  

---

## Project Structure

```
├── backend/
│   └── src/
│       ├── index.ts             # App entrypoint (Express server)
│       ├── constants.ts         # Expirations, salts, required env
│       ├── lib/
│       │   └── prisma.ts        # Prisma Client export
│       ├── middleware/          # Auth & rate‐limiting
│       ├── routes/              # Route definitions
│       ├── controllers/         # HTTP handlers
│       ├── services/            # Business logic & integrations
│       ├── schemas/             # Zod validation schemas
│       └── utils/               # Helpers (Etherscan, tokens, env)
└── client/
    └── src/
        └── services/
            └── api.ts           # Axios instance & interceptors
```

---

## Backend Layers

1. **Entry Point** (`index.ts`)  
   - Configures middleware: CORS, Helmet, JSON parser, cookie parser, IP capture  
   - Mounts `/api/v1` router  
   - Validates environment variables on startup  

2. **Routing**  
   - `authRouter` (public endpoints): `/login`, `/register`, `/refresh-access-token`, `/verify-email/:token`, `/logout`  
   - Protected routes via `verifyAccessToken` middleware:  
     - `/wallet` (create, delete, list)  
     - `/history/:id` (wallet history)  
     - `/portfolio/:id` (current valuation + daily change)  
     - `/profile` (get, edit, reset password)  

3. **Controllers**  
   - Parse and validate requests with Zod schemas  
   - Call corresponding service methods  
   - Handle errors and set HTTP status codes  
   - Example (login flow):
     ```ts
     const { accessToken, refreshToken } = await authService.login({ email, password });
     res
       .cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: JWT_REFRESH_TOKEN_EXPIRATION_TIME })
       .json({ accessToken });
     ```

4. **Services**  
   - **AuthService**: register, login, email verification, token refresh, logout  
   - **TokenService**: generate & hash JWTs, store refresh tokens in DB  
   - **EmailService**: send verification emails  
   - **WalletService**: create/delete wallets, seed history via Etherscan  
   - **HistoryService**: query wallet history  
   - **PortfolioService**: fetch real-time prices (CryptoCompare), on-chain balance (Etherscan), compute allocation & daily changes  
   - **ProfileService**: manage user profile & password changes  

5. **Middleware**  
   - **verifyAccessToken**: checks `Authorization: Bearer <token>` header, verifies JWT, attaches `req.user`  
   - **rateLimiters**: throttle login (`max: 5`) & register (`max: 3`) in 15‐minute windows  

6. **Validation Schemas** (`/schemas`)  
   - Zod schemas for `login`, `register`, `wallet`, `filters`, `profile`, `password`  
   - Ensures type‐safe and consistent request shapes  

7. **Utilities**  
   - **createWalletHistory**: fetches & aggregates on‐chain transactions into daily balances  
   - **hashToken**: HMAC‐SHA256 for refresh token storage  
   - **verifyEnv**: ensures all required `process.env` variables are set  
   - **passwordRegex**: enforces strong password rules  
   - **seed.ts**: populates currency history from CryptoCompare  

---

## Client-Side Token Flow

1. **Request Interceptor**  
   - Reads `localStorage.getItem("token")`  
   - Sets `Authorization: Bearer <accessToken>` header  

2. **Response Interceptor**  
   - On `401`/`403`, attempts single refresh call to `/auth/refresh-access-token`  
   - Stores new access token and retries original request  
   - On failure, clears token and redirects to `/login`  

```ts
API.interceptors.response.use(
  res => res,
  async (err) => {
    if ([401,403].includes(err.response.status) && !orig._retry) {
      orig._retry = true;
      const { data } = await axios.post(`${API.defaults.baseURL}/auth/refresh-access-token`, {}, { withCredentials: true });
      TokenService.setToken(data.accessToken);
      orig.headers.Authorization = `Bearer ${data.accessToken}`;
      return API(orig);
    }
    return Promise.reject(err);
  }
);
```

---

## Environment Variables

Make sure the following are defined in your environment before running the server:

- JWT_ACCESS_SECRET  
- JWT_REFRESH_SECRET  
- JWT_ACCESS_TOKEN_EXPIRATION_TIME  
- JWT_REFRESH_TOKEN_EXPIRATION_TIME  
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS  
- API_URL, CLIENT_URL  
- CRYPTOCOMPARE_API_KEY, ETHERSCAN_API_KEY  
- DATABASE_URL, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB  
- PORT  

---

## References

- Express.js: https://expressjs.com  
- Prisma: https://www.prisma.io  
- Zod: https://github.com/colinhacks/zod  
- CryptoCompare API: https://www.cryptocompare.com/api/  
- Etherscan API: https://etherscan.io/apis  
- Nodemailer: https://nodemailer.com  