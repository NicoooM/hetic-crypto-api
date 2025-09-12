# Getting Started

This guide will help you spin up the HETIC Crypto API backend locally, configure environment variables, seed the database, and verify everything is working.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- A supported database (e.g., PostgreSQL) with a valid connection URL
- A CryptoCompare API key — sign up at https://min-api.cryptocompare.com/

## 1. Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api/backend
```

## 2. Install Dependencies

```bash
npm install
# or
yarn install
```

## 3. Configure Environment Variables

Create a `.env` file in the `backend` folder and define the following variables:

```
PORT=4000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
CRYPTOCOMPARE_API_KEY=your_crypto_compare_api_key
```

The application will verify that all required variables are set on startup. If any are missing or empty, it will throw an error:

```bash
Error: Missing or empty required environment variables: PORT, DATABASE_URL, CRYPTOCOMPARE_API_KEY
```

## 4. Set Up the Database

1. Generate Prisma client and run migrations:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

2. (Optional) Inspect your schema in Prisma Studio:

   ```bash
   npx prisma studio
   ```

## 5. Seed the Database

A seed script fetches historical ETH/EUR price data from CryptoCompare and populates your `currency` and `currencyHistory` tables.

```bash
npx ts-node src/utils/seed.ts
```

You should see logs like:

```
Cleaning currency history...
Fetching base data...
Populating database with ETH data...
```

## 6. Start the Server

```bash
npm run dev
# or
yarn dev
```

By default, the server listens on the port defined in `PORT`. You should see:

```
Listening on port 4000...
```

## 7. Test the API

With the server running, you can make requests to:

```
http://localhost:<PORT>/api/v1/...
```

Example using `curl`:

```bash
curl http://localhost:4000/api/v1/currencies
```

Replace the path with any available endpoint under `/api/v1`.

---

For more details on routing, middleware, and advanced configuration, explore the `src/` directory or check out Prisma’s docs at https://www.prisma.io/.