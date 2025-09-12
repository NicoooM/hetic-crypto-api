# Database Guide

This guide explains how to configure, migrate, and seed the database for the HETIC Crypto API backend using Prisma ORM.

## Prerequisites

- Node.js v14+  
- A running database (PostgreSQL, MySQL, SQLite, etc.)  
- A [CryptoCompare API key](https://min-api.cryptocompare.com/)  

## 1. Configure Environment Variables

Create a `.env` file in the `backend/` folder with:

```
# Database connection string (adjust for your provider)
DATABASE_URL="postgresql://user:password@localhost:5432/hetic_crypto_api"

# CryptoCompare API key for fetching historical prices
CRYPTOCOMPARE_API_KEY="YOUR_API_KEY"
```

Prisma reads `DATABASE_URL` and your seed script reads `CRYPTOCOMPARE_API_KEY`.

## 2. Install Dependencies

From the repository root:

```bash
cd backend
npm install
```

This installs `@prisma/client`, `prisma`, and runtime dependencies.

## 3. Initialize Prisma

1. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

2. Run migrations (if you have migration files):

   ```bash
   npx prisma migrate dev --name init
   ```

   This will create your database schema under `prisma/schema.prisma`.

## 4. Seeding the Database

The seed script at `backend/src/utils/seed.ts` does the following:

- Wipes existing entries in `currencyHistory`.  
- Fetches historical daily prices for a given cryptocurrency (default: ETH/EUR).  
- Upserts rows into `currency` and `currencyHistory` tables.

### Run the seed script

```bash
npx ts-node src/utils/seed.ts
```

Or add an npm script in `backend/package.json`:

```json
"scripts": {
  "seed": "ts-node src/utils/seed.ts"
}
```

Then run:

```bash
npm run seed
```

You should see logs like:

```
Cleaning currency history...
Fetching base data...
Populating database with ETH data...
```

## 5. Inspecting Data

Launch Prisma Studio to view your tables in a browser:

```bash
npx prisma studio
```

Navigate to `http://localhost:5555` to inspect `currency` and `currencyHistory`.

---

Now your database is ready! The backend will use `backend/src/lib/prisma.ts` to connect via the generated Prisma client.