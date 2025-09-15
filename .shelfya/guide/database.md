# Database Guide

This guide explains how to set up and seed your PostgreSQL (or other) database using Prisma and the provided seed script.

## Prerequisites

- Node.js ≥ 16
- A running database (PostgreSQL, MySQL, SQLite, etc.)
- A [CryptoCompare API key](https://min-api.cryptocompare.com/) (`CRYPTOCOMPARE_API_KEY`)
- Environment variables in a `.env` file:
  ```
  DATABASE_URL="postgresql://user:password@localhost:5432/your_db"
  CRYPTOCOMPARE_API_KEY="YOUR_API_KEY_HERE"
  ```

## 1. Install & Generate Prisma Client

1. Install dependencies:
   ```bash
   npm install
   npm install @prisma/client
   npm install -D prisma
   ```
2. Initialize Prisma (if not done):
   ```bash
   npx prisma init
   ```
3. Define your schema in `prisma/schema.prisma` (example models):
   ```prisma
   model Currency {
     id       Int               @id @default(autoincrement())
     symbol   String            @unique
     history  CurrencyHistory[]
   }

   model CurrencyHistory {
     id         Int       @id @default(autoincrement())
     date       DateTime
     price      Float
     currency   Currency  @relation(fields: [currencyId], references: [id])
     currencyId Int
     
     @@unique([date, currencyId])
   }
   ```
4. Run migrations & generate client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

## 2. Understanding the Prisma Client Setup

File: `backend/src/lib/prisma.ts`
```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```
This exports a singleton instance of the Prisma Client. Import it wherever you need to query the database:
```ts
import { prisma } from "../lib/prisma";
```

## 3. Seeding Currency Data

The `seed.ts` script fetches historical price data from CryptoCompare and populates two tables: `Currency` and `CurrencyHistory`.

File: `backend/src/utils/seed.ts` (key points)
- **cleanCurrencyHistory**: deletes all existing history entries.
- **getCurrencyHistory**: fetches daily OHLC data in chunks (up to 2000 per request) until no more new data.
- **populateDb**: 
  1. Upserts a `Currency` record by symbol.
  2. Upserts each history point by `(date, currencyId)`.

### Running the Seed Script

1. Compile or run directly with `ts-node`:
   ```bash
   npx ts-node backend/src/utils/seed.ts
   ```
2. You should see console logs:
   ```
   Cleaning currency history...
   Fetching base data...
   Fetching data from 2021-01-01T00:00:00.000Z...
   Populating database with ETH data...
   ```

### Customizing the Seed

To seed a different cryptocurrency or currency pair, modify the last line of `seed.ts`:
```ts
// Default:
populateDb("ETH", "EUR");

// Example: Bitcoin to USD
populateDb("BTC", "USD");
```
Then rerun the script.

## 4. Verifying the Data

Use Prisma Studio to explore:
```bash
npx prisma studio
```
Browse the `Currency` and `CurrencyHistory` tables to confirm the records.

## 5. Next Steps

- Integrate CRUD endpoints in your API using `prisma`.
- Schedule regular data refreshes (e.g., with cron jobs).
- Add indexes or partitioning to `CurrencyHistory` for large datasets.

For more details, see the Prisma documentation: https://www.prisma.io/docs/.