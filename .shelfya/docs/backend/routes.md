# Backend API Routes

This document describes all available HTTP routes in the backend API, grouped by feature. Unless noted otherwise, JSON is used for request and response bodies.

---

## Authentication (`/auth`)

No authentication required.

| Method | Route                     | Description                       | Middleware       |
| ------ | ------------------------- | --------------------------------- | ---------------- |
| POST   | `/auth/login`             | Log in a user                     | `loginLimiter`  |
| POST   | `/auth/register`          | Register a new user               | `registerLimiter` |
| POST   | `/auth/refresh-access-token` | Refresh JWT access token      | —                |
| GET    | `/auth/verify-email/:token` | Verify user email via token     | —                |
| POST   | `/auth/logout`            | Log out (invalidate refresh token)| —                |

### Examples

Login  
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "YourSecret123"
}
```

Register  
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongP@ssw0rd"
}
```

---

## Wallet (`/wallet`)

Protected: requires a valid access token.

| Method | Route         | Description                |
| ------ | ------------- | -------------------------- |
| GET    | `/wallet`     | List all wallets           |
| POST   | `/wallet`     | Create a new wallet        |
| DELETE | `/wallet/:id` | Delete a wallet by its ID  |

### Examples

Get all wallets  
```
GET /wallet
Authorization: Bearer <access_token>
```

Create wallet  
```
POST /wallet
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "My BTC Wallet",
  "currency": "BTC"
}
```

Delete wallet  
```
DELETE /wallet/12345
Authorization: Bearer <access_token>
```

---

## Transaction History (`/history`)

Protected: requires a valid access token.

| Method | Route             | Description                        |
| ------ | ----------------- | ---------------------------------- |
| GET    | `/history/:id`    | Retrieve transaction history by ID |

### Example

```
GET /history/12345
Authorization: Bearer <access_token>
```

---

## Portfolio (`/portfolio`)

Public route.

| Method | Route               | Description                        |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/portfolio/:id`    | Retrieve portfolio data by user ID |

### Example

```
GET /portfolio/12345
```

---

## User Profile (`/profile`)

Protected: requires a valid access token.

| Method | Route               | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/profile`          | Get current user profile            |
| PATCH  | `/profile`          | Edit user profile details           |
| PATCH  | `/profile/password` | Change user password                |

### Examples

Get profile  
```
GET /profile
Authorization: Bearer <access_token>
```

Edit profile  
```
PATCH /profile
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "name": "New Name",
  "bio": "Blockchain enthusiast"
}
```

Reset password  
```
PATCH /profile/password
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "oldPassword": "OldPass123",
  "newPassword": "NewP@ssw0rd!"
}
```

---

For more details on request and response schemas, see the respective controller documentation in `backend/src/controllers`.