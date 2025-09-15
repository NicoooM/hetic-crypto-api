# Database Guide

This guide explains how the Crypto API uses Prisma to interact with its database. You’ll learn where the client is initialized, which tables (models) are in play, and see code examples illustrating common operations in each service.

## 1. Prisma Client Setup

Prisma is initialized in  
`backend/src/lib/prisma.ts`  

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

By importing `prisma`, all services can perform queries. Ensure your `DATABASE_URL` is set in your environment so Prisma can connect.

## 2. Key Models

Based on how services use them, the following tables exist. Field names reflect columns defined in your `schema.prisma`.

- **User**  
  • id  
  • name  
  • email  
  • password  
  • isEmailVerified  

- **RefreshToken**  
  • id  
  • token  
  • expiresAt  
  • userId → User  

- **Currency**  
  • id  
  • symbol  

- **CurrencyHistory**  
  • id  
  • currencyId → Currency  
  • date  
  • price  

- **Wallet**  
  • id  
  • userId → User  
  • address  
  • title  

- **WalletHistory**  
  • id  
  • walletId → Wallet  
  • date  
  • value      (value in base currency, e.g. EUR)  
  • quantity   (quantity of crypto)  
  • currencyId → Currency  

## 3. Service Examples

### AuthService (login, register, tokens)

```ts
// Find a user by email
const user = await prisma.user.findUnique({
  where: { email: "alice@example.com" },
});

// Create a new user
await prisma.user.create({
  data: {
    name: "Alice",
    email: "alice@example.com",
    password: "<hashed>",
    isEmailVerified: false,
  },
});

// Delete a refresh token on logout
await prisma.refreshToken.delete({
  where: { token: "<refreshToken>" },
});
```

### ProfileService (fetch and update profile)

```ts
// Get profile by user ID
const profile = await prisma.user.findUnique({
  where: { id: 42 },
  select: { name: true, email: true },
});

// Update name/email and manage email-verified flag
const updated = await prisma.user.update({
  where: { id: 42 },
  data: { name: "Alice A.", email: "alice@new.com", isEmailVerified: false },
});
```

### WalletService (CRUD wallets & history)

```ts
// Create a wallet and its history
const wallet = await prisma.wallet.create({
  data: { userId: 42, address: "0x123…", title: "My ETH Wallet" },
});
await prisma.walletHistory.createMany({
  data: [
    { walletId: wallet.id, date: new Date(), value: 200, quantity: 0.1, currencyId: ethId },
    // …
  ],
});

// List all wallets for a user
const wallets = await prisma.wallet.findMany({
  where: { userId: 42 },
});

// Delete a wallet (and its history)
await prisma.wallet.delete({ where: { id: 5, userId: 42 } });
await prisma.walletHistory.deleteMany({ where: { walletId: 5 } });
```

### HistoryService (filter wallet history)

```ts
// Fetch history with optional filters
const history = await prisma.walletHistory.findMany({
  where: {
    walletId: 5,
    date: {
      gte: new Date("2023-01-01"),
      lte: new Date("2023-01-31"),
    },
  },
});
```

### PortfolioService (aggregate balances)

PortfolioService combines on‐chain data and historical values:

```ts
// Get the latest saved history value
const lastHistory = await prisma.walletHistory.findFirst({
  where: { walletId: 5 },
  select: { value: true },
});
```

Remaining data (current price, daily change, real-time value) is fetched via external APIs, but any saved snapshots come from the `walletHistory` table.

## 4. Further Reading

- Prisma Getting Started: https://www.prisma.io/docs/getting-started  
- Defining models & relations: https://www.prisma.io/docs/concepts/components/prisma-schema  
- `@prisma/client` API reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference  

With this foundation, you can extend queries, add new models, and keep your data layer in sync with the business logic in each service.