# Authentication API

The Authentication API provides endpoints to register new users, log in, verify email addresses, refresh access tokens, and log out. All routes are mounted under the `/auth` prefix.

## Base URL

```
https://your-domain.com/auth
```

---

## Endpoints

### 1. Register

Create a new user account. After successful registration, a verification email is sent.

**Request**

```
POST /auth/register
Content-Type: application/json
```

**Body Parameters**

| Name     | Type   | Description                                                                                                 |
| -------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| `name`   | string | Full name of the user.                                                                                      |
| `email`  | string | Valid email address.                                                                                        |
| `password` | string | Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character. |

**Example**

```bash
curl -X POST https://your-domain.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "P@ssw0rd!"
  }'
```

**Responses**

- **201 Created**  
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```
- **400 Bad Request**  
  Invalid or missing fields.  
  ```json
  {
    "message": "Password must be at least 8 characters long and contain at least one uppercase letter..."
  }
  ```
- **500 Internal Server Error**  
  Unexpected server error.

---

### 2. Login

Authenticate a user and receive an access token. A refresh token is set in a secure HTTP-only cookie.

**Request**

```
POST /auth/login
Content-Type: application/json
```

**Body Parameters**

| Name      | Type   | Description       |
| --------- | ------ | ----------------- |
| `email`   | string | User’s email.     |
| `password`| string | User’s password.  |

**Example**

```bash
curl -X POST https://your-domain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@example.com",
    "password": "P@ssw0rd!"
  }'
```

**Response**

- **200 OK**  
  - Sets cookie `refreshToken` (HTTP-only, Secure in production, SameSite=Strict).
  - Returns JSON:
    ```json
    {
      "accessToken": "<JWT_ACCESS_TOKEN>"
    }
    ```
- **400 Bad Request**  
  Malformed email/password.
- **401 Unauthorized**  
  Invalid credentials.

---

### 3. Verify Email

Activate a newly registered user’s account via the token sent by email.

**Request**

```
GET /auth/verify-email/:token
```

**URL Parameters**

| Name    | Type   | Description                     |
| ------- | ------ | ------------------------------- |
| `token` | string | Email verification token.       |

**Example**

```bash
curl https://your-domain.com/auth/verify-email/abcdef123456
```

**Responses**

- **200 OK**
  ```json
  {
    "message": "Email verified successfully"
  }
  ```
- **500 Internal Server Error**  
  Invalid or expired token.

---

### 4. Refresh Access Token

Obtain a new access token using the `refreshToken` cookie.

**Request**

```
POST /auth/refresh-access-token
```

- Must include the `refreshToken` cookie set at login.
- No request body.

**Example**

```bash
curl -X POST https://your-domain.com/auth/refresh-access-token \
  --cookie "refreshToken=<YOUR_REFRESH_TOKEN_COOKIE>"
```

**Response**

- **200 OK**  
  ```json
  {
    "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
  }
  ```
- **400 Bad Request**  
  Missing or malformed `refreshToken`.
- **401 Unauthorized**  
  Invalid or expired refresh token.

---

### 5. Logout

Invalidate the current refresh token and clear the cookie.

**Request**

```
POST /auth/logout
```

- Must include the `refreshToken` cookie.

**Example**

```bash
curl -X POST https://your-domain.com/auth/logout \
  --cookie "refreshToken=<YOUR_REFRESH_TOKEN_COOKIE>"
```

**Response**

- **200 OK**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **400 Bad Request**  
  Malformed or missing `refreshToken`.
- **500 Internal Server Error**  
  Unexpected server error.

---

## Notes

- All JSON request bodies are validated using Zod schemas.
- Access tokens should be sent in the `Authorization: Bearer <token>` header for protected routes.
- Refresh tokens are stored as HTTP-only cookies with a lifespan set by `JWT_REFRESH_TOKEN_EXPIRATION_TIME`.
- For production, ensure `NODE_ENV=production` so cookies are marked `Secure`.