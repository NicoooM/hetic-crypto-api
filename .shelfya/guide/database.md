# Database Guide

This guide covers how to set up and use the database layer in the Hetic Crypto API project. We leverage Prisma as our ORM and store:

- Cryptocurrency metadata (`currency` table)
- Daily price history (`currencyHistory` table)
- User wallets (`wallet` table)
- Wallet balance snapshots (`walletHistory` table)

---

## Prerequisites

- Node.js >= 14
- A PostgreSQL (or MySQL) database
- `CRYPTOCOMPARE_API_KEY` environment variable set
- Etherscan API configured for wallet history

---

## 1. Install & Configure Prisma

1. Install dependencies:
   ```bash
   npm install @prisma/client prisma
   ```
2. Create or update your `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/crypto-db?schema=public"
   CRYPTOCOMPARE_API_KEY="your-crypto-compare-api-key"
   ```
3. Generate the Prisma client & apply migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

The client is exported in `backend/src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

---

## 2. Seeding Historical Prices

We provide a seed script to fetch daily historical prices from CryptoCompare and populate your `currency` and `currencyHistory` tables.

File: `backend/src/utils/seed.ts`

Key steps:

1. **Clean up** existing history:
   ```ts
   await prisma.currencyHistory.deleteMany({});
   ```
2. **Fetch** in batches (up to 2000 days) for a symbol (e.g., `ETH` → `EUR`).
3. **Upsert**:
   - Create or find the `currency` row (`symbol = "ETH"`).
   - Upsert each history entry by date & currency ID.

### Running the Seed

```bash
# From project root
npx ts-node backend/src/utils/seed.ts
```

On success, you’ll see logs:
```
Cleaning currency history...
Fetching base data...
Populating database with ETH data...
```

---

## 3. Wallet Service

`WalletService` wraps common operations on wallets and their histories:

File: `backend/src/services/wallet.service.ts`

### Methods

- `create({ address, title, id: userId })`
  1. Fetch on-chain history via Etherscan (`createWalletHistory`).
  2. Load ETH prices from `currencyHistory`.
  3. Enrich each entry:  
     `valueInCurrency = quantity * ETH_price_on_date`.
  4. Insert into `wallet` and bulk-insert into `walletHistory`.

- `all(userId)`
  - Retrieves all wallets for a given user.

- `delete(walletId, userId)`
  - Deletes a wallet and its history.

### Example Usage

```ts
import { WalletService } from "services/wallet.service";

const service = new WalletService();

// Create a new wallet for user #1
const wallet = await service.create({
  address: "0x1234…abcd",
  title: "My ETH Wallet",
  id: 1
});

// List wallets
const wallets = await service.all(1);

// Delete a wallet
await service.delete(wallet.id, 1);
```

---

## 4. Tips & References

- Prisma docs: https://www.prisma.io/docs
- CryptoCompare API: https://min-api.cryptocompare.com
- Etherscan utils: see `backend/src/utils/etherscan.ts`

Keep your API keys secure and rotate them if exposed. Happy coding!