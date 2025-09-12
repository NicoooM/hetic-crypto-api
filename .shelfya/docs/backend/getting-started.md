# Getting Started (Backend)

This guide walks you through setting up and running the HETIC Crypto API backend.

## Prerequisites

- Node.js v16+ and npm (or Yarn)  
- A PostgreSQL database (or any database supported by Prisma)  
- A CryptoCompare API key (register at https://min-api.cryptocompare.com)

## Installation

```bash
# Clone the repo and enter backend folder
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api/backend

# Install dependencies
npm install
# or
yarn install
```

## Environment Variables

Create a `.env` file in `backend/` and add the following:

```
PORT=4000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
CRYPTOCOMPARE_API_KEY=your_crypto_compare_api_key
```

## Database Setup with Prisma

1. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

2. Run your migrations (or create one):

   ```bash
   npx prisma migrate dev --name init
   ```

3. (Optional) Reset the database to a clean state:

   ```bash
   npx prisma migrate reset
   ```

## Seeding Historical Data

The seed script fetches daily price history for a given cryptocurrency (default: ETH → EUR) and populates two tables: `currency` and `currencyHistory`.

```bash
npx ts-node src/utils/seed.ts
```

You should see console logs about cleaning history and fetching data.

## Running the Server

Start the Express server in development mode:

```bash
npm run dev
# or, if you prefer ts-node directly
npx ts-node src/index.ts
```

By default, the server listens on `http://localhost:4000` (or the `PORT` you set) and mounts all routes under `/api/v1`. For example:

- `GET http://localhost:4000/api/v1/currencies`
- `POST http://localhost:4000/api/v1/auth/login`

## Core Components

- **Express App** (`src/index.ts`):  
  Initializes middleware (CORS, Helmet, cookie-parser, request-ip) and registers `/api/v1` router.

- **Prisma Client** (`src/lib/prisma.ts`):  
  Exports a shared `prisma` instance for database queries.

- **Seed Script** (`src/utils/seed.ts`):  
  Fetches historical price data from CryptoCompare and upserts it into the database.

## Next Steps

- Explore and extend routes in `src/routes`  
- Add new models or relations in `prisma/schema.prisma` and re-run migrations  
- Integrate authentication, logging, or other middleware as needed