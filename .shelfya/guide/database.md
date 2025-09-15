# Database Guide

This guide covers configuring your database with Prisma, seeding historical currency data, and interacting with your tables in code (e.g., wallets and histories).

## 1. Prerequisites

- A running PostgreSQL (or MySQL/SQLite) instance.
- Node.js ≥ 16.
- `DATABASE_URL` set in your `.env` (e.g., `postgresql://user:pass@localhost:5432/dbname`).
- `CRYPTOCOMPARE_API_KEY` in your environment for historical price data.

## 2. Prisma Setup

1. Install dependencies in your `backend/` folder:
   ```bash
   cd backend
   npm install @prisma/client prisma
   ```
2. Initialize Prisma (if not already done):
   ```bash
   npx prisma init
   ```
3. Update `prisma/schema.prisma` to define your models (`Currency`, `CurrencyHistory`, `Wallet`, `WalletHistory`, etc.).
4. Run your migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

Internally, your code uses a shared Prisma client at `src/lib/prisma.ts`:

```ts
// backend/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

## 3. Seeding Historical Currency Data

We use CryptoCompare’s API to fetch daily ETH→EUR prices and store them in `currency` and `currencyHistory`.

### Seed Script

```ts
// backend/src/utils/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ... (fetch logic in cleanCurrencyHistory, getCurrencyHistory, populateDb)

cleanCurrencyHistory();
populateDb("ETH", "EUR");
```

### How to Run

1. Ensure `.env` has `CRYPTOCOMPARE_API_KEY`.
2. From the `backend/` directory:
   ```bash
   npx ts-node src/utils/seed.ts
   ```
3. Check your database:
   ```sql
   SELECT symbol FROM Currency;
   SELECT date, price FROM CurrencyHistory ORDER BY date DESC LIMIT 5;
   ```

## 4. Using Prisma in Services

### WalletService Example

`WalletService` creates, lists, and deletes wallets, enriching transaction history with ETH prices from `CurrencyHistory`.

```ts
// backend/src/services/wallet.service.ts
import { prisma } from "lib/prisma";

export class WalletService {
  #prisma = prisma;

  create = async ({ address, title, id }) => {
    // 1. Retrieve on-chain history via Etherscan util
    const walletHistory = await createWalletHistory(address);

    // 2. Load ETH currency and its daily prices
    const currency = await prisma.currency.findUnique({ where: { symbol: "ETH" } });
    const cryptoHistory = await prisma.currencyHistory.findMany({ where: { currencyId: currency.id } });
    const priceMap = new Map(cryptoHistory.map(e => [e.date.toISOString().split("T")[0], e.price]));

    // 3. Enrich with fiat values
    const enriched = walletHistory.map(entry => {
      const key = entry.date.toISOString().split("T")[0];
      return { ...entry, valueInCurrency: entry.value * (priceMap.get(key) || 0) };
    });

    // 4. Persist wallet and history
    const wallet = await prisma.wallet.create({ data: { userId: id, address, title } });
    await prisma.walletHistory.createMany({
      data: enriched.map(e => ({
        walletId: wallet.id,
        date: e.date,
        quantity: e.value,
        value: e.valueInCurrency,
        currencyId: currency.id,
      })),
    });

    return wallet;
  };

  all = async (userId) => this.#prisma.wallet.findMany({ where: { userId } });

  delete = async (walletId, userId) => {
    await this.#prisma.walletHistory.deleteMany({ where: { walletId } });
    await this.#prisma.wallet.delete({ where: { id: walletId, userId } });
  };
}
```

## 5. Next Steps

- Add more currencies by modifying `populateDb("BTC", "USD")` and re-running the seed script.
- Expose CRUD endpoints in your API (using Express, Fastify, etc.) that call `WalletService`.
- Monitor database performance and add indexes on commonly queried fields (e.g., `currencyId`, `date`).