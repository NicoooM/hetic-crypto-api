# API Overview

Welcome to the HETIC Crypto API. This service powers user authentication, wallet management, transaction history, portfolio tracking, and profile management for cryptocurrency applications.

Base URL  
```
https://api.yourdomain.com
```

All endpoints are prefixed with `/api`. Authentication uses JWT access tokens sent via the `Authorization` header.

## Authentication

The **Auth** routes handle user registration and login:

- `POST /api/auth/signup`  
- `POST /api/auth/login`  
- `POST /api/auth/refresh-token`  

Example:  
```bash
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"P@ssw0rd"}'
```

On successful login, you’ll receive an access token:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1Ni…"
}
```

## Protected Routes

Some resources require a valid access token. Include it in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

### Wallet

Routes under `/api/wallet` let you create, view, and manage crypto wallets.

- `GET /api/wallet` — list all wallets  
- `POST /api/wallet` — create a new wallet  
- `DELETE /api/wallet/:id` — delete a wallet

Example:
```bash
curl https://api.yourdomain.com/api/wallet \
  -H "Authorization: Bearer eyJhbGci…"
```

### History

Routes under `/api/history` return transaction and market activity.

- `GET /api/history` — fetch all transactions  
- `GET /api/history/:walletId` — fetch history for a specific wallet  

Example:
```bash
curl https://api.yourdomain.com/api/history \
  -H "Authorization: Bearer eyJhbGci…"
```

### Profile

Routes under `/api/profile` allow reading and updating user details.

- `GET /api/profile` — fetch current user profile  
- `PUT /api/profile` — update profile information  

Example:
```bash
curl -X PUT https://api.yourdomain.com/api/profile \
  -H "Authorization: Bearer eyJhbGci…" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"CryptoFan","bio":"Blockchain enthusiast"}'
```

## Public Routes

### Portfolio

Routes under `/api/portfolio` are accessible without authentication and provide aggregated market data or user portfolio overviews.

- `GET /api/portfolio` — get market overview or public portfolio stats  

Example:
```bash
curl https://api.yourdomain.com/api/portfolio
```

## Next Steps

For detailed request/response schemas and error codes, please visit the individual route docs:

- [Auth API](/.shelfya/api/auth.md)  
- [Wallet API](/.shelfya/api/wallet.md)  
- [History API](/.shelfya/api/history.md)  
- [Portfolio API](/.shelfya/api/portfolio.md)  
- [Profile API](/.shelfya/api/profile.md)  