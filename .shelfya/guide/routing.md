# Routing Guide

This guide covers all API endpoints available in the Crypto API, organized by route group. You can use these routes to authenticate users, manage wallets, retrieve transaction history, view portfolios, and update profiles.

## Base Router

All routes are mounted under the base path `/api` (or whatever your server’s base is). Inside the router:

- `/auth` — Authentication endpoints  
- `/wallet` — Wallet management (requires access token)  
- `/history` — Transaction history (requires access token)  
- `/portfolio` — Portfolio lookup  
- `/profile` — User profile (requires access token)  

Most “requires access token” routes use the `verifyAccessToken` middleware to secure access.

---

## /auth

Authentication and session management. None of these endpoints require a token.

### POST /auth/login

Rate-limited login endpoint.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd"
}
```

Response:
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### POST /auth/register

Rate-limited user registration.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd",
  "name": "Alice"
}
```

Response:
```json
{
  "message": "Registration successful. Please verify your email."
}
```

### POST /auth/refresh-access-token

Obtain a new access token using a valid refresh token.

Request Body:
```json
{
  "refreshToken": "refresh-token"
}
```

Response:
```json
{
  "accessToken": "new-jwt-token"
}
```

### GET /auth/verify-email/:token

Verify user email using the token sent via email.

Example:
```
GET /auth/verify-email/abcdef123456
```

Response:
```json
{
  "message": "Email verified successfully."
}
```

### POST /auth/logout

Revoke current refresh token.

Request Body (optional):
```json
{
  "refreshToken": "refresh-token"
}
```

Response:
```json
{
  "message": "Logged out successfully."
}
```

---

## /wallet

Manage wallets. All endpoints require a valid `Authorization: Bearer <accessToken>` header.

### GET /wallet

List all wallets for the authenticated user.

Response:
```json
[
  { "id": "1", "name": "Main Wallet", "balance": 1234.56 },
  { "id": "2", "name": "Savings", "balance": 789.00 }
]
```

### POST /wallet

Create a new wallet.

Request Body:
```json
{
  "name": "New Wallet",
  "initialBalance": 0
}
```

Response:
```json
{
  "id": "3",
  "name": "New Wallet",
  "balance": 0
}
```

### DELETE /wallet/:id

Delete a wallet by its ID.

Example:
```
DELETE /wallet/3
```

Response:
```json
{
  "message": "Wallet deleted."
}
```

---

## /history

Fetch transaction history. Requires `Authorization: Bearer <accessToken>`.

### GET /history/:id

Get the transaction history for wallet `:id`.

Example:
```
GET /history/1
```

Response:
```json
[
  { "txId": "tx100", "amount": -50, "date": "2024-01-01T12:00:00Z" },
  { "txId": "tx101", "amount": 200, "date": "2024-01-02T15:30:00Z" }
]
```

---

## /portfolio

Public endpoint to view a user’s portfolio. No access token required.

### GET /portfolio/:id

Retrieve portfolio details for user `:id`.

Example:
```
GET /portfolio/42
```

Response:
```json
{
  "userId": "42",
  "holdings": [
    { "asset": "BTC", "quantity": 0.5 },
    { "asset": "ETH", "quantity": 10 }
  ],
  "totalValue": 25000
}
```

---

## /profile

Manage your user profile. All routes require `Authorization: Bearer <accessToken>`.

### GET /profile

Fetch your current profile.

Response:
```json
{
  "id": "42",
  "email": "user@example.com",
  "name": "Alice",
  "createdAt": "2023-06-01T09:00:00Z"
}
```

### PATCH /profile

Edit profile fields like name or email.

Request Body (any subset):
```json
{
  "name": "Alice Smith",
  "email": "alice.smith@example.com"
}
```

Response:
```json
{
  "message": "Profile updated."
}
```

### PATCH /profile/password

Reset your password.

Request Body:
```json
{
  "currentPassword": "oldP@ssword",
  "newPassword": "NewP@ssw0rd!"
}
```

Response:
```json
{
  "message": "Password changed."
}
```

---

For more details on controllers, middleware, and error handling, refer to the source code under `backend/src/routes`.