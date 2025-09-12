# API Overview

This document provides a high-level overview of the HETIC Crypto API. It outlines the main route groups, how authentication works, and examples for obtaining and using access tokens.

## Base URL

```
https://api.yourdomain.com
```

## Route Groups

- **/auth**  
  User authentication and session management (no prior authentication).
- **/wallet**  
  Manage user wallets (requires a valid access token).
- **/history**  
  Retrieve transaction history (requires a valid access token).
- **/portfolio**  
  View portfolio data.
- **/profile**  
  Fetch or update user profile (requires a valid access token).

---

## Authentication

All protected routes (`/wallet`, `/history`, `/profile`) use the `verifyAccessToken` middleware. You must include a valid Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

### 1. Register

Create a new user account.

```
POST /auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```

Response (201 Created):

```json
{
  "message": "Registration successful. Please verify your email."
}
```

### 2. Verify Email

Activate a newly registered account via token.

```
GET /auth/verify/:token
```

Response (200 OK):

```json
{
  "message": "Email verified successfully"
}
```

### 3. Login

Authenticate and receive an access token. A `refreshToken` cookie is set for future refreshes.

```
POST /auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```

Response (200 OK):

```json
{
  "accessToken": "<JWT_ACCESS_TOKEN>"
}
```

Cookie set on response:
- `refreshToken` (HttpOnly, Secure in production, SameSite=Strict)

### 4. Refresh Access Token

Obtain a new access token using the `refreshToken` cookie.

```
POST /auth/refresh
```

Response (200 OK):

```json
{
  "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
}
```

### 5. Logout

Invalidate the current session and clear the `refreshToken` cookie.

```
POST /auth/logout
```

Response (200 OK):

```json
{
  "message": "Logged out successfully"
}
```

---

## Example: Accessing a Protected Endpoint

Fetch the user's wallet list:

```
GET /wallet
Authorization: Bearer <accessToken>
```

If the token is expired, call:

```
POST /auth/refresh
```

and retry the request with the new access token.

---

## Next Steps

For details on specific route implementations (request schemas, error codes, examples), see the individual resource docs:

- [Wallet API](./wallet.md)
- [History API](./history.md)
- [Portfolio API](./portfolio.md)
- [Profile API](./profile.md)