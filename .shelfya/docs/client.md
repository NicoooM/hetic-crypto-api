# Client API Service

This module exports a pre-configured Axios instance (`API`) that your React application can use to communicate with the backend. It handles:

- Base URL configuration via environment variables  
- Automatic `Authorization` header injection from `localStorage`  
- Cookie-based refresh-token flow on `401`/`403` responses  
- Token storage and removal  

## Table of Contents

- [Installation & Configuration](#installation--configuration)  
- [TokenService](#tokenservice)  
- [API Instance & Interceptors](#api-instance--interceptors)  
- [Usage Examples](#usage-examples)  

---

## Installation & Configuration

1. Install dependencies (if not already):

   ```bash
   npm install axios
   # or
   yarn add axios
   ```

2. Create a `.env` file at the project root:

   ```bash
   REACT_APP_API_BASE_URL=https://your-api.com/api/v1
   ```

   If `REACT_APP_API_BASE_URL` is not set, the client defaults to `http://localhost:5000/api/v1`.

3. Ensure your backend sets a `refreshToken` cookie on login, and that it is valid for cross-site requests.

---

## TokenService

The `TokenService` helper manages the **access token** in `localStorage`:

```ts
const TokenService = {
  getToken:    () => localStorage.getItem("token"),
  setToken:    (token: string) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
};
```

- Use `TokenService.setToken(...)` to save a new JWT after login
- `TokenService.getToken()` is invoked automatically before each request
- On irrecoverable refresh failures, `TokenService.removeToken()` clears the token

---

## API Instance & Interceptors

```ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // Sends cookies (for refreshToken)
});
```

### Request Interceptor

Before every request, the interceptor:

- Reads `token` from `localStorage`
- If present, sets `Authorization: Bearer <token>`

### Response Interceptor

On `401` or `403` responses:

1. Attempts to call `POST /auth/refresh` (cookies auto-included)
2. Saves the new `accessToken` to `localStorage`
3. Replays all queued requests with the new token
4. If refresh fails:
   - Clears the token
   - Waits 25 s, then redirects the user to `/login`

---

## Usage Examples

### Login Flow

```ts
import API from "./services/api";
import TokenService from "./services/api"; // destructure if exported

async function login(email: string, password: string) {
  const { data } = await API.post("/auth/login", { email, password });
  TokenService.setToken(data.accessToken);
  // Subsequent API calls will include the token automatically
}
```

### Fetching Protected Data

```ts
import API from "./services/api";

async function fetchUserProfile() {
  const response = await API.get("/user/profile");
  return response.data;
}

// In a React component
useEffect(() => {
  fetchUserProfile()
    .then(profile => setProfile(profile))
    .catch(err => console.error("Failed to load profile", err));
}, []);
```

### Handling Logging Out

```ts
import API from "./services/api";
import TokenService from "./services/api";

async function logout() {
  await API.post("/auth/logout");
  TokenService.removeToken();
  window.location.href = "/login";
}
```

---

For more on Axios configuration and interceptors, see the official guide:  
https://axios-http.com/docs/req_config and https://axios-http.com/docs/interceptors.