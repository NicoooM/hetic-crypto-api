# Services

This document outlines the backend services provided by the Crypto API, including email verification, user profile management, portfolio valuation, and utility functions for token hashing and Etherscan data retrieval.

## Environment Variables

Ensure the following environment variables are set in your `.env` file:

- `SMTP_HOST` – SMTP server host for sending emails  
- `SMTP_PORT` – SMTP server port  
- `CLIENT_URL` – Base URL of your client application (used in verification links)  
- `JWT_ACCESS_SECRET` – Secret key for signing JWT tokens  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME` – Refresh token expiration (e.g. `7d`)  
- `ETHERSCAN_API_KEY` – API key for Etherscan requests  
- `BCRYPT_SALT_ROUNDS` – Number of salt rounds for bcrypt hashing (e.g. `10`)

## EmailService

Handles sending verification emails to users.

### Constructor

```ts
const emailService = new EmailService();
```

### sendVerificationEmail(email: string, token: string): Promise<void>

Sends a verification link to the given email address.

```ts
await emailService.sendVerificationEmail(
  "user@example.com",
  "your-jwt-verification-token"
);
```

- Builds a URL: `${CLIENT_URL}/verify-email/${token}`
- Uses `nodemailer` under the hood
- Throws an error if the email fails to send

## ProfileService

Manages user profile retrieval, editing, and password resets.

```ts
const profileService = new ProfileService();
```

### get(id: number): Promise<{ name: string; email: string } | null>

Fetches a user's name and email by their ID.

```ts
const profile = await profileService.get(42);
// => { name: "Alice", email: "alice@example.com" }
```

### edit({ id, name, email }): Promise<User>

Updates a user's name and/or email.  
If the email changes, sends a new verification email.

```ts
const updatedUser = await profileService.edit({
  id: 42,
  name: "Alice Smith",
  email: "alice.smith@example.com"
});
```

- Marks `isEmailVerified` false when the email changes
- Generates a JWT token and calls `EmailService.sendVerificationEmail`

### resetPassword({ id, oldPassword, newPassword }): Promise<void>

Changes a user's password after verifying the old one.

```ts
await profileService.resetPassword({
  id: 42,
  oldPassword: "currentPass123",
  newPassword: "newSecurePass456"
});
```

- Compares the hashed `oldPassword` to the stored hash  
- Hashes and stores the `newPassword` on success

## PortfolioService

Fetches portfolio metrics for a given wallet.

```ts
const portfolioService = new PortfolioService();
```

### get(walletId: number): Promise<{
  allocation: number;
  priceData: number;
  dailyPrice: number;
  value: number;
  dailyValue: number;
}>

Returns:

- `allocation`: Placeholder allocation value (currently `1`)
- `priceData`: Current ETH price in EUR via CryptoCompare  
- `dailyPrice`: 24-hour price change percentage  
- `value`: Current wallet value (ETH balance × price)  
- `dailyValue`: Difference vs. last recorded wallet history

```ts
const stats = await portfolioService.get(123);
console.log(stats);
// {
//   allocation: 1,
//   priceData: 1800.23,
//   dailyPrice: -2.5,
//   value: 3.6,
//   dailyValue: -0.1
// }
```

## Utilities

### hashToken(token: string, secret: string): string

Creates a SHA-256 HMAC of a token—useful for storing refresh tokens securely.

```ts
import { hashToken } from "../utils/hash-refresh-token";

const hashed = hashToken("my-refresh-token", process.env.JWT_ACCESS_SECRET!);
```

### Etherscan Helpers

Located in `backend/src/utils/etherscan.ts`, these functions fetch and process on-chain transaction data for a wallet.

- `getAllNormalTransactions(wallet: string): Promise<TransactionData[]>`  
- `getAllInternalTransactions(wallet: string): Promise<TransactionData[]>`  
- `calculateValuePerDay(transactions: TransactionData[]): Record<string, bigint>`  
- `createWalletHistory(wallet: string): Promise<{ walletId: string; date: Date; value: number }[]>`  

Example – generate a wallet’s daily history:

```ts
import { createWalletHistory } from "../utils/etherscan";

const history = await createWalletHistory("0xabc123...");
// [
//   { walletId: "0xabc123...", date: 2023-01-01, value: 1.2 },
//   { walletId: "0xabc123...", date: 2023-01-02, value: 1.25 },
//   …
```

These utilities:

- Page through Etherscan’s normal and internal transactions  
- Deduplicate by transaction hash  
- Calculate net daily inflow/outflow (including gas costs)  
- Produce a cumulative daily value series for storage or display

---

For more details on each service’s API and common workflows, refer to the source under `backend/src/services` and `backend/src/utils`.