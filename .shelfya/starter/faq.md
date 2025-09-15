# FAQ

This document answers common questions about authentication and environment setup in the HETIC Crypto API.

## What environment variables do I need to set?

The API requires the following variables (see `backend/src/constants.ts`):

```bash
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_TOKEN_EXPIRATION_TIME
JWT_REFRESH_TOKEN_EXPIRATION_TIME
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
API_URL
CRYPTOCOMPARE_API_KEY
ETHERSCAN_API_KEY
CLIENT_URL
DATABASE_URL
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
PORT
```

Example `.env` snippet:

```env
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=username
SMTP_PASS=password
API_URL=https://api.yoursite.com
CRYPTOCOMPARE_API_KEY=your_cc_api_key
ETHERSCAN_API_KEY=your_etherscan_key
CLIENT_URL=https://app.yoursite.com
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
PORT=4000
```

## How long do tokens last?

- **Access Token**  
  Configured by `JWT_ACCESS_TOKEN_EXPIRATION_TIME` (e.g., `15m`, `1h`).  
- **Refresh Token**  
  Defaults to 7 days (see `JWT_REFRESH_TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000`).

## How are tokens sent and stored?

- **Access Token**: returned in JSON response after `POST /auth/login` or `POST /auth/refresh`.
- **Refresh Token**: set as an HTTP-only cookie named `refreshToken` with:
  - `maxAge`: 7 days
  - `secure`: `true` in production
  - `sameSite`: `strict`

Example on login:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response sets:
- `Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`  
- JSON body: `{ "accessToken": "..." }`

## How does email verification work?

1. User registers via `POST /auth/register`.
2. The API sends a verification link to the provided email.
3. User clicks the link, hitting `GET /auth/verify/:token`.
4. On success, the account is activated.

Response:

```json
{ "message": "Email verified successfully" }
```

## How are rate limits applied?

Default rate limiting (in `backend/src/constants.ts`):

- **Login**: max 5 requests per 15 minutes
- **Register**: max 3 requests per 15 minutes

Adjust these limits by changing:
- `LOGIN_LIMITER_MAX_REQUESTS`
- `REGISTER_LIMITER_MAX_REQUESTS`
- `AUTH_LIMITER_WINDOW_MS`

## How do I refresh an expired access token?

Call `POST /auth/refresh` with your `refreshToken` cookie:

```http
POST /auth/refresh
Cookie: refreshToken=<your_cookie>
```

If valid, you receive a new access token:

```json
{ "accessToken": "new.jwt.access.token" }
```

## How do I log out?

Call `POST /auth/logout`. The server clears the `refreshToken` cookie:

```http
POST /auth/logout
Cookie: refreshToken=<your_cookie>
```

Response:

```json
{ "message": "Logged out successfully" }
```

## What error codes might I see?

- `400 Bad Request`  
  Validation errors (Zod schema failures).
- `401 Unauthorized`  
  Invalid credentials or missing/invalid refresh token.
- `500 Internal Server Error`  
  Unexpected server issues.

Example error response:

```json
{ "message": "Invalid email or password" }
```