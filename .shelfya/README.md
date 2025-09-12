# Shelfya Deployment

This directory contains configuration and notes for deploying the HETIC Crypto API on Shelfya. It outlines the project structure, required environment variables, and how the frontend and backend communicate.

## Project Structure

- **backend/**  
  An Express API server written in TypeScript  
  - Entry point: `src/index.ts`  
  - Routes exposed under `/api/v1`  
  - Uses cookies for authentication and CORS protection

- **client/**  
  A React application  
  - API service in `src/services/api.ts`  
  - Communicates with the backend using Axios  
  - Handles token refresh via HTTP-only cookies

## Required Environment Variables

Shelfya must inject the following into each service:

Backend (`backend`)

- `PORT`  
  Port for the Express server (e.g., `5000`)
- `CLIENT_URL`  
  Origin allowed by CORS (e.g., `https://your-app.com`)

Client (`client`)

- `REACT_APP_API_BASE_URL`  
  Base URL for API requests (e.g., `https://api.your-app.com/api/v1`)

## Runtime Behavior

1. **Backend**  
   - Applies security middlewares: `helmet`, `cors`, `cookie-parser`.  
   - Reads client IP via `request-ip`.  
   - Validates environment on startup (`verifyEnv`).  
   - Listens on `process.env.PORT`.

2. **Client**  
   - Axios instance uses `withCredentials: true` to include cookies.  
   - Attaches `Authorization: Bearer <token>` header if a token exists in `localStorage`.  
   - On 401/403, attempts token refresh via `/auth/refresh`; on failure, clears the token and redirects to `/login`.

## Next Steps

- Place any Shelfya-specific YAML/JSON files alongside this README.  
- Ensure build commands and service definitions in your Shelfya dashboard reference the `backend` and `client` folders.  
- For detailed setup and development instructions, see the project’s root README.