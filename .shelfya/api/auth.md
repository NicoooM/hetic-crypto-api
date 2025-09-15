# Authentication API

Base URL: `/auth`

This document covers the authentication endpoints for logging in, registering, refreshing tokens, verifying email, and logging out. All requests and responses use JSON unless otherwise noted.

---

## Endpoints

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh-access-token`
- `GET  /auth/verify-email/:token`
- `POST /auth/logout`

---

## POST /auth/login

Authenticate a user and receive an access token and a refresh token (HTTP-only cookie).

Request  
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

Success Response  
Status: `200 OK`  
Headers:
- `Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=<ms>`
- Security headers: `Cache-Control: no-store`, `Pragma: no-cache`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`

Body:
```json
{
  "accessToken": "<jwt_access_token>"
}
```

Error Responses  
- `400 Bad Request` – validation error  
- `401 Unauthorized` – invalid credentials  

---

## POST /auth/register

Register a new user. An email verification link will be sent.

Request  
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword!"
}
```

Success Response  
Status: `201 Created`  
```json
{
  "message": "Registration successful. Please verify your email."
}
```

Error Responses  
- `400 Bad Request` – validation error  
- `500 Internal Server Error` – server-side issue  

---

## POST /auth/refresh-access-token

Use the HTTP-only refresh token cookie to obtain a new access token.

Request  
```http
POST /auth/refresh-access-token
Cookie: refreshToken=<your_refresh_token>
```

Success Response  
Status: `200 OK`  
Headers:
- `Cache-Control: no-store`
- `Pragma: no-cache`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`

Body:
```json
{
  "accessToken": "<new_jwt_access_token>"
}
```

Error Responses  
- `400 Bad Request` – missing or invalid cookie  
- `401 Unauthorized` – invalid or expired refresh token  

---

## GET /auth/verify-email/:token

Verify a user's email address using the token sent in the verification email.

Request  
```http
GET /auth/verify-email/abc123def456
```

Success Response  
Status: `200 OK`  
```json
{
  "message": "Email verified successfully"
}
```

Error Responses  
- `500 Internal Server Error` – invalid or expired token  

---

## POST /auth/logout

Invalidate the refresh token and clear it from the client cookie.

Request  
```http
POST /auth/logout
Cookie: refreshToken=<your_refresh_token>
```

Success Response  
Status: `200 OK`  
```json
{
  "message": "Logged out successfully"
}
```
Cookies Cleared:
- `refreshToken`  

Error Responses  
- `400 Bad Request` – malformed cookie  
- `500 Internal Server Error` – server-side issue  

---

## Notes

- All endpoints expect and return JSON.
- Passwords and tokens are validated using strict schemas—invalid formats yield `400 Bad Request`.
- Rate limiting applies on the `/login` and `/register` routes.
- In production, cookies are set with `Secure` flag. Ensure HTTPS is used.