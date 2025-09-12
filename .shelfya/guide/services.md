# Services Guide

This guide describes the backend services available in your HETIC Crypto API. Each service encapsulates business logic and data access through Prisma. Below is an overview of each service, its primary methods, and usage examples.

---

## AuthService

Handles user authentication, registration, email verification, token refresh, and logout.

### Methods

- `register({ name, email, password })`  
  Create a new user, hash the password, and send a verification email.
  
- `login({ email, password })`  
  Validate credentials, ensure email is verified, and return access & refresh tokens.
  
- `verifyEmail(token)`  
  Verify the user’s email address using a JWT token.
  
- `refreshAccessToken(refreshToken)`  
  Validate a stored refresh token and issue a new access token.
  
- `logout(refreshToken)`  
  Delete the refresh token to log the user out.

### Example

```ts
import { AuthService } from "./services/auth.service";

const auth = new AuthService();

// Registration
await auth.register({
  name: "Alice",
  email: "alice@example.com",
  password: "strongPassword123",
});

// Login
const { accessToken, refreshToken } = await auth.login({
  email: "alice@example.com",
  password: "strongPassword123",
});

// Verify Email
await auth.verifyEmail(verificationToken);

// Refresh Access Token
const newTokens = await auth.refreshAccessToken(refreshToken);

// Logout
await auth.logout(refreshToken);
```

---

## TokenService

Manages JWT creation and secure storage of refresh tokens.

### Methods

- `generateAccessToken({ id, email })`  
  Returns a signed JWT access token.
  
- `generateRefreshToken({ id })`  
  Returns a signed JWT refresh token.
  
- `saveRefreshToken(token, userId)`  
  Hashes & stores the refresh token in the database with an expiration.

### Environment Variables

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME`
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME`

---

## EmailService

Sends transactional emails for verification and notifications.

### Methods

- `sendVerificationEmail(email, token)`  
  Sends a verification link to the user’s email.

### Configuration

Set SMTP details in your environment:

```
SMTP_HOST=
SMTP_PORT=
CLIENT_URL=   # e.g. https://your-frontend.com
```

---

## WalletService

Allows users to manage cryptocurrency wallets and their histories.

### Methods

- `create({ address, title, id })`  
  Fetches on-chain history via Etherscan, enriches it with historical ETH prices, and stores both wallet and history.
  
- `all(id)`  
  Returns all wallets for a given user.
  
- `delete(walletId, id)`  
  Deletes a wallet and its related history records.

### Example

```ts
import { WalletService } from "./services/wallet.service";

const walletSvc = new WalletService();

// Create a new wallet
const wallet = await walletSvc.create({
  address: "0xYourWalletAddress",
  title: "My Main Wallet",
  id: userId,
});

// List wallets
const wallets = await walletSvc.all(userId);

// Delete a wallet
await walletSvc.delete(wallet.id, userId);
```

---

## HistoryService

Fetches raw wallet history entries.

### Methods

- `get(filters)`  
  Query wallet history by filters (e.g., `walletId`, date ranges).

### Example

```ts
import { HistoryService } from "./services/history.service";

const historySvc = new HistoryService();
const entries = await historySvc.get({ walletId: 1 });
```

---

## PortfolioService

Computes portfolio metrics: current ETH price, daily price change, wallet value, and daily P&L.

### Methods

- `get(walletId)`  
  Returns an object with:
  - `allocation`  
  - `priceData` (current EUR price)  
  - `dailyPrice` (% change since yesterday)  
  - `value` (wallet balance × price)  
  - `dailyValue` (difference from last stored history)

### Example

```ts
import { PortfolioService } from "./services/portfolio.service";

const portfolioSvc = new PortfolioService();
const stats = await portfolioSvc.get(1);

console.log(stats);
// {
//   allocation: 1,
//   priceData: 1800.23,
//   dailyPrice: 2.45,
//   value: 360.05,
//   dailyValue: 5.67
// }
```

---

## ProfileService

Manages user profiles, email updates, and password resets.

### Methods

- `get(id)`  
  Retrieve user’s name and email.
  
- `edit({ name, email, id })`  
  Update profile; send a new verification email if the address changed.
  
- `resetPassword({ oldPassword, newPassword, id })`  
  Validate the old password and update to the new one.

### Example

```ts
import { ProfileService } from "./services/profile.service";

const profileSvc = new ProfileService();

// Get profile
const profile = await profileSvc.get(userId);

// Edit profile
await profileSvc.edit({
  id: userId,
  name: "Alice Smith",
  email: "alice_new@example.com",
});

// Reset password
await profileSvc.resetPassword({
  id: userId,
  oldPassword: "oldPass123",
  newPassword: "newSecurePass456",
});
```

---

For further details on database schemas, constants, and utility functions, browse the `backend/src/constants.ts`, `backend/src/schemas`, and `backend/src/utils` folders.