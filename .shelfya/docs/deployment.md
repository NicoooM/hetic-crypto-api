# Deployment Guide

This guide explains how to deploy the HETIC Crypto API backend. You’ll learn how to configure environment variables, run the server locally, and prepare it for production.

## Prerequisites

- Node.js ≥ 14
- npm or Yarn
- (Optional) A process manager such as PM2 for production

## Environment Variables

Before starting the server, you must set required environment variables. The app will throw an error if any are missing or empty. The full list lives in `backend/src/constants.ts` under `REQUIRED_ENV_VARS`, but at minimum you’ll need:

- `PORT` – HTTP port (e.g. `4000`)
- `CLIENT_URL` – URL of your frontend (defaults to `http://localhost:3000`)

Create a `.env` file in the `backend/` directory (or export vars in your shell):

```env
PORT=4000
CLIENT_URL=http://localhost:3000
# …other vars listed in backend/src/constants.ts
```

## Running Locally

1. Clone the repo and install dependencies  
   ```bash
   git clone https://github.com/NicoooM/hetic-crypto-api.git
   cd hetic-crypto-api/backend
   npm install
   # or yarn install
   ```

2. Ensure your `.env` is in place (see above).

3. Start the server  
   - If you use TypeScript tooling:  
     ```bash
     npx ts-node src/index.ts
     ```
   - If you transpile first:  
     ```bash
     npm run build    # compiles to /dist
     node dist/index.js
     ```

4. You should see  
   ```
   Listening on port 4000...
   ```
   The API is now available at `http://localhost:4000/api/v1`.

## Production Deployment

1. Build your app:  
   ```bash
   npm run build
   ```

2. Start under a process manager (e.g. PM2):  
   ```bash
   pm2 start dist/index.js --name crypto-api
   ```

3. (Optional) Configure your firewall or load balancer to forward traffic to `PORT`.

## Verifying Your Deployment

- Check the console or PM2 logs for the “Listening on port …” message.
- Make a test request:  
  ```bash
  curl http://localhost:4000/api/v1/health
  ```
  *(Replace `/health` with any existing endpoint in your router.)*

- Ensure CORS, cookie parsing, and security headers (via Helmet) behave as expected.

For any missing environment variables, the app will throw an error like:

```
Error: Missing or empty required environment variables: VAR_A, VAR_B
```

Adjust your `.env` or shell exports accordingly and restart the server.