# Portfolio API

Retrieve detailed information about a wallet’s portfolio, including allocation breakdown, price data, and value changes.

## Endpoint

GET `/portfolio/:id`

## URL Parameters

| Parameter | Type   | Description                |
|-----------|--------|----------------------------|
| `id`      | number | Wallet identifier (wallet ID) |

## Success Response

- **Status:** `200 OK`
- **Content-Type:** `application/json`
- **Body Schema:**
  ```json
  {
    "allocation": [ { "asset": string, "percentage": number } ],
    "price": [ { "asset": string, "price": number } ],
    "dailyPrice": [ { "asset": string, "priceChange": number } ],
    "value": number,
    "dailyValue": number
  }
  ```
  - `allocation`: Array of assets and their portfolio percentage.
  - `price`: Current prices for each asset.
  - `dailyPrice`: Price change for each asset over the last 24 hours.
  - `value`: Total current value of the portfolio.
  - `dailyValue`: Net change in total portfolio value over the last 24 hours.

### Example Response

```json
{
  "allocation": [
    { "asset": "BTC", "percentage": 50 },
    { "asset": "ETH", "percentage": 30 },
    { "asset": "ADA", "percentage": 20 }
  ],
  "price": [
    { "asset": "BTC", "price": 30000 },
    { "asset": "ETH", "price": 2000 },
    { "asset": "ADA", "price": 1.2 }
  ],
  "dailyPrice": [
    { "asset": "BTC", "priceChange": -500 },
    { "asset": "ETH", "priceChange": 50 },
    { "asset": "ADA", "priceChange": 0.05 }
  ],
  "value": 16000,
  "dailyValue": -350
}
```

## Error Response

- **Status:** `500 Internal Server Error`
- **Content-Type:** `application/json`
- **Body:**
  ```json
  { "message": "Error message describing what went wrong" }
  ```

## Usage Examples

### cURL

```bash
curl -X GET "https://api.yourdomain.com/portfolio/123" \
     -H "Accept: application/json"
```

### JavaScript (Fetch)

```js
fetch("https://api.yourdomain.com/portfolio/123")
  .then((res) => {
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return res.json();
  })
  .then((data) => console.log("Portfolio data:", data))
  .catch((err) => console.error("Error fetching portfolio:", err));
```

For more details on authentication, error handling, and service limits, see the [API Reference](../getting-started.md).