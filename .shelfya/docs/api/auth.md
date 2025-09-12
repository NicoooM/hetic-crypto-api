# Authentication API

This document describes the authentication endpoints for the Crypto API. All routes below are prefixed with `/api/auth`. Unless otherwise noted, requests and responses use JSON.  

---

## Table of Contents

- [Register](#register)  
- [Login](#login)  
- [Refresh Access Token](#refresh-access-token)  
- [Verify Email](#verify-email)  
- [Logout](#logout)  

---

## Register

Create a new user account.  
This endpoint is rate-limited to prevent abuse.

**Endpoint**  
```
POST /api/auth/register
```

### Request

Headers:  
- `Content-Type: application/json`

Body schema (Zod `registerSchema`):  
```ts
{
  name: string,
  email: string,          // must be a valid email
  password: string        // min 8 chars, at least one uppercase, one lowercase, one number & one special char
}
```

Example:
```bash
curl -X POST https://api.example.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Doe",
    "email": "alice@example.com",
    "password": "Str0ngP@ss!"
  }'
```

### Response

- **201 Created**  
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```

- **400 Bad Request** – Validation error  
- **429 Too Many Requests** – Rate limit exceeded  
- **500 Internal Server Error** – Service failure  

---

## Login

Authenticate with email and password. Returns an access token and sets a `refreshToken` cookie.  
This endpoint is rate-limited.

**Endpoint**  
```
POST /api/auth/login
```

### Request

Headers:  
- `Content-Type: application/json`

Body schema (Zod `loginSchema`):  
```ts
{
  email: string,     // must be a valid email
  password: string
}
```

Example:
```bash
curl -i -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "Str0ngP@ss!"
  }'
```

### Response

- **200 OK**  
  - Sets cookie `refreshToken` (HTTP-Only, Secure in production, SameSite=Strict)  
  - Headers to prevent caching: `Cache-Control: no-store`, `Pragma: no-cache`  
  - JSON body:
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
    ```
- **400 Bad Request** – Invalid input  
- **401 Unauthorized** – Wrong credentials  
- **429 Too Many Requests** – Rate limit exceeded  

---

## Refresh Access Token

Obtain a new access token using the refresh token stored in the cookie.

**Endpoint**  
```
POST /api/auth/refresh-access-token
```

### Request

- Must include cookie: `refreshToken`
- No body required

Example:
```bash
curl -X POST https://api.example.com/api/auth/refresh-access-token \
  --cookie "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6..."
```

### Response

- **200 OK**  
  - JSON body:
    ```json
    {
      "accessToken": "newAccessTokenHere"
    }
    ```
- **400 Bad Request** – Missing or malformed refresh token  
- **401 Unauthorized** – Invalid, expired, or revoked token  

---

## Verify Email

Confirm user email address via a token sent by email.

**Endpoint**  
```
GET /api/auth/verify-email/:token
```

### Request

- Path parameter `:token` – the verification token

Example:
```bash
curl https://api.example.com/api/auth/verify-email/abcdef123456
```

### Response

- **200 OK**  
  ```json
  {
    "message": "Email verified successfully"
  }
  ```
- **500 Internal Server Error** – Invalid or expired token  

---

## Logout

Revoke the current refresh token and clear the cookie.

**Endpoint**  
```
POST /api/auth/logout
```

### Request

- Must include cookie: `refreshToken`

Example:
```bash
curl -X POST https://api.example.com/api/auth/logout \
  --cookie "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6..."
```

### Response

- **200 OK**  
  - Clears cookie `refreshToken`  
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **400 Bad Request** – Malformed cookie  
- **500 Internal Server Error** – Server failure  

---

For more details on schemas and error handling, see the [`auth.schemas.ts`](../../backend/src/schemas/auth.schemas.ts) and [`auth.controller.ts`](../../backend/src/controllers/auth.controller.ts) files.