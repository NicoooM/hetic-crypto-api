# API Overview

This document provides a high-level overview of all available endpoints in the Crypto API. Endpoints are grouped by feature. Unless otherwise noted, request and response bodies use JSON. Protected routes require a valid Bearer access token in the `Authorization` header.

Base URL: `https://api.example.com` (adjust as needed)

---

## 1. Authentication

All auth routes are under `/auth`. Login and registration are rate-limited.

### POST /auth/login

Authenticate a user and receive an access & refresh token.

Request  
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "YourPassword123"
}
```

Response  
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "dGhpc2lzYXJlZnJlc2g="
}
```

### POST /auth/register

Create a new user account.  
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass!",
  "name": "New User"
}
```

### POST /auth/refresh-access-token

Exchange a valid refresh token for a new access token.  
```http
POST /auth/refresh-access-token
Authorization: Bearer <refresh_token>
```

### GET /auth/verify-email/:token

Verify an email address using a one-time token sent by email.  
```
GET /auth/verify-email/abcdef123456
```

### POST /auth/logout

Invalidate current access & refresh tokens (requires no body).  
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

---

## 2. Wallet

All wallet routes require a valid access token.

Base path: `/wallet`

- `GET /wallet`  
  List all wallets for the authenticated user.

- `POST /wallet`  
  Create a new wallet.  
  Request body example:
  ```json
  {
    "name": "My BTC Wallet",
    "currency": "BTC"
  }
  ```

- `DELETE /wallet/:id`  
  Remove a wallet by its ID.

Example:  
```http
DELETE /wallet/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <access_token>
```

---

## 3. History

Fetch transaction or price history for a specific resource. Protected by access token.

- `GET /history/:id`  
  Retrieve history items for the given ID (e.g., wallet or asset ID).

Example:  
```http
GET /history/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <access_token>
```

---

## 4. Portfolio

Public endpoint that returns portfolio breakdown or metrics.

- `GET /portfolio/:id`  
  Fetch portfolio details for the specified portfolio ID.

Example:  
```http
GET /portfolio/portfolio123
```

---

## 5. Profile

Manage user profile. All profile routes require a valid access token.

Base path: `/profile`

- `GET /profile`  
  Retrieve current user’s profile.

- `PATCH /profile`  
  Update user details (name, email, etc.).  
  Example body:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com"
  }
  ```

- `PATCH /profile/password`  
  Change account password.  
  Example body:
  ```json
  {
    "currentPassword": "OldPass123",
    "newPassword": "NewPass456"
  }
  ```

---

For detailed request/response schemas and error codes, see the individual controller docs or Swagger definition (if available).