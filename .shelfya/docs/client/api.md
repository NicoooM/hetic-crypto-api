# API Service

This document describes how to use the shared Axios instance in `client/src/services/api.ts`. It handles:

- Base URL configuration  
- Automatic inclusion of the access token  
- Token refreshing on 401/403 responses  
- Queueing and retrying in-flight requests during refresh  

---

## Configuration

### Base URL

By default, the service points to `http://localhost:5000/api/v1`. You can override it via an environment variable:

```bash
# .env
REACT_APP_API_BASE_URL=https://your.api.server/api/v1
```

### Cookies & CORS

The client sends cookies on every request (used for the `refreshToken` flow). Ensure your backend:

- Sets the proper CORS headers (e.g. `Access-Control-Allow-Credentials: true`)
- Issues an HTTP-only `refreshToken` cookie  

---

## TokenService Helpers

The `TokenService` manages the JWT in `localStorage`:

```ts
TokenService.getToken()    // ⇒ string | null
TokenService.setToken(token: string)
TokenService.removeToken()
```

---

## How It Works

1. **Request Interceptor**  
   Attaches `Authorization: Bearer <token>` if a token exists.

2. **Response Interceptor**  
   On 401 or 403:
   - Marks the original request with `_retry` to avoid loops.
   - If a refresh is already in progress, subsequent requests wait until it completes.
   - Otherwise, it calls `POST /auth/refresh` (using cookies) to get a new `accessToken`.
   - Saves the new token, updates headers, and retries the original request.
   - If refresh fails, clears the token and redirects to `/login` after ~25 seconds.

---

## Usage Examples

### Importing the API Instance

```ts
// Any React component or service file
import API from "@/services/api";
```

### Simple GET Request

```ts
// Fetch user profile
async function fetchProfile() {
  try {
    const response = await API.get("/users/me");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    throw err;
  }
}
```

### POST with Body

```ts
interface NewOrder { productId: string; quantity: number; }

async function createOrder(order: NewOrder) {
  const { data } = await API.post("/orders", order);
  return data;
}
```

### Handling Errors

```ts
try {
  await API.delete("/accounts/123");
} catch (err: any) {
  if (err.response?.status === 404) {
    console.log("Account not found");
  } else {
    console.error("Unknown API error:", err);
  }
}
```

---

## Troubleshooting

- **No token in localStorage?**  
  Ensure users log in via your authentication flow and that you call `TokenService.setToken(...)` on success.

- **CORS issues?**  
  Verify your backend allows credentials and that the front-end's `baseURL` matches the allowed origin.

- **Automatic redirect to `/login`**  
  If the refresh endpoint fails repeatedly, the app will remove the token and navigate to `/login` after a brief pause.

---

For more Axios configuration options, see the official guide:  
https://axios-http.com/docs/req_config