# CLI Guide

This guide covers the command-line steps to populate your database with historical cryptocurrency prices using the built-in seed script.

## Prerequisites

- You have a running database and valid Prisma setup.
- Environment variable `CRYPTOCOMPARE_API_KEY` is set to your CryptoCompare API key.
- Your project dependencies are installed (`npm install` or `yarn`).

## Running the Seed Script

The seed script will:

1. Remove all existing rows from the `currencyHistory` table.
2. Fetch historical daily prices (up to 2000 days per request) from CryptoCompare.
3. Upsert the specified cryptocurrency (default: `ETH`) and its daily price history (default: `EUR`) into your database.

### One-off Run

On macOS/Linux:
```bash
export CRYPTOCOMPARE_API_KEY="your_api_key_here"
npx ts-node backend/src/utils/seed.ts
```

On Windows (PowerShell):
```powershell
$env:CRYPTOCOMPARE_API_KEY="your_api_key_here"
npx ts-node backend/src/utils/seed.ts
```

You should see logs like:
```
Cleaning currency history...
Fetching base data...
Populating database with ETH data...
Fetching data from 2021-01-01T00:00:00.000Z...
…
```

### Customizing the Script

By default, the script calls:
```ts
cleanCurrencyHistory();
populateDb("ETH", "EUR");
```

To seed a different pair:

1. Open `backend/src/utils/seed.ts`.
2. Change the arguments to `populateDb(<CRYPTO_SYMBOL>, <FIAT_SYMBOL>)`.  
   For example:
   ```ts
   populateDb("BTC", "USD");
   ```
3. Re-run the script.

## What’s Happening Under the Hood

- `cleanCurrencyHistory()`: Deletes all records in `currencyHistory`.
- `getCurrencyHistory(symbol, convert)`:
  - Fetches daily price data in chunks (max 2000 days) until no more new data.
  - Filters out days with zero trading volume.
- `populateDb(symbol, convert)`:
  - Upserts the currency in `Currency` table.
  - Upserts each daily price point in `CurrencyHistory` (based on date + currency ID unique constraint).

## Troubleshooting

- If you see `Error fetching data:`, verify your `CRYPTOCOMPARE_API_KEY` is valid and has remaining quota.
- If Prisma errors occur, ensure your database is running and your Prisma schema/migrations are up to date.