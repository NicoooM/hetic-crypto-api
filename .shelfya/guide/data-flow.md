# Application Data Flow

## Overview
This module describes the end-to-end data flow in the hetic-crypto-api application, outlining how user requests, authentication, and portfolio data are managed and traversed between the front-end client, backend server, and persistent storage. It emphasizes the journey of data, user authentication lifecycle, and portfolio interactions, providing a system-level perspective on how major components interoperate to deliver core user experiences in the crypto API platform.

## Key Features
- **User Authentication Lifecycle**: Orchestrates user login, logout, and token-based session management, integrating local storage and HTTP-only cookies for secure handling.
- **Protected Route Enforcement**: Ensures API endpoints for wallets, history, and profile are accessible only to authenticated users via token verification middleware.
- **Portfolio and Wallet Data Management**: Facilitates retrieval and updates of wallet, transaction history, and portfolio information by bridging client requests to the server and database layers.
- **Resilient Token Refresh**: Implements automatic access token refresh on the client side using refresh tokens and retries failed API requests without user intervention.
- **Consistent Data Synchronization**: Maintains coherence between UI state and backend data using standardized API calls and context-based React state management.

## System Errors
- **401/403 Unauthorized (API Responses)**: Signals invalid or expired access tokens. Resolution: The client transparently refreshes the token and retries the original request, or – if unable – redirects to the login screen after token removal.
- **Token Refresh Failure**: Occurs if the refresh token is invalid or expired. Resolution: The user is logged out and prompted to re-authenticate after a delay.
- **useAuth Hook Misuse**: Error thrown if `useAuth` is used outside its React Provider context. Resolution: Ensure `useAuth` is only called within components wrapped by `AuthProvider`.

## Usage Examples

```typescript
// Client-side login (useAuth hook usage)
import { useAuth } from "hooks/useAuth";
const { login, logout, user } = useAuth();

await login("user@example.com", "securepassword");
// User gets authenticated, token is stored, state updates to authenticated.

// Making an API request (handled by API service)
import API from "services/api";
const wallets = await API.get("/wallet");
// Automatically attaches access token; refreshes automatically on expiry.

// Accessing protected backend route (Express backend)
router.use("/wallet", verifyAccessToken, walletRouter);
// Only authenticated requests with valid tokens are allowed.

// Logout flow
await logout();
// Cleans up tokens locally and in backend, UI reflects logout state.
```

## System Integration

```mermaid
flowchart LR
  User["User (Browser)"]
  UI["React App (Hooks & Context)"]
  APISvc["API Service (Axios)"]
  BAPI["Backend API (Express)"]
  TokenMW["Token Middleware (verifyAccessToken)"]
  Router["Express Routers"]
  Prisma["Database (PostgreSQL via Prisma ORM)"]

  User --> UI
  UI --> APISvc
  APISvc -->|API Requests (w/Token)| BAPI
  BAPI -->|Authentication| TokenMW
  TokenMW -->|Route Access| Router
  Router -->|Data Queries| Prisma

  classDef active fill:#b0f,stroke:#333,stroke-width:1px;
  UI,APISvc,TokenMW,Router class active;

  subgraph Data Flow Details
    UI -.->|Login/Logout actions| APISvc
    APISvc -.->|401↔️Refresh→Token| BAPI
    BAPI -.->|CRUD on wallet/history/portfolio| Prisma
  end
```
