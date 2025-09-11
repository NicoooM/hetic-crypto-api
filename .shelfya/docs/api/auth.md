# Authentication API

Base URL: `/api/v1/auth`

All endpoints under `/api/v1/auth` handle user authentication: registration, login, token refresh, email verification and logout.  

---

## POST /login

Rate limit: 5 requests per 15 minutes per IP.

Authenticate an existing user and receive an access token. The server sets an HTTP-only `refreshToken` cookie.

Request  
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "P@ssw0rd!"
}
```

Response (200 OK)  
Headers:
- `Set-Cookie: refreshToken=<token>; HttpOnly; SameSite=Strict; Max-Age=604800000`
- Security headers: `Cache-Control: no-store`, `Pragma: no-cache`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`

Body:
```json
{
  "accessToken": "<jwt-access-token>"
}
```

Errors  
- 400 Bad Request: schema validation failed  
- 401 Unauthorized: wrong credentials or email not verified  
- 429 Too Many Requests: rate limit exceeded  

---

## POST /register

Rate limit: 3 requests per 15 minutes per IP.

Create a new user account. Sends a verification email.

Request  
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Str0ngP@ss!"
}
```

Response (201 Created)  
```json
{
  "message": "Registration successful. Please verify your email."
}
```

Errors  
- 400 Bad Request: schema validation failed  
- 500 Internal Server Error: unexpected failure  
- 429 Too Many Requests: rate limit exceeded  

---

## POST /refresh-access-token

Refresh the access token using the `refreshToken` cookie.

Request  
```
POST /api/v1/auth/refresh-access-token
Cookie: refreshToken=<jwt-refresh-token>
```

Response (200 OK)  
Headers: same security headers as `/login`

Body:
```json
{
  "accessToken": "<new-jwt-access-token>"
}
```

Errors  
- 400 Bad Request: invalid or missing cookie  
- 401 Unauthorized: no cookie present  
- 403 Forbidden: invalid or expired refresh token  

---

## GET /verify-email/:token

Mark a user’s email as verified. The token is sent via the verification email.

Request  
```
GET /api/v1/auth/verify-email/eyJhbGciOi...
```

Response (200 OK)  
```json
{
  "message": "Email verified successfully"
}
```

Errors  
- 500 Internal Server Error: invalid or expired token  

---

## POST /logout

Revoke the refresh token and clear the cookie.

Request  
```
POST /api/v1/auth/logout
Cookie: refreshToken=<jwt-refresh-token>
```

Response (200 OK)  
Headers:
```
Set-Cookie: refreshToken=; HttpOnly; SameSite=Strict; Max-Age=0
```
Body:
```json
{
  "message": "Logged out successfully"
}
```

Errors  
- 400 Bad Request: invalid cookie  
- 500 Internal Server Error: failed to clear token  
