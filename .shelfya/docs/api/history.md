# Wallet History API

Retrieve the transaction history for a specific wallet.

## Endpoint

```
GET /api/history/:id
```

## Authentication

This endpoint requires a valid JWT. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

The wallet must belong to the authenticated user.

## Path Parameters

| Name | Type   | Description                       |
| ---- | ------ | --------------------------------- |
| id   | number | The ID of the wallet to query.    |

## Query Parameters

| Name      | Type   | Description                                                     |
| --------- | ------ | --------------------------------------------------------------- |
| startDate | string | Optional ISO date string. Only return history entries on/after this date. |

Example date format: `2023-05-15T00:00:00Z`

## Responses

### 200 OK

Returns an array of history entries.

```json
[
  {
    "id": 123,
    "amount": 0.5,
    "currency": "BTC",
    "type": "deposit",
    "date": "2023-05-20T14:28:23.382Z",
    "description": "Received from external wallet"
  },
  {
    "id": 124,
    "amount": -0.1,
    "currency": "BTC",
    "type": "withdrawal",
    "date": "2023-05-22T09:10:11.123Z",
    "description": "Sent to friend"
  }
]
```

> Note: The exact fields returned may vary depending on your implementation of the history service.

### 400 Bad Request

Invalid wallet ID (e.g., non-numeric).

```json
{
  "error": "Invalid wallet id"
}
```

### 404 Not Found

No history entries found for the given wallet and filters.

```json
{
  "error": "Wallet history not found"
}
```

### 500 Internal Server Error

Unexpected server error.

```json
{
  "message": "Detailed error message"
}
```

## Example Requests

### cURL

```bash
curl "https://api.example.com/api/history/42?startDate=2023-05-01T00:00:00Z" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### JavaScript (fetch)

```js
fetch('https://api.example.com/api/history/42?startDate=2023-05-01T00:00:00Z', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(console.error);
```

## Validation Schema

Requests are validated against the following Zod schema:

```ts
import { z } from 'zod';

const filtersSchema = z.object({
  walletId: z.number(),
  wallet: z.object({
    user: z.object({
      id: z.number(),
    }),
  }),
  date: z
    .object({
      gte: z.date(),
    })
    .optional(),
});
```

- `walletId` must be a number.
- `wallet.user.id` is extracted from the authenticated user.
- `date.gte` is an optional `Date` object representing the `startDate`.