# Authentication Guide

This guide covers user registration, login, email verification, token refresh, and logout flows for the HETIC Crypto API. All endpoints are under the `/auth` route.

## Environment Variables

Ensure you have the following set in your `.env`:

- `JWT_ACCESS_SECRET` — secret for signing access tokens  
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME` — e.g. `15m`  
- `JWT_REFRESH_SECRET` — secret for signing refresh tokens  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME` — in milliseconds, e.g. `7d`  
- `NODE_ENV` — set to `production` in production

---

## 1. Register a New User

**Endpoint**  
POST `/auth/register`

**Request Body**  
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "s3cr3tPass!"
}
```

**Response**  
- 201 Created  
```json
{
  "message": "Registration successful. Please verify your email."
}
```

**Example (cURL)**  
```bash
curl -X POST https://api.example.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Doe","email":"alice@example.com","password":"s3cr3tPass!"}'
```

After registration, the user receives a verification email with a token.

---

## 2. Verify Email

**Endpoint**  
GET `/auth/verify-email/:token`

**Parameters**  
- `:token` — JWT sent in the verification email

**Response**  
- 200 OK  
```json
{
  "message": "Email verified successfully"
}
```

**Example (cURL)**  
```bash
curl https://api.example.com/auth/verify-email/eyJhbGciOiJIUz...
```

---

## 3. Log In

**Endpoint**  
POST `/auth/login`

**Request Body**  
```json
{
  "email": "alice@example.com",
  "password": "s3cr3tPass!"
}
```

**Successful Response**  
- 200 OK  
- Sets an `httpOnly` cookie named `refreshToken`  
- Returns JSON with `accessToken`  
```json
{
  "accessToken": "<JWT_ACCESS_TOKEN>"
}
```

**Example (cURL)**  
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"s3cr3tPass!"}' \
  -c cookie.txt
```
> The `-c cookie.txt` flag saves the `refreshToken` cookie for subsequent requests.

---

## 4. Access Protected Routes

Protected endpoints require an **Access Token** in the `Authorization` header:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

Example middleware in Express:
```ts
import { verifyAccessToken } from "./middleware/auth";
app.get("/api/protected", verifyAccessToken, (req, res) => {
  res.json({ data: "Secret data", user: req.user });
});
```

---

## 5. Refresh Access Token

When the access token expires, use the stored refresh token cookie to get a new access token.

**Endpoint**  
POST `/auth/refresh-token`

**Request**  
- Include cookies (e.g. `refreshToken`)  
- No body required

**Successful Response**  
- 200 OK  
```json
{
  "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
}
```

**Example (cURL)**  
```bash
curl -X POST https://api.example.com/auth/refresh-token \
  -b cookie.txt
```

---

## 6. Log Out

Clears the refresh token cookie and invalidates it server-side.

**Endpoint**  
POST `/auth/logout`

**Request**  
- Include cookies (e.g. `refreshToken`)

**Response**  
- 200 OK  
```json
{
  "message": "Logged out successfully"
}
```

**Example (cURL)**  
```bash
curl -X POST https://api.example.com/auth/logout \
  -b cookie.txt
```

---

## Error Handling

- 400 Bad Request — input validation errors  
- 401 Unauthorized — missing or invalid credentials  
- 403 Forbidden — invalid or expired tokens  
- 500 Internal Server Error — unexpected failures

Each error response follows:
```json
{
  "message": "Detailed error message"
}
```

---

For any questions, refer to the API schema definitions in `backend/src/schemas/auth.schemas.ts`.