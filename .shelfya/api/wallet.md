# Wallet API

This document describes the endpoints for managing wallets in the HETIC Crypto API. All endpoints require an authenticated user (`req.user`) and are mounted under `/wallet`.

---

## Authentication

All requests must include a valid authentication token (e.g., a Bearer token in `Authorization` header). The user ID is inferred from the authenticated session.

---

## Endpoints

### 1. Create Wallet

Create a new wallet for the authenticated user.

- Method: `POST`
- URL: `/wallet`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`

#### Request Body

```jsonc
{
  "address": "0x1234abcd...",  // required, string
  "title": "My Crypto Wallet"  // required, string
}
```

#### Responses

- **201 Created**

  ```json
  {
    "id": 42,
    "address": "0x1234abcd...",
    "title": "My Crypto Wallet",
    "userId": 7,
    "createdAt": "2023-05-01T12:34:56.789Z"
  }
  ```

- **400 Bad Request**

  ```json
  { "error": "Address and title are required" }
  ```

- **500 Internal Server Error**

  ```json
  { "message": "Unexpected error message" }
  ```

---

### 2. Get All Wallets

Retrieve all wallets belonging to the authenticated user.

- Method: `GET`
- URL: `/wallet`
- Headers:
  - `Authorization: Bearer <token>`

#### Responses

- **200 OK**

  ```json
  [
    {
      "id": 42,
      "address": "0x1234abcd...",
      "title": "My Crypto Wallet",
      "userId": 7,
      "createdAt": "2023-05-01T12:34:56.789Z"
    },
    {
      "id": 43,
      "address": "0x5678efgh...",
      "title": "Savings Wallet",
      "userId": 7,
      "createdAt": "2023-05-02T08:21:33.123Z"
    }
  ]
  ```

- **500 Internal Server Error**

  ```json
  { "message": "Unexpected error message" }
  ```

---

### 3. Delete Wallet

Delete a specific wallet belonging to the authenticated user.

- Method: `DELETE`
- URL: `/wallet/:id`
- Headers:
  - `Authorization: Bearer <token>`

#### URL Parameters

| Name | Type   | Description            |
| ---- | ------ | ---------------------- |
| id   | number | Wallet ID to be removed |

#### Responses

- **204 No Content**

  Wallet successfully deleted; no response body.

- **400 Bad Request**

  ```json
  { "error": "Invalid wallet id" }
  ```

- **404 Not Found**

  ```json
  { "error": "Wallet not found" }
  ```

- **500 Internal Server Error**

  ```json
  { "message": "Unexpected error message" }
  ```

---

## Error Handling

- Validation and parse errors return `400 Bad Request`.
- Non-existent resources return `404 Not Found`.
- Unexpected conditions return `500 Internal Server Error`.

For more details on HTTP status codes, see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status.