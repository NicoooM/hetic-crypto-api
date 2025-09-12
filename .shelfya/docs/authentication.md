# Authentication

This API uses JSON Web Tokens (JWT) for stateless authentication. Two tokens are issued:

- **Access Token** (short-lived): Used in the `Authorization` header to protect routes.
- **Refresh Token** (long-lived): Stored as an HTTP-only cookie to obtain new access tokens.

All authentication routes are mounted under `/api/auth`.

---

## Endpoints

### Register a New User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "StrongP@ssw0rd"
}
```

Response (201 Created):

```json
{
  "message": "Registration successful. Please verify your email."
}
```

An email with a verification link is sent to the provided address.

---

### Verify Email

```
GET /api/auth/verify-email/<verificationToken>
```

- `<verificationToken>` is provided in the email.
- No request body required.

Response (200 OK):

```json
{
  "message": "Email verified successfully"
}
```

---

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "StrongP@ssw0rd"
}
```

Response (200 OK):

- Sets an HTTP-only cookie named `refreshToken`.
- Returns a JSON payload with the access token.

```json
{
  "accessToken": "<jwt_access_token>"
}
```

Cookie settings:

- `HttpOnly`
- `Secure` in production
- `SameSite=Strict`
- Expires after the configured refresh token TTL

---

### Refresh Access Token

```
POST /api/auth/refresh-access-token
```

- No body required. The `refreshToken` cookie is read automatically.

Response (200 OK):

```json
{
  "accessToken": "<new_jwt_access_token>"
}
```

If the refresh token is missing, invalid or expired, you’ll receive a `401 Unauthorized` or `403 Forbidden`.

---

### Logout

```
POST /api/auth/logout
```

- No body required. The `refreshToken` cookie is cleared and invalidated server-side.

Response (200 OK):

```json
{
  "message": "Logged out successfully"
}
```

---

## Protecting Routes

Use the `verifyAccessToken` middleware to guard private routes. Add it to your Express router:

```ts
import { verifyAccessToken } from "middleware/auth";

app.get("/api/profile", verifyAccessToken, (req, res) => {
  // req.user contains { id: string; email: string }
  res.json({ userId: req.user.id, email: req.user.email });
});
```

Clients must send the access token in the `Authorization` header:

```
Authorization: Bearer <jwt_access_token>
```

If the token is missing or invalid, the middleware returns `401 Unauthorized` or `403 Forbidden`.

---

## Error Handling

- Validation errors (`400 Bad Request`) return a JSON with `{ message: string }`.
- Authentication errors return `401 Unauthorized` or `403 Forbidden`.
- Server errors return `500 Internal Server Error`.

---

## Token Configuration

- `JWT_ACCESS_TOKEN_EXPIRATION_TIME`: controls how long access tokens are valid.
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME`: controls how long refresh tokens (and cookies) live.
- Secrets read from `process.env.JWT_ACCESS_SECRET` and `process.env.JWT_REFRESH_SECRET`.

Ensure you set these in your environment before running the server.