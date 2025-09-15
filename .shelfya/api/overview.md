# API Overview

This document provides a high-level view of all HETIC Crypto API endpoints, their HTTP methods, authentication requirements and rate-limiting details. Use this guide to quickly locate and interact with the core routes.  

Base URL: `https://api.yourdomain.com`

---

## Authentication Endpoints (`/auth`)

No access token required unless noted. The following routes are rate limited to prevent abuse:

- **POST /auth/register**  
  Registers a new user.  
  • Rate limiter: `registerLimiter`  
  • Body:  
    ```json
    {
      "email": "user@example.com",
      "password": "SecureP@ssw0rd"
    }
    ```

- **POST /auth/login**  
  Logs in an existing user and returns access & refresh tokens.  
  • Rate limiter: `loginLimiter`  
  • Body:  
    ```json
    {
      "email": "user@example.com",
      "password": "SecureP@ssw0rd"
    }
    ```

- **POST /auth/refresh-access-token**  
  Exchanges a valid refresh token for a new access token.  
  • Body:  
    ```json
    {
      "refreshToken": "<your-refresh-token>"
    }
    ```

- **GET /auth/verify-email/:token**  
  Verifies a newly registered user’s email via token link.

- **POST /auth/logout**  
  Invalidates the refresh token (logs the user out).

---

## Wallet Endpoints (`/wallet`)

All wallet routes require a valid bearer token in the `Authorization` header.

- **GET /wallet**  
  Retrieves all wallets for the authenticated user.

- **POST /wallet**  
  Creates a new wallet.  
  • Body example:  
    ```json
    {
      "name": "Trading Wallet",
      "currency": "BTC"
    }
    ```

- **DELETE /wallet/:id**  
  Deletes the wallet with the specified ID.

Example:
```bash
curl -X POST https://api.yourdomain.com/wallet \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Savings","currency":"ETH"}'
```

---

## History Endpoints (`/history`)

These endpoints require authentication.

- **GET /history/:id**  
  Retrieves transaction history for wallet or asset identified by `id`.

Example:
```bash
curl https://api.yourdomain.com/history/1234 \
  -H "Authorization: Bearer <access-token>"
```

---

## Portfolio Endpoints (`/portfolio`)

Publicly accessible (no token required).

- **GET /portfolio/:id**  
  Fetches the public portfolio data for a given user or asset set.

---

## Profile Endpoints (`/profile`)

Requires authentication.

- **GET /profile**  
  Fetches the authenticated user’s profile.

- **PATCH /profile**  
  Edits profile details.  
  • Body example:  
    ```json
    {
      "displayName": "CryptoFan",
      "avatarUrl": "https://example.com/avatar.png"
    }
    ```

- **PATCH /profile/password**  
  Resets the user’s password.  
  • Body example:  
    ```json
    {
      "currentPassword": "OldP@ssw0rd",
      "newPassword": "NewSecur3P@ss"
    }
    ```

---

### Common Headers

- `Content-Type: application/json`  
- `Authorization: Bearer <access-token>` (for protected routes)

---

For detailed parameter descriptions and response examples, refer to the specific controller documentation or open the route file under `backend/src/routes/`.