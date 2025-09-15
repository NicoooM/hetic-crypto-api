# Authentication Guide

This guide explains how to register, log in, verify email, refresh tokens, and log out when using the HETIC Crypto API. All authentication endpoints are exposed by the `AuthController` in the backend.

Base URL  
```
http://localhost:3000
```

## Endpoints

### 1. Register a New User

- **URL:** `POST /auth/register`
- **Body JSON:**
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "StrongP@ssw0rd"
  }
  ```
- **Response:**  
  - `201 Created`  
    ```json
    {
      "message": "Registration successful. Please verify your email."
    }
    ```
  - `400 Bad Request` if validation fails  
  - `500 Internal Server Error` on server errors  

### 2. Verify Email

After registration, the user receives a verification email with a link:

```
GET /auth/verify-email/:token
```

- **URL Example:**  
  ```
  GET /auth/verify-email/eyJhbGciOiJIUzI1NiIsInR5cCI6...
  ```
- **Response:**  
  ```json
  {
    "message": "Email verified successfully"
  }
  ```
- **Errors:**  
  - `500 Internal Server Error` if the token is invalid or expired  

### 3. Log In

- **URL:** `POST /auth/login`
- **Body JSON:**
  ```json
  {
    "email": "alice@example.com",
    "password": "StrongP@ssw0rd"
  }
  ```
- **Response:**  
  - `200 OK`  
    - Sets an HttpOnly `refreshToken` cookie  
    - Returns an `accessToken` in JSON:
      ```json
      {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
      }
      ```
  - `400 Bad Request` if validation fails  
  - `401 Unauthorized` if credentials are invalid or email isn’t verified  

### 4. Refresh Access Token

When the access token expires, call this endpoint to obtain a new one:

- **URL:** `POST /auth/refresh-token`
- **Headers/Cookies:**  
  - Include the `refreshToken` cookie (HttpOnly) set by `/auth/login`.  
  - No JSON body required.
- **Response:**  
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```
- **Errors:**  
  - `400 Bad Request` if no cookie or invalid cookie format  
  - `401 Unauthorized` if missing cookie  
  - `401 Unauthorized` if refresh token is invalid or expired  

### 5. Log Out

- **URL:** `POST /auth/logout`
- **Headers/Cookies:**  
  - Include the `refreshToken` cookie.
- **Response:**  
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **Behavior:**  
  - Deletes the refresh token from the database  
  - Clears the `refreshToken` cookie  

## Using the Access Token

Protected routes require a valid access token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

### Example: Fetching User Profile

```bash
curl https://api.yoursite.com/user/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

If the token is missing or invalid, you’ll receive:

- `401 Unauthorized`
- `403 Forbidden` if the token is malformed or expired

## Security Notes

- Refresh tokens are stored as HttpOnly cookies to mitigate XSS.
- Access tokens should be kept in memory (e.g., React state) and never persisted in local storage.
- All tokens are signed with secrets defined in environment variables (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`).
- CORS must allow credentials if your frontend is on a separate domain. Example in Express:

  ```js
  app.use(cors({
    origin: "https://your-frontend.com",
    credentials: true
  }));
  ```

For more details on token handling, see the `AuthService` and `token.service.ts` in the backend codebase.