# Getting Started

This guide will walk you through setting up and running both the backend (Express API) and the React client for the HETIC Crypto API project.

## Prerequisites

- Node.js (v14+)
- npm or Yarn
- A PostgreSQL database instance

## 1. Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

## 2. Configure Environment Variables

### Backend

In the `backend` folder, create a file named `.env` and define **all** of the following variables:

```
# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d

# SMTP (for email confirmations, password resets, etc.)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# API & Client URLs
API_URL=http://localhost:5000/api/v1
CLIENT_URL=http://localhost:3000

# External APIs
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
ETHERSCAN_API_KEY=your_etherscan_key

# Database
DATABASE_URL=postgres://user:password@localhost:5432/your_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=your_db

# Server
PORT=5000
```

> On startup, the app will call `verifyEnv()` and throw an error if any required variable is missing or empty.

### Client

In the `client` folder, create a file named `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

This value is picked up in `client/src/services/api.ts` and used as the Axios base URL.

## 3. Install Dependencies

### Backend

```bash
cd backend
npm install
# or
yarn install
```

### Client

```bash
cd ../client
npm install
# or
yarn install
```

## 4. Run the Application

### Start the Backend

```bash
cd backend
npm run start
# or
yarn start
```

You should see:

```
Listening on port 5000...
```

### Start the Client

```bash
cd ../client
npm start
# or
yarn start
```

The React app will open at `http://localhost:3000`.

## 5. Testing the API

Use your browser or a tool like `curl` / Postman to hit any endpoint:

```bash
curl http://localhost:5000/api/v1/status
```

Or log in/register via the client UI and inspect network requests in the browser DevTools.

## 6. Authentication Flow

- Access tokens are stored in `localStorage` under the key `token`.
- Refresh tokens are handled via HTTP-only cookies.
- When a request returns `401` or `403`, the client automatically attempts a token refresh (`/auth/refresh`) before retrying the original request.

For more details on error handling and interceptors, see `client/src/services/api.ts`.