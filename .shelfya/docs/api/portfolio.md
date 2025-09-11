# Portfolio API

Retrieve key portfolio metrics for a given wallet.

## Endpoint

GET `/api/v1/portfolio/:id`

- Base URL: `http://{HOST}:{PORT}/api/v1`
- No authentication required

## Path Parameters

| Name | Type   | Description   |
| ---- | ------ | ------------- |
| id   | number | Wallet ID     |

## Response

```json
{
  "allocation": number,
  "price": number,
  "dailyPrice": number,
  "value": number,
  "dailyValue": number
}
```

Field descriptions:

- **allocation**: Portfolio allocation ratio (currently always `1`).
- **price**: Current asset price in EUR.
- **dailyPrice**: Percentage change in price since yesterday.
- **value**: Total wallet value in EUR.
- **dailyValue**: Difference between today’s value and the last recorded historical value.

## Example

### Request

```bash
curl --location --request GET 'http://localhost:5000/api/v1/portfolio/123'
```

### Response

```json
{
  "allocation": 1,
  "price": 1850.42,
  "dailyPrice": 2.34,
  "value": 3700.84,
  "dailyValue": 45.13
}
```

## Error Responses

- **500 Internal Server Error**  
  ```json
  {
    "message": "Error message details"
  }
  ```
  
Ensure your environment variables (`ETHERSCAN_API_KEY`, `CRYPTOCOMPARE_API_KEY`, etc.) are set correctly for price and value calculations.