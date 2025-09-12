# Validation Schemas

This document describes the Zod-based request and data validation schemas used throughout the Crypto API. All schemas are defined in `backend/src/schemas` and enforce shape, types, and basic business rules.

## Table of Contents

- [Authentication Schemas](#authentication-schemas)  
  - [`registerSchema`](#registerschema)  
  - [`loginSchema`](#loginschema)  
  - [`middlewareSchema`](#middlewareschema)  
  - [`refreshTokenSchema`](#refreshtokenschema)  
- [Profile Schemas](#profile-schemas)  
  - [`profileSchema`](#profileschema)  
  - [`passwordSchema`](#passwordschema)  
- [Wallet Schemas](#wallet-schemas)  
  - [`walletSchema`](#walletschema)  
- [Filter Schemas](#filter-schemas)  
  - [`filtersSchema`](#filtersschema)  
- [Usage Example](#usage-example)  

---

## Authentication Schemas

File: `backend/src/schemas/auth.schemas.ts`

### registerSchema

Validates new user registration payload:

```ts
import { registerSchema } from "backend/src/schemas/auth.schemas";

// Fields
// email    : valid email
// password : ≥ 8 chars, uppercase, lowercase, number, special char
// name     : non-empty string

registerSchema.parse({
  email: "user@example.com",
  password: "P@ssw0rd!",
  name: "Alice"
});
```

Error message on invalid password:  
```
Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
```

### loginSchema

Validates login credentials:

```ts
import { loginSchema } from "backend/src/schemas/auth.schemas";

loginSchema.parse({
  email: "user@example.com",
  password: "P@ssw0rd!"
});
```

### middlewareSchema

Used to validate token payload in protected routes:

```ts
import { middlewareSchema } from "backend/src/schemas/auth.schemas";

middlewareSchema.parse({
  id: "12345",
  email: "user@example.com"
});
```

### refreshTokenSchema

A simple string schema for refresh tokens:

```ts
import { refreshTokenSchema } from "backend/src/schemas/auth.schemas";

refreshTokenSchema.parse("some-refresh-token-string");
```

---

## Profile Schemas

File: `backend/src/schemas/profile.schemas.ts`

### profileSchema

Validate user profile updates:

```ts
import { profileSchema } from "backend/src/schemas/profile.schemas";

profileSchema.parse({
  email: "new-email@example.com",
  name: "Alice Updated"
});
```

### passwordSchema

Validate old and new password change:

```ts
import { passwordSchema } from "backend/src/schemas/profile.schemas";

passwordSchema.parse({
  oldPassword: "OldP@ss1",
  newPassword: "NewP@ss2!"
});
```

Both fields enforce the same strong-password regex as `registerSchema`.

---

## Wallet Schemas

File: `backend/src/schemas/wallet.schemas.ts`

### walletSchema

Validate wallet creation or update:

```ts
import { walletSchema } from "backend/src/schemas/wallet.schemas";

walletSchema.parse({
  address: "0x123abc456def...",
  title: "My Main Wallet"
});
```

---

## Filter Schemas

File: `backend/src/schemas/filters.schemas.ts`

### filtersSchema

Used to validate filter parameters (e.g., transaction queries):

```ts
import { filtersSchema } from "backend/src/schemas/filters.schemas";

filtersSchema.parse({
  walletId: 42,
  wallet: {
    user: { id: 7 }
  },
  date: {
    gte: new Date("2024-01-01")
  }
});
```

- `walletId`: numeric ID  
- `wallet.user.id`: nested user ID  
- `date.gte`: optional lower-bound `Date`  

---

## Usage Example

In an Express route, you might use these schemas as middleware:

```ts
import express from "express";
import { registerSchema } from "backend/src/schemas/auth.schemas";

const router = express.Router();

router.post("/register", (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    // Proceed with registration logic...
    res.status(201).json({ user: data });
  } catch (e) {
    res.status(400).json({ error: e.errors });
  }
});
```

For more information on advanced schema usage, visit the [Zod documentation](https://github.com/colinhacks/zod).