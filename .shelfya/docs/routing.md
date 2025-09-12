# Routing

This document provides an overview of all Express routes in the backend, including HTTP methods, paths, middleware, and example requests.

## Base Router

All sub-routers are mounted in `backend/src/routes/index.ts`:

- `/auth`      → authRouter  
- `/wallet`    → walletRouter (protected)  
- `/history`   → historyRouter (protected)  
- `/portfolio` → portfolioRouter  
- `/profile`   → profileRouter (protected)  

Protected routes require a valid JWT access token via the `verifyAccessToken` middleware.

---

## 1. Auth Routes (`/auth`)

Path prefix: `/auth`

Middleware:  
- `loginLimiter` on POST `/login`  
- `registerLimiter` on POST `/register`  

### Endpoints

- **POST /auth/login**  
  Rate-limited.  
  Body:
    ```json
    {
      "email": "user@example.com",
      "password": "secret"
    }
    ```
  Response: `{ accessToken, refreshToken }`

- **POST /auth/register**  
  Rate-limited.  
  Body:
    ```json
    {
      "email": "newuser@example.com",
      "password": "secret",
      "name": "New User"
    }
    ```
  Response: `{ message: "User registered. Verify email sent." }`

- **POST /auth/refresh-access-token**  
  Body:
    ```json
    {
      "refreshToken": "abcd1234..."
    }
    ```
  Response: `{ accessToken }`

- **GET /auth/verify-email/:token**  
  URL param: `token` (email verification token)  
  Response: Redirect or JSON status.

- **POST /auth/logout**  
  Body:
    ```json
    {
      "refreshToken": "abcd1234..."
    }
    ```
  Response: `{ message: "Logged out successfully." }`

### Example: Login

```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

---

## 2. Wallet Routes (`/wallet`)

Path prefix: `/wallet`  
Middleware: `verifyAccessToken`

### Endpoints

- **GET /wallet**  
  List all wallets for the authenticated user.  
  Response: `[{ id, name, balance, ... }, ...]`

- **POST /wallet**  
  Create a new wallet.  
  Body:
    ```json
    {
      "name": "My Wallet",
      "currency": "BTC"
    }
    ```
  Response: `{ id, name, balance: 0, currency }`

- **DELETE /wallet/:id**  
  Delete wallet by ID.  
  URL param: `id`  
  Response: `{ message: "Wallet deleted." }`

### Example: Create Wallet

```bash
curl -X POST https://api.example.com/wallet \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Savings","currency":"ETH"}'
```

---

## 3. History Routes (`/history`)

Path prefix: `/history`  
Middleware: `verifyAccessToken`  

### Endpoints

- **GET /history/:id**  
  Fetch transaction history for a specific wallet.  
  URL param: `id` (wallet ID)  
  Response: `[{ txId, type, amount, date, ... }, ...]`

---

## 4. Portfolio Routes (`/portfolio`)

Path prefix: `/portfolio`  
No authentication required.

### Endpoints

- **GET /portfolio/:id**  
  Fetch a user’s portfolio by user ID.  
  URL param: `id` (user ID)  
  Response: `{ totalValue, assets: [{ symbol, amount, value }, ...] }`

---

## 5. Profile Routes (`/profile`)

Path prefix: `/profile`  
Middleware: `verifyAccessToken`  

### Endpoints

- **GET /profile**  
  Get authenticated user’s profile.  
  Response: `{ id, name, email, createdAt, ... }`

- **PATCH /profile**  
  Update profile fields.  
  Body (any of):
    ```json
    {
      "name": "Updated Name",
      "email": "newemail@example.com"
    }
    ```
  Response: `{ id, name, email, ... }`

- **PATCH /profile/password**  
  Change password.  
  Body:
    ```json
    {
      "oldPassword": "currentSecret",
      "newPassword": "newSecret"
    }
    ```
  Response: `{ message: "Password updated." }`

---

For more detailed controller behavior and data models, refer to the `controllers` directory.