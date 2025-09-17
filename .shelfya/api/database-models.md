# Database Models

## Overview
The Database Models module defines the structure for the core entities managed by the Hetic Crypto API. It establishes the schema for users, wallets, tokens, currencies, and their historical records, enabling persistent storage and data integrity. This module acts as the foundation for all data-related operations, supporting authentication, wallet management, and historical analysis.

## Key Features
- **User Management**: Organizes user data, roles (ADMIN, USER), authentication fields, and links to wallets and refresh tokens.
- **Wallet Organization**: Associates wallets to users, allowing unique wallet addresses and custom titles, with full historical tracking.
- **Refresh Token Storage**: Records issued refresh tokens for secure, stateless authentication and token expiration management.
- **Wallet History Tracking**: Stores transaction snapshots for wallets, including date, quantity, value, and related currency.
- **Currency Definitions**: Details available cryptocurrencies with unique identifiers, symbols, and historical tracking.
- **Currency Price History**: Captures historical price records for each currency, indexed by date and currency.

## System Errors
It's important to document common errors and troubleshooting specify :
- **Unique Constraint Violation**: Attempts to create a user/email, wallet address, currency symbol, or refresh token that already exists.
  - **Resolution**: Ensure values are unique before creation; handle duplicate errors in client code.
- **Invalid Reference Error**: Occurs when relating entities (e.g., assigning a wallet to a non-existent user).
  - **Resolution**: Confirm referenced entities exist prior to insertion; validate foreign keys.
- **Expired Refresh Token**: When accessing with a refresh token past its `expiresAt`.
  - **Resolution**: Prompt user re-authentication and generate a new refresh token.

## Usage Examples
Practical code examples showing how to use the module:

```typescript
// Create a new User
const newUser = await prisma.user.create({
  data: {
    email: "alice@example.com",
    password: "hashed_password",
    role: "USER",
  },
});

// Add a wallet for a user
const wallet = await prisma.wallet.create({
  data: {
    address: "0xABCDEF123456",
    title: "Main Wallet",
    userId: newUser.id,
  },
});

// Record currency price for a specific day
await prisma.currencyHistory.create({
  data: {
    date: new Date("2024-06-01"),
    price: 67230,
    currencyId: currency.id,
  },
});

// Fetch a user with wallets and wallet history
const userWithWallets = await prisma.user.findUnique({
  where: { email: "alice@example.com" },
  include: {
    wallets: {
      include: { history: true },
    },
  },
});
```

## System Integration
Complete ASCII diagram showing how this module integrates with the system:

```
┌─────────────────┐    ┌────────────────────┐    ┌────────────────────────┐
│ PostgreSQL DB   │───▶│ Database Models    │───▶│ API Layer / Services   │
│ (Persistent     │    │ (Prisma Schema)    │    │ (Authentication,      │
│  Storage)       │    │                    │    │  Wallet Management,    │
└─────────────────┘    └────────────────────┘    │  Price Tracking)       │
        │                  │                     └────────────────────────┘
        ▼                  ▼                              ▼
  [Raw Data]         [Schema & Relations]         [Business Logic & Consumers]
```
