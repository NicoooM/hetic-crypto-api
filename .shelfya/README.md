# Shelfya Configuration & Project Setup

This directory contains configuration and documentation for running the HETIC Crypto API project under the Shelfya environment. It covers backend and frontend setup, environment variables, and key behaviors (CORS, security headers, token refresh).

## Prerequisites

- Node.js ≥ 14
- npm or yarn
- Optional: `dotenv` for local `.env` support

## Environment Variables

Create a `.env` file in your project root:

```
# Backend
PORT=5000
CLIENT_URL=http://localhost:3000

# Frontend (create a .env in client/)
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

## Starting the Backend

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Run in development mode:

   ```bash
   npm run dev
   ```

3. The Express server will:

   - Listen on `process.env.PORT` (default 5000)
   - Mount all routes under `/api/v1`
   - Use Helmet, CORS, cookie-parser, and request-ip middleware
   - Verify required environment variables on startup

## Starting the Frontend

1. Install dependencies:

   ```bash
   cd client
   npm install
   ```

2. Run the React app:

   ```bash
   npm start
   ```

3. Axios is pre-configured in `src/services/api.ts` to:

   - Point at `REACT_APP_API_BASE_URL` (`http://localhost:5000/api/v1`)
   - Include cookies (`withCredentials: true`)
   - Attach `Authorization: Bearer <token>` header on each request
   - Auto-refresh access tokens on 401/403 responses

## API Endpoint Structure

All endpoints are prefixed with `/api/v1`. For example:

- Authentication
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh` (handled automatically by the client)
  - `POST /api/v1/auth/logout`
- Crypto data (example)
  - `GET /api/v1/coins`
  - `GET /api/v1/coins/:id`

> Check `backend/src/routes` for a full list of available routes.

## Token Refresh Flow

1. Upon 401/403, the client interceptor:
   - Marks the original request _retry
   - Sends a `POST /auth/refresh` (cookies carry the refresh token)
2. On success:
   - Stores new `accessToken` in `localStorage`
   - Retries all failed requests with the new token
3. On failure:
   - Clears stored token
   - Waits ~25 seconds, then redirects to `/login`

## Useful Commands

```bash
# From project root
npm run dev:backend   # starts Express + auto-reload
npm run dev:frontend  # starts React dev server

npm test              # runs any unit/integration tests
```

## Troubleshooting

- CORS errors? Ensure `CLIENT_URL` matches your React `localhost` port.
- Token not stored? Check browser’s localStorage under key `token`.
- Env vars not loaded? Install `dotenv` or set them in your shell before starting.

---

For detailed route definitions and service examples, browse:

- `backend/src/routes`
- `client/src/services/api.ts`