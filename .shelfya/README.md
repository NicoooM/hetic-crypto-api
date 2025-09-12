# Shelfya Crypto API Documentation

This document guides you through installing, configuring, and using the HETIC Crypto API (backend) and its accompanying client service. You’ll see how to start the server, explore available routes, and integrate with the preconfigured Axios client in your frontend.

## 1. Installation

Clone the repository and install dependencies for both backend and client:

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api

# Install backend deps
cd backend
npm install

# Install client deps
cd ../client
npm install
```

## 2. Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in `backend/` with at least:

- `PORT` — port number (e.g. `5000`)
- `CLIENT_URL` — frontend origin (e.g. `http://localhost:3000`)
- JWT secrets and database URI for your setup (used by `verifyEnv`)

### Client (`client/.env`)
Create a `.env` file in `client/` with:

- `REACT_APP_API_BASE_URL` — base API URL (defaults to `http://localhost:5000/api/v1`)

## 3. Running the App

Start the backend server:

```bash
cd backend
npm run dev    # or npm start
```

Start the React client:

```bash
cd client
npm start
```

> The backend listens on `PORT` and mounts all routes under `/api/v1`.

## 4. API Routes Overview

Base URL:  
`http://<HOST>:<PORT>/api/v1`

### Public Routes

- `POST /auth/register`  
- `POST /auth/login`  
- `POST /auth/refresh`  
  • Uses HTTP‐only cookies to refresh access tokens; no request body needed.

### Protected Routes

All the following require a valid **Bearer** `Authorization` header.

- Wallet  
  • `GET /wallet` — fetch balances  
  • `POST /wallet/deposit` — add funds  

- History  
  • `GET /history` — fetch transaction history  

- Portfolio  
  • `GET /portfolio` — fetch portfolio breakdown  

- Profile  
  • `GET /profile/me` — fetch user profile  
  • `PATCH /profile` — update user data  

> Routes under `/wallet`, `/history`, and `/profile` use `verifyAccessToken` middleware.

## 5. Client Service (`client/src/services/api.ts`)

The client exposes a ready‐to‐use Axios instance that handles:

- Base URL from `REACT_APP_API_BASE_URL`
- `withCredentials: true` to include HTTP-only cookies
- Automatic `Authorization: Bearer <token>` header from `localStorage`
- Silent token refresh on 401/403 via `/auth/refresh`
- Queued requests during refresh; redirect to `/login` on failure

### Basic Usage

```ts
import API from './services/api';

// Fetch wallet balances
async function loadWallet() {
  const { data } = await API.get('/wallet');
  return data;
}

// Trigger a protected route
API.get('/profile/me')
   .then(res => console.log(res.data))
   .catch(err => console.error(err));
```

### Token Management

The Axios instance will:

1. Read `localStorage.getItem('token')` and attach it to headers.
2. On 401/403, call `/auth/refresh` (cookies handle the refresh token).
3. Update `localStorage` with the new `accessToken`.
4. Retry any failed requests automatically.
5. If refresh fails, clear the token and redirect to `/login` after a delay.

---

Happy coding! If you run into issues, ensure your environment variables match and ports don’t conflict.