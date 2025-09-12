# Schemas Guide

This guide details the Zod schemas used to validate request payloads and internal data structures in the `backend/src/schemas` directory. Each schema enforces the required shape and validation rules so you can catch invalid input early.

---

## Table of Contents

- [Authentication Schemas](#authentication-schemas)  
- [Wallet Schema](#wallet-schema)  
- [Filters Schema](#filters-schema)  
- [Profile Schemas](#profile-schemas)  

---

## Authentication Schemas

All authentication-related schemas are defined in `backend/src/schemas/auth.schemas.ts`.

### registerSchema

Validates user registration payload.

```ts
import { registerSchema } from "schemas/auth.schemas";

type RegisterInput = z.infer<typeof registerSchema>;
// {
//   email: string;
//   password: string;
//   name: string;
// }

registerSchema.parse({
  email: "alice@example.com",
  password: "Secur3P@ss!",
  name: "Alice"
// });
```

Fields:
- **email**: must be a valid email string.
- **password**: minimum 8 chars, and include at least one uppercase, one lowercase, one number, and one special character.
- **name**: non-empty string.

### loginSchema

Validates user login payload.

```ts
import { loginSchema } from "schemas/auth.schemas";

loginSchema.parse({
  email: "alice@example.com",
  password: "Secur3P@ss!"
});
```

Fields:
- **email**: valid email.
- **password**: non-empty string.

### middlewareSchema

Validates the authenticated user object attached by middleware.

```ts
import { middlewareSchema } from "schemas/auth.schemas";

// e.g. in Express middleware:
middlewareSchema.parse(req.user);
```

Fields:
- **id**: user ID (string).
- **email**: valid email.

### refreshTokenSchema

Validates a refresh token string.

```ts
import { refreshTokenSchema } from "schemas/auth.schemas";

refreshTokenSchema.parse("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
```

---

## Wallet Schema

Defined in `backend/src/schemas/wallet.schemas.ts`.

```ts
import { walletSchema } from "schemas/wallet.schemas";

const input = {
  address: "0x1234abcd...",
  title: "Main Savings Wallet"
};

walletSchema.parse(input);
```

Fields:
- **address**: blockchain address string.
- **title**: descriptive name for the wallet.

---

## Filters Schema

Defined in `backend/src/schemas/filters.schemas.ts`. Used to filter transaction queries.

```ts
import { filtersSchema } from "schemas/filters.schemas";

// Example filter to get all txns since Jan 1, 2023 for wallet #42
filtersSchema.parse({
  walletId: 42,
  wallet: { user: { id: 7 } },
  date: { gte: new Date("2023-01-01") }
});
```

Fields:
- **walletId**: numeric ID of the wallet.
- **wallet.user.id**: numeric ID of the owning user.
- **date?**: optional object `{ gte: Date }` to filter records from that date onward.

---

## Profile Schemas

Located in `backend/src/schemas/profile.schemas.ts`, these handle user profile updates.

### profileSchema

Validates general profile updates:

```ts
import { profileSchema } from "schemas/profile.schemas";

profileSchema.parse({
  email: "newemail@example.com",
  name: "New Name"
});
```

Fields:
- **email**: valid email.
- **name**: non-empty string.

### passwordSchema

Validates password change requests:

```ts
import { passwordSchema } from "schemas/profile.schemas";

passwordSchema.parse({
  oldPassword: "OldP@ssw0rd!",
  newPassword: "NewStr0ngP@ss!"
});
```

Fields:
- **oldPassword**: must meet the same complexity rules as registration.
- **newPassword**: same complexity requirements.

---

## How to Use

All schemas are powered by [Zod](https://github.com/colinhacks/zod). To validate incoming requests, simply import the relevant schema and call:

```ts
schema.parse(req.body);
```

Any validation failure throws a `ZodError` you can catch and return as a `400 Bad Request`. This keeps your controllers clean and guarantees well-formed data throughout the stack.