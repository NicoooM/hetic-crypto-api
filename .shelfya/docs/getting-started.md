# Getting Started

This guide walks you through setting up and running the crypto API backend and React client. You’ll also see how the shared `API` service handles authentication, token storage, and automatic token refreshing.

## Prerequisites

- Node.js ≥ 14
- npm or Yarn
- Git

## Repository Structure

```
.
├── backend/           # Express API server
│   └── src/index.ts
└── client/            # React frontend
    └── src/services/api.ts
```

## 1. Clone & Install

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api

# Backend deps
cd backend
npm install
# or
# yarn install

# Client deps
cd ../client
npm install
# or
# yarn install
```

## 2. Environment Variables

Create a `.env` file in each folder:

### Backend (`backend/.env`)

```
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Client (`client/.env`)

```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

> The client’s `REACT_APP_API_BASE_URL` points at the backend route `/api/v1`.

## 3. Running the Backend

```bash
cd backend
npm run dev
```

- The Express server listens on `http://localhost:5000`.
- API routes are mounted under `/api/v1`.

Key middleware in `src/index.ts`:

- `cors` (allows requests from `CLIENT_URL` with credentials)
- `cookie-parser` (parses HTTP cookies)
- `helmet` (security headers)
- `request-ip` (logs client IP)

Example start-up log:

```
Verifying environment variables…
Listening on port 5000...
```

## 4. Running the Client

```bash
cd client
npm start
```

- React app runs on `http://localhost:3000`.
- All API calls go to `http://localhost:5000/api/v1` by default.

## 5. API Service Overview

The shared Axios instance at `client/src/services/api.ts` handles:

1. **Base URL**  
   ```ts
   baseURL: process.env.REACT_APP_API_BASE_URL
   ```

2. **Credentials**  
   ```ts
   withCredentials: true
   ```

3. **Request Interceptor**  
   Automatically attaches the Bearer access token from `localStorage`:
   ```ts
   API.interceptors.request.use(config => {
     const token = localStorage.getItem("token");
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

4. **Response Interceptor**  
   - Catches `401/403` errors  
   - Prevents multiple simultaneous refresh requests  
   - Calls `/auth/refresh` endpoint to get a new access token  
   - Retries the original request with updated token  
   - On refresh failure, clears token & redirects to `/login`

### Example Usage

```ts
import API from "services/api";

// Login
const login = async (email: string, password: string) => {
  const { data } = await API.post("/auth/login", { email, password });
  // { accessToken, user }
  localStorage.setItem("token", data.accessToken);
  return data.user;
};

// Fetch user profile
const fetchProfile = async () => {
  const { data } = await API.get("/users/me");
  return data;
};
```

## 6. Testing Authentication Flow

1. **Login**  
   ```bash
   POST http://localhost:5000/api/v1/auth/login
   {
     "email": "you@example.com",
     "password": "secret"
   }
   ```
   - Returns `{ accessToken }`
   - Sets refresh token in an HTTP-only cookie.

2. **Auto-Refresh**  
   - When the access token expires, the client interceptor calls:
     ```
     POST http://localhost:5000/api/v1/auth/refresh
     ```
   - Server reads refresh token from cookie and issues a new access token.

3. **Logout**  
   ```bash
   POST http://localhost:5000/api/v1/auth/logout
   ```
   - Clears the refresh token cookie on the server.

---

You’re now ready to develop and extend the crypto API and React client! For details on available routes, see the `/routes` module in the backend.