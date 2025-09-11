# Authentication Guide

This guide walks you through the authentication flow for the HETIC Crypto API. You’ll learn how to register, verify email, login, refresh tokens, logout, and secure protected routes.

## Environment Variables

Make sure the following environment variables are set in your `.env` (see `backend/src/constants.ts`):

```
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
DATABASE_URL=postgres://...
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
PORT=5000
CRYPTOCOMPARE_API_KEY=...
ETHERSCAN_API_KEY=...
API_URL=http://localhost:5000/api/v1
```

> Note: The backend will throw an error on startup if any required variable is missing.

## Routes Overview

All auth endpoints are prefixed with `/api/v1/auth`:

- **POST** `/register`  
- **GET**  `/verify-email/:token`  
- **POST** `/login`  
- **POST** `/refresh-access-token`  
- **POST** `/logout`  

---

## 1. Register

Create a new user. A verification email is sent to `email`.

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "Str0ngP@ssw0rd!"
  }'
```

Response:
```json
{
  "message": "Registration successful. Please verify your email."
}
```

Rate-limited to 3 requests per 15 minutes per IP.

## 2. Verify Email

When the user clicks the link in the verification email:

```http
GET http://localhost:5000/api/v1/auth/verify-email/<jwt_token>
```

Response:
```json
{ "message": "Email verified successfully" }
```

After verification, `isEmailVerified` is set to `true` in the database.

## 3. Login

Authenticate credentials and receive an access token and HTTP-only refresh cookie.

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "Str0ngP@ssw0rd!"
  }' \
  -c cookies.txt
```

Response headers will include:

- `Set-Cookie: refreshToken=<token>; HttpOnly; Secure`
- CORS and security headers

Body:
```json
{ "accessToken": "<jwt_access_token>" }
```

Rate-limited to 5 requests per 15 minutes per IP.

## 4. Refresh Access Token

When your access token expires, use the refresh token cookie to obtain a new one.

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh-access-token \
  -b cookies.txt
```

Response:
```json
{ "accessToken": "<new_jwt_access_token>" }
```

## 5. Logout

Invalidate the refresh token and clear the cookie:

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -b cookies.txt
```

Response:
```json
{ "message": "Logged out successfully" }
```

---

## 6. Protecting Routes

Use the `verifyAccessToken` middleware on any route that requires authentication.

```ts
import { verifyAccessToken } from "middleware/auth";

router.use("/wallet", verifyAccessToken, walletRouter);
```

Requests must include:

```
Authorization: Bearer <jwt_access_token>
```

If missing or invalid, the API returns `401 Unauthorized` or `403 Forbidden`.

---

## 7. Client Integration (Axios)

Below is an example of how the React client handles access tokens, refresh flow, and automatic retries:

```ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, // send cookies
});

// Attach access token to all requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401/403, refresh and retry
API.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (!originalRequest._retry && [401,403].includes(err.response.status)) {
      originalRequest._retry = true;
      const { data } = await axios.post(
        `${API.defaults.baseURL}/auth/refresh-access-token`,
        {},
        { withCredentials: true }
      );
      localStorage.setItem("token", data.accessToken);
      API.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      return API(originalRequest);
    }
    return Promise.reject(err);
  }
);

export default API;
```

---

## 8. Rate Limiting

To prevent brute-force attacks:

- **Login**: max 5 requests per 15 minutes per IP  
- **Register**: max 3 requests per 15 minutes per IP  

Configured via `express-rate-limit` in `backend/src/middleware/rate-limiter.ts`.

---

For more details, see:

- [Auth Controller][auth-controller]
- [Token Service][token-service]
- [JWT Documentation](https://jwt.io)
- [Zod Validation](https://github.com/colinhacks/zod)

[auth-controller]: https://github.com/NicoooM/hetic-crypto-api/blob/main/backend/src/controllers/auth.controller.ts
[token-service]: https://github.com/NicoooM/hetic-crypto-api/blob/main/backend/src/services/token.service.ts