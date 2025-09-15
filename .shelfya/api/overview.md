# API Overview

Welcome to the HETIC Crypto API. This document provides a quick overview of the available endpoint groups, authentication requirements, and basic usage examples.

## Base URL

All endpoints are served under the common prefix:

```
https://api.yourdomain.com/
```

*(Replace `https://api.yourdomain.com` with your actual base URL.)*

## Authentication

Most endpoints require a valid JSON Web Token (JWT) in the `Authorization` header. You can obtain a token by registering or logging in via the **Auth** routes.

Header example:

```
Authorization: Bearer <your-access-token>
```

## Endpoint Groups

| Prefix       | Protected        | Description                              |
| ------------ | ---------------- | ---------------------------------------- |
| `/auth`      | No               | User registration and login              |
| `/wallet`    | Yes (token req.) | Manage user wallets and balances         |
| `/history`   | Yes (token req.) | Retrieve transaction and activity logs   |
| `/portfolio` | No               | View market portfolios and snapshots     |
| `/profile`   | Yes (token req.) | Fetch and update user profile data       |

### 1. /auth

Handles user authentication.

- **POST** `/auth/register` — Create a new user account.  
- **POST** `/auth/login` — Authenticate and receive an access token.

Example (login):

```bash
curl -X POST https://api.yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

### 2. /wallet

Manage cryptocurrency wallets. Requires `Authorization` header.

- **GET** `/wallet` — List all wallets of the authenticated user.  
- **POST** `/wallet` — Create a new wallet entry.  
- **PUT** `/wallet/:id` — Update a wallet by ID.  
- **DELETE** `/wallet/:id` — Remove a wallet by ID.

Example:

```bash
curl https://api.yourdomain.com/wallet \
  -H "Authorization: Bearer <token>"
```

### 3. /history

Access transaction history. Requires `Authorization` header.

- **GET** `/history` — Retrieve all transactions for the authenticated user.  
- **GET** `/history?start=YYYY-MM-DD&end=YYYY-MM-DD` — Filter by date range.

Example:

```bash
curl "https://api.yourdomain.com/history?start=2024-01-01&end=2024-06-01" \
  -H "Authorization: Bearer <token>"
```

### 4. /portfolio

View market portfolio snapshots. Open access.

- **GET** `/portfolio` — List available portfolio templates or market snapshots.  
- **GET** `/portfolio/:id` — View detailed data for a specific portfolio.

Example:

```bash
curl https://api.yourdomain.com/portfolio
```

### 5. /profile

Fetch and update your user profile. Requires `Authorization` header.

- **GET** `/profile` — Retrieve the current user’s profile.  
- **PUT** `/profile` — Update profile fields (name, email, etc.).

Example:

```bash
curl -X GET https://api.yourdomain.com/profile \
  -H "Authorization: Bearer <token>"
```

---

For detailed request/response schemas, error codes, and examples, please refer to the individual route documentation in this directory:
- [`auth.md`](auth.md)  
- [`wallet.md`](wallet.md)  
- [`history.md`](history.md)  
- [`portfolio.md`](portfolio.md)  
- [`profile.md`](profile.md)