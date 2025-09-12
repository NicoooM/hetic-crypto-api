# CLI Guide

This guide walks you through using the built-in seed script to fetch historical cryptocurrency prices and populate your database.

## Prerequisites

- Node.js (v14+)
- A running database configured via `DATABASE_URL` in your `.env`
- A CryptoCompare API key set as `CRYPTOCOMPARE_API_KEY` in your `.env`
- Dependencies installed (run `npm install` in the project root)

## Running the Seed Script

The seed utility will:

1. Clear existing entries in `currencyHistory`
2. Fetch daily historical prices (up to 2,000 data points per batch) from CryptoCompare
3. Upsert currency records into your database

### Using ts-node (no build required)

```bash
npx ts-node backend/src/utils/seed.ts
```

### Using the Compiled JavaScript

1. Build the project:

   ```bash
   npm run build
   ```

2. Run the compiled script:

   ```bash
   node dist/utils/seed.js
   ```

## Configuration

- By default, the script seeds **ETH** priced in **EUR**:
  ```ts
  cleanCurrencyHistory();
  populateDb("ETH", "EUR");
  ```
- To seed another pair, open `backend/src/utils/seed.ts` and change:
  ```ts
  populateDb("<CRYPTO_SYMBOL>", "<FIAT_SYMBOL>");
  ```

## Inspecting the Results

After the script completes:

1. Launch Prisma Studio to explore tables:
   ```bash
   npx prisma studio
   ```
2. Inspect the `Currency` and `CurrencyHistory` models for populated data.

## Troubleshooting

- If you see fetch errors, verify your `CRYPTOCOMPARE_API_KEY` is correct.
- Check database connectivity by running any Prisma CLI command, for example:
  ```bash
  npx prisma migrate status
  ```
- Logs are printed to the console—look for “Error fetching data:” or “Error populating database:” messages.