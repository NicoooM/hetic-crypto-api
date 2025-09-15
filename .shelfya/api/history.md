# History API

Retrieve the transaction history for a specific wallet.

## Endpoint

GET `/api/history/:id`

## Authentication

This endpoint requires a valid authenticated user. A middleware must populate `req.user` before calling the controller.

## Path Parameters

- `id` (integer, required)  
  The ID of the wallet whose history you want to fetch.

## Query Parameters

- `startDate` (string, optional)  
  ISO-formatted date. When provided, only transactions on or after this date will be returned.

## Responses

### 200 OK

Returns an array of history records:

```json
[
  {
    "transactionId": 123,
    "walletId": 45,
    "type": "deposit",
    "amount": 100.5,
    "date": "2024-01-15T10:20:30.000Z",
    "metadata": { /* ... */ }
  },
  {
    "transactionId": 124,
    "walletId": 45,
    "type": "withdrawal",
    "amount": 50.0,
    "date": "2024-01-16T11:00:00.000Z",
    "metadata": { /* ... */ }
  }
]
```

### 400 Bad Request

Invalid wallet ID (e.g., non-numeric `id`):

```json
{
  "error": "Invalid wallet id"
}
```

### 404 Not Found

No history found for the given wallet (and optional date filter):

```json
{
  "error": "Wallet history not found"
}
```

### 500 Internal Server Error

Unexpected server error:

```json
{
  "message": "Error message details"
}
```

## Example

Fetch all history for wallet `45`:

```bash
curl -X GET "https://api.example.com/api/history/45" \
  -H "Authorization: Bearer <token>"
```

Fetch history from January 1, 2024 onward:

```bash
curl -G "https://api.example.com/api/history/45" \
  -H "Authorization: Bearer <token>" \
  --data-urlencode "startDate=2024-01-01T00:00:00Z"
```

## Implementation Notes

- Validates input via Zod schema (`filtersSchema`) before querying.
- Service layer (`HistoryService`) returns the filtered history array.
- Ensure your auth middleware sets `req.user.id` to filter by the owning user.