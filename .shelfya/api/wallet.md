# Wallet API

The Wallet API allows authenticated users to create, list, and delete their cryptocurrency wallets. All endpoints require a valid authentication token (e.g. a Bearer JWT) and use the base path:

```
/api/wallet
```

## Authentication

Include an `Authorization` header in every request:

```
Authorization: Bearer <your_token_here>
```

---

## Endpoints

### List Wallets

Retrieve all wallets belonging to the authenticated user.

```
GET /api/wallet
```

Request headers:
- `Authorization`: Bearer token

Response:
- `200 OK`  
  ```json
  [
    {
      "id": 1,
      "address": "0x1234abcd...",
      "title": "My Main Wallet",
      "userId": 42
    },
    {
      "id": 2,
      "address": "0xabcd1234...",
      "title": "Savings Wallet",
      "userId": 42
    }
  ]
  ```
- `500 Internal Server Error`  
  ```json
  { "message": "Error message" }
  ```

Example:
```bash
curl -H "Authorization: Bearer $TOKEN" \
     https://your-domain.com/api/wallet
```

---

### Create Wallet

Register a new wallet for the authenticated user.

```
POST /api/wallet
```

Request headers:
- `Authorization`: Bearer token  
- `Content-Type`: application/json

Request body:
```json
{
  "address": "0x1234abcd...",
  "title": "My New Wallet"
}
```

Fields:
- `address` (string, required): The blockchain address of the wallet.
- `title` (string, required): A user-friendly name for the wallet.

Response:
- `201 Created`  
  ```json
  {
    "id": 3,
    "address": "0x1234abcd...",
    "title": "My New Wallet",
    "userId": 42
  }
  ```
- `400 Bad Request`  
  ```json
  { "error": "Address and title are required" }
  ```
- `500 Internal Server Error`  
  ```json
  { "message": "Error message" }
  ```

Example:
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"address":"0x1234abcd...","title":"My New Wallet"}' \
     https://your-domain.com/api/wallet
```

---

### Delete Wallet

Remove a specific wallet by its ID.

```
DELETE /api/wallet/:id
```

Request headers:
- `Authorization`: Bearer token

Path parameters:
- `id` (integer, required): The ID of the wallet to delete.

Response:
- `204 No Content`  
- `400 Bad Request`  
  ```json
  { "error": "Invalid wallet id" }
  ```
- `404 Not Found`  
  ```json
  { "error": "Wallet not found" }
  ```
- `500 Internal Server Error`  
  ```json
  { "message": "Error message" }
  ```

Example:
```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
     https://your-domain.com/api/wallet/3
```

---

## Error Handling

- Validation and parsing errors (missing or invalid fields) return a **400** status.
- Attempting to delete a non-existent wallet returns **404**.
- Unexpected errors return a **500** status with an error message.