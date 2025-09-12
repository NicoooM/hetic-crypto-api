# Authentication API

This document describes the authentication endpoints for user registration, login, token refresh, email verification, and logout. All routes are mounted under the `/auth` base path.

Base URL  
```
https://<your-domain>/auth
```

---

## Endpoints

### 1. Register a New User

Rate-limited: `registerLimiter`

**Request**  
POST `/auth/register`  
Headers:
- `Content-Type: application/json`

Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "P@ssw0rd!"
}
```

**Success Response**  
Status: `201 Created`  
```json
{
  "message": "Registration successful. Please verify your email."
}
```

**Error Responses**
- `400 Bad Request` — Validation error (missing/invalid fields)
- `500 Internal Server Error` — Unexpected server error

---

### 2. User Login

Rate-limited: `loginLimiter`

**Request**  
POST `/auth/login`  
Headers:
- `Content-Type: application/json`

Body:
```json
{
  "email": "john@example.com",
  "password": "P@ssw0rd!"
}
```

**Success Response**  
Status: `200 OK`  
Headers:
```
Cache-Control: no-store
Pragma: no-cache
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Set-Cookie: refreshToken=<token>; HttpOnly; SameSite=Strict; Secure
```
Body:
```json
{
  "accessToken": "<jwt-access-token>"
}
```

**Error Responses**
- `400 Bad Request` — Validation error
- `401 Unauthorized` — Invalid credentials

---

### 3. Refresh Access Token

**Request**  
POST `/auth/refresh-access-token`  
Requires cookie:
```
refreshToken=<your-refresh-token>
```

**Success Response**  
Status: `200 OK`  
Headers:
```
Cache-Control: no-store
Pragma: no-cache
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```
Body:
```json
{
  "accessToken": "<new-jwt-access-token>"
}
```

**Error Responses**
- `400 Bad Request` — Missing or invalid refresh token
- `401 Unauthorized` — Expired or revoked token

---

### 4. Verify Email

**Request**  
GET `/auth/verify-email/:token`  
- URL parameter `token`: Email verification token

**Example**
```bash
curl https://<your-domain>/auth/verify-email/abcdef123456
```

**Success Response**  
Status: `200 OK`  
```json
{
  "message": "Email verified successfully"
}
```

**Error Responses**
- `500 Internal Server Error` — Verification failure or invalid token

---

### 5. Logout

**Request**  
POST `/auth/logout`  
Requires cookie:
```
refreshToken=<your-refresh-token>
```

**Success Response**  
Status: `200 OK`  
Clears the `refreshToken` cookie and returns:
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses**
- `400 Bad Request` — Invalid cookie
- `500 Internal Server Error` — Server failure during logout

---

## Examples

### cURL: Login & Fetch Protected Resource
```bash
# Login and save cookies
curl -i -c cookies.txt -H "Content-Type: application/json" \
  -X POST https://<your-domain>/auth/login \
  -d '{"email":"john@example.com","password":"P@ssw0rd!"}'

# Extract access token from response JSON, then call protected route
ACCESS_TOKEN=$(jq -r '.accessToken' < response.json)

curl -H "Authorization: Bearer $ACCESS_TOKEN" \
     https://<your-domain>/protected/resource
```

### cURL: Refresh Token
```bash
curl -i -b cookies.txt \
  -X POST https://<your-domain>/auth/refresh-access-token
```

---

For full schema definitions and rate limits, refer to the backend implementation in `routes/auth.ts` and `controllers/auth.controller.ts`.