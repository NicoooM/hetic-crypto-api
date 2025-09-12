# Authentication Guide

This guide walks you through the authentication flow of the HETIC Crypto API. You’ll learn how to register, log in, verify your email, protect routes with JWT, refresh access tokens, and log out.

---

## Prerequisites

- Environment variables  
  • `JWT_ACCESS_SECRET` – secret for signing access tokens  
  • `JWT_REFRESH_SECRET` – secret for signing refresh tokens  
  • `NODE_ENV` – set to `production` in production  
- Cookie support on your client for HTTP-only refresh tokens

---

## Endpoints

Assuming these controllers are mounted under `/auth`, the key endpoints are:

- `POST /auth/register`  
- `POST /auth/login`  
- `GET  /auth/verify-email/:token`  
- `POST /auth/refresh-token`  
- `POST /auth/logout`

---

## 1. Register

Create a new user and send a verification email.

Request  
```
POST /auth/register
Content-Type: application/json

{
  "name":     "Alice Doe",
  "email":    "alice@example.com",
  "password": "yourSecureP@ssw0rd"
}
```

Success Response (201 Created)  
```json
{
  "message": "Registration successful. Please verify your email."
}
```

The server emails you a link like:
```
GET /auth/verify-email/<verificationToken>
```

---

## 2. Verify Email

Activate the user account by visiting the link in the email.

Request  
```
GET /auth/verify-email/:token
```

Success Response (200 OK)  
```json
{
  "message": "Email verified successfully"
}
```

---

## 3. Login

Authenticate with email and password to receive an access token and a refresh token (stored in an HTTP-only cookie).

Request  
```
POST /auth/login
Content-Type: application/json

{
  "email":    "alice@example.com",
  "password": "yourSecureP@ssw0rd"
}
```

Success Response (200 OK)  

Headers set by server:  
• `Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=<expiry>`  
• Security headers: Cache-Control, Pragma, X-Content-Type-Options, X-Frame-Options  

Body:  
```json
{
  "accessToken": "<jwt-access-token>"
}
```

---

## 4. Protecting Routes

Use the `verifyAccessToken` middleware on any private route. It expects an `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Example in Express:
```ts
import { verifyAccessToken } from "./middleware/auth";

app.get("/api/profile", verifyAccessToken, (req, res) => {
  // req.user contains { id, email }
  res.json({ id: req.user.id, email: req.user.email });
});
```

Error Codes  
• `401 Unauthorized` – missing or malformed token  
• `403 Forbidden` – invalid or expired token

---

## 5. Refresh Access Token

When the access token expires, call the refresh endpoint. The server reads the HTTP-only cookie, validates it, and returns a new access token.

Request  
```
POST /auth/refresh-token
Cookie: refreshToken=<your-refresh-token>
```

Success Response (200 OK)  
```json
{
  "accessToken": "<new-jwt-access-token>"
}
```

Error Codes  
• `401 Unauthorized` – no refresh token provided  
• `400 Bad Request` – invalid token format  
• `401 Unauthorized` – invalid or expired refresh token

---

## 6. Logout

Invalidate the refresh token and clear the cookie.

Request  
```
POST /auth/logout
Cookie: refreshToken=<your-refresh-token>
```

Success Response (200 OK)  
Headers: `Set-Cookie: refreshToken=; Max-Age=0; HttpOnly; Secure; SameSite=Strict`  
```json
{ "message": "Logged out successfully" }
```

---

## Error Handling

All endpoints return JSON errors with appropriate HTTP status codes. Common patterns:

- `400 Bad Request` – schema validation failure  
- `401 Unauthorized` – missing credentials or tokens  
- `403 Forbidden` – token invalid or expired  
- `500 Internal Server Error` – unexpected failures

---

For more details on schemas and token behaviour, see:

- `backend/src/schemas/auth.schemas.ts`  
- `backend/src/middleware/auth.ts`  
- `backend/src/services/auth.service.ts`