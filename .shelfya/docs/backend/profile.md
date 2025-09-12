# Profile Endpoints

Manage the authenticated user's profile: fetch details, update name/email, and reset password.

## Base Route

All endpoints below are mounted under:

```
/api/profile
```

They require a valid `Authorization: Bearer <token>` header.

---

## GET /api/profile

Fetch the current user's profile.

### Request

```
GET /api/profile
Authorization: Bearer <access_token>
```

### Response

Status: 200 OK  
Body:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

### Errors

- 500 Internal Server Error  
  ```json
  { "message": "Error message" }
  ```

---

## PATCH /api/profile

Edit the user's name and/or email. If the email changes, a verification email is sent.

### Request

```
PATCH /api/profile
Authorization: Bearer <access_token>
Content-Type: application/json
```

Body schema (zod):
```ts
{
  name: string,
  email: string // must be a valid email
}
```

Example:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

### Response

Status: 200 OK  
Body (updated user):
```json
{
  "id": 123,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "isEmailVerified": false,
  // ...other user fields
}
```

### Errors

- 400 Bad Request  
  ```json
  { "error": "Email is required" }
  ```
- 400 Bad Request (unique constraint)  
  ```json
  { "error": "Account edition failed" }
  ```
- 500 Internal Server Error  
  ```json
  { "message": "Error message" }
  ```

---

## PATCH /api/profile/password

Reset the user's password by providing the current and new passwords.

### Request

```
PATCH /api/profile/password
Authorization: Bearer <access_token>
Content-Type: application/json
```

Body schema (zod):
```ts
{
  oldPassword: string, // min 8 chars, uppercase, lowercase, number, special char
  newPassword: string  // same requirements
}
```

Example:
```json
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

### Response

Status: 200 OK  
```json
{ "message": "Password changed" }
```

### Errors

- 400 Bad Request  
  ```json
  { "error": "Old password and new password are required" }
  ```
- 400 Bad Request  
  ```json
  { "error": "New password must be different" }
  ```
- 500 Internal Server Error  
  ```json
  { "message": "Error message" }
  ```

---

## Schemas & Validation

- Profile payload: [`profileSchema`](../../backend/src/schemas/profile.schemas.ts)  
- Password payload: [`passwordSchema`](../../backend/src/schemas/profile.schemas.ts)

These use [Zod](https://github.com/colinhacks/zod) for runtime validation.