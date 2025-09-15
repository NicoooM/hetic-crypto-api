# History

Retrieve the transaction history for a specific wallet.

## Endpoint

```
GET /api/history/:id
```

- Requires authentication (e.g., Bearer token).
- Returns all history entries for the given wallet, optionally filtered by start date.

## Path Parameters

Name | Type    | Description  
-----|---------|-------------
id   | integer | The ID of the wallet to fetch history for.

## Query Parameters

Name       | Type   | Description  
-----------|--------|---------------------------------------------
startDate  | string | *(optional)* ISO 8601 date filter. Only entries on or after this date are returned.

## Responses

### 200 OK

```json
[
  {
    "id": 1,
    "walletId": 123,
    "amount": 100.0,
    "type": "deposit",
    "date": "2023-01-02T10:00:00.000Z"
    // ...other fields
  },
  {
    "id": 2,
    "walletId": 123,
    "amount": -50.0,
    "type": "withdrawal",
    "date": "2023-01-10T14:30:00.000Z"
  }
]
```

### 400 Bad Request

- Invalid `id` parameter (not a number).

```json
{ "error": "Invalid wallet id" }
```

### 404 Not Found

- No history entries found for the specified wallet (and optional date filter).

```json
{ "error": "Wallet history not found" }
```

### 500 Internal Server Error

- Unexpected server error.

```json
{ "message": "Internal server error details" }
```

## Example: cURL

```bash
curl -X GET "https://api.example.com/api/history/123?startDate=2023-01-01" \
     -H "Authorization: Bearer <your-token>"
```

## Example: Node.js (fetch)

```js
import fetch from 'node-fetch';

async function fetchHistory(walletId, startDate) {
  const url = new URL(`https://api.example.com/api/history/${walletId}`);
  if (startDate) url.searchParams.set('startDate', startDate);

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message);
  }
  return response.json();
}

fetchHistory(123, '2023-01-01')
  .then(data => console.log(data))
  .catch(err => console.error('Error fetching history:', err));
```

## See Also

- [Authentication](./authentication.md)  
- [Filters Schema](../schemas/filters.schemas.md)  (used internally for date filtering)