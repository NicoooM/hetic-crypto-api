# Frontend API Service

The `API` service is a preconfigured Axios instance handling:

- Base URL and credentials
- Automatic authorization header injection
- Access token refresh on 401/403 responses
- Request queuing during token refresh

---

## 1. Installation & Setup

1. Install Axios (if not already):
   ```bash
   npm install axios
   ```
2. Ensure you have a `.env` entry:
   ```bash
   REACT_APP_API_BASE_URL=https://your-api-domain.com/api/v1
   ```

---

## 2. Configuration

File: `client/src/services/api.ts`

```ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // include HTTP-only cookies for refresh tokens
});

// Token storage helper
const TokenService = {
  getToken:    () => localStorage.getItem("token"),
  setToken:    (token: string) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
};
```

---

## 3. Request Interceptor

Automatically attaches the `Authorization` header if an access token exists:

```ts
API.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## 4. Response Interceptor & Token Refresh

On `401` or `403`, the client attempts an access token refresh:

1. Prevents duplicate refresh calls.
2. Queues pending requests until a new token is issued.
3. Stores the new token in `localStorage`.
4. Retries the original requests with the fresh token.
5. On refresh failure, clears the token and redirects to `/login` after a delay.

```ts
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      // ...token refresh logic...
    }
    return Promise.reject(error);
  }
);
```

---

## 5. Usage Examples

Import the service and call it like any Axios client:

```ts
import API from "services/api";

// GET request
API.get("/users/me")
  .then(({ data }) => console.log("User profile:", data))
  .catch((err) => console.error(err));

// POST request with JSON body
API.post("/transactions", { amount: 100, currency: "USD" })
  .then(({ data }) => console.log("Transaction created:", data));

// DELETE request
API.delete("/sessions/logout")
  .then(() => console.log("Logged out successfully"));
```

---

## 6. Custom Requests

Override headers or config per request:

```ts
API.post(
  "/uploads",
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
)
.then(({ data }) => console.log("Uploaded file:", data));
```

---

## 7. Further Reading

- Axios docs: https://github.com/axios/axios  
- Handling tokens with Axios interceptors:  
  https://axios-http.com/docs/interceptorsありがとう