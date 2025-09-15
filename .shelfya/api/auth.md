# Authentication API

Endpoints for user registration, login, token refresh, email verification, and logout. All routes are prefixed with `/api/auth`.

---

## POST `/api/auth/register`

Register a new user and send a verification email.

**Rate Limiter**: `registerLimiter`

Request Body (JSON):
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongP@ssw0rd"
}
```

Success Response:
- Status: `201 Created`
- Body:
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```

Error Responses:
- `400 Bad Request` — validation failed (invalid email, password too short, missing fields).
- `500 Internal Server Error` — unexpected server error.

---

## POST `/api/auth/login`

Authenticate a user and issue tokens. Stores a HTTP-only refresh token cookie.

**Rate Limiter**: `loginLimiter`

Request Body (JSON):
```json
{
  "email": "jane@example.com",
  "password": "StrongP@ssw0rd"
}
```

Success Response:
- Status: `200 OK`
- Headers:
  - `Cache-Control: no-store`
  - `Pragma: no-cache`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
- Cookie (`Set-Cookie`):
  - Name: `refreshToken`
  - Flags: `HttpOnly; Secure (in production); SameSite=Strict`
  - Max-Age: configured by `JWT_REFRESH_TOKEN_EXPIRATION_TIME`
- Body:
  ```json
  {
    "accessToken": "<JWT_ACCESS_TOKEN>"
  }
  ```

Error Responses:
- `400 Bad Request` — invalid payload.
- `401 Unauthorized` — invalid credentials.

---

## POST `/api/auth/refresh-access-token`

Refresh the access token using the HTTP-only refresh token cookie.

Request:
- Cookie: `refreshToken`

Success Response:
- Status: `200 OK`
- Headers (same as login):
  - `Cache-Control: no-store`
  - `Pragma: no-cache`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
- Body:
  ```json
  {
    "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
  }
  ```

Error Responses:
- `400 Bad Request` — missing or invalid refresh token.
- `401 Unauthorized` — expired or invalid token.

---

## GET `/api/auth/verify-email/:token`

Verify a user's email address via a token sent by email.

Path Parameter:
- `token` — verification token from email link.

Success Response:
- Status: `200 OK`
- Body:
  ```json
  {
    "message": "Email verified successfully"
  }
  ```

Error Responses:
- `500 Internal Server Error` — invalid or expired token, or server failure.

---

## POST `/api/auth/logout`

Invalidate the refresh token and clear the cookie.

Request:
- Cookie: `refreshToken`

Success Response:
- Status: `200 OK`
- Clears `refreshToken` cookie (`HttpOnly`, `Secure`, `SameSite=Strict`).
- Body:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

Error Responses:
- `400 Bad Request` — invalid cookie.
- `500 Internal Server Error` — server failure during logout.

---

# Examples

Using `curl`:

Login:
```bash
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"StrongP@ssw0rd"}' \
  -c cookies.txt
```

Refresh Token:
```bash
curl -X POST https://api.example.com/api/auth/refresh-access-token \
  -b cookies.txt
```

Logout:
```bash
curl -X POST https://api.example.com/api/auth/logout \
  -b cookies.txt
```

---

For detailed error messages and status codes, refer to the HTTP response body:  
```json
{ "message": "Description of the error." }
```