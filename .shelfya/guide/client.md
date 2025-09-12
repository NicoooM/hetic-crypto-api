# Client API Guide

This guide explains how to use the client-side API service (`client/src/services/api.ts`) in your React application. It covers setup, authentication, automatic token refresh, and usage examples.

## Overview

The `API` object is an Axios instance configured to:

- Use a base URL (`REACT_APP_API_BASE_URL` or `http://localhost:5000/api/v1`)
- Include cookies (`withCredentials: true`)
- Attach the Bearer access token automatically to outgoing requests
- Handle 401/403 responses by refreshing the access token and retrying failed requests

## Setup

1. Install dependencies (if you haven’t already):

   ```bash
   npm install axios
   # or
   yarn add axios
   ```

2. Define the API base URL in your `.env`:

   ```
   REACT_APP_API_BASE_URL=https://api.yourdomain.com/api/v1
   ```

3. Place `client/src/services/api.ts` in your project and import `API` where needed.

## Token Management

Tokens are stored in `localStorage` via the `TokenService`:

```ts
const TokenService = {
  getToken:    () => localStorage.getItem("token"),
  setToken:    (token: string) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
};
```

- After a successful login, call `TokenService.setToken(accessToken)` to store the JWT.
- To log out, call `TokenService.removeToken()` and redirect to your login page.

## Automatic Token Refresh

When a request fails with status `401` or `403`, the interceptor will:

1. Pause outgoing requests until the refresh flow completes.
2. Send a `POST` to `/auth/refresh` with credentials (cookies).
3. Update the stored token and retry the original request.
4. If refresh fails, clear the token and redirect to `/login` after a short delay.

This behavior is fully handled inside `api.ts`. You don’t need to write custom retry logic.

## Using the API Instance

Import and use `API` just like Axios:

```ts
import API from "../services/api";

// GET request
const fetchProfile = async () => {
  const response = await API.get("/users/me");
  return response.data;
};

// POST request
const createOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};
```

### Example: Login Flow

```ts
import API from "../services/api";
import { TokenService } from "../services/api";

interface LoginResponse {
  accessToken: string;
}

const login = async (email: string, password: string) => {
  const { data } = await API.post<LoginResponse>("/auth/login", { email, password });
  
  // Store JWT
  TokenService.setToken(data.accessToken);

  // Redirect or update UI
  window.location.href = "/dashboard";
};
```

### Example: Logout Flow

```ts
import { TokenService } from "../services/api";

const logout = () => {
  TokenService.removeToken();
  window.location.href = "/login";
};
```

## Error Handling

All errors bubble up as rejected Promises. Use `try/catch` or `.catch()` to handle them:

```ts
try {
  const data = await API.get("/protected/resource");
  // handle data
} catch (error: any) {
  console.error("Request failed:", error.response?.data || error.message);
}
```

## Next Steps

- Explore backend endpoints under `/auth`, `/users`, `/orders`, etc.
- Add custom request/response interceptors if you need logging or performance metrics.
- Securely handle refresh tokens on the server side (HTTP-only cookies).