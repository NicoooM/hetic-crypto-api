# Database Guide

This guide covers how to configure, seed, and interact with your PostgreSQL (or compatible) database using Prisma in the `hetic-crypto-api` backend.

## 1. Configuration

1. Install dependencies:  
   ```bash
   npm install @prisma/client prisma
   ```

2. Set environment variables in your `.env` at the project root:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   CRYPTOCOMPARE_API_KEY="your-crypto-compare-api-key"
   ```

3. (If needed) Run Prisma migrations to create your schema:
   ```bash
   npx prisma migrate deploy
   # or, for development
   npx prisma migrate dev --name init
   ```

## 2. Prisma Client Setup

`backend/src/lib/prisma.ts` exports a singleton Prisma client for easy import across your services:

```ts
// backend/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

Usage example:
```ts
import { prisma } from "lib/prisma";

async function listCurrencies() {
  const currencies = await prisma.currency.findMany();
  console.log(currencies);
}
```

## 3. Seeding Historical Price Data

A seed script fetches daily price history from CryptoCompare and populates two tables: `currency` and `currencyHistory`.

- File: `backend/src/utils/seed.ts`

### What it does

1. **Cleans** existing entries in `currencyHistory`.
2. **Fetches** data in 2,000-day chunks for a given `cryptocurrency` (e.g. `"ETH"`) and conversion currency (e.g. `"EUR"`).
3. **Upserts** the `currency` record.
4. **Upserts** each `currencyHistory` entry (date + price).

### Running the seed script

Ensure your `.env` is set, then:

```bash
npx ts-node backend/src/utils/seed.ts
```

You should see console logs like:

```
Cleaning currency history...
Fetching base data...
Fetching data from 2020-01-01T00:00:00.000Z...
Populating database with ETH data...
```

To change the target cryptocurrency or currency symbol, modify the last line:

```ts
// at the bottom of seed.ts
populateDb("BTC", "USD");
```

## 4. Querying History Data

The `HistoryService` exposes a simple API to retrieve wallet history entries:

```ts
// backend/src/services/history.service.ts
import { prisma } from "lib/prisma";
import type { FiltersSchema } from "schemas/types";

export class HistoryService {
  #prisma = prisma;

  get = async (filters: FiltersSchema) => {
    return this.#prisma.walletHistory.findMany({
      where: filters,
    });
  };
}
```

### Example usage

```ts
import { HistoryService } from "services/history.service";

async function fetchUserHistory(userId: string) {
  const service = new HistoryService();
  const history = await service.get({ userId });
  console.log(history);
}
```

## 5. Helpful Links

- Prisma Docs: https://www.prisma.io/docs
- CryptoCompare API: https://min-api.cryptocompare.com/documentation

With these steps, your database layer is configured, seeded with historical data, and ready for queries.