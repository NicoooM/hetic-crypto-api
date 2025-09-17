# CLI Seeding Utility (`seed.ts`)

## Overview
The CLI Seeding Utility automates the process of cleaning and repopulating the cryptocurrency historical prices in the application's database. Its primary function is to synchronize local data with remote market data, making sure developers and system operators can rapidly reset or populate the currency database with up-to-date market values for cryptocurrencies (e.g., ETH in EUR).

## Key Features
- **Database Cleanup**: Deletes all existing cryptocurrency historical price data before reseeding, ensuring no outdated data remains.
- **External Data Fetching**: Connects to the CryptoCompare API to retrieve comprehensive historical price data for a specified cryptocurrency pair (e.g., ETH to EUR) in daily increments.
- **Bulk Database Population**: Recreates the cryptocurrency record (if necessary) and inserts or updates daily price entries for the cryptocurrency.
- **Idempotency & Upserts**: Uses upsert pattern for both currency and price history entries to avoid duplicates and allow safe repeated runs.
- **Error Logging & Skipping Invalid Data**: Provides console outputs for errors and warnings, skipping any invalid data points received from the external API.

## System Errors

- **Connection/Network Errors**:  
  *Description*: Issues when connecting to CryptoCompare API, often due to network disruptions or invalid API keys.  
  *Resolution*: Check your internet connection and ensure `CRYPTOCOMPARE_API_KEY` is correctly configured in the environment.

- **Database Access Errors**:  
  *Description*: Issues when Prisma ORM fails to connect or execute queries against the database.  
  *Resolution*: Verify that database services are running and Prisma is configured properly.

- **API Rate Limiting or Throttling**:  
  *Description*: The API returns incomplete or error responses due to excessive request frequency.  
  *Resolution*: Check CryptoCompare documentation for rate limits and adjust invocation frequency or use proper API keys.

- **Invalid or Incomplete Data**:  
  *Description*: Some data entries from the API are malformed or lack price/volume information, resulting in skipping those entries with a warning.  
  *Resolution*: This is expected; skipped entries are logged. No user action necessary unless data gaps become significant.

## Usage Examples

```bash
# Run the seed script using Bun to clean and populate the DB with ETH/EUR historical data
bun run backend/src/utils/seed.ts

# Or, if you want to adjust the script, update the symbols in the code for different cryptocurrencies/currencies.
# Example: populateDb("BTC", "USD");
```

## System Integration

```
┌────────────────────┐     ┌────────────────────┐     ┌──────────────────────┐
│  CryptoCompare API │ ───▶│   seed.ts Utility  │ ───▶│     Prisma ORM       │
│ (external service) │     │ (CLI Seeder)       │     │ (Database Adapter)   │
└────────────────────┘     └────────────────────┘     └──────────────────────┘
                                    │                           │
                                    ▼                           ▼
                             [Fetches data]            [Updates DB records]
                                                            │
                                                            ▼
                                                ┌─────────────────────────────┐
                                                │    Local Currency/History   │
                                                │         Database            │
                                                └─────────────────────────────┘
```

- **Dependencies**: 
  - Requires a working database and Prisma client setup.
  - Needs a valid CryptoCompare API key (`CRYPTOCOMPARE_API_KEY` env variable).
- **Process**: 
  - Deletes previous history.
  - Fetches fresh data from external API.
  - Upserts records into local database.
- **Consumers**: 
  - Other backend services relying on up-to-date currency price history for analytics, reporting, or serving API requests.