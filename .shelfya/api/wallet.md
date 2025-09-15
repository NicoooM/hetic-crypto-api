# Wallet API

This document describes the HTTP endpoints for managing wallets. All routes require an authenticated user; authentication middleware should populate `req.user` with the current user’s data (including an `id` field).

Base path: `/wallet`

---

## Authentication

Each request must include a valid authorization token. For example:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### GET /wallet

Fetch all wallets for the authenticated user.

Request:
  • Method: GET  
  • URL: `/wallet`  
  • Headers:
    - `Authorization: Bearer <token>`

Response (200 OK):
```json
[
  {
    "id": 1,
    "title": "My ETH Wallet",
    "address": "0x1234...abcd",
    "userId": 42,
    "createdAt": "2023-06-01T12:34:56.789Z"
  },
  {
    "id": 2,
    "title": "Savings Wallet",
    "address": "0xabcd...1234",
    "userId": 42,
    "createdAt": "2023-06-02T09:10:11.123Z"
  }
]
```

Error responses:
  • 500 Internal Server Error  
  ```json
  { "message": "Error details..." }
  ```

---

### POST /wallet

Create a new wallet for the authenticated user.

Request:
  • Method: POST  
  • URL: `/wallet`  
  • Headers:
    - `Content-Type: application/json`
    - `Authorization: Bearer <token>`  
  • Body:
  ```json
  {
    "address": "0x1234...abcd",
    "title": "My New Wallet"
  }
  ```

Response (201 Created):
```json
{
  "id": 3,
  "title": "My New Wallet",
  "address": "0x1234...abcd",
  "userId": 42,
  "createdAt": "2023-06-03T14:15:16.171Z"
}
```

Error responses:
  • 400 Bad Request  
  ```json
  { "error": "Address and title are required" }
  ```
  • 500 Internal Server Error  
  ```json
  { "message": "Error details..." }
  ```

---

### DELETE /wallet/:id

Delete a wallet by its ID for the authenticated user.

Request:
  • Method: DELETE  
  • URL: `/wallet/:id`  
  • Headers:
    - `Authorization: Bearer <token>`

Path Parameters:
  • `id` (integer) – The wallet’s unique identifier.

Response (204 No Content):  
_No body._

Error responses:
  • 400 Bad Request  
  ```json
  { "error": "Invalid wallet id" }
  ```
  • 404 Not Found  
  ```json
  { "error": "Wallet not found" }
  ```
  • 500 Internal Server Error  
  ```json
  { "message": "Error details..." }
  ```

---

## Examples

Fetch all wallets:
```
curl -H "Authorization: Bearer $TOKEN" \
     https://api.example.com/wallet
```

Create a wallet:
```
curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"address":"0x1234...abcd","title":"My Wallet"}' \
     https://api.example.com/wallet
```

Delete a wallet:
```
curl -X DELETE \
     -H "Authorization: Bearer $TOKEN" \
     https://api.example.com/wallet/3
```

For further details on authentication and error handling, refer to the main API documentation.