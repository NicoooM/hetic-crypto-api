# HETIC Crypto API

This document walks you through setting up and running the HETIC Crypto API – an Express-based back end with JWT authentication and a React client using Axios for API requests and automatic token refresh.

## Prerequisites

- Node.js ≥ 14  
- Yarn or npm  
- PostgreSQL database  
- An SMTP account (for email features)  

## Environment Variables

Create a `.env` file in both `backend/` and `client/` (for CRA) folders. Populate the following variables:

### Backend (`backend/.env`)
```
PORT=5000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgres://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>

JWT_ACCESS_SECRET=<your_access_jwt_secret>
JWT_REFRESH_SECRET=<your_refresh_jwt_secret>
JWT_ACCESS_TOKEN_EXPIRATION_TIME=<ms>
JWT_REFRESH_TOKEN_EXPIRATION_TIME=<ms>

SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_user>
SMTP_PASS=<smtp_pass>

CRYPTOCOMPARE_API_KEY=<your_cryptocompare_key>
ETHERSCAN_API_KEY=<your_etherscan_key>
```

### Client (`client/.env`)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

## Install & Run

### Backend

```bash
cd backend
yarn install       # or npm install
yarn build         # compile TypeScript
yarn start         # or nodemon src/index.ts
```

The server will:
- Listen on `process.env.PORT`
- Expose all routes under `/api/v1`
- Enforce CORS (origins from CLIENT_URL)
- Parse JSON, cookies, IP addresses and set security headers via Helmet

### Client

```bash
cd client
yarn install       # or npm install
yarn start         # runs React on http://localhost:3000
```

The client ships a pre-configured Axios instance (`src/services/api.ts`) that:
- Uses `REACT_APP_API_BASE_URL` (default `http://localhost:5000/api/v1`)
- Attaches `Authorization: Bearer <token>` if a token exists in `localStorage`
- Automatically attempts `/auth/refresh` on 401/403 and retries original requests
- Redirects to `/login` on failed refresh

## Usage Examples

### Backend Fetch (Express Route)

```ts
import express from "express";
const router = express.Router();

router.get("/coins", async (_req, res) => {
  // Call external APIs, query your DB, etc.
  res.json({ coins: ["BTC", "ETH", "LTC"] });
});

export { router };
```

### Frontend Call

```ts
import API from "./services/api";

async function loadCoins() {
  try {
    const { data } = await API.get<{ coins: string[] }>("/coins");
    console.log("Available coins:", data.coins);
  } catch (err) {
    console.error("Failed to load coins", err);
  }
}
```

## Token Handling

1. On login/registration, the backend issues:
   - An **access token** in the response body
   - A **refresh token** in a secure, HTTP-only cookie
2. Axios interceptors:
   - Attach the access token to each request
   - On 401/403, call `/auth/refresh` (cookies handle the refresh token)
   - Retry the original request with the new access token
   - On refresh failure, clear storage and redirect to `/login`

## Links & Resources

- Express: https://expressjs.com  
- Axios: https://axios-http.com  
- JWT Best Practices: https://jwt.io  
- Helmet Docs: https://helmetjs.github.io  
- CORS npm: https://www.npmjs.com/package/cors