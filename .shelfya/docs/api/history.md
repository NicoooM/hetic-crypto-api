# History API

Retrieve the transaction history of a specific wallet.  

All endpoints are prefixed with `/api/v1` and require a valid access token (JWT) in the `Authorization` header.

---

## Authentication

This endpoint is protected. Include an access token in the request header:

```
Authorization: Bearer <ACCESS_TOKEN>
```

If the token is missing, invalid, or expired, you'll receive a `401 Unauthorized` or `403 Forbidden` response.

---

## GET /history/:id

Fetch the wallet history for the given wallet ID and authenticated user.

### URL

```
GET /api/v1/history/:id
```

### Path Parameter

- `id` (integer, required) — The ID of the wallet whose history you want to retrieve.

### Query Parameter

- `startDate` (string, optional) — Only return entries on or after this date. Format as ISO 8601 (e.g. `2023-05-01`).

### Response

- `200 OK`  
  Returns an array of history records:

  ```json
  [
    {
      "id": 123,
      "walletId": 45,
      "date": "2023-05-01T00:00:00.000Z",
      "value": 2.1574,
      "quantity": 1.2,
      "currencyId": 1
    },
    {
      "id": 124,
      "walletId": 45,
      "date": "2023-05-02T00:00:00.000Z",
      "value": 2.3011,
      "quantity": 1.1,
      "currencyId": 1
    }
    // ...
  ]
  ```

- `400 Bad Request`  
  - Invalid wallet ID  
    ```json
    { "error": "Invalid wallet id" }
    ```
  - Malformed `startDate`  
    ```json
    { "message": "Invalid date format" }
    ```

- `401 Unauthorized` / `403 Forbidden`  
  Missing or invalid access token:
  ```json
  { "message": "Unauthorized" }
  ```

- `404 Not Found`  
  No history found for this wallet (after filtering):
  ```json
  { "error": "Wallet history not found" }
  ```

- `500 Internal Server Error`  
  Unexpected server error:
  ```json
  { "message": "Server error details…" }
  ```

---

## Examples

### cURL

```bash
curl -X GET "https://api.example.com/api/v1/history/45?startDate=2023-05-01" \
     -H "Authorization: Bearer eyJhbGciOi…" \
     -H "Accept: application/json"
```

### JavaScript (Axios)

```js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api.example.com/api/v1',
  withCredentials: true
});

// Set your token
API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

async function fetchHistory(walletId, startDate) {
  const params = startDate ? { startDate } : {};
  const response = await API.get(`/history/${walletId}`, { params });
  return response.data;
}

fetchHistory(45, '2023-05-01')
  .then(history => console.log(history))
  .catch(err => console.error(err.response.data));
```

---

## Notes

- The `startDate` filter is inclusive.
- History records are ordered by date ascending.
- The wallet must belong to the authenticated user; otherwise you’ll receive an authorization error.