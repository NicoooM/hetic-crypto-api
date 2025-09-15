# Database Guide

This guide covers setting up and populating the database for the HETIC Crypto API backend, using Prisma as the ORM and a seed script to fetch historical ETH/EUR rates.

## Prerequisites

- Node.js v14+  
- A running database matching your `DATABASE_URL` (PostgreSQL, MySQL, SQLite, etc.)  
- CryptoCompare API key in `CRYPTOCOMPARE_API_KEY`  

Create a `.env` file at the project root:

```
DATABASE_URL="postgresql://user:password@localhost:5432/hetic_crypto"
CRYPTOCOMPARE_API_KEY="your_api_key_here"
```

## Install & Generate Prisma Client

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
3. Apply migrations (if using migrations):
   ```bash
   npx prisma migrate dev --name init
   ```
   If you don’t have migrations, refer to Prisma’s Getting Started guide:  
   https://www.prisma.io/docs/getting-started

## Seeding Historical Currency Data

The seed utility (`backend/src/utils/seed.ts`) does two things:

1. Cleans out `currencyHistory` table.  
2. Fetches daily ETH/EUR rates from CryptoCompare and upserts them into:
   - `Currency` (symbol “ETH”)  
   - `CurrencyHistory` (date + price)

### Run the Seed Script

Ensure `ts-node` is installed (or run via any TypeScript runner):

```bash
npm install -D ts-node
npx ts-node backend/src/utils/seed.ts
```

You should see logs like:

```
Cleaning currency history...
Fetching base data...
Populating database with ETH data...
```

Verify in your database that:

- A row exists in `Currency` with `symbol = 'ETH'`
- Many rows exist in `CurrencyHistory` with valid `date` and `price`

## Using the WalletService

The `WalletService` in `backend/src/services/wallet.service.ts` provides wallet CRUD and history enrichment:

```ts
import { WalletService } from "services/wallet.service";

const service = new WalletService();
const userId = 42;

// Create a new wallet (address, title + userId)
const wallet = await service.create({
  address: "0x1234…",
  title: "My ETH Wallet",
  id: userId,
});

// List all wallets for a user
const wallets = await service.all(userId);

// Delete a wallet by its ID
await service.delete(wallet.id, userId);
```

Behind the scenes, `create()` will:
1. Fetch on-chain ETH movements via Etherscan (`createWalletHistory`)  
2. Match each date to your seeded `CurrencyHistory` price  
3. Store aggregated entries in `WalletHistory`  

## Further Resources

- Prisma Docs: https://www.prisma.io/docs  
- CryptoCompare Histoday API:  
  https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday