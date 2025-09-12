# Getting Started

This guide walks you through setting up and running the HETIC Crypto API backend and its React client.

## Prerequisites

- Node.js (v16+)
- npm or Yarn
- Git

## Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

## Backend Setup

1. Navigate to the backend folder and install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/` and define the required variables. At minimum, you need:

   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

   For a full list of required environment variables, see `backend/src/constants.ts`. The server will validate these on startup and throw an error if any are missing or empty.

3. Start the backend server:

   ```bash
   # If a dev script is available
   npm run dev

   # Or directly with ts-node
   npx ts-node src/index.ts
   ```

   The API will listen on `http://localhost:<PORT>/api/v1`.

## Client Setup

1. In a new terminal, go to the client folder and install dependencies:

   ```bash
   cd client
   npm install
   ```

2. Start the React development server:

   ```bash
   npm start
   ```

   By default, the client runs on `http://localhost:3000` and proxies API requests to the backend.

## Testing

The React client is configured with Jest and `@testing-library/jest-dom` in `src/setupTests.ts`.

```bash
cd client
npm test
```

## Making API Requests

With both servers running, you can call any backend endpoint. For example:

```bash
curl http://localhost:5000/api/v1/<endpoint>
```

Replace `<endpoint>` with your route of choice (e.g., `users`, `orders`, etc.).