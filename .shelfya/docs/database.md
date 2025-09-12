# Database

This document describes how to configure, inspect, and seed the database for the HETIC Crypto API. The project uses [Prisma](https://www.prisma.io/) as its ORM.

## 1. Configuration

1. Create a `.env` file at the project root:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/your_db?schema=public"
   CRYPTOCOMPARE_API_KEY="your_crypto_compare_api_key"
   ```

2. Install dependencies and generate the Prisma client:

   ```bash
   npm install
   npx prisma generate
   ```

3. (If you have migrations) Run migrations to set up your schema:

   ```bash
   npx prisma migrate deploy
   ```

## 2. Schema Overview

Below are the main data models defined in your Prisma schema:

### Currency

- `id` (Int, PK, auto-increment)  
- `symbol` (String, unique) — e.g. `"ETH"`, `"BTC"`

### CurrencyHistory

- `id` (Int, PK, auto-increment)  
- `date` (DateTime)  
- `price` (Float)  
- `currencyId` (Int, FK → Currency.id)  

> Composite unique key: `(date, currencyId)`

## 3. Seeding the Database

A seed script fetches daily historical prices from CryptoCompare and populates your tables.

File: `backend/src/utils/seed.ts`

Key steps:

1. **Clean existing data**  
   ```ts
   await prisma.currencyHistory.deleteMany({});
   ```
2. **Fetch in 2,000-day chunks** using CryptoCompare’s `histoday` API, filtering out zero-volume days.
3. **Upsert** currencies and their history:

   ```ts
   await prisma.currency.upsert({ … });
   await prisma.currencyHistory.upsert({ … });
   ```

### Running the Seed

```bash
# Directly with ts-node
npx ts-node backend/src/utils/seed.ts

# Or after building (if you have a build step)
npm run build
node dist/backend/utils/seed.js
```

By default, it seeds **ETH → EUR**. To target another pair, edit the final line of `seed.ts`:

```ts
populateDb("BTC", "USD");
```

## 4. Using the Prisma Client

Import the shared client from `lib/prisma.ts`:

```ts
import { prisma } from "../lib/prisma";

async function listHistory() {
  const data = await prisma.currencyHistory.findMany({
    where: { currency: { symbol: "ETH" } },
    orderBy: { date: "asc" },
  });
  console.table(data);
}

listHistory();
```

This client is configured to read your `DATABASE_URL` and can be used throughout your backend code.