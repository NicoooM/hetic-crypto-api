# Environment Variables

This document lists all required environment variables for the backend API and the React client. Define them in a `.env` file at your project root before starting the application.

## Backend

Create a file named `.env` in the backend root with the following variables:

```dotenv
# JWT settings
JWT_ACCESS_SECRET=yourAccessSecretKey
JWT_REFRESH_SECRET=yourRefreshSecretKey
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m       # e.g. 15m, 1h
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d       # e.g. 7d, 30d

# Email (SMTP) settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

# API & Client URLs
API_URL=http://localhost:5000/api/v1
CLIENT_URL=http://localhost:3000

# Third-party API keys
CRYPTOCOMPARE_API_KEY=yourCryptoCompareApiKey
ETHERSCAN_API_KEY=yourEtherscanApiKey

# Database (PostgreSQL)
DATABASE_URL=postgresql://localhost:5432/your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name

# Server port
PORT=5000
```

Variable descriptions:

- **JWT_ACCESS_SECRET**: Secret key for signing access tokens.
- **JWT_REFRESH_SECRET**: Secret key for signing refresh tokens.
- **JWT_ACCESS_TOKEN_EXPIRATION_TIME**: Token lifetime for access tokens.
- **JWT_REFRESH_TOKEN_EXPIRATION_TIME**: Token lifetime for refresh tokens.
- **SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS**: Credentials for sending verification emails.
- **API_URL**: Base URL clients use to reach the backend (used in emails).
- **CLIENT_URL**: Frontend application URL (used in verification links).
- **CRYPTOCOMPARE_API_KEY**: Key for fetching crypto prices.
- **ETHERSCAN_API_KEY**: Key for querying Etherscan.
- **DATABASE_URL / POSTGRES_***: PostgreSQL connection settings.
- **PORT**: Port on which the Express server listens.

After creating the file, install dependencies and start the server:

```bash
cd backend
npm install
npm run start
```

## Client (React)

In the React client folder, create a `.env` file with:

```dotenv
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

- **REACT_APP_API_BASE_URL**: Base URL for all API requests (must start with `REACT_APP_`).

Then start the client:

```bash
cd client
npm install
npm start
```