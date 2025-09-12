# Getting Started

This guide will help you set up and run the backend API for the HETIC Crypto project. You’ll learn how to install dependencies, configure necessary environment variables, and start the server.

## Prerequisites

- Node.js (v14 or newer)
- npm (v6 or newer)

## Installation

1. Clone the repository and navigate into it:

   ```
   git clone https://github.com/NicoooM/hetic-crypto-api.git
   cd hetic-crypto-api
   ```

2. Install backend dependencies:

   ```
   cd backend
   npm install
   ```

## Configuration

The application relies on several environment variables. Create a `.env` file in `backend/` (you can copy `.env.example` if one exists) and define the following:

- `PORT`  
  The port where the server will listen (e.g. `4000`).

- `CLIENT_URL`  
  The origin URL allowed by CORS (defaults to `http://localhost:3000` if not set).

- Any other variables listed in `backend/src/constants.ts` under `REQUIRED_ENV_VARS`.  
  The app will throw an error on launch if any required variable is missing or empty.

Example `.env`:

```
PORT=4000
CLIENT_URL=http://localhost:3000
# Add other REQUIRED_ENV_VARS here…
```

## Running the Server

### Development

Use `ts-node-dev` for auto-reloading on changes:

```
npx ts-node-dev --respawn --transpile-only src/index.ts
```

> The server will automatically verify your environment variables on startup.  
> You should see a console message like:  
> `Listening on port 4000...`

### Production

1. Compile TypeScript:

   ```
   npx tsc
   ```

2. Run the compiled code:

   ```
   node dist/index.js
   ```

## Testing the API

All routes are mounted under `/api/v1`. For example, to hit a health-check or root endpoint, you might:

```
curl http://localhost:4000/api/v1/health
```

Adjust the path based on the available routes in `backend/src/routes`.

## Troubleshooting

If the server crashes on startup with an error like:

```
Error: Missing or empty required environment variables: FOO, BAR
```

- Double-check your `.env` file has all variables listed in `REQUIRED_ENV_VARS`.
- Ensure no extra whitespace or missing values.

---

You’re now ready to build and extend the HETIC Crypto API. Enjoy!