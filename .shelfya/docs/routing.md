# Routing

This document describes the HTTP routes provided by the HETIC Crypto API.  
Base URL: `https://<your-domain>/api`  

Some routes require a Bearer access token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

## Table of Contents
- [Auth](#auth)
- [Wallet](#wallet)
- [History](#history)
- [Portfolio](#portfolio)
- [Profile](#profile)

---

## Auth

Prefix: `/auth`

| Method | Endpoint                    | Middleware      | Description                                 |
|--------|-----------------------------|-----------------|---------------------------------------------|
| POST   | `/login`                    | `loginLimiter`  | Authenticate user and return tokens.        |
| POST   | `/register`                 | `registerLimiter`| Create a new user and send verification.    |
| POST   | `/refresh-access-token`     | —               | Refresh an expired access token.            |
| GET    | `/verify-email/:token`      | —               | Verify a user’s email address.              |
| POST   | `/logout`                   | —               | Invalidate refresh token and log out.       |

Example — Login  
```bash
curl -X POST https://api.example.com/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'
```

---

## Wallet

Prefix: `/wallet`  
Requires: valid access token

| Method | Endpoint     | Description                     |
|--------|--------------|---------------------------------|
| GET    | `/`          | List all wallets for the user.  |
| POST   | `/`          | Create a new wallet.            |
| DELETE | `/:id`       | Delete a wallet by its ID.      |

Example — Create Wallet  
```bash
curl -X POST https://api.example.com/wallet \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"name":"My BTC Wallet"}'
```

---

## History

Prefix: `/history`  
Requires: valid access token

| Method | Endpoint     | Description                          |
|--------|--------------|--------------------------------------|
| GET    | `/:id`       | Get transaction history by wallet ID.|

Example — Get History  
```bash
curl https://api.example.com/history/123 \
  -H 'Authorization: Bearer <token>'
```

---

## Portfolio

Prefix: `/portfolio`

| Method | Endpoint     | Description                              |
|--------|--------------|------------------------------------------|
| GET    | `/:id`       | Retrieve aggregated portfolio by user ID.|

Example — Get Portfolio  
```bash
curl https://api.example.com/portfolio/456
```

---

## Profile

Prefix: `/profile`  
Requires: valid access token

| Method | Endpoint          | Description                            |
|--------|-------------------|----------------------------------------|
| GET    | `/`               | Fetch current user profile.            |
| PATCH  | `/`               | Update user profile fields.            |
| PATCH  | `/password`       | Change user password.                  |

Example — Update Profile  
```bash
curl -X PATCH https://api.example.com/profile \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"displayName":"New Name"}'
```

For more details on authentication and token handling, refer to the [Auth](./auth.md) guide.