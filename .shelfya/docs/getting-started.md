# Getting Started

This guide walks you through setting up and running the HETIC Crypto API locally, from cloning the repo to seeding the database.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- A running database (e.g., PostgreSQL)
- A CryptoCompare API key (register at https://www.cryptocompare.com)

## 1. Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

## 2. Install Dependencies

```bash
npm install
# or
yarn install
```

## 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then open `.env` and set at least:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
CRYPTOCOMPARE_API_KEY=your_api_key_here
```

The API will verify these on startup (see `backend/src/utils/verify-env.ts`).

## 4. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 5. Seed the Database

The seed script clears out any existing history and fetches fresh data for a currency pair (default: ETH → EUR).

```bash
npx ts-node backend/src/utils/seed.ts
```

If you want to seed a different pair, edit the last line of `backend/src/utils/seed.ts`:

```ts
populateDb("BTC", "USD");
```

## 6. Start the API

Make sure your `.env` is set up, then start the server:

```bash
npm run dev
```

Behind the scenes, `verifyEnv()` will ensure all required variables are present before the server listens for requests.

## 7. Test the Endpoints

Once running (default: `http://localhost:3000`), try:

```bash
# List all tracked currencies
curl http://localhost:3000/api/currencies

# Fetch price history for ETH
curl http://localhost:3000/api/history?symbol=ETH
```

Adjust routes and query parameters as needed. Enjoy exploring historical crypto data!