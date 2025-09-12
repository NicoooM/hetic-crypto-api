# History and Portfolio

This document covers two core endpoints of the Crypto API: fetching a wallet’s history and retrieving its current portfolio metrics.

---

## Authentication

Both endpoints require a valid user session. Include your JWT or session cookie in the request so that `req.user.id` can be validated.

---

## 1. Wallet History

Fetch a chronological list of balance changes for a specific wallet.

### Request

```
GET /api/history/:id?startDate=<ISO_DATE>
```

- `:id` — integer — the wallet ID.
- `startDate` (optional) — ISO 8601 date or date‐time string. Only history entries with `date >= startDate` will be returned.

### Example

```bash
curl -X GET https://api.example.com/api/history/42?startDate=2023-05-01 \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Responses

- **200 OK**  
  Returns an array of history objects:

  ```json
  [
    {
      "id": 101,
      "walletId": 42,
      "date": "2023-05-01T14:23:00.000Z",
      "value": 1.5324,
      "source": "ETHERSCAN"
    },
    {
      "id": 102,
      "walletId": 42,
      "date": "2023-05-02T10:12:00.000Z",
      "value": 1.6100,
      "source": "ETHERSCAN"
    }
  ]
  ```

- **400 Bad Request**  
  Invalid wallet ID:

  ```json
  { "error": "Invalid wallet id" }
  ```

- **404 Not Found**  
  No history entries found for that wallet (and date filter):

  ```json
  { "error": "Wallet history not found" }
  ```

- **500 Internal Server Error**  
  Unexpected server error:

  ```json
  { "message": "Some error detail..." }
  ```

---

## 2. Wallet Portfolio

Retrieve live portfolio metrics for a specific wallet, including allocation, ETH-EUR price, daily price change, total value, and daily P&L.

### Request

```
GET /api/portfolio/:id
```

- `:id` — integer — the wallet ID.

### Example

```bash
curl -X GET https://api.example.com/api/portfolio/42 \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Responses

- **200 OK**  
  Returns an object with the following fields:

  ```json
  {
    "allocation": 1,
    "price": 1850.42,
    "dailyPrice": 2.15,
    "value": 2.7756,
    "dailyValue": 0.0800
  }
  ```

  Field descriptions:
  - `allocation` — number (currently a placeholder, always `1`).
  - `price` — current ETH→EUR exchange rate (fetched from CryptoCompare).
  - `dailyPrice` — percentage change in ETH price over the last 24h.
  - `value` — wallet balance in ETH × current ETH→EUR rate.
  - `dailyValue` — net EUR gain/loss since the last recorded history value.

- **500 Internal Server Error**  
  Unexpected server error:

  ```json
  { "message": "Some error detail..." }
  ```

---

## External Dependencies

- CryptoCompare Price APIs  
  - Current price: `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR`  
  - Historical price: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=EUR&ts=<UNIX_TS>`

- Etherscan Balance API  
  ```
  https://api.etherscan.io/api
    ?module=account
    &action=balance
    &address=<WALLET_ADDRESS>
    &tag=latest
    &apikey=<ETHERSCAN_API_KEY>
  ```

Make sure `ETHERSCAN_API_KEY` is set in your environment to fetch on‐chain balances.