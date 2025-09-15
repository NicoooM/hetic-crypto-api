# Database Guide

This guide walks you through the database setup, seeding historical price data, and how the Wallet service uses Prisma to store and query your crypto data.

## Table of Contents

- [Prerequisites](#prerequisites)  
- [1. Prisma Client Setup](#1-prisma-client-setup)  
- [2. Environment Variables](#2-environment-variables)  
- [3. Database Migrations](#3-database-migrations)  
- [4. Seeding Historical Currency Data](#4-seeding-historical-currency-data)  
- [5. Wallet Service Overview](#5-wallet-service-overview)  
- [6. Example Usage](#6-example-usage)  

---

## Prerequisites

- Node.js ≥ 14  
- A running PostgreSQL (or compatible) database  
- `@prisma/client` and `prisma` installed in `backend/`  

---

## 1. Prisma Client Setup

All database access goes through a shared Prisma client. The client is instantiated in:

```ts
// backend/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

Import `prisma` in your services to run queries, mutations, and upserts.

---

## 2. Environment Variables

You need to provide:

- `DATABASE_URL` → your PostgreSQL connection string  
- `CRYPTOCOMPARE_API_KEY` → API key for fetching historical price data  

Example `.env`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/crypto
CRYPTOCOMPARE_API_KEY=your_api_key_here
```

---

## 3. Database Migrations

1. Define your schema in `backend/prisma/schema.prisma`.  
2. Run:

   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

3. Generate the client:

   ```bash
   npx prisma generate
   ```

---

## 4. Seeding Historical Currency Data

We fetch daily ETH/EUR history from CryptoCompare and populate two tables: `Currency` and `CurrencyHistory`.

### Seed Script

```ts
// backend/src/utils/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 1. Clear existing history
await prisma.currencyHistory.deleteMany({});

// 2. Fetch historical data in chunks (limit=2000 days)
//    Skips days with zero volume.
const getCurrencyHistory = async (fsym, tsym) => { /* ... */ };

// 3. Upsert Currency and CurrencyHistory
await prisma.currency.upsert({ /* ... */ });
await prisma.currencyHistory.upsert({ /* ... */ });
```

### Running the Seeder

Add a script in `backend/package.json`:

```json
"scripts": {
  "seed": "ts-node src/utils/seed.ts"
}
```

Then run:

```bash
cd backend
npm run seed
```

This will:

1. Delete all rows in `currencyHistory`.  
2. Fetch ETH/EUR daily prices.  
3. Upsert the `Currency` record for ETH.  
4. Upsert each day’s price into `CurrencyHistory`.

---

## 5. Wallet Service Overview

The `WalletService` uses Prisma to create, delete, and list wallets. It enriches on-chain history with fiat prices:

```ts
// backend/src/services/wallet.service.ts
import { prisma } from "lib/prisma";
import { createWalletHistory } from "utils/etherscan";

export class WalletService {
  // Delete a wallet and its history
  delete = async (walletId, userId) => { /* ... */ };

  // Create a new wallet + history
  create = async ({ address, title, id }) => {
    // 1. Fetch on-chain history via Etherscan
    // 2. Load ETH/EUR price map from CurrencyHistory
    // 3. Enrich each entry: valueInCurrency = value * price
    // 4. Insert wallet and history rows
  };

  // List all wallets for a user
  all = async (userId) => { /* ... */ };
}
```

Key points:

- Looks up the `Currency` record for `"ETH"`.  
- Builds a `Map<string (YYYY-MM-DD) → price>` from `currencyHistory`.  
- Calculates `valueInCurrency` for each on-chain event.  
- Uses `prisma.wallet` and `prisma.walletHistory` to persist data.

---

## 6. Example Usage

```ts
import { WalletService } from "services/wallet.service";
const service = new WalletService();

// Create a wallet for user 42
const newWallet = await service.create({
  address: "0x123…",
  title: "My ETH Wallet",
  id: 42,
});

// Delete a wallet
await service.delete(newWallet.id, 42);

// List wallets
const wallets = await service.all(42);
console.log(wallets);
```

---

That's it! You now have a running database schema, seeded historical data, and a service layer to manage wallets and their fiat-denominated histories.