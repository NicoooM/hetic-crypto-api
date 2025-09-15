# Installation

Follow these steps to get the HETIC Crypto API up and running on your machine.

## Prerequisites

- Node.js (v14 or later)
- npm or Yarn
- PostgreSQL database

## 1. Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api/backend
```

## 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

## 3. Configure Environment Variables

The API relies on a set of required environment variables. Create a `.env` file in the `backend` folder and populate it with values for each key:

```
# JWT secrets and expirations
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000            # in milliseconds
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000        # 7 days in ms

# SMTP configuration (for email notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=yourEmailPassword

# URLs
API_URL=http://localhost:3000
CLIENT_URL=http://localhost:3001

# External API keys
CRYPTOCOMPARE_API_KEY=yourCryptoCompareKey
ETHERSCAN_API_KEY=yourEtherscanKey

# Database connection
DATABASE_URL=postgres://localhost:5432
POSTGRES_USER=dbUser
POSTGRES_PASSWORD=dbPassword
POSTGRES_DB=dbName

# Application port
PORT=3000
```

The `verifyEnv()` utility runs at startup and will throw an error if any of these are missing or empty.

## 4. Run Database Migrations

Ensure your PostgreSQL instance is running, then apply any pending migrations (if applicable). For example, if you use `knex`:

```bash
npx knex migrate:latest
```

*(Replace with your migration tool command.)*

## 5. Start the Server

With everything configured, start the API:

Using npm:

```bash
npm run start
```

Or in development mode (with auto-reload):

```bash
npm run dev
```

Or using Yarn:

```bash
yarn start
```

The API will be accessible at `http://localhost:<PORT>` (default: 3000).

## 6. Verify It’s Working

Send a test request:

```bash
curl http://localhost:3000/health
```

You should receive a `200 OK` response (assuming a health-check route is implemented). If the server fails to start, check your `.env` entries—missing or empty values will be reported in the startup logs.