# Database Seeding Guide

This guide walks you through populating your database with historical cryptocurrency data (ETH → EUR) using the built-in seed script.

## Prerequisites

- A running PostgreSQL database, configured via `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- Environment variables defined (see `backend/src/constants.ts`), especially:
  - `CRYPTOCOMPARE_API_KEY` – your CryptoCompare API key.
  - `DATABASE_URL` – your Prisma connection string.
- Prisma CLI installed (`npm install -g prisma` or via dev dependency).

## 1. Run Migrations

Ensure your schema is up to date:

```bash
cd backend
npx prisma migrate deploy
```

Or if you’re in development:

```bash
npx prisma migrate dev --name init
```

## 2. Seed the Database

The seed script is located at `backend/src/utils/seed.ts`. It:

- Clears the `currencyHistory` table.
- Fetches daily ETH→EUR price data in 2,000-day chunks.
- Upserts into `currency` and `currencyHistory` tables.

Run it with `ts-node` (requires `ts-node` dev dependency):

```bash
cd backend
npx ts-node src/utils/seed.ts
```

Or add a script in your `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node src/utils/seed.ts"
  }
}
```

Then:

```bash
npm run seed
```

## 3. Verify Data

You can inspect the tables via Prisma Studio:

```bash
npx prisma studio
```

Browse the `Currency` and `CurrencyHistory` models to confirm populated dates and prices.

## 4. Customizing the Seed Script

By default, the script calls:

```ts
cleanCurrencyHistory();
populateDb("ETH", "EUR");
```

To seed Bitcoin or another fiat pair:

1. Open `backend/src/utils/seed.ts`.
2. Change the arguments:

   ```ts
   populateDb("BTC", "USD");
   ```

3. Re-run the seed command.

## 5. Troubleshooting

- **Missing API Key**: Verify `process.env.CRYPTOCOMPARE_API_KEY` is set and valid.
- **Rate Limits**: CryptoCompare free tier may throttle requests; consider adding delays or reducing `limit`.
- **Empty Response**: The script stops when `volumefrom === 0`. If you need earlier history, lower `limit`.

---

For more on Prisma seeding, see the official guide:  
https://www.prisma.io/docs/guides/database/seed-database