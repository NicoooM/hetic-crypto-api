# Authentication

This module handles user registration, login, email verification, token refreshing, and logout in the backend. It also provides `verifyAccessToken` middleware to protect routes.

## Environment Variables

Make sure to set the following in your `.env`:

- `NODE_ENV` — e.g. `development` or `production`
- `JWT_ACCESS_SECRET` — secret for signing access tokens
- `JWT_REFRESH_SECRET` — secret for signing refresh tokens
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME` — e.g. `"15m"`
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME` — in milliseconds, e.g. `7 * 24 * 60 * 60 * 1000` (7 days)
- `BCRYPT_SALT_ROUNDS` — e.g. `10`
- Database connection (e.g. `DATABASE_URL`)

---

## Routes

All auth routes are mounted under `/auth` in **backend/src/routes/auth.ts**.

### 1. Register

- Endpoint: `POST /auth/register`
- Rate‐limited via `registerLimiter`
- Body:
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "Password123!"
  }
  ```
- Response: `201 Created`
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```
- Side effect: sends a verification email with a token link `/auth/verify-email/:token`

### 2. Verify Email

- Endpoint: `GET /auth/verify-email/:token`
- Params:
  - `token` — JWT returned by registration
- Response: `200 OK`
  ```json
  {
    "message": "Email verified successfully"
  }
  ```

### 3. Login

- Endpoint: `POST /auth/login`
- Rate‐limited via `loginLimiter`
- Body:
  ```json
  {
    "email": "alice@example.com",
    "password": "Password123!"
  }
  ```
- Response: `200 OK`
  ```json
  {
    "accessToken": "<JWT_ACCESS_TOKEN>"
  }
  ```
- Sets an HttpOnly `refreshToken` cookie:
  - `httpOnly`: true
  - `sameSite`: "strict"
  - `secure`: only in production
  - `maxAge`: `JWT_REFRESH_TOKEN_EXPIRATION_TIME`

Example with `curl`:
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password123!"}' \
  --include
```

### 4. Refresh Access Token

- Endpoint: `POST /auth/refresh-access-token`
- Reads `refreshToken` cookie (HttpOnly)
- Response: `200 OK`
  ```json
  {
    "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
  }
  ```
- Does **not** issue a new refresh token; reuse existing until expiration.

Fetch example:
```js
fetch("https://api.example.com/auth/refresh-access-token", {
  method: "POST",
  credentials: "include"
})
  .then(res => res.json())
  .then(data => console.log(data.accessToken));
```

### 5. Logout

- Endpoint: `POST /auth/logout`
- Reads `refreshToken` cookie and deletes it server‐side
- Clears `refreshToken` cookie client‐side
- Response: `200 OK`
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## Protecting Routes

Use the `verifyAccessToken` middleware in **backend/src/middleware/auth.ts**:

```ts
import { verifyAccessToken } from "middleware/auth";

app.get(
  "/api/protected",
  verifyAccessToken,
  (req: Request & { user: { id: string; email: string } }, res) => {
    res.json({ userId: req.user.id, email: req.user.email });
  }
);
```

- Expects `Authorization: Bearer <accessToken>`
- On success, attaches `req.user = { id, email }`
- Errors result in `401 Unauthorized` or `403 Forbidden`

---

## Under the Hood

- **Zod schemas** validate inputs (email, password, tokens).
- `AuthService` in **services/auth.service.ts** handles:
  - Bcrypt hashing and verification
  - JWT generation for access & refresh tokens
  - Storing hashed refresh tokens in the database
  - Email verification via `EmailService`
- `TokenService` in **services/token.service.ts** wraps JWT and token‐hashing logic.
- **utils/hash-refresh-token.ts** uses HMAC SHA-256 to hash refresh tokens before saving.
- Refresh tokens are stored hashed; only the hash is persisted.

For more details, see the service and controller source files in `backend/src/services` and `backend/src/controllers`.