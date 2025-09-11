# FAQ

## What environment variables do I need to set?
The backend requires the following variables (see `backend/src/constants.ts`):

```env
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m         # e.g. "15m"
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d         # e.g. "7d"
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
API_URL=http://localhost:5000
CRYPTOCOMPARE_API_KEY=your_crypto_compare_key
ETHERSCAN_API_KEY=your_etherscan_key
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgres://user:pass@localhost:5432/db
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=db
PORT=5000
```

## How do I start the backend?
1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file with the required variables.

3. Run the server:

   ```bash
   npm run dev
   ```

The server will validate your env vars on startup (`verifyEnv()`) and listen on `PORT`.

## How does authentication work?
- **Login**:  
  `POST /api/v1/auth/login` with `{ email, password }`.  
  Returns an `accessToken` in JSON and sets an HTTP-only `refreshToken` cookie.
- **Protected routes** use `Authorization: Bearer <accessToken>`.
- **Logout**:  
  `POST /api/v1/auth/logout` clears the cookie and invalidates the token server-side.

## How do I refresh my access token?
When your access token expires (401/403 errors), call:

```http
POST /api/v1/auth/refresh-access-token
Cookie: refreshToken=<your_refresh_token>
```

The server will:
1. Validate & hash the cookie value.
2. Check it against the DB.
3. Return a new `{ accessToken }` and continue.

## How do I protect my routes?
Use the `verifyAccessToken` middleware in express. It reads:

```js
const authHeader = req.headers.authorization;
const token = authHeader.split(" ")[1];
const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
req.user = decoded; // { id, email }
```

Applied automatically in `backend/src/routes/index.ts` for `/wallet`, `/history`, and `/profile`.

## What rate limits do you enforce?
Configured in `backend/src/middleware/rate-limiter.ts`:

- **Login**: max 5 requests per 15 minutes
- **Register**: max 3 requests per 15 minutes

Clients receive HTTP 429 with a `Too many requests` message if exceeded.

## How do I manage wallets?
All wallet endpoints require a valid access token.

1. **Create a wallet**  
   `POST /api/v1/wallet`  
   Body:  
   ```json
   { "address": "0x...", "title": "My ETH Wallet" }
   ```
2. **List wallets**  
   `GET /api/v1/wallet`
3. **Delete a wallet**  
   `DELETE /api/v1/wallet/:id`

Upon creation, the service fetches your on-chain history, enriches it with price data, and stores it in your DB.

## How do I fetch portfolio and history data?
- **Portfolio**:  
  `GET /api/v1/portfolio/:walletId`  
  Returns allocation, current price, daily price change, total value, and daily value.
- **History**:  
  `GET /api/v1/history/:walletId?startDate=2023-01-01`  
  Returns your stored wallet history since the optional `startDate`.

## How do I verify or update my profile?
- **Verify email** (after registration):  
  `GET /api/v1/auth/verify-email/:token`
- **Get profile**:  
  `GET /api/v1/profile`
- **Update name/email**:  
  `PATCH /api/v1/profile`  
  Body: `{ "name": "New Name", "email": "new@example.com" }`
- **Change password**:  
  `PATCH /api/v1/profile/password`  
  Body: `{ "oldPassword": "...", "newPassword": "..." }`

All profile routes require a valid `Authorization` header.

## Where can I see error responses?
- Validation errors return **400 Bad Request** with `{ message: ... }`.
- Auth failures return **401 Unauthorized** or **403 Forbidden**.
- Rate limits return **429 Too Many Requests**.
- Missing resources return **404 Not Found**.
- Server errors return **500 Internal Server Error** with `{ message: ... }`.