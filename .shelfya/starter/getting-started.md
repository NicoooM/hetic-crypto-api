# Getting Started

This guide will help you set up and run the HETIC Crypto API project—including both the backend server and the client application.

## Prerequisites

- Node.js (>= 14.x) and npm (or Yarn)
- Git
- A running database if your routes require one
- (Optional) A tool like Visual Studio Code

## 1. Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

## 2. Backend Setup

1. Navigate to the backend folder and install dependencies:

   ```bash
   cd backend
   npm install
   # or
   yarn
   ```

2. Create a `.env` file in `backend/` based on your environment. At minimum, define:

   ```
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

   The server will call `verifyEnv()` on startup, which will throw an error if any required variables are missing or empty. Check `backend/src/constants.ts` for the full list of `REQUIRED_ENV_VARS`.

3. Start the server:

   ```bash
   # in backend/
   npm run dev       # if you have a dev script (e.g. using nodemon)
   # or
   node dist/index.js  # after building with tsc
   ```

   The Express server will listen on `http://localhost:<PORT>/api/v1`.

## 3. Client Setup

1. Open a new terminal, navigate to the client folder, and install dependencies:

   ```bash
   cd client
   npm install
   # or
   yarn
   ```

2. Create a `.env` file in `client/` with at least:

   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
   ```

   This variable configures the base URL for all API calls in `client/src/services/api.ts`.

3. Start the React app:

   ```bash
   npm start
   # or
   yarn start
   ```

   The client will launch at `http://localhost:3000` (by default).

## 4. How It Works

- **Backend**  
  - Uses Express with middleware: CORS, Helmet, JSON parsing, cookie parsing and IP detection.  
  - Mounts all routes under `/api/v1`.  
  - On startup, calls `verifyEnv()` to ensure all required environment variables are set.

- **Client**  
  - Uses Axios instance (`client/src/services/api.ts`) to talk to the backend.  
  - Automatically includes the Bearer token from `localStorage` on each request.  
  - Handles `401/403` responses by:
    1. Pausing the original request.
    2. Attempting a refresh via `/auth/refresh` (relying on HTTP-only cookies).
    3. Retrying queued requests once a new access token is obtained.
    4. Redirecting to `/login` after a refresh failure.

## 5. Testing the Setup

From your terminal or Postman/Curl:

```bash
curl http://localhost:5000/api/v1/health
# or any other route your router exposes
```

You should receive a valid JSON response or status code defined by your route handlers.

---

With both services running, you’re all set to develop features, test endpoints, and build your frontend against the HETIC Crypto API!