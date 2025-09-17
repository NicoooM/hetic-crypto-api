# CLI Utilities

## Overview
This set of CLI utilities provides essential features for verifying required environment variables and seeding the application's database with cryptocurrency price history data. These utilities are typically invoked as scripts during application deployment or development setup to ensure the application environment is correctly configured and that seed data is loaded for immediate use.

## Key Features
- **Environment Variable Validation**: Ensures all necessary environment variables are defined and non-empty before starting the backend, preventing runtime errors and misconfiguration.
- **Database Seeding with Crypto History**: Fetches and loads historical cryptocurrency price data into the local database, supporting application features that require up-to-date or historical rates.
- **Cleanup of Currency History**: Clears previous currency history data to avoid conflicts and ensure a fresh seeding process.
- **Supports Upserts & Resilience**: Ensures seeding is idempotent and resilient to partial failures — existing records are updated, while missing ones are created.

## System Errors
- **Missing Environment Variables**:  
  - **Description**: The CLI will throw an error if any required environment variable is not set or is empty.
  - **Resolution**: Ensure all environment variables defined in the application's requirements are set in your environment (e.g., `.env` file or system variables) before running the CLI.
- **Network/API Errors During Seeding**:  
  - **Description**: If there is a failure communicating with the external CryptoCompare API, price data may not be seeded.
  - **Resolution**: Check your network connection and ensure the `CRYPTOCOMPARE_API_KEY` is correctly set and valid. Retry after resolving network issues.
- **Database Connection Errors**:  
  - **Description**: Problems with connecting to the database (such as misconfigured connection strings or service downtime) will prevent the seeding process.
  - **Resolution**: Validate your database connection settings and ensure the database service is running and accessible.
- **Invalid Data in Response**:  
  - **Description**: If invalid data is returned (e.g., missing fields), those entries are skipped. This may result in incomplete historical data.
  - **Resolution**: Verify that the external API returns complete data and that your API key has sufficient permissions.

## Usage Examples

```bash
# Check for required environment variables before running the app
node -e "require('./backend/src/utils/verify-env').verifyEnv()"

# Seed database with ETH/EUR price history (typically run via a script)
node backend/src/utils/seed.js

# In package.json, you might have:
# "scripts": {
#   "verify-env": "node backend/src/utils/verify-env.js",
#   "seed:db": "node backend/src/utils/seed.js"
# }
```

## System Integration

```mermaid
flowchart LR
  envVars[".env / Environment Variables"] --> verifyEnv["CLI: verify-env Utility"] --> appBoot["Application Bootstrapping"]

  seedUtil["CLI: Database Seeding Utility"] --> cryptoAPI["CryptoCompare API"]
  seedUtil --> prismaORM["Prisma ORM/Database"]
  appBoot --> prismaORM
  cryptoAPI -.-> seedUtil
  prismaORM --> appFeatures["App Features Requiring Data"]

  envVars -. used by .-> seedUtil

  classDef cli fill:#ffe4b5,stroke:#333,stroke-width:1.5px;
  verifyEnv,seedUtil,class cli;

  style prismaORM fill:#bbf7d0
  style appFeatures fill:#caf0f8
  style cryptoAPI fill:#f1c0e8
```
