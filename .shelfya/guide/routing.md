# Routing Guide

This guide outlines the HTTP routes exposed by the backend API and their protection layers. All routes are mounted in `backend/src/routes/index.ts` using Express. Protected routes require a valid JWT access token in the `Authorization: Bearer <token>` header.

---

## Mount Points

### 1. /auth  
Handles user authentication, registration and token refresh. Rate limiting is applied on login and register.

- **POST /auth/login**  
  Body: `{ email: string, password: string }`  
  Returns access & refresh tokens.  

- **POST /auth/register**  
  Body: `{ email: string, password: string, ... }`  
  Initiates email verification.  

- **POST /auth/refresh-access-token**  
  Body: `{ refreshToken: string }`  
  Returns a new access token.  

- **GET /auth/verify-email/:token**  
  Verifies email using the provided token.  

- **POST /auth/logout**  
  Revokes the current refresh token.

Example:
```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

### 2. /wallet (Protected)  
Requires `verifyAccessToken` middleware.

- **GET /wallet**  
  List all wallets for the authenticated user.

- **POST /wallet**  
  Body: `{ name: string, balance: number, ... }`  
  Create a new wallet.

- **DELETE /wallet/:id**  
  Delete a wallet by ID.

### 3. /history (Protected)

- **GET /history/:id**  
  Retrieve transaction history for wallet `:id`.

### 4. /portfolio  
(No auth required)

- **GET /portfolio/:id**  
  Fetch portfolio data for user or entity `:id`.

### 5. /profile (Protected)

- **GET /profile**  
  Get current user’s profile data.

- **PATCH /profile**  
  Body: fields to update (e.g. `{ name: string, email: string }`).

- **PATCH /profile/password**  
  Body: `{ oldPassword: string, newPassword: string }`  
  Change user password.

---

## How to Use Protected Routes

1. **Authenticate** via `/auth/login` to receive `accessToken`.
2. Send requests with header:  
   `Authorization: Bearer <accessToken>`
3. On token expiry, refresh via `/auth/refresh-access-token`.