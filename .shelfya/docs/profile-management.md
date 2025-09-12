# Profile Management

This guide covers retrieving and updating user profiles and resetting passwords.  
All endpoints require authentication (a valid JWT attached to `req.user`).

---

## Schemas & Validation

### Profile Schema

```ts
import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});
```

- `email` must be a valid email.
- `name` must be a non-empty string.

### Password Schema

```ts
import { z } from "zod";
import { passwordRegex } from "utils/regex";

export const passwordSchema = z.object({
  oldPassword: z.string().min(8).regex(passwordRegex, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
  newPassword: z.string().min(8).regex(passwordRegex, {
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),
});
```

- Both `oldPassword` and `newPassword` must be ≥8 characters and match the regex.

---

## Endpoints

### GET /profile

Fetch the authenticated user’s profile.

Request:
```
GET /profile
Authorization: Bearer <token>
```

Response (200):
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

Errors:
- 500 Internal Server Error

---

### PUT /profile

Update the user’s name and/or email.

Request:
```
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Rochester",
  "email": "jane.rochester@example.com"
}
```

Response (200):
```json
{
  "id": 42,
  "name": "Jane Rochester",
  "email": "jane.rochester@example.com",
  "isEmailVerified": false,
  "createdAt": "2024-05-01T12:34:56.789Z",
  "updatedAt": "2024-06-10T10:00:00.123Z"
}
```

Notes:
- If the new email differs, a verification email is sent automatically.
- If the email is unchanged, `isEmailVerified` remains `true`.

Errors:
- 400 Bad Request  
  • Missing `email` field  
  • Invalid email format  
  • Duplicate email (`{ "error": "Account edition failed" }`)
- 500 Internal Server Error

---

### POST /profile/reset-password

Change the user’s password.

Request:
```
POST /profile/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "OldPassw0rd!",
  "newPassword": "N3wSecur3#Pass"
}
```

Response (200):
```json
{
  "message": "Password changed"
}
```

Validation steps:
1. Both `oldPassword` and `newPassword` are required.
2. `newPassword` must differ from `oldPassword`.
3. Both passwords must match the password schema.

Errors:
- 400 Bad Request  
  • Missing passwords  
  • New password equals old password  
- 500 Internal Server Error

---

## Service Behavior

- **ProfileService.get(id):** Returns `{ name, email }` from the database.
- **ProfileService.edit({ id, name, email }):**  
  • Updates `name`/`email`.  
  • Resends verification if email changed.  
- **ProfileService.resetPassword({ id, oldPassword, newPassword }):**  
  • Verifies old password.  
  • Hashes and updates new password.

For more details, see:

- [profile.controller.ts](../../backend/src/controllers/profile.controller.ts)  
- [profile.service.ts](../../backend/src/services/profile.service.ts)  
- [profile.schemas.ts](../../backend/src/schemas/profile.schemas.ts)