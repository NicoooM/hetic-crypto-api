# Command Line Interface (CLI) Guide

This guide covers how to seed your database with historical cryptocurrency prices using the provided `seed.ts` script.

## Prerequisites

- Node.js (v14+)
- npm or Yarn
- A running database configured in your Prisma schema
- Prisma CLI installed (`npm install -D prisma`)
- TypeScript and ts-node installed (`npm install -D typescript ts-node`)

## Environment Variables

Create a `.env` file in the project root with the following:

```bash
# CryptoCompare API key (sign up at https://min-api.cryptocompare.com)
CRYPTOCOMPARE_API_KEY=your_api_key_here

# Example Prisma connection URL
DATABASE_URL="postgresql://user:password@localhost:5432/crypto_db"
```

## Install & Prepare

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Generate Prisma client and run migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

## Seed Script

The `seed.ts` script (located at `backend/src/utils/seed.ts`) performs the following:

- Deletes all existing entries in `currencyHistory`.
- Fetches historical daily prices from CryptoCompare.
- Filters out zero-volume days.
- Upserts currencies and their history into the database.

By default, it seeds Ethereum (ETH) prices in Euros (EUR). You can customize the symbols directly in the script.

## Running the Seed

### Using ts-node (development)

```bash
npx ts-node backend/src/utils/seed.ts
```

### Using compiled JavaScript (production)

1. Build your project:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Run the compiled file:

   ```bash
   node dist/utils/seed.js
   ```

You should see console logs indicating the cleaning and fetching progress:

```text
Cleaning currency history...
Fetching base data...
Populating database with ETH data...
Fetching data from 2021-05-01T00:00:00.000Z...
...
```

## Customization

- To seed a different cryptocurrency or target currency, update the last line in `seed.ts`:

  ```ts
  // Change "BTC" and "USD" as needed
  populateDb("BTC", "USD");
  ```

- Adjust the API limit or batching logic by modifying the `limit` constant at the top of the file.

## Troubleshooting

- **Missing API key**: Ensure `CRYPTOCOMPARE_API_KEY` is set and valid.
- **Prisma errors**: Double-check your database connection and run `npx prisma migrate deploy`.
- **Network issues**: Verify your internet connection and that CryptoCompare’s API is reachable.

For more details on Prisma, see their documentation:  
https://www.prisma.io/docs.