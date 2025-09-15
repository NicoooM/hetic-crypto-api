# Wallet API

Manage user wallets by creating, listing, or deleting them.

All endpoints require a valid authenticated user (available as `req.user`). The base path for these routes is `/wallet`.

---

## Authentication

Each request must include authentication headers (e.g. a JWT token). The server populates `req.user.id` with the authenticated user’s ID.

---

## Endpoints

### 1. List Wallets

Retrieve all wallets belonging to the authenticated user.

- Method: GET  
- URL: `/wallet`

#### Request

```http
GET /wallet
Authorization: Bearer <token>
```

#### Response

- 200 OK  
- Body: Array of wallet objects

Example:

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

---

### 2. Create Wallet

Add a new wallet for the authenticated user.

- Method: POST  
- URL: `/wallet`

#### Request

```http
POST /wallet
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": "0x1234abcd...",
  "title": "My New Wallet"
}
```

#### Validation

- Both `address` (string) and `title` (string) are required.
- The request body is validated against a Zod schema.

#### Responses

- 201 Created  
  Returns the newly created wallet:

  ```json
  {
    "id": 3,
    "address": "0x1234abcd...",
    "title": "My New Wallet",
    "userId": 42
  }
  ```

- 400 Bad Request  
  When `address` or `title` is missing:

  ```json
  { "error": "Address and title are required" }
  ```

- 500 Internal Server Error  
  On unexpected errors:

  ```json
  { "message": "Error message details" }
  ```

---

### 3. Delete Wallet

Remove a wallet by its ID. Only the owner can delete their wallet.

- Method: DELETE  
- URL: `/wallet/:id`

#### Request

```http
DELETE /wallet/3
Authorization: Bearer <token>
```

#### Responses

- 204 No Content  
  Successfully deleted.

- 400 Bad Request  
  Invalid wallet ID format:

  ```json
  { "error": "Invalid wallet id" }
  ```

- 404 Not Found  
  Wallet does not exist or does not belong to the user:

  ```json
  { "error": "Wallet not found" }
  ```

- 500 Internal Server Error  
  On unexpected errors:

  ```json
  { "message": "Error message details" }
  ```
