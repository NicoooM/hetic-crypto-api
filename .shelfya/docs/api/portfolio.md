# Portfolio API

Retrieve detailed portfolio analytics for a given wallet.

## Endpoint

GET `/portfolio/:id`

## Path Parameters

- `id` (integer, required)  
  The unique identifier of the wallet whose portfolio you want to fetch.

## Success Response

**Status:** `200 OK`  
**Content-Type:** `application/json`

```json
{
  "allocation": { "BTC": 50, "ETH": 30, "ADA": 20 },
  "price":     { "BTC": 60000, "ETH": 4000, "ADA": 2.5 },
  "dailyPrice": { "BTC": -1500, "ETH": 50, "ADA": 0.1 },
  "value":     { "BTC": 30000, "ETH": 12000, "ADA": 500 },
  "dailyValue": { "BTC": -750, "ETH": 150, "ADA": 20 }
}
```

Field descriptions:

- `allocation`  
  An object mapping each asset symbol to its percentage share of the portfolio.
- `price`  
  Current price of each asset.
- `dailyPrice`  
  Price change (absolute) for each asset over the last 24 hours.
- `value`  
  Current total value of each asset (price × quantity).
- `dailyValue`  
  Value change (absolute) for each asset over the last 24 hours.

## Error Response

**Status:** `500 Internal Server Error`  
**Content-Type:** `application/json`

```json
{
  "message": "Internal server error message"
}
```

## Examples

### cURL

```bash
curl -X GET http://localhost:3000/portfolio/123 \
     -H "Accept: application/json"
```

### JavaScript (fetch)

```js
fetch("http://localhost:3000/portfolio/123")
  .then((res) => {
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  })
  .then((data) => console.log("Portfolio data:", data))
  .catch((err) => console.error(err));
```