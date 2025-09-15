# Authentication Guide

This guide covers all authentication-related endpoints in the NicoooM HETIC Crypto API. You’ll learn how to register users, verify their email, log in, refresh access tokens, and log out. All endpoints live under the `/auth` route.

## Prerequisites

- Node.js + Express server running.
- Environment variables:
  - `NODE_ENV` (`production` or `development`)
  - `JWT_ACCESS_SECRET` (secret for signing access and verification tokens)
  - `JWT_REFRESH_SECRET` (secret for hashing refresh tokens)
- Cookie parser middleware enabled (`req.cookies`).

---

## 1. Register a New User

**Endpoint**  
POST `/auth/register`

**Request Body**  
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "SuperSecret123"
}
```

**Response**  
- Status: `201 Created`  
- Body:
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```

**Notes**  
- Uses Zod schema validation.  
- Sends a verification email containing a JWT token.

**cURL Example**  
```bash
curl -X POST https://api.example.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Doe","email":"alice@example.com","password":"SuperSecret123"}'
```

---

## 2. Verify Email

After registration, users receive an email with a verification link:

```
GET /auth/verify-email/:token
```

**Parameters**  
- `token` — the JWT from the verification email.

**Response**  
- Status: `200 OK`  
- Body:
  ```json
  {
    "message": "Email verified successfully"
  }
  ```

**cURL Example**  
```bash
curl https://api.example.com/auth/verify-email/eyJhbGciOiJIUzI1NiIs...
```

---

## 3. Login

**Endpoint**  
POST `/auth/login`

**Request Body**  
```json
{
  "email": "alice@example.com",
  "password": "SuperSecret123"
}
```

**Response**  
- Status: `200 OK`  
- Headers set for security:
  - `Cache-Control: no-store`
  - `Pragma: no-cache`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
- Sets a **`refreshToken`** cookie (`HttpOnly`, `SameSite=Strict`, secure in production).
- Body:
  ```json
  {
    "accessToken": "<JWT_ACCESS_TOKEN>"
  }
  ```

**cURL Example**  
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -c cookie.txt \
  -d '{"email":"alice@example.com","password":"SuperSecret123"}'
```
> The `-c cookie.txt` flag stores the `refreshToken` cookie for subsequent requests.

---

## 4. Refresh Access Token

When your **access token** expires, request a new one using the stored **refresh token** cookie.

**Endpoint**  
POST `/auth/refresh-token`

**Request**  
- Must include the `refreshToken` cookie (sent automatically if you use `-b cookie.txt`).

**Response**  
- Status: `200 OK`  
- Security headers identical to **Login**.
- Body:
  ```json
  {
    "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
  }
  ```

**cURL Example**  
```bash
curl -X POST https://api.example.com/auth/refresh-token \
  -b cookie.txt \
  -H "Content-Type: application/json"
```

---

## 5. Logout

**Endpoint**  
POST `/auth/logout`

**Request**  
- Deletes the stored refresh token server-side.
- Clears the `refreshToken` cookie.

**Response**  
- Status: `200 OK`  
- Body:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

**cURL Example**  
```bash
curl -X POST https://api.example.com/auth/logout \
  -b cookie.txt \
  -H "Content-Type: application/json"
```

---

## Error Handling

- **400 Bad Request**: Zod schema validation failed.
- **401 Unauthorized**: Invalid credentials or missing refresh token.
- **500 Internal Server Error**: Unexpected server errors.

All error responses follow the shape:
```json
{
  "message": "Error description"
}
```

---

## Security Notes

- Refresh tokens are stored **hashed** in the database.
- Cookies are secured with `HttpOnly` and `SameSite=Strict`.
- In production, cookies are set with `secure: true`.
- Access tokens are short-lived JWTs; refresh tokens have a longer lifespan defined by `JWT_REFRESH_TOKEN_EXPIRATION_TIME`.