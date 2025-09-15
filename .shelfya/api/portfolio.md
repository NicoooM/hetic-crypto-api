# Portfolio API

This document describes the Portfolio API, providing endpoints and data structure for retrieving Ethereum wallet portfolio data.

## Endpoint Overview

Retrieve the latest portfolio information for a specific wallet by its numeric ID.

- **URL**: `/api/portfolio/:id`
- **Method**: `GET`
- **Route File**: [`backend/src/routes/portfolio.ts`](../../backend/src/routes/portfolio.ts)

### Path Parameters

- `:id` &mdash; *(integer, required)*: The unique ID of the wallet.

---

## Sample Request

```http
GET /api/portfolio/42
```

---

## Response

A successful request returns a JSON object containing:

- `allocation`: Allocation metric for the wallet (currently always `1`)
- `price`: Latest ETH price in EUR
- `dailyPrice`: ETH % change in price since yesterday (EUR)
- `value`: Current wallet value in EUR
- `dailyValue`: Change in wallet value since the last recorded value (EUR)

### Example Response

```json
{
  "allocation": 1,
  "price": 3350.45,
  "dailyPrice": 2.1,
  "value": 1200.88,
  "dailyValue": 50.23
}
```

---

## How It Works

1. **Gets Wallet Address**: Fetches the wallet address for the given `walletId`.
2. **Gets Last Recorded Value**: Fetches the wallet's most recent historical value.
3. **Fetches ETH Price**: Retrieves current and previous day EUR prices for ETH from CryptoCompare.
4. **Calculates Price Change**: Computes the percentage change in price since yesterday.
5. **Fetches Wallet Balance**: Gets the balance in ETH for the wallet from Etherscan, converts to EUR.
6. **Value Delta**: Calculates the change in wallet value since the last historical record.

---

## Error Handling

- Returns `500 Internal Server Error` with a message field in JSON if any backend error occurs (e.g., invalid wallet ID, network or service issues).

### Example Error

```json
{
  "message": "Login failed => [Error details]"
}
```

---

## Notes

- The `allocation` value is currently a placeholder (`1`).
- Only Ethereum (ETH) in EUR is supported.
- Requires a valid Etherscan API key set in `process.env.ETHERSCAN_API_KEY`.
- Data accuracy depends on external services (CryptoCompare, Etherscan).

---

## Related Files

- Controller: [`backend/src/controllers/portfolio.controller.ts`](../../backend/src/controllers/portfolio.controller.ts)
- Service Logic: [`backend/src/services/portfolio.service.ts`](../../backend/src/services/portfolio.service.ts)
- Router: [`backend/src/routes/portfolio.ts`](../../backend/src/routes/portfolio.ts)

---

## Example Usage (with fetch)

```js
fetch('/api/portfolio/42')
  .then(res => res.json())
  .then(data => {
    console.log('Current wallet value:', data.value, 'EUR');
    console.log('Price change since yesterday:', data.dailyPrice, '%');
  });
```

---

## See Also

- [CryptoCompare API](https://min-api.cryptocompare.com/)
- [Etherscan API](https://etherscan.io/apis)