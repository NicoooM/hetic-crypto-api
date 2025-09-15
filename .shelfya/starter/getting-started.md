# Getting Started

This guide walks you through setting up and running the Crypto API backend locally.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Git

## Clone the Repo

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api/backend
```

## Install Dependencies

```bash
npm install
# or
yarn install
```

## Environment Variables

Create a `.env` file in `backend/` with the following variables:

```env
# Port where the server will listen
PORT=4000

# Client application URL (for CORS)
CLIENT_URL=http://localhost:3000
```

> Note: The `verifyEnv` utility will throw an error if any required variable is missing.

## Available Scripts

- `npm run dev`  
  Starts the server in development mode (requires `ts-node-dev` or similar).

- `npm start`  
  Builds and runs the compiled code (requires a build step to be defined in package.json).

> If scripts aren’t defined, you can run directly with:
> ```bash
> npx ts-node src/index.ts
> ```

## How It Works

1. **Express server** listens on `PORT`.
2. **Middleware** applied in order:
   - `cookie-parser`  
   - `cors` (configured with `CLIENT_URL` and `credentials: true`)  
   - `helmet` (security headers)  
   - `express.json()` (JSON body parsing)  
   - `request-ip` (attach client IP on `req.clientIp`)
3. **Routes** are mounted under `/api/v1`  
   All your API endpoints live in the `routes` module and will be accessible at:
   ```
   http://localhost:<PORT>/api/v1/<your-route>
   ```

## Run the Server

```bash
npm run dev
```

You should see:

```
Listening on port 4000...
```

## Testing the API

Use `curl`, Postman, or your front-end client to hit an endpoint:

```bash
curl http://localhost:4000/api/v1/health
```

Replace `/health` with any route you’ve defined in `routes`.

---

You’re all set! Start building or integrating your front-end against this Crypto API.