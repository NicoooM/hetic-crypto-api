# Authentication

This guide explains how to register, log in, verify email addresses, refresh access tokens, and log out when using the HETIC Crypto API. All authentication endpoints are under `/api/auth`.

## Table of Contents

- [Registration](#registration)  
- [Login](#login)  
- [Email Verification](#email-verification)  
- [Refresh Access Token](#refresh-access-token)  
- [Logout](#logout)  
- [Middleware](#middleware)  
- [Rate Limiting](#rate-limiting)  

---

## Registration

Registering a new user creates an account and sends a verification email.

**Endpoint**  
```
POST /api/auth/register
```

**Request Body**  
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "P@ssw0rd!"
}
```

**Responses**

- `201 Created`  
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```
- `400 Bad Request` for invalid input  
- `429 Too Many Requests` if rate limit exceeded  
- `500 Internal Server Error` on unexpected failures  

---

## Login

Log in with verified credentials to receive an access token and a refresh token (stored in an HTTP-only cookie).

**Endpoint**  
```
POST /api/auth/login
```

**Request Body**  
```json
{
  "email": "john@example.com",
  "password": "P@ssw0rd!"
}
```

**Responses**

- `200 OK`  
  - **Headers**  
    ```
    Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict
    Cache-Control: no-store
    Pragma: no-cache
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    ```
  - **Body**  
    ```json
    {
      "accessToken": "<jwt-access-token>"
    }
    ```
- `400 Bad Request` for schema validation errors  
- `401 Unauthorized` for invalid credentials or unverified email  
- `429 Too Many Requests` if rate limit exceeded  

---

## Email Verification

After registering, the user receives a link containing a verification token. Calling this endpoint marks the email as verified.

**Endpoint**  
```
GET /api/auth/verify-email/:token
```

**URL Parameters**  
- `token` — the JWT issued during registration

**Responses**

- `200 OK`  
  ```json
  {
    "message": "Email verified successfully"
  }
  ```
- `500 Internal Server Error` if token is invalid or expired  

---

## Refresh Access Token

When the access token expires, request a new one using the refresh token stored in an HTTP-only cookie.

**Endpoint**  
```
POST /api/auth/refresh-token
```

**Cookies**  
- `refreshToken` — must be present

**Responses**

- `200 OK`  
  ```json
  {
    "accessToken": "<new-jwt-access-token>"
  }
  ```
- `400 Bad Request` for missing or malformed cookie  
- `401 Unauthorized` for missing or invalid refresh token  
- `403 Forbidden` if the refresh token cannot be parsed  

---

## Logout

Invalidate the refresh token by clearing the cookie and deleting it server-side.

**Endpoint**  
```
POST /api/auth/logout
```

**Responses**

- `200 OK`  
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- `400 Bad Request` for invalid cookie  
- `500 Internal Server Error` on server failures  

---

## Middleware

### verifyAccessToken

Protect routes by validating the `Authorization: Bearer <token>` header.

```ts
import { verifyAccessToken } from "middleware/auth";

app.get(
  "/api/profile",
  verifyAccessToken,
  (req, res) => {
    // req.user contains { id, email }
    res.json({ profile: /* … */ });
  }
);
```

- Responds `401 Unauthorized` if header is missing or malformed  
- Responds `403 Forbidden` for invalid or expired token  

---

## Rate Limiting

To defend against brute-force attacks, the login and registration endpoints are rate limited to a fixed number of requests per time window (default: 15 minutes).

- `loginLimiter` applies to `POST /api/auth/login`  
- `registerLimiter` applies to `POST /api/auth/register`  

Example usage:

```ts
import { loginLimiter, registerLimiter } from "middleware/rate-limiter";

app.post("/api/auth/login", loginLimiter, authController.login);
app.post("/api/auth/register", registerLimiter, authController.register);
```

When the limit is exceeded, responses will be `429 Too Many Requests` with a message:  
```
Too many requests from this IP, please try again after 15 minutes
```

---

For more details on token generation and hashing, refer to the `TokenService` and `AuthService` implementation under `backend/src/services`.