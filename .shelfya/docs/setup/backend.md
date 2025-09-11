# Backend Setup

This guide walks you through installing, configuring, and running the HETIC Crypto API backend.

## Prerequisites

- Node.js ≥ 16, npm or yarn  
- PostgreSQL database  
- (Optional) An SMTP server for email verification  
- API keys for:
  - CryptoCompare (`CRYPTOCOMPARE_API_KEY`)
  - Etherscan (`ETHERSCAN_API_KEY`)

## 1. Clone & Install

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api/backend
npm install   # or yarn install
```

## 2. Environment Variables

Create a `.env` file in `backend/` and set the following variables:

```
# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d

# SMTP (email verification)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=mail@example.com
SMTP_PASS=your_smtp_password

# Application URLs
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5000/api/v1

# Third-party API Keys
CRYPTOCOMPARE_API_KEY=xxx
ETHERSCAN_API_KEY=yyy

# Database (PostgreSQL)
DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5432/POSTGRES_DB

# Server
PORT=5000
```

> Note: On startup, the app calls `verifyEnv()` to ensure all required vars are set.

## 3. Database Setup

1. Create the PostgreSQL database:

   ```bash
   psql -U your_user -c "CREATE DATABASE your_db;"
   ```

2. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

3. (Optional) Seed historical ETH price data:

   ```bash
   node src/utils/seed.ts
   ```

## 4. Running the Server

- In development (with auto-reload):

  ```bash
  npm run dev     # assuming ts-node-dev is configured
  ```

- In production:

  ```bash
  npm run build
  npm start
  ```

Once started, the API listens on `http://localhost:<PORT>/api/v1`.

## 5. Endpoints Overview

- `POST /auth/register` — Register new user (rate-limited)
- `POST /auth/login` — Login, returns access token + sets HTTP-only refresh token
- `POST /auth/refresh-access-token` — Refresh JWT
- `GET  /auth/verify-email/:token` — Verify email
- `POST /auth/logout` — Logout (clears refresh token cookie)

Protected routes (require `Authorization: Bearer <token>`):

- `GET    /wallet`  
- `POST   /wallet`  
- `DELETE /wallet/:id`  
- `GET    /history/:id`  
- `GET    /portfolio/:id`  
- `GET    /profile`  
- `PATCH  /profile`  
- `PATCH  /profile/password`  

## 6. Testing

The backend uses Jest. To run tests:

```bash
npm test
```

## 7. Troubleshooting

- **Missing env vars**: The server will throw an error listing any `REQUIRED_ENV_VARS`.  
- **Database errors**: Confirm `DATABASE_URL` and credentials, then re-run migrations.  
- **Email not sending**: Verify SMTP settings and reachability.  
- **API rate limits**: Login/register routes are limited to prevent brute-force (max 5/3 req per 15min).  

---

You’re all set! Your backend should now be ready to handle authentication, wallet management, and crypto data fetching.