# Getting Started

This guide will help you set up and run the HETIC Crypto API locally, covering both the backend and frontend (React) applications.

## Prerequisites

- Node.js (>=14)
- npm or yarn
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

## 2. Backend Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   # or
   yarn install
   ```

2. **Configure environment variables**

   Create a `.env` file in `backend/` and add all required keys. The application will throw an error if any are missing or empty. Check `backend/src/constants.ts` for the full list.

   Example `.env` (adjust names and values to your setup):

   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=myuser
   DB_PASSWORD=mypassword
   DB_NAME=crypto_db
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

3. **Start the server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The backend will listen on port defined in your `.env` (default `5000`).

## 3. Frontend (Client) Setup

1. **Install dependencies**

   ```bash
   cd ../client
   npm install
   # or
   yarn install
   ```

2. **Configure environment variables**

   Create a `.env` file in `client/`:

   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
   ```

   > If you leave `REACT_APP_API_BASE_URL` empty, the client defaults to `http://localhost:5000/api/v1`.

3. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

   The React app will open at `http://localhost:3000`.

## 4. How It Works

- **Environment validation**  
  The backend runs `verifyEnv()` on startup, ensuring no required variable is missing or empty.
- **API client**  
  The frontend uses a central `axios` instance (`client/src/services/api.ts`) that:
  - Automatically attaches the JWT token (from `localStorage`) to `Authorization` headers.
  - Attempts to refresh the access token via `/auth/refresh` when it receives a 401/403 response.
  - Persists the refreshed token in `localStorage` and retries the original request.

## 5. Testing Your Setup

1. Register or log in via the frontend UI to obtain an access token.
2. Perform API calls (e.g., fetch market data, manage portfolios).
3. Inspect network requests in your browser’s DevTools and verify the `Authorization` header and refresh flow.

---

You’re now ready to explore and build on top of the HETIC Crypto API! If you encounter issues, ensure your `.env` files are configured correctly and all services are running.