# Wallets API Guide

This document provides an overview and usage guide for the Wallets API endpoints. These endpoints allow authenticated users to manage their crypto wallets.

## Endpoints Summary

- `GET /api/wallets` — List all wallets for the current user
- `POST /api/wallets` — Create a new wallet
- `DELETE /api/wallets/:id` — Delete a wallet by its ID

> All routes require the user to be authenticated.

---

## Get All Wallets

**GET** `/api/wallets`

Returns all wallets belonging to the authenticated user.

### Example Request

```http
GET /api/wallets
Authorization: Bearer <token>
```

### Example Response

```json
[
  {
    "id": 1,
    "userId": 12,
    "address": "0x92C23c7fb5BdAD3bfD44AA1b257849f5e1f3Af40",
    "title": "Main Wallet"
  },
  ...
]
```

---

## Create a Wallet

**POST** `/api/wallets`

Creates a new wallet and stores its transaction history enriched with ETH prices.

### Request Body

| Field    | Type   | Required | Description                             |
|----------|--------|----------|-----------------------------------------|
| address  | string | Yes      | The wallet's Ethereum address           |
| title    | string | Yes      | A title/label for the wallet            |

**Schema** (validation: both fields required and of type `string`):

```json
{
  "address": "0x92C23c7fb5BdAD3bfD44AA1b257849f5e1f3Af40",
  "title": "My ETH Wallet"
}
```

### Example Request

```http
POST /api/wallets
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": "0x92C23c7fb5BdAD3bfD44AA1b257849f5e1f3Af40",
  "title": "Trading Wallet"
}
```

### Example Response

```json
{
  "id": 12,
  "userId": 1,
  "address": "0x92C23c7fb5BdAD3bfD44AA1b257849f5e1f3Af40",
  "title": "Trading Wallet"
}
```

#### Errors

- **400** Invalid or missing fields
- **500** Wallet creation failed (server error)

---

## Delete a Wallet

**DELETE** `/api/wallets/:id`

Deletes a wallet and its related history for the authenticated user.

### Example Request

```http
DELETE /api/wallets/12
Authorization: Bearer <token>
```

### Responses

- **204 No Content** — Deletion successful
- **404 Not Found** — Wallet not found
- **400 Bad Request** — Invalid wallet ID

---

## Notes

- Wallet creation automatically fetches and stores the wallet's transaction history, enriched with ETH prices.
- Each user can only access and manage their own wallets.
- Ensure a valid authentication token is sent with each request.

---

If you need help authenticating or handling responses, see the [Getting Started](./getting-started.md) page or contact support.