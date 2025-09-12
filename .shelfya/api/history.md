# History API

Retrieve the transaction history for a specific wallet.

## Endpoint

```
GET /history/:id
```

### Authentication

This endpoint requires the user to be authenticated. The server reads the user from `req.user`.

## Path Parameters

| Name | Type   | Description           |
| ---- | ------ | --------------------- |
| id   | number | ID of the wallet      |

## Query Parameters

| Name      | Type   | Description                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------- |
| startDate | string | *Optional.* ISO-8601 date string. Filters history entries on or after this date (`date.gte`). |

## Request Example

```bash
curl -X GET "https://api.example.com/history/42?startDate=2023-01-01T00:00:00Z" \
     -H "Authorization: Bearer <your_jwt_token>"
```

## Responses

### 200 OK

Returns an array of history records for the given wallet. Each record is a JSON object; field definitions depend on your application’s history schema.

Example body:
```json
[
  {
    "id": 101,
    "walletId": 42,
    "type": "deposit",
    "amount": 0.5,
    "currency": "BTC",
    "date": "2023-01-10T14:23:00Z",
    "description": "User deposit"
  },
  {
    "id": 102,
    "walletId": 42,
    "type": "trade",
    "amount": -0.1,
    "currency": "ETH",
    "date": "2023-02-05T09:12:00Z",
    "description": "Bought ETH"
  }
]
```

### 400 Bad Request

Invalid wallet ID was provided.

```json
{
  "error": "Invalid wallet id"
}
```

### 401 Unauthorized

Missing or invalid authentication token.

```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found

No history found for the given wallet (and date filter).

```json
{
  "error": "Wallet history not found"
}
```

### 500 Internal Server Error

Unexpected server error.

```json
{
  "message": "Internal server error message"
}
```

## Implementation Notes

- Incoming query `startDate` is parsed to a JavaScript `Date` object and validated by the [filtersSchema](https://github.com/NicoooM/hetic-crypto-api/blob/main/backend/src/schemas/filters.schemas.ts).
- The controller verifies:
  - `id` is a valid number.
  - `req.user.id` matches the wallet’s owner.
  - Optional `date.gte` filter based on `startDate`.
- If no records are found, a **404** is returned.