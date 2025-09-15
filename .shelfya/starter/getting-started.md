# Getting Started

This guide will help you set up and run the HETIC Crypto API backend locally. You’ll learn how to install dependencies, configure environment variables, seed the database with historical price data, and start the server.

## Prerequisites

- **Node.js** v14+ and **npm** (or **yarn**)
- A running database supported by [Prisma](https://www.prisma.io/) (e.g., PostgreSQL, MySQL)
- A [CryptoCompare API key](https://min-api.cryptocompare.com/) to fetch historical price data

## 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api/backend

# Install dependencies
npm install
# or
yarn install
```

## 2. Configure Environment Variables

Create a `.env` file in `backend/` and define the following variables:

```env
# Server
PORT=4000
CLIENT_URL=http://localhost:3000

# Database (example for PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/crypto_db

# CryptoCompare API
CRYPTOCOMPARE_API_KEY=your_api_key_here
```

The server will verify that all required variables are set at startup. If any are missing or empty, it will throw an error:

```bash
Error: Missing or empty required environment variables: PORT, DATABASE_URL, CRYPTOCOMPARE_API_KEY
```

## 3. Seed the Database

Before running the server, populate your database with historical cryptocurrency prices:

```bash
npx ts-node src/utils/seed.ts
```

What happens:

- The script cleans any existing `currencyHistory` records.
- It fetches daily price data for Ethereum (ETH → EUR) in batches from CryptoCompare.
- It upserts currency entries and their history into your database.

You should see logs like:

```
Cleaning currency history...
Fetching base data...
Populating database with ETH data...
```

## 4. Start the Server

Once the database is seeded, start the Express server:

```bash
npx ts-node src/index.ts
```

Or, if you have a dev script:

```bash
npm run dev
```

You should see:

```
Listening on port 4000...
```

The API is now available at `http://localhost:4000/api/v1`.

## 5. Test the API

- Open your browser or API client (Postman, Insomnia).
- Send a request to one of the routes under `/api/v1`.
- Example:  
  ```bash
  curl http://localhost:4000/api/v1/cryptocurrencies
  ```

## Next Steps

- Implement frontend integration using `CLIENT_URL`.
- Add more endpoints or authentication.
- Deploy to production with proper environment configuration and SSL.

For more details, explore the source:

- `src/index.ts` – Server setup (Express, CORS, Helmet, request-ip)
- `src/utils/verify-env.ts` – Environment variable validation
- `src/utils/seed.ts` – Database seeding with Prisma and CryptoCompare API