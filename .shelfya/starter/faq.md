# FAQ

This FAQ covers common questions about environment setup, authentication flow, rate limiting, and client-side API usage.

## What environment variables are required?

In `backend/src/constants.ts`, the `REQUIRED_ENV_VARS` array lists all env-vars your app expects:

- JWT_ACCESS_SECRET  
- JWT_REFRESH_SECRET  
- JWT_ACCESS_TOKEN_EXPIRATION_TIME  
- JWT_REFRESH_TOKEN_EXPIRATION_TIME  
- SMTP_HOST  
- SMTP_PORT  
- SMTP_USER  
- SMTP_PASS  
- API_URL  
- CRYPTOCOMPARE_API_KEY  
- ETHERSCAN_API_KEY  
- CLIENT_URL  
- DATABASE_URL  
- POSTGRES_USER  
- POSTGRES_PASSWORD  
- POSTGRES_DB  
- PORT  

Example `.env` snippet:

```ini
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000      # in ms (e.g. 15 minutes)
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000  # 7 days in ms
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
API_URL=http://localhost:5000/api/v1
CRYPTOCOMPARE_API_KEY=your_crypto_api_key
ETHERSCAN_API_KEY=your_etherscan_key
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgres://user:pass@localhost:5432/db
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=db
PORT=5000
```

## How long are JWT tokens valid?

- Access tokens: Controlled by `JWT_ACCESS_TOKEN_EXPIRATION_TIME` (set via env, e.g., 15 minutes).  
- Refresh tokens: Default 7 days (`7 * 24 * 60 * 60 * 1000` ms).

## How does automatic token refreshing work on the client?

The client uses an Axios instance (`client/src/services/api.ts`) configured with:

- `withCredentials: true` to send cookies (refresh token is stored in an HTTP-only cookie).  
- A response interceptor that catches `401` / `403` errors:

  1. If no other refresh is in progress, it sends `POST /auth/refresh` with cookies.
  2. On success, it receives a new `{ accessToken }`, stores it in `localStorage`, and retries the original request.
  3. If refreshing fails, it clears the token, waits ~25 seconds, then redirects to `/login`.

Example usage:

```ts
import API from "./services/api";

// Any call will automatically attach Authorization header:
API.get("/users/me")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

## How are tokens stored on the client?

A simple `TokenService` in `api.ts`:

```ts
const TokenService = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token: string) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
};
```

- **Access token**: Stored in `localStorage` under `token`.  
- **Refresh token**: Sent/received as an HTTP-only cookie (`withCredentials`).

## What are the security parameters?

- Bcrypt salt rounds: `10` (defined by `BCRYPT_SALT_ROUNDS`).  
- Rate limiting (per IP):

  - Login: max `5` requests per 15 minutes.  
  - Register: max `3` requests per 15 minutes.  
  - Window: `AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000` ms.

## Where can I learn more about the crypto data APIs?

- CryptoCompare API: https://min-api.cryptocompare.com/documentation  
- Etherscan API: https://docs.etherscan.io/  

Make sure to set `CRYPTOCOMPARE_API_KEY` and `ETHERSCAN_API_KEY` in your env configuration.