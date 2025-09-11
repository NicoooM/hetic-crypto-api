# Changelog

All notable changes to HETIC Crypto API.

## [Unreleased]
- Planned improvements and bug fixes.

## [1.0.0] – 2024-06-01
### Added
- **Authentication**  
  - `/api/v1/auth/login` (rate-limited)  
  - `/api/v1/auth/register` (rate-limited)  
  - `/api/v1/auth/refresh-access-token`  
  - `/api/v1/auth/verify-email/:token`  
  - `/api/v1/auth/logout`  
  - JWT access & refresh tokens, secure HTTP-only cookie for refresh token  
  - Zod schemas for input validation
- **User Profile**  
  - `/api/v1/profile` (GET, PATCH)  
  - `/api/v1/profile/password` (PATCH)  
  - Email change triggers re-verification email via Nodemailer  
- **Wallet Management**  
  - `/api/v1/wallet` (GET, POST)  
  - `/api/v1/wallet/:id` (DELETE)  
  - Stores wallet history on creation by fetching Etherscan transactions  
- **History**  
  - `/api/v1/history/:id` (GET)  
  - Zod filters for date-range and ownership validation
- **Portfolio**  
  - `/api/v1/portfolio/:id` (GET)  
  - Returns allocation, current price (CryptoCompare), daily price change, ETH balance (Etherscan), and daily value delta
- **Services & Utilities**  
  - AuthService, ProfileService, WalletService, HistoryService, PortfolioService  
  - TokenService for signing & persisting refresh tokens (hashed)  
  - `utils/etherscan.ts` for transaction aggregation  
  - `utils/verify-env.ts` to enforce required environment variables  
  - Rate-limiter middleware on auth routes
- **Database & ORM**  
  - Prisma client setup  
  - Seed scripts for currency history (CryptoCompare API)
- **Client API wrapper**  
  - Axios instance with automatic token refresh and retry logic  
  - Includes credentials for cookie handling  
- **Security & Performance**  
  - Helmet, CORS, cookie-parser, request-IP middleware  
  - Strict typing with TypeScript and Zod  
  - Express-rate-limit to throttle suspicious requests

---
For full details on services, schemas, and middleware, see the README and code comments in `backend/src`.