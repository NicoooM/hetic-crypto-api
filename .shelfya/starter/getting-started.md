# Getting Started

## Overview
This guide provides an introduction to the Hetic Crypto Wallet Tracker monolith. The system allows users to track, analyze, and visualize cryptocurrency asset data by integrating with third-party APIs. Both backend and frontend components are included for a seamless user experience—from account management to portfolio analysis.

## Key Features
- **User Authentication**: Handles user registration, login, email verification, and session management.
- **Wallet Management**: Enables creation, listing, and deletion of cryptocurrency wallets, as well as retrieval of wallet history and statistics.
- **Profile Management**: Allows users to view and update profile information, including password reset.
- **Dashboard Visualization**: Provides graphical analysis of wallet transactions (dashboard and graph pages).
- **Fiscal Reports (PDF)**: Generates tax-related PDF documents to support reporting needs (local feature, not directly linked to API).
- **System Integrations**: Connects with external APIs (Cryptocompare, Etherscan) and internal services (Postgres DB, Mailhog for email testing).

## System Errors
It's important to document common errors and troubleshooting steps:
- **Authentication Errors**: Occur when login credentials are invalid or tokens have expired. Resolution: Reattempt login or refresh token.
- **API Rate Limiting**: Triggers if too many requests are sent to backend routes. Resolution: Wait and retry after cooldown, review rate limit policy.
- **Database Connection Error**: Application cannot connect to Postgres. Resolution: Ensure Postgres is running and credentials in `docker-compose.yml` are correct.
- **Mail Delivery Failure**: Email verification does not arrive. Resolution: Check Mailhog for local email delivery or update SMTP settings.

## Usage Examples
Practical code examples showing how to use the system modules:

```bash
# Start backend (from /backend)
bun i
bun dev

# Start client (from /client)
npm install
npm start

# Register a new user via API (example with curl)
curl -X POST http://localhost:3001/api/v1/auth/register -d '{"email":"user@example.com","password":"securepass"}' -H "Content-Type: application/json"

# Retrieve wallet list via API (after login)
curl -X GET http://localhost:3001/api/v1/wallet -H "Authorization: Bearer <your_access_token>"

# Access client dashboard
# Visit: http://localhost:3000/dashboard
```

## System Integration

```
                           ┌─────────────────────┐
                           │    External APIs    │
                  ┌───────▶│ Cryptocompare       │
                  │        │ Etherscan           │
                  │        └─────────────────────┘
            ┌─────────────┐       ▲
            │  PostgresDB │◀──────┘
            └─────────────┘       │
                  ▲               │
                  │               │
       ┌─────────────────────────────┐
       │         Backend API         │
       │ (Bun, Express, Prisma ORM)  │
       └─────────────────────────────┘
                  ▲
                  │
         ┌─────────────────┐
         │     Mailhog     │       ┌───────────────┐
         │(Email Testing)  │◀─────▶│     Client    │
         └─────────────────┘       │ (React, D3)   │
                                   └───────────────┘

[External APIs] - Provides wallet data, pricing, and transaction history.
[Backend API] - Core business logic, storage, authentication, and API endpoints.
[PostgresDB] - Persists user, wallet, and analytics data.
[Mailhog] - Captures and previews outgoing emails for verification and password reset.
[Client] - User interface for interaction, visualization, and reporting.
```

This integrated architecture ensures each module contributes to end-to-end tracking, analysis, and visualization of cryptocurrency portfolio data.