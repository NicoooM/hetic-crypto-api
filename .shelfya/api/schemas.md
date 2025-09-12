# API Schemas

This document describes the JSON shapes expected by the HETIC Crypto API for authentication, wallets, filters, and profile routes. All schemas are validated using Zod.

---

## Authentication Schemas

### RegisterSchema

Used to create a new user account.

- **email** (string): must be a valid email address  
- **password** (string): minimum 8 characters, at least one uppercase, one lowercase, one number, one special character  
- **name** (string)

Example request body:
```json
{
  "email": "alice@example.com",
  "password": "Str0ngP@ssword!",
  "name": "Alice"
}
```

### LoginSchema

Used to authenticate an existing user.

- **email** (string): valid email address  
- **password** (string)

Example request body:
```json
{
  "email": "alice@example.com",
  "password": "Str0ngP@ssword!"
}
```

### RefreshTokenSchema

Used to refresh an expired access token.

- **refreshToken** (string)

Example request body:
```json
"your-refresh-token-string-here"
```

### MiddlewareSchema

Represents the validated user payload attached to protected routes.

- **id** (string)  
- **email** (string): valid email address

Example payload (e.g., extracted from JWT):
```json
{
  "id": "user-uuid-1234",
  "email": "alice@example.com"
}
```

---

## Wallet Schema

### WalletSchema

Defines the shape of a wallet resource.

- **address** (string): blockchain address  
- **title** (string): user-defined label

Example request body:
```json
{
  "address": "0xAbC1234dEf5678GhI9jKlMnOpQrStUVwXyZ",
  "title": "My Main Wallet"
}
```

---

## Filters Schema

### FiltersSchema

Used to filter transaction or balance queries.

- **walletId** (number): internal wallet identifier  
- **wallet** (object): nested object containing  
  - **user** (object):  
    - **id** (number)  
- **date** (object, optional): date filter  
  - **gte** (string, ISO 8601 date)

Example request body:
```json
{
  "walletId": 42,
  "wallet": {
    "user": {
      "id": 7
    }
  },
  "date": {
    "gte": "2023-07-01T00:00:00.000Z"
  }
}
```

---

## Profile Schemas

### ProfileSchema

Used to update user profile details.

- **email** (string): valid email address  
- **name** (string)

Example request body:
```json
{
  "email": "newalice@example.com",
  "name": "Alice Johnson"
}
```

### PasswordSchema

Used to change the user’s password.

- **oldPassword** (string): current password, same rules as registration  
- **newPassword** (string): must follow the same strength rules

Example request body:
```json
{
  "oldPassword": "Str0ngP@ssword!",
  "newPassword": "N3wStr0ngP@ss!"
}
```

---

For more on validation patterns and error handling, see the Zod documentation: https://github.com/colinhacks/zod.