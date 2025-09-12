# Environment Variables

This document outlines all the environment variables required by the backend and frontend of the HETIC Crypto API project. Define these in your `.env` files before starting the application.

## Backend

The backend reads the following variables (see `backend/src/constants.ts`):

- `JWT_ACCESS_SECRET`  
  Secret key used to sign JWT access tokens.
- `JWT_REFRESH_SECRET`  
  Secret key used to sign JWT refresh tokens.
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME`  
  Access token lifetime in milliseconds.
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME`  
  Refresh token lifetime in milliseconds (default is 7 days).
- `SMTP_HOST`  
  Hostname of your SMTP server (for email notifications).
- `SMTP_PORT`  
  Port of your SMTP server.
- `SMTP_USER`  
  Username for SMTP authentication.
- `SMTP_PASS`  
  Password for SMTP authentication.
- `API_URL`  
  Public base URL of the backend API (used in email links).
- `CRYPTOCOMPARE_API_KEY`  
  API key for fetching market data from CryptoCompare.
- `ETHERSCAN_API_KEY`  
  API key for fetching blockchain data from Etherscan.
- `CLIENT_URL`  
  Public URL of the frontend application (used in email links).
- `DATABASE_URL`  
  Complete database connection string (e.g., PostgreSQL).
- `POSTGRES_USER`  
  PostgreSQL username (if not embedded in `DATABASE_URL`).
- `POSTGRES_PASSWORD`  
  PostgreSQL password (if not embedded in `DATABASE_URL`).
- `POSTGRES_DB`  
  PostgreSQL database name (if not embedded in `DATABASE_URL`).
- `PORT`  
  Port on which the backend HTTP server listens.

### Example `.env`

Create a file at `backend/.env`:

```dotenv
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000        # e.g. 15 minutes in ms
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000    # e.g. 7 days in ms
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
API_URL=https://api.your-domain.com
CLIENT_URL=https://app.your-domain.com
CRYPTOCOMPARE_API_KEY=xxxxxx
ETHERSCAN_API_KEY=yyyyyy
DATABASE_URL=postgres://user:pass@localhost:5432/your_db
# Or use separate vars:
# POSTGRES_USER=user
# POSTGRES_PASSWORD=pass
# POSTGRES_DB=your_db
PORT=5000
```

## Frontend

The React client uses one environment variable (see `client/src/services/api.ts`):

- `REACT_APP_API_BASE_URL`  
  Base URL for the backend API. Defaults to `http://localhost:5000/api/v1` if not set.

> Note: Create React App requires environment variables to start with `REACT_APP_`.  
> See: https://create-react-app.dev/docs/adding-custom-environment-variables

### Example `.env.local`

Create a file at `client/.env.local`:

```dotenv
REACT_APP_API_BASE_URL=https://api.your-domain.com/api/v1
```

After setting these variables, restart your servers so the changes take effect.