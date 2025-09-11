# HETIC Crypto API – Shelfya Configuration

This document describes how to configure, run, and test the HETIC Crypto API project within Shelfya. The repository contains:

- **backend**: Express.js + TypeScript REST API  
- **client**: React front-end (CRA)  
- **.shelfya**: Shelfya-specific README

---

## Prerequisites

- Node.js ≥ 16  
- PostgreSQL database  
- Access to SMTP credentials (for email verification)  
- API keys:
  - CryptoCompare
  - Etherscan

---

## 1. Environment Variables

Create a `.env` file in your **backend** folder and populate **all** of the following:

```
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TOKEN_EXPIRATION_TIME=
JWT_REFRESH_TOKEN_EXPIRATION_TIME=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
API_URL=
CRYPTOCOMPARE_API_KEY=
ETHERSCAN_API_KEY=
CLIENT_URL=
DATABASE_URL=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
PORT=
```

> Shelfya will automatically validate these at startup.

---

## 2. Install & Run

```bash
# 1. Clone
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api

# 2. Backend
cd backend
npm install
npm run dev                # watch mode with ts-node or nodemon

# 3. Client
cd ../client
npm install
npm start                  # starts React on http://localhost:3000
```

Your API will be available at `http://localhost:<PORT>/api/v1`.

---

## 3. Key API Endpoints

### Authentication

- **POST** `/api/v1/auth/register`  
  Body: `{ name, email, password }`

- **POST** `/api/v1/auth/login`  
  Body: `{ email, password }`  
  ⇒ Returns `accessToken`; sets `refreshToken` cookie

- **GET** `/api/v1/auth/verify-email/:token`  
  Verify user’s email

- **POST** `/api/v1/auth/refresh-access-token`  
  Uses cookie `refreshToken` to issue new `accessToken`

- **POST** `/api/v1/auth/logout`  
  Clears `refreshToken` cookie

### Wallets

Authenticated via `Authorization: Bearer <token>` header

- **GET** `/api/v1/wallet`  
  List all wallets

- **POST** `/api/v1/wallet`  
  Body: `{ address, title }` → Create wallet & seed history

- **DELETE** `/api/v1/wallet/:id`  
  Delete wallet and its history

### History

- **GET** `/api/v1/history/:walletId?startDate=YYYY-MM-DD`  
  Fetch wallet history (filter by start date)

### Portfolio

- **GET** `/api/v1/portfolio/:walletId`  
  Returns allocation, current price, daily price change, total value, daily value

### Profile

- **GET** `/api/v1/profile`  
- **PATCH** `/api/v1/profile`  
  Body: `{ name, email }`

- **PATCH** `/api/v1/profile/password`  
  Body: `{ oldPassword, newPassword }`

---

## 4. Example: Login + Fetch Wallets

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"P@ssw0rd!"}' \
  -c cookies.txt

# Extract accessToken from response, or store in localStorage via client

# Fetch wallets
curl http://localhost:5000/api/v1/wallet \
  -H "Authorization: Bearer <accessToken>" \
  -b cookies.txt
```

---

## 5. Testing

- **Backend**: Add tests under `backend/src/**` and run `npm test`  
- **Client**: `npm test` (Jest + React Testing Library)

---

For more details, explore the code under `backend/src` and `client/src`. If you hit missing‐env errors, verify all variables from **Section 1** are set.