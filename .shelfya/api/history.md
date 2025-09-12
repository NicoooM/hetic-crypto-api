# History API

Retrieve the transaction history for a specific wallet. Requires authentication.

## Endpoint

GET `/history/:id`

## Authentication

All requests must be made by an authenticated user. Include a valid JWT or session cookie as configured by your application.

## Path Parameters

- `id` (integer, required):  
  The ID of the wallet whose history you want to retrieve.

## Query Parameters

- `startDate` (string, optional):  
  ISO-formatted date (e.g. `2023-06-01`). When provided, only transactions on or after this date are returned.

## Responses

### 200 OK

Returns an array of history entries for the given wallet.

```json
[
  {
    "transactionId": 42,
    "walletId": 1,
    "type": "deposit",
    "amount": 100.5,
    "currency": "USD",
    "date": "2023-06-15T10:30:00.000Z",
    // ...other fields
  },
  {
    "transactionId": 43,
    "walletId": 1,
    "type": "withdrawal",
    "amount": 50,
    "currency": "USD",
    "date": "2023-06-20T14:45:00.000Z"
  }
]
```

### 400 Bad Request

Invalid wallet ID. Returned if `:id` is not a number.

```json
{ "error": "Invalid wallet id" }
```

### 404 Not Found

No history entries were found for the wallet (or it doesn’t belong to the authenticated user).

```json
{ "error": "Wallet history not found" }
```

### 500 Internal Server Error

An unexpected error occurred.

```json
{ "message": "Internal server error details..." }
```

## Examples

Fetch all history for wallet `1`:

```bash
curl -H "Authorization: Bearer <token>" \
     https://api.example.com/history/1
```

Fetch history for wallet `1` starting from June 1, 2023:

```bash
curl -H "Authorization: Bearer <token>" \
     "https://api.example.com/history/1?startDate=2023-06-01"
```

## Implementation Notes

- The controller uses a Zod schema (`filtersSchema`) to validate:
  - `walletId` must match the `:id` path parameter.
  - Ownership: the wallet must belong to the authenticated user.
  - Optional `date.gte` filter when `startDate` is provided.
- If authentication middleware is not in place, `req.user` must be set before reaching this route.