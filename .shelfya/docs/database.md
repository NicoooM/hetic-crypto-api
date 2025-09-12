# Database

This guide covers setting up and interacting with the database in the HETIC Crypto API backend. It explains how to configure Prisma, seed historical cryptocurrency prices, and work with the `WalletService`.

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Prisma Client Setup](#prisma-client-setup)  
- [Seeding Currency History](#seeding-currency-history)  
- [Database Models Overview](#database-models-overview)  
- [Using WalletService](#using-walletservice)  

## Prerequisites

- Node.js ≥ 16  
- A running database (PostgreSQL, MySQL, SQLite, etc.)  
- `CRYPTOCOMPARE_API_KEY` environment variable set for seeding  

Example `.env`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"
CRYPTOCOMPARE_API_KEY="your_api_key"
```

## Prisma Client Setup

The Prisma client is initialized once and reused across the app.  
File: `backend/src/lib/prisma.ts`
```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

After editing your Prisma schema (`schema.prisma`), generate the client:
```bash
npx prisma generate
```

Run migrations:
```bash
npx prisma migrate dev --name init
```

## Seeding Currency History

We fetch daily historical prices from CryptoCompare and populate two tables: `Currency` and `CurrencyHistory`.

File: `backend/src/utils/seed.ts`
```ts
// 1. Clean out existing history
await prisma.currencyHistory.deleteMany({});

// 2. Fetch chunks of daily data
const currencyHistory = await getCurrencyHistory("ETH", "EUR");

// 3. Upsert currency & history entries
await prisma.currency.upsert({ ... });
await prisma.currencyHistory.upsert({ ... });
```

To run the seed script:
```bash
npx ts-node backend/src/utils/seed.ts
```

This will:
- Delete existing `currencyHistory` records  
- Fetch all historical ETH/EUR data  
- Upsert the `Currency` record for ETH  
- Upsert daily `CurrencyHistory` entries

## Database Models Overview

While your Prisma schema may vary, here is a simplified overview:

- Currency  
  - id: Int (PK)  
  - symbol: String (unique)  
  - createdAt, updatedAt  

- CurrencyHistory  
  - id: Int (PK)  
  - date: Date  
  - price: Float  
  - currencyId: Int → Currency.id  

- Wallet  
  - id: Int (PK)  
  - userId: Int  
  - address: String  
  - title: String  

- WalletHistory  
  - id: Int (PK)  
  - walletId: Int → Wallet.id  
  - date: Date  
  - quantity: Float  
  - value: Float  
  - currencyId: Int → Currency.id  

## Using WalletService

The `WalletService` manages user wallets and enriches on-chain balance data with historical ETH prices.

File: `backend/src/services/wallet.service.ts`

### Create a Wallet

```ts
import { WalletService } from "services/wallet.service";

const service = new WalletService();
const newWallet = await service.create({
  address: "0x1234…abcd",
  title: "My Ether Wallet",
  id: userId,
});

// Returns the created wallet record
console.log(newWallet);
```

What happens under the hood:
1. Fetch on-chain balance history via Etherscan utility  
2. Load ETH price history from `CurrencyHistory`  
3. Calculate `valueInCurrency = quantity * price` per day  
4. Create a `Wallet` record  
5. Bulk-insert `WalletHistory` entries with enriched values  

### List All Wallets

```ts
const wallets = await service.all(userId);
console.log(wallets);
```

### Delete a Wallet

```ts
await service.delete(walletId, userId);
```

This removes both the `Wallet` and its related `WalletHistory`.

---

For more on Prisma and schema definitions, see the official docs:  
https://www.prisma.io/docs/reference/api-reference/prisma-client-reference