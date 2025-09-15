# Authentication Guide

This guide walks you through the authentication flow provided by the HETIC Crypto API backend. You’ll learn how to:

- Register a new user  
- Verify email addresses  
- Log in and receive tokens  
- Refresh access tokens  
- Protect your routes with middleware  
- Log out

All endpoints described below are assumed to be mounted under `/auth`. Adjust the base path if you’ve mounted them differently.

---

## 1. Register a New User

Endpoint  
```
POST /auth/register
Content-Type: application/json
```

Request Body  
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "StrongPassword123"
}
```

Success Response (201 Created)  
```json
{
  "message": "Registration successful. Please verify your email."
}
```

On registration, the API:
- Checks for existing users
- Hashes the password
- Creates a verification token
- Sends a verification email (via `EmailService`)

---

## 2. Verify Email Address

After registration, the user receives a link such as:
```
GET /auth/verify/:token
```

Example  
```
GET /auth/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Success Response (200 OK)  
```json
{
  "message": "Email verified successfully"
}
```

---

## 3. Log In

Endpoint  
```
POST /auth/login
Content-Type: application/json
```

Request Body  
```json
{
  "email": "alice@example.com",
  "password": "StrongPassword123"
}
```

Success Response (200 OK)  
- Sets a **HttpOnly** cookie `refreshToken`  
- Returns a JSON payload with `accessToken`

```json
{
  "accessToken": "<JWT_ACCESS_TOKEN>"
}
```

Headers & Cookie Security  
- Cache-Control: no-store  
- Pragma: no-cache  
- X-Content-Type-Options: nosniff  
- X-Frame-Options: DENY  
- Cookie (`refreshToken`):
  - `httpOnly: true`
  - `secure: true` in production
  - `sameSite: 'strict'`
  - `maxAge`: matches your refresh token expiration

---

## 4. Refresh Access Token

When the access token expires, use the refresh token cookie to get a new one.

Endpoint  
```
POST /auth/refresh
```

Request  
- Sends the `refreshToken` cookie automatically

Success Response (200 OK)  
```json
{
  "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
}
```

The API validates and hashes the refresh token, checks its expiry, and issues a fresh access token.

---

## 5. Protecting Routes

To secure your routes, use the `verifyAccessToken` middleware:

```ts
import express from "express";
import { verifyAccessToken } from "middleware/auth";

const router = express.Router();

router.get(
  "/protected",
  verifyAccessToken,
  (req, res) => {
    // req.user contains decoded { id, email }
    res.json({ message: "Secure data", user: req.user });
  }
);
```

Behavior:
- Expects an `Authorization: Bearer <accessToken>` header  
- Verifies and parses the JWT  
- Throws `401 Unauthorized` or `403 Forbidden` on failure  

---

## 6. Log Out

Endpoint  
```
POST /auth/logout
```

Behavior:
- Reads the `refreshToken` cookie
- Deletes it from the database
- Clears the cookie on the client

Success Response (200 OK)  
```json
{
  "message": "Logged out successfully"
}
```

Cleared Cookie Options  
- `httpOnly: true`  
- `secure: true` in production  
- `sameSite: 'strict'`  

---

## Error Handling

- **400 Bad Request**: Validation errors (Zod schemas)  
- **401 Unauthorized**: Missing or invalid credentials/tokens  
- **403 Forbidden**: Invalid or expired access token  
- **500 Internal Server Error**: Unexpected failures  

---

For more details on token configuration, see:
- `src/services/token.service.ts`  
- `src/middleware/auth.ts`  

Keep your `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and expiration settings secure in environment variables.