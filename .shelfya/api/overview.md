# API Overview

This document provides a high-level overview of the HETIC Crypto API, including its main endpoints and authentication flow. All routes are prefixed with `/api` by default (e.g. `https://your-domain.com/api/auth/login`).

## Authentication

The API uses JWT for stateless access and an HTTP-only cookie for refresh tokens. After logging in, you will receive:

- `accessToken` in the JSON response
- `refreshToken` as an HTTP-only, secure cookie

Include the access token in the `Authorization` header for protected routes:

```
Authorization: Bearer <accessToken>
```

### Endpoints

#### Register a New User

Create a new account.  
Method: `POST`  
URL: `/auth/register`

Request body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```

Response:
- `201 Created`  
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```
- `400 Bad Request` – validation error

#### Email Verification

Verify a user’s email via token sent by email.  
Method: `GET`  
URL: `/auth/verify/:token`

Example:
```
GET /auth/verify/abcdef123456
```

Response:
- `200 OK`  
  ```json
  {
    "message": "Email verified successfully"
  }
  ```
- `500 Internal Server Error` – invalid or expired token

#### Login

Authenticate and receive an access token.  
Method: `POST`  
URL: `/auth/login`

Request body:
```json
{
  "email": "jane@example.com",
  "password": "strongPassword123"
}
```

Response:
- `200 OK`  
  - JSON with `accessToken`
  - Sets `refreshToken` cookie
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```
- `400 Bad Request` – validation error
- `401 Unauthorized` – invalid credentials

#### Refresh Access Token

Obtain a new access token using the HTTP-only refresh cookie.  
Method: `POST`  
URL: `/auth/refresh`

Response:
- `200 OK`  
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```
- `400 Bad Request` – missing or invalid cookie
- `401 Unauthorized` – refresh token expired or revoked

#### Logout

Invalidate the refresh token and clear the cookie.  
Method: `POST`  
URL: `/auth/logout`

Response:
- `200 OK`  
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- `400 Bad Request` – validation error

---

## Resource Endpoints

| Route Group   | Path               | Auth Required | Description                        |
| ------------- | ------------------ | ------------- | ---------------------------------- |
| Wallet        | `/wallet`          | Yes           | Manage user wallets (CRUD ops)     |
| History       | `/history`         | Yes           | Fetch transaction/history records  |
| Portfolio     | `/portfolio`       | No            | View public portfolio data         |
| Profile       | `/profile`         | Yes           | Get or update user profile         |

For detailed request/response schemas and additional examples, see the corresponding section in this documentation.