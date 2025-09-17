# Database Module

## Overview
The Database module manages the core data entities and relationships for the Hetic Crypto API. It defines the primary data models to persist user accounts, wallet structures, cryptocurrencies with historical prices, and authentication tokens. Acting as the single source of truth, it exposes a unified, structured schema accessed throughout the backend for persisting and retrieving all business-critical information.

## Key Features

- **User Management**: Stores user accounts, roles (ADMIN, USER), email verification status, and associates users with multiple wallets.
- **Authentication Tokens**: Supports secure refresh tokens for persistent authentication, linking tokens to users with expiration and creation timestamps.
- **Wallet Support**: Represents individual cryptocurrency wallets, each with a unique address, title, ownership by a user, and a transaction history.
- **Wallet History Tracking**: Records temporal changes to wallet holdings, including the value, quantity, and currency involved in each event.
- **Cryptocurrency Registry**: Maintains metadata for supported cryptocurrencies (symbol and name), and associates each with price and history information.
- **Currency Price History**: Records time-stamped historical price points for each supported currency to enable accurate value computations and analytics.
- **Relational Integrity**: Enforces strong foreign key relationships and uniqueness constraints across core entities (users, wallets, currencies) for data consistency.

## System Errors

- **Unique Constraint Violation**:  
  Triggered when attempting to create a duplicate entry for unique fields (e.g., user email, wallet address, or currency symbol).  
  _Resolution_: Ensure the email, address, or symbol does not already exist before insertion.

- **Foreign Key Constraint Failure**:  
  Occurs if operations reference non-existent related entities (e.g., associating a `Wallet` with a missing `User`).  
  _Resolution_: Confirm all related records exist in their respective tables before creating dependent records.

- **NULL Constraint Violation**:  
  Attempting to insert or update a required (non-null) column with no value (e.g., wallet title, wallet history value/quantity).  
  _Resolution_: Supply all required fields when creating or updating records.

## Usage Examples

```typescript
// Create a new user
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    password: 'hashedPassword',
    name: 'Alice',
    role: 'USER'
  }
});

// Add a wallet for a user
const wallet = await prisma.wallet.create({
  data: {
    address: '0xABC123...',
    title: 'Main Wallet',
    userId: user.id
  }
});

// Record a new historical event for a wallet
await prisma.walletHistory.create({
  data: {
    date: new Date(),
    quantity: 2.5,
    value: 3000.0,
    currencyId: currency.id,
    walletId: wallet.id
  }
});

// Register a new cryptocurrency
const currency = await prisma.currency.create({
  data: {
    symbol: 'BTC',
    name: 'Bitcoin'
  }
});

// Log a historical price for a currency
await prisma.currencyHistory.create({
  data: {
    date: new Date(),
    price: 45000.0,
    currencyId: currency.id
  }
});
```

## System Integration

```
┌────────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   PostgreSQL DB    │<───▶│  Database Module │<───▶│ Application Core │
│(Data persistence,  │     │ (Prisma Models   │     │(API, Services,   │
│  actual records)   │     │  & Queries)      │     │  GraphQL/REST)   │
└────────────────────┘     └──────────────────┘     └──────────────────┘
                                  │                        │
                                  ▼                        ▼
                        [Enforces schema,         [Consumes database
                         provides data access      module for user,
                         & guarantees consistency] wallet, auth,
                                                   currency logic]
```

- **Dependencies**: Connects to PostgreSQL as the data source.
- **Process**: Exposes a strict schema through Prisma for robust and validated backend operations.
- **Consumers**: All backend API endpoints and business logic modules requiring persistent state or relational queries.