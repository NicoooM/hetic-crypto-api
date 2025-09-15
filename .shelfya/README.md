# ShelfYa API

This document provides a quick overview of ShelfYa’s backend API, built with Express and TypeScript. You'll find instructions for setup, middleware details, and the primary route structure.

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/NicoooM/hetic-crypto-api.git
   cd hetic-crypto-api/backend
   npm install
   ```
2. Create a `.env` file in `backend/` and define at least:
   - `PORT` — port to run the server (e.g. `4000`)
   - `CLIENT_URL` — allowed client origin for CORS (e.g. `http://localhost:3000`)
   - Any other variables your `verifyEnv()` utility requires (JWT secrets, database URLs, etc.).
3. Run in development:
   ```bash
   npm run dev
   ```
4. Build and start in production:
   ```bash
   npm run build
   npm start
   ```
5. The server listens on `http://localhost:<PORT>/api/v1`.

## Middleware Stack

All routes are mounted under `/api/v1` and pass through:

- `cookie-parser` — parse HTTP cookies
- `cors` — with `origin` set to `CLIENT_URL` and credentials enabled
- `helmet` — security headers
- `express.json()` — JSON body parsing
- `request-ip` — attach client IP to `req.clientIp`

An environment check (`verifyEnv()`) runs on startup to ensure required variables are present.

## Route Structure

All endpoints use the base path `/api/v1`.

  • `/auth` (public)  
      – Handles registration, login, logout, token refresh, etc.

  • `/wallet` (protected)  
      – Requires a valid access token. Manages user wallets, balances, and transactions.

  • `/history` (protected)  
      – Requires a valid access token. Retrieves transaction history.

  • `/portfolio` (public)  
      – Fetches market data or aggregated portfolio info.

  • `/profile` (protected)  
      – Requires a valid access token. Manages user profile details.

### Sample Requests

#### Login
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}' \
  -c cookies.txt
```

#### Fetch Wallets (Protected)
```bash
curl http://localhost:4000/api/v1/wallet \
  -b cookies.txt
```

#### Get Portfolio (Public)
```bash
curl http://localhost:4000/api/v1/portfolio
```

## Next Steps

- Explore each router in `backend/src/routes/` for detailed endpoint definitions.
- Implement or extend middleware in `backend/src/middleware/`.
- Integrate with your frontend by pointing API calls to `CLIENT_URL`.

For deeper dives into error handling, data models, and business logic, consult the code under `backend/src/`.