# Portfolio API

Retrieve detailed information about a wallet’s asset allocation, pricing, and daily performance.

## Endpoint

**GET** `/portfolio/:id`

- `:id` (integer) – Unique identifier of the wallet.

## Request

### URL Parameters

| Parameter | Type    | Description                     |
|-----------|---------|---------------------------------|
| `id`      | Integer | The ID of the wallet to fetch.  |

### Example

```bash
curl -X GET "https://api.example.com/portfolio/123" \
  -H "Accept: application/json"
```

Or using fetch in JavaScript:

```js
fetch("https://api.example.com/portfolio/123")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

## Success Response

- **Status**: `200 OK`
- **Content-Type**: `application/json`

### Body

```json
{
  "allocation": [
    { "asset": "BTC", "percentage": 45.3 },
    { "asset": "ETH", "percentage": 32.1 },
    { "asset": "USDT", "percentage": 22.6 }
  ],
  "price": {
    "BTC": 50000.23,
    "ETH": 3500.12,
    "USDT": 1.00
  },
  "dailyPrice": {
    "BTC": -2.3,
    "ETH": +1.5,
    "USDT": 0.0
  },
  "value": {
    "BTC": 22650.11,
    "ETH": 11203.44,
    "USDT": 560.00
  },
  "dailyValue": {
    "BTC": -528.95,
    "ETH": +163.05,
    "USDT": 0.00
  }
}
```

Field Descriptions:

- `allocation`: Array of assets with their percentage share of the portfolio.
- `price`: Current price per unit for each asset.
- `dailyPrice`: Percentage change in price over the last 24 hours.
- `value`: Total value held in each asset (price × quantity).
- `dailyValue`: Change in asset value over the last 24 hours.

## Error Response

- **Status**: `500 Internal Server Error`
- **Content-Type**: `application/json`

### Body

```json
{
  "message": "Internal server error message"
}
```

---

For any questions or issues, please refer to the [API reference home](/.shelfya/api/README.md).