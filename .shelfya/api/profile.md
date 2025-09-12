# Profile API Reference

These endpoints allow an authenticated user to view and manage their own profile. All requests require a valid bearer token.

Base URL: `https://api.example.com`

## Authentication

Include your JWT token in the `Authorization` header for every request:

```
Authorization: Bearer <your_token_here>
```

---

## Endpoints

### GET /profile

Fetch the current user’s profile.

- Method: `GET`
- URL: `/profile`
- Headers:
  - `Authorization: Bearer <token>`
- Response:  
  - `200 OK` – JSON object with user details
  - `500 Internal Server Error` – on unexpected failures

#### Example Request

```
curl -X GET "https://api.example.com/profile" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1..."
```

#### Example Response

```json
{
  "id": 42,
  "name": "Alice Smith",
  "email": "alice@example.com",
  "createdAt": "2023-05-01T12:34:56.789Z"
}
```

---

### PATCH /profile

Update your name and/or email address.

- Method: `PATCH`
- URL: `/profile`
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Body Parameters:
  - `name` (string, optional) – new display name
  - `email` (string, required) – new email address
- Responses:
  - `200 OK` – JSON object with updated user
  - `400 Bad Request` – missing `email` or duplicate email (`Account edition failed`)
  - `500 Internal Server Error`

#### Example Request

```bash
curl -X PATCH "https://api.example.com/profile" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1..." \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Alice Johnson",
       "email": "alice.j@example.com"
     }'
```

#### Example Successful Response

```json
{
  "id": 42,
  "name": "Alice Johnson",
  "email": "alice.j@example.com",
  "updatedAt": "2024-02-15T08:21:30.123Z"
}
```

#### Possible Error Responses

```json
// Missing email
HTTP/1.1 400 Bad Request
{
  "error": "Email is required"
}

// Duplicate email
HTTP/1.1 400 Bad Request
{
  "error": "Account edition failed"
}
```

---

### PATCH /profile/password

Change your account password.

- Method: `PATCH`
- URL: `/profile/password`
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Body Parameters:
  - `oldPassword` (string, required)
  - `newPassword` (string, required; must differ from `oldPassword`)
- Responses:
  - `200 OK` – password successfully changed
  - `400 Bad Request` – missing fields or `newPassword` equals `oldPassword`
  - `500 Internal Server Error`

#### Example Request

```bash
curl -X PATCH "https://api.example.com/profile/password" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1..." \
     -H "Content-Type: application/json" \
     -d '{
       "oldPassword": "currentPass123",
       "newPassword": "newSecurePass456"
     }'
```

#### Example Successful Response

```json
{
  "message": "Password changed"
}
```

#### Possible Error Responses

```json
// Missing fields
HTTP/1.1 400 Bad Request
{
  "error": "Old password and new password are required"
}

// New password same as old
HTTP/1.1 400 Bad Request
{
  "error": "New password must be different"
}
```