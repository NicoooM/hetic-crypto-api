# Wallet API

Manage user wallets (crypto addresses). All endpoints require authentication via a valid JWT in the `Authorization` header:  
`Authorization: Bearer <token>`

Base path: `/api/wallet`

---

## Schemas

```ts
// backend/src/schemas/wallet.schemas.ts
export const walletSchema = z.object({
  address: z.string(),
  title:   z.string(),
});
```

Wallet object (returned by the API) typically includes:
- `id` (number): Unique wallet identifier
- `address` (string): Wallet address
- `title` (string): User-friendly name

---

## Create a Wallet

**POST** `/api/wallet`

Create a new wallet for the authenticated user.

### Request

Headers  
```
Authorization: Bearer <token>
Content-Type: application/json
```

Body (JSON)  
```json
{
  "address": "0xABCDEF1234567890",
  "title":   "My Main Wallet"
}
```

### Responses

- `201 Created`  
  Returns the created wallet object.  
  ```json
  {
    "id": 1,
    "address": "0xABCDEF1234567890",
    "title": "My Main Wallet"
  }
  ```
- `400 Bad Request`  
  Missing or invalid fields.  
  ```json
  { "error": "Address and title are required" }
  ```
- `500 Internal Server Error`  
  Unexpected error.  
  ```json
  { "message": "Detailed error message" }
  ```

### Example (cURL)

```bash
curl -X POST https://api.example.com/api/wallet \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"address":"0xABCDEF1234567890","title":"My Main Wallet"}'
```

---

## List All Wallets

**GET** `/api/wallet`

Retrieve all wallets belonging to the authenticated user.

### Request

Headers  
```
Authorization: Bearer <token>
```

### Responses

- `200 OK`  
  JSON array of wallet objects.  
  ```json
  [
    { "id": 1, "address": "0xABC...", "title": "Main" },
    { "id": 2, "address": "0xDEF...", "title": "Savings" }
  ]
  ```
- `500 Internal Server Error`  
  ```json
  { "message": "Detailed error message" }
  ```

### Example (cURL)

```bash
curl https://api.example.com/api/wallet \
  -H "Authorization: Bearer $TOKEN"
```

---

## Delete a Wallet

**DELETE** `/api/wallet/:id`

Delete a wallet by its ID for the authenticated user.

### Request

Headers  
```
Authorization: Bearer <token>
```

Path Parameter  
- `id` (integer): Wallet ID to delete

### Responses

- `204 No Content`  
  Wallet deleted successfully.
- `400 Bad Request`  
  Invalid wallet ID.  
  ```json
  { "error": "Invalid wallet id" }
  ```
- `404 Not Found`  
  Wallet does not exist or does not belong to the user.  
  ```json
  { "error": "Wallet not found" }
  ```
- `500 Internal Server Error`  
  ```json
  { "message": "Detailed error message" }
  ```

### Example (cURL)

```bash
curl -X DELETE https://api.example.com/api/wallet/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

For more details on error codes and behavior, refer to the router implementation in `backend/src/routes/wallet.ts` and controller logic in `backend/src/controllers/wallet.controller.ts`.