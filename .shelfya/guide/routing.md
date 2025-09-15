# API Routing Guide

This guide describes how routes are organized in the backend and how to interact with the main endpoints. All routes are defined under `backend/src/routes` and mounted in `index.ts`. Routes marked “Protected” require a valid access token sent in the `Authorization: Bearer <token>` header.

## Route Structure

In `backend/src/routes/index.ts`:

- `/auth`  
  Public endpoints for user authentication and session management.  
- `/wallet` (Protected)  
  CRUD operations on user wallets.  
- `/history` (Protected)  
  Transaction or activity history.  
- `/portfolio`  
  Public or aggregated portfolio data.  
- `/profile` (Protected)  
  User profile management.

## Authentication Routes (`/auth`)

Defined in `backend/src/routes/auth.ts`.

Endpoints:

- **POST /auth/login**  
  Rate-limited login endpoint.  
  Request body:
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
  Response:
  ```json
  {
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  }
  ```

- **POST /auth/register**  
  Rate-limited registration.  
  Request body:
  ```json
  {
    "email": "user@example.com",
    "password": "string",
    "name": "Your Name"
  }
  ```

- **POST /auth/refresh-access-token**  
  Exchange a valid refresh token for a new access token.  
  Request body:
  ```json
  {
    "refreshToken": "existing-refresh-token"
  }
  ```

- **GET /auth/verify-email/:token**  
  Verify a user’s email address via token link.

- **POST /auth/logout**  
  Invalidate the current refresh token.

### Example: Login

```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

## Wallet Routes (`/wallet`) ‑ Protected

Defined in `backend/src/routes/wallet.ts`. All requests require:
```
Authorization: Bearer <accessToken>
```

Endpoints:

- **GET /wallet**  
  List all wallets for the authenticated user.

- **POST /wallet**  
  Create a new wallet.  
  Request body example:
  ```json
  {
    "name": "Main Wallet",
    "currency": "BTC"
  }
  ```

- **DELETE /wallet/:id**  
  Delete a wallet by its ID.

### Example: Create a Wallet

```bash
curl -X POST https://api.example.com/wallet \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Savings","currency":"ETH"}'
```

## Other Routers

- `/history` – view transaction history (Protected)  
- `/portfolio` – retrieve portfolio overview  
- `/profile` – manage user profile (Protected)

For details on these routes, see their respective guides in `.shelfya/guide/`.