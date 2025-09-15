# Database Guide

This guide provides an overview of the database schema used by the Hetic Crypto API project. It describes how the main entities are structured, how they relate to each other, and summarizes key constraints and behaviors.

## Overview

- **Database**: PostgreSQL  
- **ORM**: Prisma

The database models users, authentication, wallets, transaction history, and cryptocurrency data, providing a foundation for managing user accounts and tracking wallet balances and cryptocurrency prices over time.

## Main Entities

### User

Represents a registered user.

| Field             | Type      | Attributes                           |
|-------------------|-----------|--------------------------------------|
| id                | Int       | Primary key, auto-increment          |
| role              | Enum      | `ADMIN` or `USER`; default: `USER`   |
| name              | String?   | Nullable, max 255 chars              |
| email             | String    | Unique; required                     |
| password          | String    | Required, max 255 chars              |
| isEmailVerified   | Boolean   | Default: `false`                     |

**Relations:**  
- Has many `Wallet`
- Has many `RefreshToken`

### RefreshToken

Used for authenticating sessions.

| Field      | Type      | Attributes                  |
|------------|-----------|-----------------------------|
| id         | Int       | Primary key, auto-increment |
| token      | String    | Unique                      |
| userId     | Int       | Foreign key to `User`       |
| expiresAt  | DateTime  | Expiry timestamp            |
| createdAt  | DateTime  | Defaults to now             |

### Wallet

Represents a user's cryptocurrency wallet.

| Field      | Type    | Attributes                  |
|------------|---------|-----------------------------|
| id         | Int     | Primary key, auto-increment |
| address    | String  | Unique; required            |
| title      | String  | Required, max 255 chars     |
| userId     | Int     | Foreign key to `User`       |

**Relations:**  
- Has many `WalletHistory`

### WalletHistory

Tracks changes to a wallet over time.

| Field      | Type      | Attributes                         |
|------------|-----------|------------------------------------|
| id         | Int       | Primary key, auto-increment        |
| date       | DateTime  | Timestamp of record                |
| quantity   | Float     | Amount of cryptocurrency           |
| value      | Float     | Calculated value (in fiat, etc.)   |
| currencyId | Int       | Foreign key to `Currency`          |
| walletId   | Int       | Foreign key to `Wallet`            |

### Currency

Represents a cryptocurrency.

| Field      | Type     | Attributes                  |
|------------|----------|-----------------------------|
| id         | Int      | Primary key, auto-increment |
| symbol     | String   | Unique; required            |
| name       | String?  | Optional                    |

**Relations:**  
- Has many `CurrencyHistory`
- Has many `WalletHistory`

### CurrencyHistory

Tracks historical price data for currencies.

| Field      | Type       | Attributes                                                   |
|------------|------------|--------------------------------------------------------------|
| id         | Int        | Primary key, auto-increment                                  |
| date       | DateTime   | Timestamp of price record                                    |
| price      | Float      | Price at the recorded date                                   |
| currencyId | Int        | Foreign key to `Currency`                                    |

**Unique Constraint:**  
- Combination of `date` and `currencyId`.

## Entity Relationship Diagram (ERD)

```
User --< Wallet --< WalletHistory >-- Currency >-- CurrencyHistory
  ^
  |
RefreshToken
```

## Indexes & Constraints

- **Unique:** `User.email`, `Wallet.address`, `Currency.symbol`, `RefreshToken.token`, (`CurrencyHistory.date`, `CurrencyHistory.currencyId`)
- **Foreign Keys:** Appropriate constraints ensure referential integrity.

## Example Usage

Below are common example queries using Prisma Client:

**Get all wallets of a user**
```ts
const userWithWallets = await prisma.user.findUnique({
  where: { id: userId },
  include: { wallets: true },
});
```

**Fetch a currency and its historical prices**
```ts
const btc = await prisma.currency.findUnique({
  where: { symbol: 'BTC' },
  include: { currencyHistory: true },
});
```

**Record a new transaction in WalletHistory**
```ts
await prisma.walletHistory.create({
  data: {
    date: new Date(),
    quantity: 1.5,
    value: 46000.50,
    currencyId: btcId,
    walletId: myWalletId,
  },
});
```

## Migration Management

Migrations are managed using Prisma Migrate. To apply new migrations:

```sh
cd backend
npx prisma migrate deploy
```

## Further Reading

- [Prisma Schema Docs](https://pris.ly/d/prisma-schema)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

For setup instructions, see the [Getting Started Guide](getting-started.md). For questions, check the [FAQ](faq.md).