# API Overview

This document provides a high-level overview of the Crypto API, its available endpoints, authentication flow, and how the client interacts with it using the `API` service.

## Base URL & Environment

By default, all endpoints are prefixed with:
```
http://localhost:5000/api/v1
```
You can override this in the client by setting the environment variable:
```bash
REACT_APP_API_BASE_URL=https://your.api.domain/api/v1
```

## Authentication Flow

1. **Login / Register**  
   Public endpoints under `/auth` allow users to:
   - Login (`POST /auth/login`)
   - Register (`POST /auth/register`)
2. **Access Token**  
   On successful auth, the server issues an `accessToken` (in the response) and a `refreshToken` (as an HTTP-only cookie).
3. **Token Refresh**  
   When an `accessToken` expires, the client:
   - Detects a `401` or `403` response.
   - Calls `POST /auth/refresh` (no payload; cookie-driven).
   - Updates the `accessToken` and retries the failed request.
4. **Logout**  
   Simply remove the stored token:
   ```ts
   TokenService.removeToken();
   window.location.href = "/login";
   ```

## Available Routes

All routes live under `/api/v1` and are grouped as follows:

- `/auth` (public)
  - Login, register, refresh
- `/wallet` (authenticated)
  - Manage user wallets
- `/history` (authenticated)
  - Retrieve transaction history
- `/portfolio` (public)
  - View market portfolio data
- `/profile` (authenticated)
  - User profile operations

> Note: Routes marked "authenticated" require a valid `Authorization: Bearer <token>` header.

## Client API Service

The client uses a single Axios instance with built-in token handling:

```ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // for refresh token cookie
});
```

### Request Interceptor

Automatically attaches the stored access token:
```ts
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles `401/403` errors by:
1. Pausing outgoing requests.
2. Refreshing the token via `/auth/refresh`.
3. Retrying the failed requests with the new token.
4. Redirecting to login if refresh fails.

## Usage Examples

```ts
import API from "./services/api";

// Login
const login = async (email: string, password: string) => {
  const { data } = await API.post("/auth/login", { email, password });
  localStorage.setItem("token", data.accessToken);
};

// Fetch Wallets
const fetchWallets = async () => {
  const { data } = await API.get("/wallet");
  return data;
};

// Get Profile
const fetchProfile = async () => {
  const { data } = await API.get("/profile");
  return data;
};

// Handle Errors
fetchWallets().catch(err => {
  console.error("Failed to fetch wallets:", err.response?.data || err.message);
});
```

For detailed request and response schemas, refer to the individual route documentation under `/backend/src/routes`.