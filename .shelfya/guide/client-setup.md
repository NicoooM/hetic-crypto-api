# Client Setup Guide

This guide walks you through setting up the React client for the HETIC Crypto API, including environment variables, the centralized API service, token handling, and testing configuration.

## Prerequisites

- Node.js (>= 14.x)
- npm or Yarn
- A running instance of the Crypto API server

## 1. Install Dependencies

```bash
# Using npm
cd client
npm install

# Or with Yarn
cd client
yarn
```

## 2. Environment Variables

Create a `.env` file in the `client/` folder to override the default API base URL:

```bash
REACT_APP_API_BASE_URL=https://your-api-host.com/api/v1
```

By default, if this variable is missing, the client will fall back to `http://localhost:5000/api/v1`.

## 3. API Service (`client/src/services/api.ts`)

All HTTP requests use a shared Axios instance with:

- Base URL from `REACT_APP_API_BASE_URL`
- `withCredentials: true` to include cookies (for refresh tokens)
- Automatic `Authorization` header injection
- Token refresh logic on 401/403 responses

```typescript
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

// Simple token storage in localStorage
const TokenService = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token: string) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
};

// Request interceptor: add Bearer token if available
API.interceptors.request.use(config => {
  const token = TokenService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401/403 and refresh token
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
        API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        onRefreshed(accessToken);
        isRefreshing = false;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        TokenService.removeToken();
        isRefreshing = false;
        // wait before redirecting to login
        await new Promise(res => setTimeout(res, 25000));
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
```

### Usage Example

```typescript
import API from "./services/api";

async function fetchCoins() {
  const response = await API.get("/coins");
  return response.data;
}
```

## 4. Testing Setup (`client/src/setupTests.ts`)

We use React Testing Library with `jest-dom` matchers. This file is auto-loaded by Create React App pointing at:

```typescript
import "@testing-library/jest-dom";
```

Run your tests with:

```bash
npm test
# or
yarn test
```

## 5. Running the Client

Start the development server:

```bash
npm start
# or
yarn start
```

Your React app will be available at `http://localhost:3000` by default. Ensure your API server is running and `REACT_APP_API_BASE_URL` is correctly pointing to it.