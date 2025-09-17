# Architecture Guide

## Overview
This monolithic crypto wallet tracker system enables users to register, authenticate, and manage cryptocurrency wallets, retrieving and analyzing their portfolio data from external sources. The platform provides both an API and a web client, supporting secure wallet monitoring, transaction history, and portfolio performance analysis, all designed for individuals interested in tracking their crypto assets conveniently.

## Key Features
- **User Authentication & Authorization**: Allows registration, login, email verification, and access token management, ensuring secure access to all wallet features.
- **Wallet Management**: Users can add, view, and delete wallets. Each wallet is associated with a user and maintains a record of its addresses.
- **Portfolio & History Retrieval**: Fetches and displays wallet transaction history and portfolio statistics, aggregating data from external APIs (e.g., Cryptocompare, Etherscan).
- **Profile Management**: Enables users to view and modify their personal information and credentials.
- **Statistical Analysis & Visualization**: Provides endpoints for portfolio statistics, and the client visualizes transaction graphs and generates tax (fiscalité) reports as PDFs.

## System Errors
- **AuthenticationError**: Occurs when access tokens are invalid, missing, or expired.  
  _Resolution_: Ensure the client sends valid tokens with requests to protected endpoints. Use the refresh token route to obtain new credentials.
- **ResourceNotFound**: When accessing a wallet or transaction history that does not exist for the user.  
  _Resolution_: Confirm the wallet or user exists and the IDs used in requests are correct.
- **ValidationError**: Input data does not meet API requirements or expected formats.  
  _Resolution_: Review API documentation for required fields and correct errors in request payloads.
- **DatabaseError**: Issues related to the database connection or data integrity (e.g., duplicate addresses, unique constraint violations).  
  _Resolution_: Check database connectivity, constraints, and ensure data uniqueness.

## Usage Examples

```javascript
// User Registration
fetch('/api/v1/auth/register', {
  method: 'POST',
  body: JSON.stringify({ email: 'user@example.com', password: 'SecurePass123' }),
  headers: { 'Content-Type': 'application/json' }
});

// Add a New Wallet (after authentication)
fetch('/api/v1/wallet', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ address: '0xABC123...', title: 'My ETH Wallet' }),
  headers: { 'Content-Type': 'application/json' }
});

// Get Wallet Portfolio Statistics
fetch('/api/v1/portfolio/1', {
  method: 'GET',
  credentials: 'include'
});
```

## System Integration

```
                           ┌─────────────────────────┐
                           │      External APIs      │
                           │ (Cryptocompare, Etherscan) │
                           └─────────────┬───────────┘
                                         │
                                         ▼
┌─────────────┐       ┌──────────────────────┐       ┌────────────┐
│  Database   │◀─────▶│   Backend (API)      │◀─────▶│   Client   │
│ (Postgres + │       │   Express+Prisma     │       │ (React)    │
│  Prisma)    │       └──────────────────────┘       └────────────┘
└─────────────┘                ▲     ▲     ▲                ▲
               User profile,   │     │     │All API Calls   │
               wallets,        │     │     │(auth, wallet,  │
               transactions    │     │     │profile,        │
                               │     │     │portfolio)      │
         ┌────────────────┐    │     │     │                │
         │ User Sessions  │────┘     │     └────────────────┘
         │  (Tokens, etc) │──────────┘

Legend:
- Database: Stores users, wallets, history, etc.
- Backend: Provides all REST APIs, handles authentication, integrates with external crypto APIs, enforces business logic.
- Client: User-facing React app for interacting with the system.
- External APIs: Source of crypto wallet data and prices.
```
