# Portfolio API

Retrieve the current allocation and market data for a specific wallet.

## Endpoint

```
GET /portfolio/:id
```

- **Path Parameters**
  - `id` (integer, required): The unique ID of the wallet.

## Response

Returns a JSON object with the following fields:

- `allocation` (number): The portfolio’s allocation ratio (currently hardcoded to 1).
- `price` (number): Current ETH price in EUR.
- `dailyPrice` (number): Percentage change of ETH price compared to 24 h ago.
- `value` (number): Current wallet value in EUR.
- `dailyValue` (number): Difference between current value and last stored value.

### Success (200)

```json
{
  "allocation": 1,
  "price": 1845.72,
  "dailyPrice": 2.13,
  "value": 10456.34,
  "dailyValue": 125.47
}
```

### Error (500)

```json
{
  "message": "Internal server error message"
}
```

## Example

```bash
curl -X GET "https://api.example.com/portfolio/42" \
     -H "Accept: application/json"
```

## Notes

- The service fetches data from:
  - CryptoCompare API for current & historical ETH/EUR prices.
  - Etherscan API for wallet balance.
- Ensure `ETHERSCAN_API_KEY` is set in your environment:

```bash
export ETHERSCAN_API_KEY=your_api_key_here
```

## Source

- Controller: `backend/src/controllers/portfolio.controller.ts`
- Service: `backend/src/services/portfolio.service.ts`
- Route: `backend/src/routes/portfolio.ts`