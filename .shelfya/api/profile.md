# Profile API

Manage the authenticated user’s profile, including viewing, updating details, and changing their password.

BASE URL: `/api/profile`  
Authentication: Requires `Authorization: Bearer <token>`

---

## Get Profile

Retrieve the current user’s profile.

### Request

```
GET /api/profile
Authorization: Bearer <token>
```

### Response

- 200 OK  
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

- 500 Internal Server Error  
  ```json
  {
    "message": "Detailed error message"
  }
  ```

### Example

```bash
curl -H "Authorization: Bearer $TOKEN" \
     https://your-domain.com/api/profile
```

---

## Edit Profile

Update the current user’s name and email.

### Request

```
PATCH /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

Fields:

- `name` (string, required)
- `email` (string, required, valid email format)

Validation is performed by a Zod schema:
```ts
z.object({
  name: z.string(),
  email: z.string().email()
});
```

### Response

- 200 OK  
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com"
  }
  ```

- 400 Bad Request  
  ```json
  { "error": "Email is required" }
  ```
  or
  ```json
  { "error": "Account edition failed" }
  ```

- 500 Internal Server Error  
  ```json
  { "message": "Detailed error message" }
  ```

### Example

```bash
curl -X PATCH \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Jane Doe","email":"jane.doe@example.com"}' \
     https://your-domain.com/api/profile
```

---

## Reset Password

Change the current user’s password.

### Request

```
PATCH /api/profile/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "OldP@ssw0rd!",
  "newPassword": "NewP@ssw0rd!"
}
```

Both `oldPassword` and `newPassword` are required and must be at least 8 characters long, including:
- one uppercase letter
- one lowercase letter
- one number
- one special character

Validation is performed by a Zod schema:
```ts
z.object({
  oldPassword: z.string().min(8).regex(passwordRegex),
  newPassword: z.string().min(8).regex(passwordRegex)
});
```

### Response

- 200 OK  
  ```json
  { "message": "Password changed" }
  ```

- 400 Bad Request  
  ```json
  { "error": "Old password and new password are required" }
  ```
  or
  ```json
  { "error": "New password must be different" }
  ```

- 500 Internal Server Error  
  ```json
  { "message": "Detailed error message" }
  ```

### Example

```bash
curl -X PATCH \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"oldPassword":"OldP@ssw0rd!","newPassword":"NewP@ssw0rd!"}' \
     https://your-domain.com/api/profile/password
```

---

For all endpoints, ensure a valid JWT token is provided in the `Authorization` header. All responses use standard HTTP status codes.