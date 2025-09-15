# Portfolio API

Retrieve aggregated portfolio data for a specific wallet.

## Endpoint

GET `/portfolio/:id`

- **URL Params**
  - `id` (integer, required): Wallet identifier.

## Request Example

```bash
curl -X GET https://api.example.com/portfolio/123
```

## Successful Response

- **Status:** `200 OK`
- **Content-Type:** `application/json`
- **Body Fields:**
  - `allocation` (object): Percentage breakdown of assets.
  - `price` (object): Current prices per asset.
  - `dailyPrice` (object): Price changes over the last 24 hours.
  - `value` (number): Total current value of the portfolio.
  - `dailyValue` (number): Change in total value over the last 24 hours.

```json
{
  "allocation": {
    "BTC": 50.1,
    "ETH": 30.5,
    "ADA": 19.4
  },
  "price": {
    "BTC": 60000,
    "ETH": 4000,
    "ADA": 2.5
  },
  "dailyPrice": {
    "BTC": -2.3,
    "ETH": +1.1,
    "ADA": +0.5
  },
  "value": 123456.78,
  "dailyValue": -2345.67
}
```

## Error Responses

- **500 Internal Server Error**  
  When an unexpected error occurs.

```json
{
  "message": "Internal server error details"
}
```

## Notes

- Ensure `:id` is a valid integer.  
- All numeric fields are in USD by default.  
- For authentication and rate limits, see the [Authentication guide](../getting-started/authentication.md).