# Profile API

Manage the authenticated user’s profile, including retrieving profile data, updating account details, and changing the password.

All endpoints require a valid Authorization header with a Bearer token:

```
Authorization: Bearer <access_token>
```

Base path: `/profile`

---

## Get Profile

Retrieve the current user’s profile information.

**Request**

```
GET /profile
```

Headers  
• `Authorization: Bearer <token>`

**Response**

- **200 OK**

```json
{
  "id": 42,
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "createdAt": "2023-04-15T12:34:56.000Z",
  "updatedAt": "2024-06-12T09:21:37.000Z"
}
```

- **500 Internal Server Error**

```json
{
  "message": "Unexpected error"
}
```

---

## Update Profile

Edit the user’s `name` and `email`.

**Request**

```
PATCH /profile
Content-Type: application/json
Authorization: Bearer <token>
```

Body

```json
{
  "name": "Jane Newname",
  "email": "jane.new@example.com"
}
```

**Response**

- **200 OK**

```json
{
  "id": 42,
  "name": "Jane Newname",
  "email": "jane.new@example.com",
  "createdAt": "2023-04-15T12:34:56.000Z",
  "updatedAt": "2024-06-13T10:00:00.000Z"
}
```

- **400 Bad Request**

• Missing email  
```json
{ "error": "Email is required" }
```

• Email already in use  
```json
{ "error": "Account edition failed" }
```

- **500 Internal Server Error**

```json
{ "message": "Database connection error" }
```

---

## Change Password

Reset the user’s password by providing the old and new passwords.

**Request**

```
PATCH /profile/password
Content-Type: application/json
Authorization: Bearer <token>
```

Body

```json
{
  "oldPassword": "currentPass123",
  "newPassword": "newSecurePass456"
}
```

**Response**

- **200 OK**

```json
{ "message": "Password changed" }
```

- **400 Bad Request**

• Missing fields  
```json
{ "error": "Old password and new password are required" }
```

• New password equals old password  
```json
{ "error": "New password must be different" }
```

- **500 Internal Server Error**

```json
{ "message": "Unexpected error" }
```

---

## Examples

cURL — Get profile

```bash
curl -H "Authorization: Bearer $TOKEN" \
     https://api.example.com/profile
```

cURL — Update profile

```bash
curl -X PATCH \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Jane Q. Public","email":"jane.public@example.com"}' \
     https://api.example.com/profile
```

cURL — Change password

```bash
curl -X PATCH \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"oldPassword":"oldPass","newPassword":"newPass"}' \
     https://api.example.com/profile/password
```

---

For any issues or questions, please refer to the Error Codes section or contact support.