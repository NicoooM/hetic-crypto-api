# Database Guide

This guide walks you through how the Hétic Crypto API manages its database using Prisma. You’ll learn how to set up the connection, explore the main models, and see examples of CRUD operations via the service layer.

## 1. Setup

1. Install dependencies:
   ```bash
   npm install @prisma/client prisma
   ```
2. Add your database URL to `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/crypto"
   ```
3. Generate the Prisma client and run migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

## 2. Prisma Client Initialization

All database operations use a single Prisma client instance:

```ts
// backend/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

Import `prisma` into services to interact with your database.

## 3. Database Models Overview

While the full Prisma schema lives in `prisma/schema.prisma`, the key models are:

- **User**
  - id: Int (PK)
  - name: String
  - email: String
  - password: String
  - isEmailVerified: Boolean
- **Wallet**
  - id: Int (PK)
  - userId: Int (FK → User)
  - address: String
  - title: String
- **Currency**
  - id: Int (PK)
  - symbol: String
- **CurrencyHistory**
  - id: Int (PK)
  - currencyId: Int (FK → Currency)
  - date: DateTime
  - price: Float
- **WalletHistory**
  - id: Int (PK)
  - walletId: Int (FK → Wallet)
  - date: DateTime
  - quantity: Float
  - value: Float
  - currencyId: Int (FK → Currency)

## 4. Profile Operations

### Fetch Profile

```ts
const profile = await prisma.user.findUnique({
  where: { id: userId },
  select: { name: true, email: true }
});
```

### Edit Profile

- Updates `name`, `email`
- Resets `isEmailVerified` and sends a new verification token if email changed

```ts
await prisma.user.update({
  where: { id },
  data: {
    name,
    email,
    isEmailVerified: email === oldEmail
  }
});
```

### Reset Password

1. Verify old password
2. Hash and store new password

```ts
const newHashed = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
await prisma.user.update({ where: { id }, data: { password: newHashed } });
```

## 5. Wallet Management

### Create Wallet

1. Fetch on-chain history via Etherscan
2. Enrich with USD rates from `CurrencyHistory`
3. Store wallet and historical entries

```ts
// Create wallet record
const wallet = await prisma.wallet.create({
  data: { userId: id, address, title }
});

// Bulk insert history
await prisma.walletHistory.createMany({
  data: enrichedHistory.map(entry => ({
    walletId: wallet.id,
    date: entry.date,
    quantity: entry.value,
    value: entry.valueInCurrency,
    currencyId
  }))
});
```

### List & Delete

- **List all** wallets for a user:
  ```ts
  await prisma.wallet.findMany({ where: { userId } });
  ```
- **Delete** a wallet and its history:
  ```ts
  await prisma.wallet.delete({ where: { id: walletId, userId } });
  await prisma.walletHistory.deleteMany({ where: { walletId } });
  ```

## 6. History Queries

Filter and retrieve historical portfolio data:

```ts
// backend/src/services/history.service.ts
await prisma.walletHistory.findMany({
  where: {
    walletId: 123,
    date: { gte: new Date("2023-01-01") }
  }
});
```

## 7. Next Steps

- Review and adjust your `prisma/schema.prisma`
- Add more models or relations as features expand
- Use `npx prisma studio` to inspect your data visually

For full reference on Prisma features, visit https://www.prisma.io/docs.