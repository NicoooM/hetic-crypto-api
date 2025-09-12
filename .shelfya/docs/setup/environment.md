# Environment Variables Setup

This document outlines all required environment variables for running the backend of the HETIC Crypto API. The application will validate these variables at startup—if any are missing or empty, it will throw an error.

## 1. Create a `.env` File

In the `backend/` directory, create a file named `.env`:

```bash
cd backend
touch .env
```

## 2. Define Required Variables

Add the following entries to your `.env` file. Replace placeholder values with your actual secrets and URLs.

```dotenv
# JWT settings
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000          # 15 minutes in ms
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000      # 7 days in ms

# Email (SMTP) settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# API endpoints
API_URL=http://localhost:3000
CLIENT_URL=http://localhost:8080

# External API keys
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
ETHERSCAN_API_KEY=your_etherscan_key

# Database (Postgres)
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name

# Server port
PORT=3000
```

### Variable Descriptions

- **JWT_ACCESS_SECRET**: Secret key for signing access tokens.  
- **JWT_REFRESH_SECRET**: Secret key for signing refresh tokens.  
- **JWT_ACCESS_TOKEN_EXPIRATION_TIME**: Access token lifespan in milliseconds.  
- **JWT_REFRESH_TOKEN_EXPIRATION_TIME**: Refresh token lifespan in milliseconds.  
- **SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS**: SMTP server configuration for sending verification/password emails.  
- **API_URL**: Base URL where your backend is reachable.  
- **CLIENT_URL**: URL of your frontend application (for email links, CORS, etc.).  
- **CRYPTOCOMPARE_API_KEY, ETHERSCAN_API_KEY**: Keys for external crypto data providers.  
- **DATABASE_URL**: Full Postgres connection string.  
- **POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB**: Individual Postgres credentials (required by some ORMs).  
- **PORT**: TCP port on which the backend will listen.

## 3. Verify Environment at Startup

The application runs the `verifyEnv()` utility on launch, ensuring all required variables are set:

```ts
import { verifyEnv } from "./utils/verify-env";

verifyEnv();
// If any variable is missing or empty, the process will exit with an error.
```

Simply start your server as usual:

```bash
npm install
npm run build
npm start
```

If everything is configured correctly, your backend will start without errors on the specified `PORT`.