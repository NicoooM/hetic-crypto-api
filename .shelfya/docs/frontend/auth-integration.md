# Authentication Integration

This guide explains how the frontend integrates with the backend’s authentication system using a preconfigured Axios instance. It covers environment setup, token storage, request/response interceptors, and automatic token refresh.

## 1. Setup

1. Install dependencies:
   ```bash
   npm install axios
   ```
2. Add your API base URL to `.env`:
   ```
   REACT_APP_API_BASE_URL=https://your-api.example.com/api/v1
   ```
   By default, the client falls back to `http://localhost:5000/api/v1`.

## 2. API Client

All HTTP calls go through a single Axios instance in `src/services/api.ts`:

```ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // sends cookies for refreshToken
});
export default API;
```

## 3. Token Storage

A simple `TokenService` handles access tokens in `localStorage`:

```ts
const TokenService = {
  getToken:    () => localStorage.getItem("token"),
  setToken:    (token: string) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
};
```

## 4. Request Interceptor

Before each request, the interceptor attaches the `Authorization` header if an access token exists:

```ts
API.interceptors.request.use(
  config => {
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
```

## 5. Response Interceptor & Token Refresh

On `401` or `403` responses, the client will:

1. Queue failed requests while refreshing.
2. Call `POST /auth/refresh` (cookies carry the `refreshToken`).
3. Update the access token and replay queued requests.
4. Redirect to `/login` if refresh fails.

```ts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the new token, then retry
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(API(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${API.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = data;
        TokenService.setToken(accessToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        onRefreshed(accessToken);
        isRefreshing = false;

        return API(originalRequest);
      } catch {
        TokenService.removeToken();
        isRefreshing = false;
        // delay before redirect
        await new Promise(res => setTimeout(res, 25000));
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
```

## 6. Usage Example

Import and use `API` in your components or services:

```ts
import API from "../services/api";

// Fetch user profile
API.get("/auth/profile")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

// Login
API.post("/auth/login", { email, password })
  .then(res => {
    const { accessToken } = res.data;
    TokenService.setToken(accessToken);
  });
```

That's it! Your frontend now automatically handles token injection, refresh, and fallback to login on expiry.