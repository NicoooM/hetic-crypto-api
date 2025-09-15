# Portfolio API

Retrieve detailed information about a specific portfolio (wallet) by its ID.

## Endpoint

```
GET /api/portfolio/:id
```

- Base path `/api/portfolio` (router mount point)
- HTTP method: `GET`

## Path Parameters

| Name | Type   | Description               |
|------|--------|---------------------------|
| id   | integer | Unique identifier of the portfolio (wallet) |

## Successful Response

- **Status:** `200 OK`
- **Content-Type:** `application/json`
- **Body:**  
  ```json
  {
    "allocation": { "<asset>": number, ... },
    "price": { "<asset>": number, ... },
    "dailyPrice": { "<asset>": [ { "date": string, "price": number }, ... ], ... },
    "value": number,
    "dailyValue": [ { "date": string, "value": number }, ... ]
  }
  ```

Field descriptions:

- **allocation**  
  A mapping of each asset symbol to its percentage share in the portfolio.  
  Example: `{ "BTC": 0.5, "ETH": 0.3, "ADA": 0.2 }`

- **price**  
  Latest price of each asset in the portfolio.  
  Example: `{ "BTC": 45000.12, "ETH": 3200.50 }`

- **dailyPrice**  
  Historical daily prices for each asset.  
  Example:
  ```json
  {
    "BTC": [
      { "date": "2024-06-01", "price": 44000 },
      { "date": "2024-06-02", "price": 44500 }
    ],
    "ETH": [
      { "date": "2024-06-01", "price": 3100 },
      { "date": "2024-06-02", "price": 3150 }
    ]
  }
  ```

- **value**  
  Current total value of the portfolio (sum of asset quantities × latest prices).  
  Example: `28000.75`

- **dailyValue**  
  Historical total portfolio values by day.  
  Example:
  ```json
  [
    { "date": "2024-06-01", "value": 27500 },
    { "date": "2024-06-02", "value": 28000 }
  ]
  ```

## Error Response

- **Status:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "message": "<error details>"
  }
  ```

## Example

### cURL

```bash
curl -X GET "https://api.example.com/api/portfolio/123" \
     -H "Accept: application/json"
```

### JavaScript (fetch)

```js
fetch("https://api.example.com/api/portfolio/123")
  .then(res => {
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log("Portfolio Allocation", data.allocation);
    console.log("Current Value", data.value);
  })
  .catch(err => console.error("API error:", err.message));
```