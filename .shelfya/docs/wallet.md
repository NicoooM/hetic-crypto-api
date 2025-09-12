# Wallet Management

Manage your Ethereum wallets: add new wallets, list existing ones, and delete wallets. Each newly added wallet will have its transaction history fetched from Etherscan and stored as daily balances.

## Authentication

All endpoints require a valid authenticated user (`req.user` must be populated, e.g., via JWT middleware).

## Environment Variables

- `ETHERSCAN_API_KEY` – Your Etherscan API key for fetching transactions.

## Endpoints

### List Wallets

Retrieve all wallets associated with the authenticated user.

**Request**

```
GET /wallets
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
[
  {
    "id": 1,
    "userId": 42,
    "address": "0x1234...abcd",
    "title": "My Main Wallet",
    "createdAt": "2024-05-01T12:34:56.789Z",
    "updatedAt": "2024-05-01T12:34:56.789Z"
  },
  {
    "id": 2,
    "userId": 42,
    "address": "0x5678...efgh",
    "title": "Savings Wallet",
    "createdAt": "2024-06-02T10:20:30.123Z",
    "updatedAt": "2024-06-02T10:20:30.123Z"
  }
]
```

### Create Wallet

Add a new Ethereum wallet and populate its history.

**Request**

```
POST /wallets
Content-Type: application/json
Authorization: Bearer <token>
```

**Body**

```json
{
  "address": "0xd0b08671ec13b451823ad9bc5401ce908872e7c5",
  "title": "My New Wallet"
}
```

- `address` (string): The Ethereum address to track.
- `title` (string): A friendly name for this wallet.

**Response (201 Created)**

```json
{
  "id": 3,
  "userId": 42,
  "address": "0xd0b08671ec13b451823ad9bc5401ce908872e7c5",
  "title": "My New Wallet",
  "createdAt": "2024-06-10T08:15:00.000Z",
  "updatedAt": "2024-06-10T08:15:00.000Z"
}
```

If `address` or `title` is missing:

```json
HTTP/1.1 400 Bad Request
{
  "error": "Address and title are required"
}
```

### Delete Wallet

Remove a wallet and all its stored history.

**Request**

```
DELETE /wallets/:id
Authorization: Bearer <token>
```

- `:id` – The numeric ID of the wallet to delete.

**Response**

- `204 No Content` on success.
- `400 Bad Request` if `id` is not a number.
- `404 Not Found` if no wallet matches the given ID for this user.

```json
HTTP/1.1 404 Not Found
{
  "error": "Wallet not found"
}
```

## Schema

All create requests are validated using [Zod](https://github.com/colinhacks/zod):

```ts
import { z } from "zod";

export const walletSchema = z.object({
  address: z.string(),
  title: z.string(),
});
```

## Behind the Scenes

- `WalletService.create`  
  1. Calls Etherscan APIs to fetch all normal and internal transactions for the address.  
  2. Calculates daily Ether balance deltas (including gas costs).  
  3. Persists a new `wallet` record and its daily `walletHistory` entries in the database.

- `WalletService.delete`  
  Deletes the wallet and all related history in a single transaction.

- `createWalletHistory` (in `utils/etherscan.ts`)  
  - Paginates through Etherscan results (up to 10,000 records per batch).  
  - Deduplicates by transaction hash.  
  - Builds a cumulative daily balance array to seed your dashboard or analytics.

Ensure `ETHERSCAN_API_KEY` is set in your environment to allow history fetching.