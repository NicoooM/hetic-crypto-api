# Authentication Guide

This guide describes how to register, log in, verify email addresses, refresh access tokens, and protect API routes in the HETIC Crypto API using JWT access and refresh tokens.

## Environment Variables

Make sure the following environment variables are set:

- `JWT_ACCESS_SECRET` – Secret key for signing access tokens  
- `JWT_REFRESH_SECRET` – Secret key for signing refresh tokens  
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME` – e.g. `"15m"`  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME` – e.g. `"7d"`  
- `BCRYPT_SALT_ROUNDS` – e.g. `10`  

## Endpoints & Usage

### 1. Register a New User

**Endpoint**  
`POST /api/auth/register`

**Request Body**  
```json
{
  "name": "Alice Example",
  "email": "alice@example.com",
  "password": "P@ssw0rd!"
}
```

**Behavior**  
- Hashes the password with bcrypt.  
- Creates a user record with `isEmailVerified = false`.  
- Sends a verification email containing a time-limited token.

### 2. Verify Email

**Endpoint**  
`GET /api/auth/verify?token=<verificationToken>`

**Query Params**  
- `token` – JWT signed with `JWT_ACCESS_SECRET`

**Behavior**  
- Verifies the token and sets `isEmailVerified = true` for the corresponding user.

### 3. Log In

**Endpoint**  
`POST /api/auth/login`

**Request Body**  
```json
{
  "email": "alice@example.com",
  "password": "P@ssw0rd!"
}
```

**Response**  
```json
{
  "accessToken": "<jwt-access-token>",
  "refreshToken": "<jwt-refresh-token>"
}
```

**Behavior**  
- Verifies email, checks password.  
- Generates an access token (short-lived) and a refresh token (long-lived).  
- Stores a hashed copy of the refresh token in the database.

### 4. Accessing Protected Routes

Use the `verifyAccessToken` middleware in your Express routes:

```ts
import { verifyAccessToken } from "./middleware/auth";

app.get(
  "/api/profile",
  verifyAccessToken,
  (req, res) => {
    // req.user contains { id, email }
    res.json({ profile: /* ... */ });
  }
);
```

**Usage**  
- Add header:  
  `Authorization: Bearer <jwt-access-token>`

- On failure:  
  - Missing token → 401 Unauthorized  
  - Invalid or expired token → 403 Forbidden  

### 5. Refresh Access Token

**Endpoint**  
`POST /api/auth/refresh`

**Request Body**  
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```

**Response**  
```json
{
  "accessToken": "<new-jwt-access-token>",
  "refreshToken": "<same-refresh-token>"
}
```

**Behavior**  
- Looks up the hashed refresh token in the database.  
- If valid and not expired, issues a new access token.

### 6. Log Out

**Endpoint**  
`POST /api/auth/logout`

**Request Body**  
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```

**Behavior**  
- Deletes the stored refresh token, effectively logging out the user.

## Implementation Details

### verifyAccessToken Middleware

```ts
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { middlewareSchema } from "schemas/auth.schemas";

export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    req.user = middlewareSchema.parse(decoded);
    next();
  } catch {
    res.status(StatusCodes.FORBIDDEN).json({ message: "Invalid token" });
  }
}
```

### TokenService

- `generateAccessToken({ id, email })` signs a JWT with `JWT_ACCESS_SECRET` and `JWT_ACCESS_TOKEN_EXPIRATION_TIME`.  
- `generateRefreshToken({ id })` signs a JWT with `JWT_REFRESH_SECRET` and `JWT_REFRESH_TOKEN_EXPIRATION_TIME`.  
- `saveRefreshToken(token, userId)`  
  1. Hashes the token with HMAC-SHA256 via `hashToken(token, secret)`.  
  2. Stores the hash and expiry in the `refreshToken` table.

### Refresh-Token Hashing

```ts
import crypto from "crypto";

export function hashToken(token: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("hex");
}
```

This prevents raw refresh tokens from being stored in plaintext.

---

By following these steps, you can secure your API with short-lived access tokens, long-lived refresh tokens, and email verification.