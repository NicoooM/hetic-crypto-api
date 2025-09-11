# Getting Started

This guide will help you set up and run the HETIC Crypto API locally. You’ll install dependencies, configure environment variables, seed historical data, and launch both the backend and frontend applications.

## 1. Prerequisites

- Node.js ≥ 18  
- npm or Yarn  
- PostgreSQL ≥ 12  
- An SMTP server or service (e.g. SendGrid)  
- API keys for:
  - CryptoCompare (for historical pricing)
  - Etherscan (for on-chain wallet data)

## 2. Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

## 3. Configure Environment Variables

Create a `.env` file in both `backend/` and `client/` folders.

### backend/.env

```env
# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d

# SMTP (for email verification)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass

# API URLs & Keys
API_URL=http://localhost:5000/api/v1
CLIENT_URL=http://localhost:3000
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
ETHERSCAN_API_KEY=your_etherscan_key

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_pass
POSTGRES_DB=your_db_name
PORT=5000
```

### client/.env

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

> **Tip:** Adjust ports and URLs to match your setup.

## 4. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../client
npm install
```

## 5. Initialize & Seed Database

1. Ensure PostgreSQL is running and your `.env` `DATABASE_URL` is correct.  
2. From the `backend/` folder, run Prisma migrations (if defined) or ensure your schema matches your database.  
3. Seed currency history:

```bash
# This runs src/utils/seed.ts and populates 'currency' and 'currencyHistory'
npm run seed
```

> If no seed script is defined in `package.json`, run it directly with:
> ```bash
> npx ts-node src/utils/seed.ts
> ```

## 6. Run the Backend

```bash
cd backend
npm run dev
```

- Verifies all required env vars on startup.
- Listens on `http://localhost:5000`.

## 7. Run the Frontend

```bash
cd client
npm start
```

- Opens at `http://localhost:3000`.
- Connects to the API via `REACT_APP_API_BASE_URL`.

## 8. Testing

The client includes Jest + Testing Library:

```bash
cd client
npm test
```

You can also add backend tests as needed.

## 9. Directory Overview

- **backend/**  
  • `src/index.ts` – Express app setup  
  • `src/routes/` – Auth, Wallet, History, Portfolio, Profile  
  • `src/controllers/` – Controllers for each route  
  • `src/services/` – Business logic and external integrations  
  • `src/schemas/` – Zod validation schemas  
  • `src/utils/` – Helpers (email, hashing, seeding, Etherscan)  
- **client/**  
  • `src/services/api.ts` – Axios instance with token refresh  
  • Standard React components and pages

## 10. Next Steps

- Implement UI flows (login, register, wallet creation, portfolio view).  
- Deploy backend (Heroku, AWS, etc.) and frontend (Netlify, Vercel).  
- Secure your SMTP credentials and secrets in a vault or CI/CD pipeline.  
- Enable HTTPS in production (e.g., via a reverse proxy like Nginx).

Enjoy building with the HETIC Crypto API!