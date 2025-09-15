# Getting Started

This guide walks you through setting up and running the Crypto API backend.

## Prerequisites

- Node.js (v14 or higher)
- npm or Yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api/backend

# Install dependencies
npm install
# or
yarn install
```

## Configuration

1. In the `backend` folder, create a file named `.env`.
2. Define the following environment variables (and any others listed in `backend/src/constants.ts`):

   ```
   PORT=3001
   CLIENT_URL=http://localhost:3000
   ```

   - `PORT`: the port on which the server will listen.
   - `CLIENT_URL`: the allowed origin for CORS requests (defaults to `http://localhost:3000` if unset).

   On startup the app checks for missing or empty values and will throw an error if any required variables are not defined.

## Running the Server

**Development mode (with hot reload, if configured):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

You should see a log message like:

```
Listening on port 3001...
```

## Using the API

All routes are mounted under the `/api/v1` prefix. For example:

```bash
curl http://localhost:3001/api/v1/your-endpoint
```

Replace `your-endpoint` with the desired route defined in the project.

## Middleware & Security

The server is preconfigured with:

- `cors` (supports credentials; origin from `CLIENT_URL`)
- `helmet` for secure HTTP headers
- `cookie-parser` for parsing cookies
- `express.json()` to handle JSON payloads
- `request-ip` to capture the client IP address

Refer to the source in `backend/src/index.ts` for details on middleware setup.