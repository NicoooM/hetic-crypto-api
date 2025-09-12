# Wallet API

The Wallet API lets authenticated users create, list, and delete cryptocurrency wallets. All endpoints require a valid user context (e.g., a JWT in the `Authorization` header).

Base path:  
```
/wallet
```

---

## Authentication

Include an `Authorization` header with a bearer token in every request:

```
Authorization: Bearer <your_token_here>
```

---

## Endpoints

### List Wallets

Retrieve all wallets for the authenticated user.

- Method: `GET`
- Path: `/wallet`
- Response: `200 OK`  
  An array of wallet objects.

#### Example Request

```bash
curl -H "Authorization: Bearer $TOKEN" \
     https://api.example.com/wallet
```

#### Example Response

```json
[
  {
    "id": 1,
    "address": "0x1234abcd...",
    "title": "Main Wallet"
  },
  {
    "id": 2,
    "address": "0xabcd1234...",
    "title": "Savings Wallet"
  }
]
```

---

### Create a Wallet

Add a new wallet for the authenticated user.

- Method: `POST`
- Path: `/wallet`
- Request Body (JSON):
  - `address` (string, required): The blockchain address.
  - `title` (string, required): A human-friendly name.

- Success Response: `201 Created`  
  The newly created wallet object.

- Error Responses:
  - `400 Bad Request` if `address` or `title` is missing.
  - `500 Internal Server Error` on unexpected errors.

#### Example Request

```bash
curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "address": "0x1234abcd...",
       "title": "Trading Wallet"
     }' \
     https://api.example.com/wallet
```

#### Example Response

```json
{
  "id": 3,
  "address": "0x1234abcd...",
  "title": "Trading Wallet"
}
```

---

### Delete a Wallet

Remove a wallet by its ID. Only the owner can delete their wallet.

- Method: `DELETE`
- Path: `/wallet/:id`
  - `id` (integer): Wallet identifier.

- Success Response: `204 No Content`

- Error Responses:
  - `400 Bad Request` if `id` is not a valid number.
  - `404 Not Found` if the wallet does not exist or does not belong to the user.
  - `500 Internal Server Error` on unexpected errors.

#### Example Request

```bash
curl -X DELETE \
     -H "Authorization: Bearer $TOKEN" \
     https://api.example.com/wallet/3
```

#### Example Response

Status: `204 No Content`

---

For any additional questions or troubleshooting, refer to our [FAQ](../faq.md) or reach out to support.