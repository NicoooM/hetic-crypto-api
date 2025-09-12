# Backend Schemas

This document describes all Zod schemas used in the backend for request validation and middleware type-checking.

## Table of Contents

- [Auth Schemas](#auth-schemas)  
- [Profile Schemas](#profile-schemas)  
- [Wallet Schemas](#wallet-schemas)  
- [Filters Schema](#filters-schema)  

---

## Auth Schemas

Defined in `backend/src/schemas/auth.schemas.ts`.

### registerSchema

Validates user registration data.

```ts
import { registerSchema } from "backend/src/schemas/auth.schemas";

type RegisterInput = z.infer<typeof registerSchema>;
```

Fields:

- `email` &mdash; Valid email address.  
- `password` &mdash; Minimum 8 characters, must include uppercase, lowercase, number, and special character.  
- `name` &mdash; Non-empty string.

Example request:

```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Str0ng!Pass",
  "name": "John Doe"
}
```

### loginSchema

Validates user login data.

```ts
import { loginSchema } from "backend/src/schemas/auth.schemas";

type LoginInput = z.infer<typeof loginSchema>;
```

Fields:

- `email` &mdash; Valid email.  
- `password` &mdash; Non-empty string.

Example request:

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Str0ng!Pass"
}
```

### middlewareSchema

Used to type the decoded JWT payload on protected routes.

```ts
import { middlewareSchema } from "backend/src/schemas/auth.schemas";

type JWTData = z.infer<typeof middlewareSchema>;
```

Fields:

- `id` &mdash; User ID as string.  
- `email` &mdash; User email.

### refreshTokenSchema

Validates a refresh token (plain string):

```ts
import { refreshTokenSchema } from "backend/src/schemas/auth.schemas";

type RefreshToken = z.infer<typeof refreshTokenSchema>; // string
```

---

## Profile Schemas

Defined in `backend/src/schemas/profile.schemas.ts`.

### profileSchema

Validates user profile updates.

```ts
import { profileSchema } from "backend/src/schemas/profile.schemas";

type ProfileInput = z.infer<typeof profileSchema>;
```

Fields:

- `email` &mdash; Valid email.  
- `name` &mdash; Non-empty string.

Example:

```json
PUT /api/profile
Content-Type: application/json

{
  "email": "new@example.com",
  "name": "Jane Doe"
}
```

### passwordSchema

Validates password change requests.

```ts
import { passwordSchema } from "backend/src/schemas/profile.schemas";

type PasswordChangeInput = z.infer<typeof passwordSchema>;
```

Fields:

- `oldPassword` &mdash; Current password; same rules as registration password.  
- `newPassword` &mdash; New password; same complexity rules.

Example:

```json
PUT /api/profile/password
Content-Type: application/json

{
  "oldPassword": "Old!Pass123",
  "newPassword": "N3w!Pass456"
}
```

---

## Wallet Schemas

Defined in `backend/src/schemas/wallet.schemas.ts`.

### walletSchema

Validates wallet creation or update.

```ts
import { walletSchema } from "backend/src/schemas/wallet.schemas";

type WalletInput = z.infer<typeof walletSchema>;
```

Fields:

- `address` &mdash; Blockchain wallet address string.  
- `title` &mdash; Human-readable name for the wallet.

Example:

```json
POST /api/wallets
Content-Type: application/json

{
  "address": "0xAbCdEf0123456789",
  "title": "My Main Wallet"
}
```

---

## Filters Schema

Defined in `backend/src/schemas/filters.schemas.ts`.

### filtersSchema

Validates query filters for transactions or reports.

```ts
import { filtersSchema } from "backend/src/schemas/filters.schemas";

type Filters = z.infer<typeof filtersSchema>;
```

Fields:

- `walletId` &mdash; Numeric wallet ID.  
- `wallet.user.id` &mdash; Numeric user ID (nested).  
- `date` (optional) — Object with:  
  - `gte` &mdash; Date instance to filter entries on or after this date.

Example usage in a service layer:

```ts
const filters = filtersSchema.parse({
  walletId: 42,
  wallet: { user: { id: 7 } },
  date: { gte: new Date("2024-01-01") },
});
```

---

For more information on Zod schemas, visit the official docs: https://github.com/colinhacks/zod.