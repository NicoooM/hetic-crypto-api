# Database

This document explains how the database is configured, seeded, and accessed in the `hetic-crypto-api` backend using Prisma.

## Prisma Client

All database operations use a shared Prisma Client instance:

```ts
// backend/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

You can import and use it anywhere in the backend:

```ts
import { prisma } from "lib/prisma";

async function listUsers() {
  return prisma.user.findMany();
}
```

## Schema Migrations

Prisma’s schema and migrations are managed via the `prisma/schema.prisma` file (not shown). Typical commands:

```bash
# Generate the client after modifying the schema
npx prisma generate

# Create a new migration
npx prisma migrate dev --name add-some-field

# Apply migrations in production
npx prisma migrate deploy
```

## Seeding Historical Currency Prices

A seed script fetches daily historical crypto prices from CryptoCompare and populates two tables: `Currency` and `CurrencyHistory`.

### Configuration

- Make sure you have a valid API key:  
  ```bash
  export CRYPTOCOMPARE_API_KEY="your_api_key_here"
  ```
- The script cleans existing history and upserts new data for a given symbol (default is ETH→EUR).

### Running the Seed Script

```bash
# From project root, using ts-node or compiled JavaScript:
npx ts-node backend/src/utils/seed.ts
```

### What Happens

1. `cleanCurrencyHistory()`—Deletes all rows in `currencyHistory`.  
2. `getCurrencyHistory("ETH", "EUR")`—Fetches chunks of daily data (max 2000 points) until complete.  
3. `populateDb("ETH", "EUR")`  
   - Upserts a `Currency` record for "ETH".  
   - Upserts each `CurrencyHistory` record with `date` and `price`.  

## Wallet and History Services

The backend exposes two main services that interact with user wallets and their historical values.

### WalletService

```ts
import { WalletService } from "services/wallet.service";

const service = new WalletService();
```

Methods:

- `create({ address, title, id })`  
  1. Fetches wallet transactions via Etherscan.  
  2. Loads ETH price history from `currencyHistory`.  
  3. Calculates `valueInCurrency = quantity * price`.  
  4. Creates a `Wallet` record.  
  5. Bulk-inserts enriched `WalletHistory` entries.  

- `all(userId)`  
  Returns all wallets for a given user.

- `delete(walletId, userId)`  
  Deletes a wallet and its related history.

Example:

```ts
const newWallet = await service.create({
  address: "0x1234…",
  title: "My ETH Wallet",
  id: currentUser.id,
});
```

### HistoryService

```ts
import { HistoryService } from "services/history.service";

const historyService = new HistoryService();
```

- `get(filters: { walletId?: number; date?: Date; ... })`  
  Returns `walletHistory` records matching given filters.

Example:

```ts
const recentEntries = await historyService.get({
  walletId: 42,
  date: { gte: new Date("2023-01-01") },
});
```

## Putting It All Together

1. **Migrate** your database:  
   `npx prisma migrate dev`
2. **Seed** historical rates:  
   `npm run seed` (or `npx ts-node backend/src/utils/seed.ts`)
3. **Start** the server:  
   `npm run start:backend`
4. **Use** the `WalletService` and `HistoryService` in your controllers or resolvers to build out APIs.

For more on Prisma and schema modeling, see the official documentation: https://www.prisma.io/docs.