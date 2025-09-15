# CLI Seeding Guide

This guide explains how to seed historical cryptocurrency price data into your database using the project's seeding utility. This process fetches data from the CryptoCompare API and populates your database via Prisma.

---

## Overview

The seed utility (`backend/src/utils/seed.ts`) performs two main actions:

1. **Clean the Database**: Removes all existing historical currency data.
2. **Populate Currency History**: Downloads daily price history for a given cryptocurrency (default: ETH/EUR) and inserts it into the database.

---

## Prerequisites

- Node.js
- Prisma set up and your database running
- A valid [CryptoCompare API key](https://min-api.cryptocompare.com/)
- Environment variable `CRYPTOCOMPARE_API_KEY` set

---

## Usage

1. **Set your CryptoCompare API Key**

   Make sure your `.env` file contains:

   ```
   CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key
   ```

2. **Run the Seed Script**

   From the project root:

   ```bash
   cd backend
   ts-node src/utils/seed.ts
   ```
   Or, if using an npm script:
   ```bash
   npm run seed
   ```

---

## What Does the Script Do?

- **Deletes all historical data** from `currencyHistory`.
- **Fetches historical data** for the given cryptocurrency (defaults: ETH => EUR, 2000 days at a time, as much as the API allows).
- **Inserts/updates data**:
  - Ensures the cryptocurrency exists in the `currency` table.
  - Inserts price and date into `currencyHistory` for each day.

---

## Customizing the Script

To change the cryptocurrency or target currency, edit the last lines of `seed.ts`:

```typescript
populateDb("BTC", "USD"); // Example for Bitcoin in USD
```

---

## Example

Output on success may look like:

```
Cleaning currency history...
Fetching base data...
Populating database with ETH data...
...
```

---

## Troubleshooting

- **Missing or invalid API key**: Ensure `CRYPTOCOMPARE_API_KEY` is set and valid.
- **API errors or empty data**: The script logs errors if requests fail or if API limits are reached.
- **Database connection issues**: Ensure that Prisma is configured properly and your database is up.

---

## Next Steps

- Check your database for new entries in `currency` and `currencyHistory`.
- Use the seeded data in your API or frontend projects.

---

## References

- [CryptoCompare API Documentation](https://min-api.cryptocompare.com/documentation)
- [Prisma Documentation](https://www.prisma.io/docs)

---