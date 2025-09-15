# API Overview

This document provides a quick overview of the available endpoints in the HETIC Crypto API. The API is organized into five main areas:

- Authentication (`/auth`)
- Wallet management (`/wallet`)
- Transaction history (`/history`)
- User profile (`/profile`)
- Portfolio lookup (`/portfolio`)

All routes (except the authentication flows) require a valid JWT access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

## 1. Authentication

Base path: `/auth`

| Method | Endpoint                     | Description                    |
| ------ | -----------------------------| ------------------------------ |
| POST   | /login                       | Log in with email & password  |
| POST   | /register                    | Create a new user account     |
| POST   | /refresh-access-token        | Exchange a refresh token for a new access token |
| GET    | /verify-email/:token         | Verify a user's email address |
| POST   | /logout                      | Invalidate the current refresh token |

### Examples

Login  
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Refresh token  
```
POST /auth/refresh-access-token
Content-Type: application/json

{
  "refreshToken": "<your_refresh_token>"
}
```

---

## 2. Wallet

Base path: `/wallet`

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| GET    | /               | List all wallets for the user |
| POST   | /               | Create a new wallet        |
| DELETE | /:id            | Delete a wallet by ID      |

### Examples

List wallets  
```
GET /wallet
Authorization: Bearer <access_token>
```

Create a wallet  
```
POST /wallet
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Main BTC Wallet",
  "currency": "BTC"
}
```

---

## 3. Transaction History

Base path: `/history`

| Method | Endpoint     | Description                          |
| ------ | ------------ | ------------------------------------ |
| GET    | /:id         | Get transaction history for a wallet |

### Examples

Fetch history  
```
GET /history/<wallet_id>
Authorization: Bearer <access_token>
```

---

## 4. Profile

Base path: `/profile`

| Method | Endpoint     | Description                     |
| ------ | ------------ | ------------------------------- |
| GET    | /            | Retrieve current user profile   |
| PATCH  | /            | Update profile details          |
| PATCH  | /password    | Change account password         |

### Examples

Get profile  
```
GET /profile
Authorization: Bearer <access_token>
```

Update profile  
```
PATCH /profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "displayName": "New Name",
  "bio": "Crypto enthusiast"
}
```

---

## 5. Portfolio

Base path: `/portfolio`

| Method | Endpoint     | Description                         |
| ------ | ------------ | ----------------------------------- |
| GET    | /:id         | Retrieve portfolio summary by user ID |

### Examples

Fetch portfolio  
```
GET /portfolio/<user_id>
Authorization: Bearer <access_token>
```

---

For more details on request/response schemas, refer to the controller implementations in `/backend/src/controllers`.