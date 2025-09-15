# Authentication Guide

This guide explains the authentication flow for the Hetic Crypto API, covering user registration, login, email verification, token handling, and logout procedures. It details both backend and frontend integration, ensuring secure access to protected resources.

---

## Overview

- **Authentication method:** JWT (JSON Web Tokens) with access and refresh tokens.
- **Security features:** HTTP-only cookies (for refresh token), password hashing, email verification, and protected endpoints.

---

## User Registration

Users must register with their email, name, and password. A verification email is sent, and the user must verify their email before logging in.

### Frontend Example (`client/src/pages/Register.tsx`)

```tsx
// form state: email, name, password, confirmPassword
await API.post("/auth/register", { email, password, name });
```

**Server endpoint:**

- **POST /auth/register**  
  **Body:** `{ name: string, email: string, password: string }`  
  **Response:**  
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```

---

## Email Verification

After registering, users receive an email with a verification link. Visiting the link verifies their email.

### Frontend Example (`client/src/pages/VerifyEmail.tsx`)

```tsx
const token = window.location.pathname.split("/").pop();
await API.get(`/auth/verify-email/${token}`);
```

**Server endpoint:**

- **GET /auth/verify-email/:token**  
  **Response:**  
  ```json
  {
    "message": "Email verified successfully"
  }
  ```

---

## Login

Users can log in only after their email is verified.

### Frontend Example (`client/src/pages/Login.tsx`)

```tsx
await API.post("/auth/login", { email, password });
// accessToken saved in localStorage; refreshToken in HTTP-only cookie
```

**Server endpoint:**

- **POST /auth/login**  
  **Body:** `{ email: string, password: string }`  
  **Response:**  
  ```json
  {
    "accessToken": "<jwt-access-token>"
  }
  ```
  - Sets `refreshToken` as HTTP-only, secure cookie

**Error cases:**  
- 401 if email not registered, email not verified, or password invalid

---

## Token Handling

### Access Token
- Returned in login response JSON (`accessToken`)
- **Usage:** Add as `Authorization: Bearer <accessToken>` header in protected API requests.

### Refresh Token
- Set as HTTP-only, secure cookie (`refreshToken`) by backend
- Used to obtain new access tokens

### Refresh Endpoint

If the access token expires, refresh via:

- **POST /auth/refresh-token**  
  - Requires `refreshToken` cookie  
  - Response:
    ```json
    {
      "accessToken": "<new-access-token>"
    }
    ```

---

## Logout

Removes the refresh token both server-side and client-side.

### Frontend Example (`client/src/hooks/useAuth.tsx`)

```tsx
await API.post("/auth/logout", {}, { withCredentials: true });
localStorage.removeItem("token");
```

**Server endpoint:**

- **POST /auth/logout**
  - Clears the refresh token cookie
  - Deletes token from the database  
  - Returns:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

---

## Protecting Routes (Frontend)

Use the `useAuth` hook and state (from `client/src/hooks/useAuth.tsx`) to guard pages:

```tsx
const { user } = useAuth();
if (!user) return <Navigate to="/login" />;
```

---

## Protecting Routes (Backend)

Use `verifyAccessToken` middleware (see `backend/src/middleware/auth.ts`):

```ts
// Example: apply middleware to protected route
app.get("/dashboard", verifyAccessToken, (req, res) => { ... });
```
- Requires `Authorization: Bearer <accessToken>` header
- Responds `401` if not provided; `403` if invalid

---

## Summary Flow

1. **Register** → **Verify Email** → **Login**  
2. Backend issues access & refresh tokens.  
3. Store access token in `localStorage`; refresh token kept as HTTP-only cookie.  
4. Use the access token to authenticate requests.  
5. Refresh token when needed or logout to end session.

---

## Troubleshooting

- Registration requires a unique, valid email.
- Login blocked if email not verified.
- Access tokens expire; use refresh endpoint (with cookie) to renew.
- Always use HTTPS in production (cookies set as secure).

---

## See Also

- [JWT Authentication Overview](https://jwt.io/introduction)
- [Example API service implementation](../services/api.js) (project-specific)
- [Protected route usage (React)](../hooks/useAuth.tsx)

---
**End of guide.**