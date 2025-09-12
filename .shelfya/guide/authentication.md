# Authentication Guide

This guide covers the authentication flow for the HETIC Crypto API, including registration, email verification, login, token refresh, logout, and route protection.

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Environment Variables](#environment-variables)  
- [Endpoints](#endpoints)  
  - [Register](#register)  
  - [Verify Email](#verify-email)  
  - [Login](#login)  
  - [Refresh Access Token](#refresh-access-token)  
  - [Logout](#logout)  
- [Protecting Routes](#protecting-routes)  

---

## Prerequisites

- Node.js & npm installed  
- A running instance of the API (see the Getting Started guide)  
- A configured SMTP service for email verification  

## Environment Variables

| Variable                                | Description                                         |
| --------------------------------------- | --------------------------------------------------- |
| `JWT_ACCESS_SECRET`                     | Secret key for signing access tokens               |
| `JWT_REFRESH_SECRET`                    | Secret key for signing refresh tokens              |
| `JWT_ACCESS_TOKEN_EXPIRATION_TIME`      | e.g. `"15m"`                                        |
| `JWT_REFRESH_TOKEN_EXPIRATION_TIME`     | e.g. milliseconds (used for cookie max-age)        |
| `BCRYPT_SALT_ROUNDS`                    | Number of rounds for bcrypt password hashing        |
| `NODE_ENV`                              | `"development"` or `"production"`                   |

---

## Endpoints

All endpoints are under the `/api/auth` prefix by default. Replace it if you have a custom router.

### Register

Create a new user and send a verification email.

**Request**

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "strongPassword123"
}
```

**Response**

- `201 Created`  
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```
- `400 Bad Request` (validation failed)  
- `500 Internal Server Error` (database or email failure)  

---

### Verify Email

Mark a user’s email address as verified. The frontend should redirect here with the token query.

**Request**

```
GET /api/auth/verify-email/<verificationToken>
```

**Response**

- `200 OK`  
  ```json
  { "message": "Email verified successfully" }
  ```
- `500 Internal Server Error` (invalid or expired token)  

---

### Login

Authenticate a user and receive an access token plus an HTTP-only refresh token cookie.

**Request**

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "strongPassword123"
}
```

**Response**

- `200 OK`  
  - JSON body containing the JWT access token  
  - `Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=<ms>`
  ```json
  { "accessToken": "eyJhbGciOiJIUzI1NiIsIn..." }
  ```
- `400 Bad Request` (validation error)  
- `401 Unauthorized` (invalid credentials or unverified email)  

**Example (cURL)**

```bash
curl -i -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"strongPassword123"}' \
  -c cookies.txt
```

---

### Refresh Access Token

Obtain a new access token using the refresh token stored in cookie.

**Request**

```
POST /api/auth/refresh
Cookie: refreshToken=<token>
```

**Response**

- `200 OK`  
  ```json
  { "accessToken": "eyJhbGciOiJIUzI1NiIsIn..." }
  ```
- `400 Bad Request` (invalid cookie format)  
- `401 Unauthorized` (missing cookie)  
- `401 Unauthorized` (invalid or expired refresh token)  

**Example (cURL)**

```bash
curl -i -X POST https://api.example.com/api/auth/refresh \
  -b cookies.txt
```

---

### Logout

Invalidate the refresh token on the server and clear the cookie.

**Request**

```
POST /api/auth/logout
Cookie: refreshToken=<token>
```

**Response**

- `200 OK`
  ```json
  { "message": "Logged out successfully" }
  ```
- `400 Bad Request` (invalid cookie format)  
- `500 Internal Server Error`  

**Example (cURL)**

```bash
curl -i -X POST https://api.example.com/api/auth/logout \
  -b cookies.txt
```

---

## Protecting Routes

Use the `verifyAccessToken` middleware to guard any endpoints that require authentication. It expects the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

**Middleware Signature**

```ts
function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): void
```

**On Success**

- Attaches `req.user = { id: string; email: string }`  
- Calls `next()`

**On Failure**

- `401 Unauthorized` if header missing or malformed  
- `403 Forbidden` if token is invalid or expired  

**Example**

```ts
import express from "express";
import { verifyAccessToken } from "./middleware/auth";

const router = express.Router();

router.get("/portfolio", verifyAccessToken, (req, res) => {
  // req.user is guaranteed
  res.json({ message: `Hello user ${req.user.id}` });
});
```

---

With this flow in place, clients can register, verify their email, log in, refresh tokens, log out, and access protected resources securely.