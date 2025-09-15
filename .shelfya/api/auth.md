# Authentication API Guide

This guide covers the authentication API for the Hetic Crypto API backend, detailing available endpoints and how to interact with them for secure user management (registration, login, logout, email verification, and token refresh).

---

## Endpoints Overview

| Method | Path                            | Description                             | Auth Required |
|--------|---------------------------------|-----------------------------------------|--------------|
| POST   | `/api/auth/register`            | Register a new user                     | No           |
| POST   | `/api/auth/login`               | User login, issues tokens               | No           |
| GET    | `/api/auth/verify-email/:token` | Verify user email                       | No           |
| POST   | `/api/auth/refresh-access-token`| Refresh access token using refresh token| No           |
| POST   | `/api/auth/logout`              | Log out and delete refresh token        | No           |

---

## 1. Register

**POST `/api/auth/register`**

Creates a new user and sends a verification email.

**Request Body:**
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "StrongPassw0rd!"
}
```
Password requirements:
- At least 8 characters long
- At least one uppercase letter, one lowercase letter, one number, and one special character

**Response Example:**
```json
{
  "message": "Registration successful. Please verify your email."
}
```

---

## 2. Verify Email

**GET `/api/auth/verify-email/:token`**

Verifies user's email using the email verification token sent during registration.

**Response Example:**
```json
{
  "message": "Email verified successfully"
}
```

---

## 3. Login

**POST `/api/auth/login`**

Authenticates user and provides an access token (JWT) and a refresh token (set as HTTP-only cookie).

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "StrongPassw0rd!"
}
```

**Response Example:**
```json
{
  "accessToken": "<JWT access token>"
}
// The refreshToken is sent as an HTTP-only cookie
```

---

## 4. Refresh Access Token

**POST `/api/auth/refresh-access-token`**

Obtains a new access token using a valid HTTP-only refresh token cookie.

**Request:**  
No body required. The refresh token is sent automatically via browser cookies.

**Response Example:**
```json
{
  "accessToken": "<new JWT access token>"
}
```

---

## 5. Logout

**POST `/api/auth/logout`**

Invalidates the current user's refresh token and clears the cookie.

**Response Example:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Error Handling

- If input validation fails (e.g., invalid email/password format), you’ll receive a 400 Bad Request with a message.
- Invalid credentials or tokens result in a 401 Unauthorized.
- Server issues return a 500 Internal Server Error.

---

## Security Notes

- **Refresh tokens** are stored as secure, HTTP-only, SameSite cookies—never handle them client-side.
- **Access tokens** should be sent in the `Authorization` header for authenticated requests (not covered here).
- **Email verification** is mandatory before login.

---

## Example: Login Flow

1. **Register:** `/api/auth/register`
2. **Verify Email:** Click link in verification email.
3. **Login:** `/api/auth/login`
   - Save `accessToken` from response for authenticated requests.
   - Browser receives an HTTP-only `refreshToken` cookie.
4. **On access token expiry:** `/api/auth/refresh-access-token`
5. **Logout:** `/api/auth/logout`

---

## Further Reading

- [API Errors & Status Codes](./errors.md) *(if available)*
- [Accessing Protected Resources](./protected-endpoints.md) *(if available)*

For integration or troubleshooting, refer to your frontend documentation or contact the API maintainer.