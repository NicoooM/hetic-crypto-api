# Wallet API Documentation

This document describes the Wallet endpoints in the backend, including how wallets are created, fetched, and deleted. The service integrates with Etherscan to build historical balance data.

---

## Table of Contents

- [Endpoints](#endpoints)  
  - [GET /wallet](#get-wallet)  
  - [POST /wallet](#post-wallet)  
  - [DELETE /wallet/:id](#delete-walletid)  
- [Request Validation](#request-validation)  
- [Service Workflow](#service-workflow)  
- [Etherscan Integration](#etherscan-integration)  

---

## Endpoints

All wallet routes are registered under `/wallet` and require an authenticated user (available on `req.user`).

### GET /wallet

Fetch all wallets for the current user.

Request  
```
GET /wallet
Authorization: Bearer <token>
```

Response (200 OK)  
```json
[
  {
    "id": 1,
    "userId": 123,
    "address": "0xabc123...",
    "title": "My Main Wallet",
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  // ...
]
```

### POST /wallet

Create a new wallet. Generates the wallet record and backfills historical balances based on on-chain transactions.

Request  
```
POST /wallet
Content-Type: application/json
Authorization: Bearer <token>
```
Body  
```json
{
  "address": "0xabc123...",
  "title": "My Main Wallet"
}
```

Response (201 Created)  
```json
{
  "id": 2,
  "userId": 123,
  "address": "0xabc123...",
  "title": "My Main Wallet",
  "createdAt": "2024-01-02T10:00:00.000Z"
}
```

Errors  
- 400 Bad Request: Missing `address` or `title`.
- 500 Internal Server Error: Unexpected failure.

### DELETE /wallet/:id

Delete a wallet and all its history records.

Request  
```
DELETE /wallet/2
Authorization: Bearer <token>
```

Response  
- 204 No Content: Successfully deleted.
- 400 Bad Request: Invalid `id` parameter.
- 404 Not Found: Wallet not found.
- 500 Internal Server Error: Unexpected failure.

---

## Request Validation

The controller uses [Zod](https://github.com/colinhacks/zod) schema `walletSchema` to enforce:

- `address`: non-empty string
- `title`: non-empty string

```ts
// Example schema (zod)
import { z } from "zod";

export const walletSchema = z.object({
  address: z.string().nonempty(),
  title:   z.string().nonempty(),
});
```

---

## Service Workflow

`WalletService` implements the business logic:

- **create**  
  1. Fetch on-chain transaction history via Etherscan (normal + internal).
  2. Calculate daily net value changes, adjust for gas costs.
  3. Enrich with historical ETH price from the database.
  4. Insert a new `wallet` record.
  5. Bulk insert daily `walletHistory` entries.

- **all**  
  - Query all wallets for a given `userId`.

- **delete**  
  - Delete the `wallet` record and cascade remove its `walletHistory`.

```ts
const service = new WalletService();
await service.create({ address, title, id: userId });
const wallets = await service.all(userId);
await service.delete(walletId, userId);
```

---

## Etherscan Integration

Utilities in `utils/etherscan.ts` handle:

1. **getAllNormalTransactions** / **getAllInternalTransactions**  
   - Paginate through blocks, dedupe by hash, label incoming vs. outgoing.

2. **calculateValuePerDay**  
   - Converts wei to ETH, subtracts gas costs, accumulates per day.

3. **createWalletHistory**  
   - Merges both transaction types, computes cumulative balance per date, returns:
     ```ts
     interface WalletHistoryEntry {
       walletId: string; // passed address until persisted
       date: Date;
       value: number;    // ETH on that date
     }
     ```

Ensure `ETHERSCAN_API_KEY` is set in your environment for on-chain queries.

---

For more details, see:
- `backend/src/controllers/wallet.controller.ts`
- `backend/src/services/wallet.service.ts`
- `backend/src/utils/etherscan.ts`
- `backend/src/routes/wallet.ts`