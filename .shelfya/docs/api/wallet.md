# Wallet API

All wallet endpoints are prefixed with `/api/v1/wallet` and require a valid access token in the `Authorization` header.

## Authentication

Include your JWT access token in every request’s header:

```
Authorization: Bearer <accessToken>
```

---

## List All Wallets

Retrieve all wallets for the authenticated user.

**Endpoint**

```
GET /api/v1/wallet
```

**Request Headers**

- `Authorization: Bearer <accessToken>`

**Response**

- `200 OK`

```json
[
  {
    "id": 1,
    "userId": 42,
    "address": "0xAbC123...789",
    "title": "Main ETH Wallet",
    "createdAt": "2024-05-01T10:15:30.000Z",
    "updatedAt": "2024-05-01T10:15:30.000Z"
  },
  {
    "id": 2,
    "userId": 42,
    "address": "0xDeF456...012",
    "title": "Savings Wallet",
    "createdAt": "2024-05-03T14:22:10.000Z",
    "updatedAt": "2024-05-03T14:22:10.000Z"
  }
]
```

---

## Create a New Wallet

Add a new Ethereum wallet to the authenticated user’s account.

**Endpoint**

```
POST /api/v1/wallet
```

**Request Headers**

- `Authorization: Bearer <accessToken>`
- `Content-Type: application/json`

**Request Body**

```json
{
  "address": "0xAbC123...789",
  "title": "My New Wallet"
}
```

Both `address` and `title` are required and must be strings.

**Response**

- `201 Created`

```json
{
  "id": 3,
  "userId": 42,
  "address": "0xAbC123...789",
  "title": "My New Wallet",
  "createdAt": "2024-05-10T09:00:00.000Z",
  "updatedAt": "2024-05-10T09:00:00.000Z"
}
```

**Errors**

- `400 Bad Request`  
  Missing or invalid fields:
  ```json
  { "error": "Address and title are required" }
  ```
- `500 Internal Server Error`  
  Unexpected failure:
  ```json
  { "message": "Wallet creation failed => Error details..." }
  ```

---

## Delete a Wallet

Remove a wallet and its history.

**Endpoint**

```
DELETE /api/v1/wallet/:id
```

**Request Headers**

- `Authorization: Bearer <accessToken>`

**Path Parameters**

- `id` (integer) – ID of the wallet to delete

**Response**

- `204 No Content` – Successfully deleted

**Errors**

- `400 Bad Request`  
  Invalid wallet ID:
  ```json
  { "error": "Invalid wallet id" }
  ```
- `404 Not Found`  
  Wallet does not exist or does not belong to the user:
  ```json
  { "error": "Wallet not found" }
  ```
- `500 Internal Server Error`  
  Unexpected failure:
  ```json
  { "message": "Error details..." }
  ```

---

For more on authentication and token management, see [Authentication API](./auth.md).