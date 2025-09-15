# Wallet History API

This document describes how to access the wallet history endpoint in the Crypto API, including request details, query parameters, and response examples.

## Endpoint

```
GET /history/:id
```

- **:id** — The wallet ID for which you want to fetch the history.

## Authentication

This endpoint requires authenticated requests. Ensure you are sending valid credentials so that `req.user` is populated.

## Query Parameters

- **startDate** (optional, string): ISO 8601 date. Filters wallet history to entries from this date onwards.

### Example

```
GET /history/42?startDate=2024-01-01
```

## Request Validation

- The `:id` parameter must be a valid integer.
- If provided, `startDate` must be a valid date string.

## Responses

### 200 OK

Returns an array of wallet history entries for the specified wallet. The shape of each entry reflects `walletHistory` records in the database.

```json
[
  {
    "id": 7,
    "walletId": 42,
    "amount": 2.0,
    "type": "deposit",
    "date": "2024-01-11T12:34:56.000Z"
  },
  // more entries...
]
```

### 400 Bad Request

If `:id` is not a valid integer:

```json
{
  "error": "Invalid wallet id"
}
```

### 404 Not Found

If no history records are found for the specified wallet:

```json
{
  "error": "Wallet history not found"
}
```

### 500 Internal Server Error

If an error occurs during processing:

```json
{
  "message": "Error message"
}
```

## Filtering Logic

The results are filtered to ensure the authenticated user owns the wallet (`wallet.user.id`). If `startDate` is given, only entries where `date >= startDate` are returned.

### Filter Schema Example

```json
{
  "walletId": 42,
  "wallet": {
    "user": {
      "id": 123
    }
  },
  "date": {
    "gte": "2024-01-01T00:00:00.000Z"
  }
}
```

## Summary

- Use `GET /history/:id` to access wallet history for a given wallet.
- Optionally filter with `startDate`.
- Only the wallet's owner can access its history.
- Standard HTTP status codes are used for error handling.

For further integration details, see [API usage documentation](../getting-started.md) or contact the API maintainers.