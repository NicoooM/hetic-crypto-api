# Routing Guide

This guide walks you through the main Express routes exposed by the API, their mount points, middleware requirements, and example calls.

## Base Router

All sub-routers are mounted on the main Express `router`:

- **`/auth`**  
  No authentication required. Handles user signup, login, token refresh, email verification, and logout.
- **`/wallet`**  
  Requires a valid access token. Manages user wallets.
- **`/history`**  
  Requires a valid access token. Retrieves transaction or trading history.
- **`/portfolio`**  
  Publicly accessible. Provides portfolio information.
- **`/profile`**  
  Requires a valid access token. Manages user profile data.

```ts
// backend/src/routes/index.ts
router.use("/auth", authRouter);
router.use("/wallet", verifyAccessToken, walletRouter);
router.use("/history", verifyAccessToken, historyRouter);
router.use("/portfolio", portfolioRouter);
router.use("/profile", verifyAccessToken, profileRouter);
```

---

## 1. Authentication Routes (`/auth`)

All routes in `authRouter` are prefixed with `/auth`.

```ts
// backend/src/routes/auth.ts
const authRouter = express.Router();
authRouter.post("/login",        loginLimiter,    authController.login);
authRouter.post("/register",     registerLimiter, authController.register);
authRouter.post("/refresh-access-token", authController.refreshAccessToken);
authRouter.get("/verify-email/:token",   authController.verifyEmail);
authRouter.post("/logout",       authController.logout);
```

### 1.1 Register
- **Endpoint**: `POST /auth/register`
- **Rate limiter**: `registerLimiter` (e.g., `5 requests / 15 minutes`)
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongP@ssw0rd"
  }
  ```
- **Response**: 
  - `201 Created` on success
  - Error codes for validation or already registered email

Example:
```bash
curl -X POST https://api.yoursite.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"StrongP@ssw0rd"}'
```

### 1.2 Login
- **Endpoint**: `POST /auth/login`
- **Rate limiter**: `loginLimiter` (e.g., `10 requests / 10 minutes`)
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongP@ssw0rd"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "<jwt_token>",
    "refreshToken": "<refresh_token>"
  }
  ```

Example:
```bash
curl -X POST https://api.yoursite.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"StrongP@ssw0rd"}'
```

### 1.3 Refresh Access Token
- **Endpoint**: `POST /auth/refresh-access-token`
- **Body**:
  ```json
  { "refreshToken": "<refresh_token>" }
  ```
- **Response**:
  ```json
  { "accessToken": "<new_jwt_token>" }
  ```

Example:
```bash
curl -X POST https://api.yoursite.com/auth/refresh-access-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<your_refresh_token>"}'
```

### 1.4 Email Verification
- **Endpoint**: `GET /auth/verify-email/:token`
- **URL Parameter**: `token` – verification token sent via email
- **Response**:
  - `200 OK` on successful verification
  - `400/404` on invalid or expired token

Example:
```bash
curl https://api.yoursite.com/auth/verify-email/eyJhbGciOi...
```

### 1.5 Logout
- **Endpoint**: `POST /auth/logout`
- **Body**:
  ```json
  { "refreshToken": "<refresh_token>" }
  ```
- **Response**:
  - `200 OK` on success

Example:
```bash
curl -X POST https://api.yoursite.com/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<your_refresh_token>"}'
```

---

## 2. Protected Routes

All following routes require a valid JWT in the `Authorization` header:

    Authorization: Bearer <accessToken>

### 2.1 Wallet (`/wallet`)
- **Mount point**: `/wallet`
- **Responsibilities**: Create, read, update, and delete user wallets.
- **Example**:
  ```bash
  curl https://api.yoursite.com/wallet
    -H "Authorization: Bearer <accessToken>"
  ```

### 2.2 History (`/history`)
- **Mount point**: `/history`
- **Responsibilities**: Fetch transaction or trade history.
- **Example**:
  ```bash
  curl https://api.yoursite.com/history
    -H "Authorization: Bearer <accessToken>"
  ```

### 2.3 Profile (`/profile`)
- **Mount point**: `/profile`
- **Responsibilities**: View or update user profile details.
- **Example**:
  ```bash
  curl -X PUT https://api.yoursite.com/profile
    -H "Authorization: Bearer <accessToken>"
    -H "Content-Type: application/json"
    -d '{"username":"new_name"}'
  ```

---

## 3. Public Routes

### 3.1 Portfolio (`/portfolio`)
- **Mount point**: `/portfolio`
- **Responsibilities**: Fetch public or aggregated portfolio data.
- **Example**:
  ```bash
  curl https://api.yoursite.com/portfolio
  ```

---

For in-depth information on each router’s methods, refer to the corresponding controller files under `backend/src/controllers`.