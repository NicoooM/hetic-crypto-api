# Portfolio API

Retrieve the detailed portfolio of a wallet, including asset allocation, price history, and total value.

## Endpoint

GET `/portfolio/:id`

- **Path Parameter**
  - `id` (integer, required): The unique identifier of the wallet whose portfolio you want to fetch.

## Request Example

```bash
curl --location --request GET "https://api.yourdomain.com/portfolio/123"
```

## Successful Response

- **Status Code:** `200 OK`
- **Content-Type:** `application/json`

```json
{
  "allocation": [
    { "asset": "BTC", "percentage": 45.3 },
    { "asset": "ETH", "percentage": 30.1 },
    { "asset": "XRP", "percentage": 24.6 }
  ],
  "price": [
    { "timestamp": "2024-06-01T00:00:00Z", "BTC": 55000, "ETH": 3500, "XRP": 1.1 },
    { "timestamp": "2024-06-02T00:00:00Z", "BTC": 56000, "ETH": 3600, "XRP": 1.2 }
  ],
  "dailyPrice": [
    { "asset": "BTC", "change": 1.8 },
    { "asset": "ETH", "change": 2.9 }
  ],
  "value": {
    "total": 125000,
    "breakdown": {
      "BTC": 56000,
      "ETH": 45000,
      "XRP": 24000
    }
  },
  "dailyValue": {
    "totalChange": 2.1,
    "details": {
      "BTC": 1.8,
      "ETH": 2.9,
      "XRP": 0.5
    }
  }
}
```

### Field Descriptions

- `allocation`: Current percentage breakdown per asset in the wallet.
- `price`: Historical price data per asset over time.
- `dailyPrice`: Daily percentage change for each asset.
- `value.total`: Current total value of the portfolio.
- `value.breakdown`: Value per asset.
- `dailyValue.totalChange`: Overall daily percentage change of the portfolio.
- `dailyValue.details`: Daily change per asset.

## Error Response

- **Status Code:** `500 Internal Server Error`
- **Content-Type:** `application/json`

```json
{
  "message": "Detailed error message describing what went wrong"
}
```

## See Also

- [Portfolio Controller](https://github.com/NicoooM/hetic-crypto-api/blob/main/backend/src/controllers/portfolio.controller.ts)  
- [Portfolio Routes](https://github.com/NicoooM/hetic-crypto-api/blob/main/backend/src/routes/portfolio.ts)