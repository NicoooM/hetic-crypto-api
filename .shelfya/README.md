# HETIC Crypto API

This document covers how to set up, run, and interact with the HETIC Crypto API backend and the companion React client. You’ll learn how to configure environment variables, start each service, and make authenticated requests with automatic token refresh.

## Prerequisites

- Node.js v14+ and npm (or Yarn)
- Git
- A modern browser (for the React client)

## Repository Structure

```
.
├── backend/            # Express API server
│   └── src/
│       └── index.ts    # App entrypoint
├── client/             # React SPA
│   └── src/
│       └── services/
│           └── api.ts  # Axios instance with auth interceptors
└── .shelfya/
    └── README.md       # (This document)
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

### 2. Setup Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file at `backend/`:
   ```
   PORT=5000
   CLIENT_URL=http://localhost:3000
   # ...add other secrets like DB connection strings, JWT secrets, etc.
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   The API will listen on `http://localhost:5000/api/v1`.

### 3. Setup Client

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Create a `.env` file at `client/`:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
   ```
3. Start the React app:
   ```bash
   npm start
   ```
   The SPA runs on `http://localhost:3000`.

---

## API Client (Axios) Overview

The React client uses an Axios instance (`client/src/services/api.ts`) configured to:

- Send credentials (cookies) on every request (`withCredentials: true`).
- Automatically attach the `Authorization: Bearer <accessToken>` header.
- Intercept `401/403` responses to trigger a token refresh flow.

### Token Refresh Flow

1. When a request returns `401` or `403`, the interceptor checks if a refresh is already in progress.
2. If not, it calls:
   ```
   POST /auth/refresh
   ```
   sending the stored refresh token in an HTTP‐only cookie.
3. On success, it:
   - Stores the new access token in `localStorage`.
   - Updates the default header for future requests.
   - Replays any failed requests with the new token.
4. On failure, it clears local tokens and redirects to `/login` after a short delay.

---

## Example Requests

### 1. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourPassword"}' \
  --include
```

- On success, you receive:
  - `accessToken` in JSON response.
  - `refreshToken` in an HTTP-only cookie.

### 2. Accessing a Protected Route

```bash
curl http://localhost:5000/api/v1/protected/resource \
  -H "Authorization: Bearer <yourAccessToken>" \
  --include
```

If your access token expired, the client will automatically:

1. Call `/auth/refresh` with the refresh cookie.
2. Retry the original request.

---

## Environment Variables

Backend `.env`:
- `PORT` — port the Express server listens on (default: 5000)
- `CLIENT_URL` — allowed CORS origin (default: http://localhost:3000)
- Plus any other secrets (database URL, JWT secrets, etc.)

Client `.env`:
- `REACT_APP_API_BASE_URL` — full base URL to the API (default: http://localhost:5000/api/v1)

---

## Troubleshooting

- Ensure cookies are enabled in your browser.
- Check console logs for "API error:" or "Token refresh failed:" messages.
- Verify your `.env` values match the running services’ URLs.

---

For any further details on endpoints and business logic, refer to the source code under `backend/src/routes` and the React pages/components in `client/src`.