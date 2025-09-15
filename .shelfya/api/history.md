# History API

Retrieve the transaction history for a given wallet. You can optionally filter results by a starting date.

## Endpoint

GET `/history/:id`

- `:id` (path parameter): The numeric ID of the wallet.

## Authentication

This endpoint requires the user to be authenticated. The server identifies the user via `req.user`.

## Query Parameters

- `startDate` (optional): ISO-formatted date string to filter history entries on or after this date.  
  Example: `2023-01-15T00:00:00Z`

## Responses

### 200 OK

Returns an array of history entries.

Example Response:
```json
[
  {
    "id": 456,
    "walletId": 123,
    "date": "2023-02-10T14:23:00.000Z",
    "type": "deposit",
    "amount": 100.5,
    "currency": "USD"
  },
  {
    "id": 457,
    "walletId": 123,
    "date": "2023-02-12T09:15:00.000Z",
    "type": "withdrawal",
    "amount": 50,
    "currency": "USD"
  }
]
```

### 400 Bad Request

Invalid wallet ID format.

Example Response:
```json
{
  "error": "Invalid wallet id"
}
```

### 404 Not Found

No history entries found for the given wallet (and optional date filter).

Example Response:
```json
{
  "error": "Wallet history not found"
}
```

### 500 Internal Server Error

An unexpected server error occurred.

Example Response:
```json
{
  "message": "Detailed error message"
}
```

## Example Requests

Using `curl`:
```bash
# Fetch all history for wallet #123
curl -H "Authorization: Bearer <token>" \
     "https://api.example.com/history/123"

# Fetch history for wallet #123 starting from 2023-01-01
curl -H "Authorization: Bearer <token>" \
     "https://api.example.com/history/123?startDate=2023-01-01T00:00:00Z"
```

Or in JavaScript with `fetch`:
```js
async function fetchHistory(walletId, startDate) {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);

  const resp = await fetch(
    `https://api.example.com/history/${walletId}?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

fetchHistory(123, '2023-01-01T00:00:00Z')
  .then(data => console.log('History:', data))
  .catch(err => console.error(err));
```

## Notes

- The date filter uses `>= startDate` logic.
- Ensure your token has access to the specified wallet. 