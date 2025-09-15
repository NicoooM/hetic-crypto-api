# API Overview

Welcome to the Monolith Wallet Tracker API overview. This school project enables users to register, manage cryptocurrency wallets, and analyze wallet data via integrations with CryptoCompare and Etherscan APIs. All API endpoints are prefixed by `/api/v1`.

---

## Authentication

Endpoints for user account management.

- `POST /auth/register`  
  Create a new account.

- `GET /auth/verify-email/:token`  
  Verify a user's email.

- `POST /auth/login`  
  Log in with credentials.

- `POST /auth/logout`  
  Log out and invalidate session.

- `POST /auth/refresh-access-token`  
  Refresh access token.

**Example: Register**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "yourPassword123"
}
```

---

## Profile

Endpoints for accessing and updating user profile information. Authentication required.

- `GET /profile`  
  Retrieve your profile details.

- `PATCH /profile`  
  Update your profile information.

- `PATCH /profile/password`  
  Change your password.

---

## Wallet

Endpoints for managing cryptocurrency wallets. Authentication required.

- `POST /wallet`  
  Create a new wallet.

- `GET /wallet`  
  Get a list of all wallets.

- `DELETE /wallet/:id`  
  Delete a wallet by ID.

**Example: List Wallets**

```http
GET /api/v1/wallet
Authorization: Bearer <access_token>
```

---

## Wallet Data

All endpoints below require authentication, unless otherwise noted.

### Transaction History

- `GET /history/:id`  
  Get transaction history for a given wallet ID.

### Portfolio Statistics

- `GET /portfolio/:id`  
  Retrieve current statistics for a specified wallet ID.

---

## Client Routes (Informational)

For reference, the frontend app provides:

- `/dashboard` — Overview of your wallets
- `/profile` — User account management
- `/fiscalite` — Taxation tools (not API-connected)
- `/graph` — Transactions chart (not API-connected)

---

## Getting Started

1. **Register** a new user via `/auth/register`
2. **Verify your email** using the link sent to your inbox
3. **Login** to get your access token
4. **Create wallets** and start tracking!

---

For more information, see the [README.md](../../README.md) file.