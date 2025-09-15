# Authentication Guide

This guide covers user registration, login, email verification, token refresh, and logout flows in the HETIC Crypto API. It also shows how to protect routes with the access-token middleware.

---

## Table of Contents

- [Endpoints](#endpoints)
- [Register](#register)
- [Verify Email](#verify-email)
- [Login](#login)
- [Refresh Access Token](#refresh-access-token)
- [Logout](#logout)
- [Protecting Routes (Middleware)](#protecting-routes-middleware)

---

## Endpoints

| Method | Path                          | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| POST   | `/auth/register`              | Create a new user and send verification    |
| GET    | `/auth/verify-email/:token`   | Verify user email via token                |
| POST   | `/auth/login`                 | Authenticate and set refresh-token cookie  |
| POST   | `/auth/refresh-token`         | Issue new access token using cookie        |
| POST   | `/auth/logout`                | Clear refresh-token and invalidate session |

---

## Register

Create a new account. The server will send a verification email with a token.

Request  
```
POST /auth/register
Content-Type: application/json

{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "StrongP@ssw0rd"
}
```

Responses  
- **201 Created**  
  ```json
  { "message": "Registration successful. Please verify your email." }
  ```
- **400 Bad Request**  
  Validation errors (using Zod schemas).  
- **500 Internal Server Error**  
  Registration failures.

---

## Verify Email

Activate your account by visiting the link sent via email.

Request  
```
GET /auth/verify-email/<token>
```

Responses  
- **200 OK**  
  ```json
  { "message": "Email verified successfully" }
  ```
- **500 Internal Server Error**  
  Token invalid or expired.

---

## Login

Authenticate with email and password to receive an access token and a secure HTTP-only refresh-token cookie.

Request  
```
POST /auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "StrongP@ssw0rd"
}
```

Successful Response  
- **200 OK**  
  Headers set for security plus a cookie:
  ```
  Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=<ms>
  ```
  Body:
  ```json
  { "accessToken": "<JWT_ACCESS_TOKEN>" }
  ```

Errors  
- **400 Bad Request** — invalid input  
- **401 Unauthorized** — wrong credentials or unverified email  

---

## Refresh Access Token

When your access token expires, call this endpoint. It reads the `refreshToken` cookie and returns a new access token.

Request  
```
POST /auth/refresh-token
Cookie: refreshToken=<your-refresh-token>
```

Successful Response  
- **200 OK**  
  ```json
  { "accessToken": "<new-JWT_ACCESS_TOKEN>" }
  ```

Errors  
- **400 Bad Request** — malformed or missing cookie  
- **401 Unauthorized** — no cookie  
- **403 Forbidden** — invalid token  
- **401 Unauthorized** — expired or revoked token  

---

## Logout

Invalidate your session by removing the refresh token from both the database and the browser cookie.

Request  
```
POST /auth/logout
Cookie: refreshToken=<your-refresh-token>
```

Successful Response  
- **200 OK**  
  ```json
  { "message": "Logged out successfully" }
  ```
  The `refreshToken` cookie is cleared.

Errors  
- **400 Bad Request** — malformed cookie  
- **500 Internal Server Error** — server-side failures  

---

## Protecting Routes (Middleware)

Use the `verifyAccessToken` middleware to secure any endpoint:

```ts
import { verifyAccessToken } from "middleware/auth";

app.get(
  "/api/protected",
  verifyAccessToken,
  (req, res) => {
    // req.user is injected by the middleware
    res.json({ message: `Hello ${req.user.email}` });
  }
);
```

How it works:

1. Expects `Authorization: Bearer <JWT_ACCESS_TOKEN>` header.
2. Verifies the token against `JWT_ACCESS_SECRET`.
3. Parses payload (id, email) and attaches it to `req.user`.
4. Rejects requests with missing, invalid, or expired tokens.

---

For more details on token lifetimes, hashing, and error handling, refer to:

- backend/src/controllers/auth.controller.ts  
- backend/src/services/auth.service.ts  
- backend/src/middleware/auth.ts