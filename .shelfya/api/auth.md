# Authentication API

Base path: `/auth`

This document describes the available authentication endpoints, request/response formats, and usage examples.

---

## Endpoints

### 1. Register a New User

**POST** `/auth/register`

Rate-limited to prevent abuse.

Request Body (JSON):  
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "YourSecurePassword123"
}
```

Responses:  
- `201 Created`  
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```
- `400 Bad Request`  
  ```json
  { "message": "Error details from validation schema" }
  ```
- `500 Internal Server Error`  
  ```json
  { "message": "Registration failed" }
  ```

Example:  
```bash
curl -X POST https://api.example.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"YourSecurePassword123"}'
```

---

### 2. Login

**POST** `/auth/login`

Rate-limited to prevent brute-force attacks.

Request Body (JSON):  
```json
{
  "email": "jane@example.com",
  "password": "YourSecurePassword123"
}
```

On success, sets a secure HTTP-only `refreshToken` cookie and returns an `accessToken`.

Responses:  
- `200 OK`  
  - Headers:  
    ```
    Set-Cookie: refreshToken=<token>; HttpOnly; SameSite=Strict; Secure (in production)
    Cache-Control: no-store
    Pragma: no-cache
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    ```
  - Body:
    ```json
    {
      "accessToken": "<jwt_access_token>"
    }
    ```
- `400 Bad Request` (validation error)  
  ```json
  { "message": "Validation error details" }
  ```
- `401 Unauthorized`  
  ```json
  { "message": "Invalid email or password" }
  ```

Example:  
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -c cookiejar.txt \
  -d '{"email":"jane@example.com","password":"YourSecurePassword123"}'
```

---

### 3. Verify Email

**GET** `/auth/verify-email/:token`

Call this endpoint to confirm the user's email address. The token is sent via email upon registration.

Path Parameter:  
- `token` (string): email verification token

Responses:  
- `200 OK`  
  ```json
  { "message": "Email verified successfully" }
  ```
- `500 Internal Server Error`  
  ```json
  { "message": "Verification failed" }
  ```

Example:  
```bash
curl https://api.example.com/auth/verify-email/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 4. Refresh Access Token

**POST** `/auth/refresh-access-token`

Uses the `refreshToken` cookie to issue a new `accessToken`. No body required.

Responses:  
- `200 OK`  
  - Body:
    ```json
    {
      "accessToken": "<new_jwt_access_token>"
    }
    ```
- `400 Bad Request` (missing/invalid cookie)  
  ```json
  { "message": "Refresh token is required" }
  ```
- `401 Unauthorized`  
  ```json
  { "message": "Invalid or expired refresh token" }
  ```

Example:  
```bash
curl -X POST https://api.example.com/auth/refresh-access-token \
  -b cookiejar.txt
```

---

### 5. Logout

**POST** `/auth/logout`

Clears the `refreshToken` cookie on the client and invalidates it server-side.

Responses:  
- `200 OK`  
  ```json
  { "message": "Logged out successfully" }
  ```
- `400 Bad Request`  
  ```json
  { "message": "Invalid refresh token" }
  ```
- `500 Internal Server Error`  
  ```json
  { "message": "Logout failed" }
  ```

Example:  
```bash
curl -X POST https://api.example.com/auth/logout \
  -b cookiejar.txt \
  -c cookiejar.txt
```

---

## Common Response Headers

All authentication responses include security headers to enforce best practices:

- `Cache-Control: no-store`
- `Pragma: no-cache`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`

---

For more details on input schemas and error handling, refer to the backend validation definitions in `schemas/auth.schemas`.