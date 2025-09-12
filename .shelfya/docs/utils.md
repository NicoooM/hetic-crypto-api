# Utilities

This document describes general helper functions and constants used across the backend.

## Table of Contents

- [Password Validation](#password-validation)  
- [Refresh Token Hashing](#refresh-token-hashing)  
- [Environment Variables Verification](#environment-variables-verification)  
- [Etherscan API Helpers](#etherscan-api-helpers)  

---

## Password Validation

A regular expression enforcing:
- At least one lowercase letter  
- At least one uppercase letter  
- At least one digit  
- At least one special character (`@$!%*?&`)  
- Minimum length of 8 characters

```ts
import { passwordRegex } from "../utils/regex";

const isValid = passwordRegex.test("P@ssw0rd!");
console.log(isValid); // true
```

---

## Refresh Token Hashing

Use HMAC-SHA256 to hash refresh tokens before storing.

```ts
import { hashToken } from "../utils/hash-refresh-token";

const token = "someRandomRefreshTokenString";
const secret = process.env.REFRESH_TOKEN_SECRET!;
const hashed = hashToken(token, secret);

console.log(hashed);
// e3b0c44298fc1c149afbf4c8996fb924...
```

---

## Environment Variables Verification

Ensure all required environment variables are defined and non-empty at startup. Throws an error if any are missing.

```ts
import { verifyEnv } from "../utils/verify-env";

try {
  verifyEnv();
  // proceed with server initialization
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
```

Make sure `REQUIRED_ENV_VARS` (from `backend/src/constants`) includes keys such as:

- `PORT`  
- `DATABASE_URL`  
- `ETHERSCAN_API_KEY`  
- …and any other critical vars your app needs.

---

## Etherscan API Helpers

Helper functions to fetch and process Ethereum transactions (normal & internal) from Etherscan and build a daily wallet history.

### Environment

- Requires `ETHERSCAN_API_KEY` in your environment.

### Functions

#### getAllNormalTransactions(wallet: string): Promise<TransactionData[]>

Fetches all **normal** (external) transactions for a given wallet address.

#### getAllInternalTransactions(wallet: string): Promise<TransactionData[]>

Fetches all **internal** (contract/internal) transactions for a given wallet address.

#### calculateValuePerDay(transactions: TransactionData[]): Record<string, bigint>

Converts an array of transactions into a map of `YYYY-MM-DD` → net Ether change (in Wei).

#### createWalletHistory(wallet: string): Promise<
  Array<{walletId: string; date: Date; value: number}>
>

1. Fetches normal + internal transactions  
2. Calculates daily net deltas (subtracting fees for outgoing txns)  
3. Builds a cumulative daily history (in Ether)

Example usage:

```ts
import { createWalletHistory } from "../utils/etherscan";

async function run() {
  const wallet = "0xd0b08671ec13b451823ad9bc5401ce908872e7c5";
  const history = await createWalletHistory(wallet);

  console.table(history.slice(-5));
  // [
  //   { walletId: '0x…7c5', date: 2023-01-01T00:00:00.000Z, value: 0.12 },
  //   { walletId: '0x…7c5', date: 2023-01-02T00:00:00.000Z, value: 0.05 },
  //   …
  // ]
}

run();
```

### Notes

- Pagination is handled via `startblock`/`endblock` looping.  
- Duplicate transactions are filtered by tracking processed hashes.  
- Delays (`sleep`) between requests ensure Etherscan rate limits are respected.  

---

For further details, refer to the source files in `backend/src/utils/`.