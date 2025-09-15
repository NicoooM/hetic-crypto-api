# Authentication Guide

This document explains how to use the authentication flows in the HETIC Crypto API: registration, email verification, login, protected routes, token refreshing, and logout. All endpoints below assume the API base URL is `https://api.your-domain.com`.

---

## Prerequisites

- Set the following environment variables:
  - `JWT_ACCESS_SECRET` – Secret key for signing access and verification tokens.
  - `JWT_REFRESH_TOKEN_EXPIRATION_TIME` – Refresh token lifespan (e.g., `"7d"`).
  - `BCRYPT_SALT_ROUNDS` – Number of salt rounds for password hashing (e.g., `10`).

---

## 1. Register a New Account

Endpoint  
`POST /auth/register`

Request Body  
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "S3cur3P@ssw0rd"
}
```

Response  
- `200 OK` on success (verification email sent)
- Errors:
  - `400 Bad Request` if body validation fails
  - `500 Internal Server Error` on unexpected issues
  - `Error: Email already registered` if the email is in use

What happens:
1. Password is hashed with bcrypt.
2. A verification token (JWT) is generated.
3. A user record is created with `isEmailVerified = false`.
4. A verification email is sent containing the token.

---

## 2. Verify Email Address

Endpoint  
`GET /auth/verify-email?token=<verificationToken>`

Query Parameter  
- `token` – JWT sent in the verification email

Response  
- `200 OK` on success (`isEmailVerified` is set to `true`)
- `401 Unauthorized` or `403 Forbidden` if the token is invalid or expired

Example  
```bash
curl "https://api.your-domain.com/auth/verify-email?token=eyJhbGciOi..."
```

---

## 3. Log In

Endpoint  
`POST /auth/login`

Request Body  
```json
{
  "email": "alice@example.com",
  "password": "S3cur3P@ssw0rd"
}
```

Response  
```json
{
  "accessToken": "<JWT_ACCESS_TOKEN>",
  "refreshToken": "<JWT_REFRESH_TOKEN>"
}
```

Errors  
- `Error: E-mail is not registered`
- `Error: Please verify your email first`
- `Error: Invalid password`

---

## 4. Access Protected Routes

To access routes guarded by `verifyAccessToken`, include the access token in the `Authorization` header:

```http
GET /api/protected/resource
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

The `verifyAccessToken` middleware will:
1. Check for a Bearer token.
2. Verify the JWT using `JWT_ACCESS_SECRET`.
3. Parse the token payload and attach `req.user`.
4. Reject requests with `401 Unauthorized` or `403 Forbidden` if invalid.

---

## 5. Refresh Access Token

When your access token expires, use the refresh token to get a new one.

Endpoint  
`POST /auth/refresh`

Request Body  
```json
{
  "refreshToken": "<JWT_REFRESH_TOKEN>"
}
```

Response  
```json
{
  "accessToken": "<NEW_JWT_ACCESS_TOKEN>",
  "refreshToken": "<JWT_REFRESH_TOKEN>"
}
```

Errors  
- `Error: Invalid refresh token` if not found
- `Error: Refresh token expired` if past its expiration date

---

## 6. Log Out

Endpoint  
`POST /auth/logout`

Request Body  
```json
{
  "refreshToken": "<JWT_REFRESH_TOKEN>"
}
```

Response  
- `200 OK` on success (refresh token deleted)
- `Error: Failed to logout` on server error

---

## Error Handling

All error responses follow this shape:

```json
{
  "message": "Descriptive error message"
}
```

Inspect HTTP status codes:
- 400–499 for client errors (invalid input, auth issues)
- 500–599 for server errors

---

## Example Workflow

1. **Register**  
   `POST /auth/register` → receives verification email.
2. **Verify Email**  
   `GET /auth/verify-email?token=...` → email confirmed.
3. **Login**  
   `POST /auth/login` → receive `accessToken` + `refreshToken`.
4. **Call Protected API**  
   `GET /api/data` with `Authorization: Bearer <accessToken>`.
5. **Refresh Token** (if 401 returned)  
   `POST /auth/refresh` → get new `accessToken`.
6. **Logout**  
   `POST /auth/logout` → invalidate `refreshToken`.

---

For detailed implementation, refer to:
- Middleware: `backend/src/middleware/auth.ts`
- Auth service: `backend/src/services/auth.service.ts`