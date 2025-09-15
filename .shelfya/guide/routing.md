# Routing Guide

This document describes all available HTTP routes in the Crypto API, grouped by feature. Note which endpoints require a valid access token (protected) and which are public.

> Base URL: `https://<your-domain>`  
> All endpoints use JSON for requests and responses unless noted otherwise.

---

## Authentication (Public)

All `/auth` routes are unprotected but rate-limited on login and register.

### POST /auth/register

Create a new user account.
```bash
curl -X POST https://api.example.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "Passw0rd!" }'
```
- Rate-limited by `registerLimiter`.

### POST /auth/login

Authenticate and receive an access token.
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "Passw0rd!" }'
```
- Rate-limited by `loginLimiter`.  
- Response includes `accessToken` and `refreshToken`.

### POST /auth/refresh-access-token

Get a new access token using the refresh token.
```bash
curl -X POST https://api.example.com/auth/refresh-access-token \
  -H "Content-Type: application/json" \
  -d '{ "refreshToken": "<your_refresh_token>" }'
```

### GET /auth/verify-email/:token

Verify a newly registered email.
```bash
curl https://api.example.com/auth/verify-email/<verification_token>
```

### POST /auth/logout

Invalidate the current refresh token.
```bash
curl -X POST https://api.example.com/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

---

## Wallet (Protected)

All `/wallet` routes require a valid access token in the `Authorization` header.

### GET /wallet

List all wallets for the authenticated user.
```bash
curl https://api.example.com/wallet \
  -H "Authorization: Bearer <access_token>"
```

### POST /wallet

Create a new wallet.
```bash
curl -X POST https://api.example.com/wallet \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "My BTC Wallet" }'
```

### DELETE /wallet/:id

Delete a wallet by its ID.
```bash
curl -X DELETE https://api.example.com/wallet/<wallet_id> \
  -H "Authorization: Bearer <access_token>"
```

---

## History (Protected)

Endpoints under `/history` return transaction or price-history details. Protected by access token.

### GET /history/:id

Retrieve history for a specific resource (e.g., wallet or transaction).
```bash
curl https://api.example.com/history/<resource_id> \
  -H "Authorization: Bearer <access_token>"
```

---

## Portfolio (Public)

The `/portfolio` endpoint is publicly accessible; no token required.

### GET /portfolio/:id

Fetch portfolio details by ID.
```bash
curl https://api.example.com/portfolio/<portfolio_id>
```

---

## Profile (Protected)

Manage the authenticated user’s profile.

### GET /profile

Get the current user’s profile.
```bash
curl https://api.example.com/profile \
  -H "Authorization: Bearer <access_token>"
```

### PATCH /profile

Update profile fields (e.g., username, avatar).
```bash
curl -X PATCH https://api.example.com/profile \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "username": "newname", "bio": "Crypto enthusiast" }'
```

### PATCH /profile/password

Reset or change your password.
```bash
curl -X PATCH https://api.example.com/profile/password \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "oldPassword": "oldPass", "newPassword": "newPass123!" }'
```

---

For more details on request/response schemas and error codes, see the API reference or the corresponding controller documentation in the codebase.