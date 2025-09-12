# Wallet History

Retrieve the transaction history for a specific wallet, optionally filtered by date.

## Endpoint

```
GET /api/history/:id
```

- Requires authentication (attaches `req.user`).
- Mounted via `historyRouter` in `backend/src/routes/history.ts`.

## Path Parameters

| Name | Type    | Description               |
| ---- | ------- | ------------------------- |
| id   | integer | The wallet’s ID to query. |

## Query Parameters

| Name      | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| startDate | string | Optional ISO date to filter records with `date >= startDate`. |

## Request Example

```bash
curl -X GET "https://api.example.com/api/history/42?startDate=2023-01-01T00:00:00Z" \
     -H "Authorization: Bearer <token>"
```

## Response

### 200 OK

Returns an array of wallet history entries as stored in the database (`walletHistory` table).

```json
[
  {
    "id": 1001,
    "walletId": 42,
    "type": "deposit",
    "amount": 0.5,
    "asset": "BTC",
    "date": "2023-02-15T12:34:56.000Z",
    "description": "Bought Bitcoin"
  },
  {
    "id": 1002,
    "walletId": 42,
    "type": "withdrawal",
    "amount": 0.1,
    "asset": "ETH",
    "date": "2023-03-01T09:20:00.000Z",
    "description": "Sent ETH to external address"
  }
]
```

### 400 Bad Request

- Invalid wallet ID (non-numeric or missing).

```json
{
  "error": "Invalid wallet id"
}
```

### 404 Not Found

- No history found for the given wallet (and optional date filter).

```json
{
  "error": "Wallet history not found"
}
```

### 500 Internal Server Error

- Server-side failure (e.g., database error).

```json
{
  "message": "Error message details"
}
```

## Implementation Details

- **Controller**: `HistoryController.get`  
  Validates:
  - `walletId` path param (must be a number)  
  - Authenticated user matches wallet owner (`req.user.id`)  
  - Optional `startDate` parsed to a `Date` object  

- **Validation Schema**: `filtersSchema` (`backend/src/schemas/filters.schemas.ts`)
  ```ts
  import { z } from "zod";

  export const filtersSchema = z.object({
    walletId: z.number(),
    wallet: z.object({ user: z.object({ id: z.number() }) }),
    date: z
      .object({ gte: z.date() })
      .optional(),
  });
  ```
- **Service**: `HistoryService.get(filters)` (`backend/src/services/history.service.ts`)  
  Uses Prisma to `findMany` on `walletHistory` with the provided `filters` object.

## Notes

- `startDate` must be a valid ISO date string.  
- Response fields reflect your Prisma schema for the `walletHistory` model. Adjust clients accordingly.