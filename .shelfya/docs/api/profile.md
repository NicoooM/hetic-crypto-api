# Profile API

Manage the authenticated user’s profile: retrieve details, update name/email, or change password.

All endpoints are prefixed with `/api/profile` and require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## GET /api/profile

Fetch the current user’s profile.

**Request**

```
GET /api/profile
```

**Response**

- Status: 200 OK  
- Body:
  ```json
  {
    "id": 42,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2023-05-01T12:34:56.789Z",
    "updatedAt": "2023-06-15T09:20:30.123Z"
  }
  ```

**Errors**

- 500 Internal Server Error  
  ```json
  { "message": "Error details…" }
  ```

---

## PATCH /api/profile

Update the user’s name and email.

**Request**

```
PATCH /api/profile
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

- `name` (string): New display name.  
- `email` (string): New email address (required, must be valid).

**Response**

- Status: 200 OK  
- Body:
  ```json
  {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "createdAt": "2023-05-01T12:34:56.789Z",
    "updatedAt": "2023-07-01T08:15:00.000Z"
  }
  ```

**Errors**

- 400 Bad Request  
  - Missing or invalid email:  
    ```json
    { "error": "Email is required" }
    ```
  - Email already in use:  
    ```json
    { "error": "Account edition failed" }
    ```
- 500 Internal Server Error  
  ```json
  { "message": "Error details…" }
  ```

---

## PATCH /api/profile/password

Change the user’s password.

**Request**

```
PATCH /api/profile/password
Content-Type: application/json
```

```json
{
  "oldPassword": "CurrentP@ssw0rd",
  "newPassword": "NewP@ssw0rd1"
}
```

- `oldPassword` (string, ≥8 chars): Current password.  
- `newPassword` (string, ≥8 chars): Must differ from `oldPassword` and match the pattern:
  - At least one uppercase letter  
  - At least one lowercase letter  
  - At least one number  
  - At least one special character  

**Response**

- Status: 200 OK  
- Body:
  ```json
  { "message": "Password changed" }
  ```

**Errors**

- 400 Bad Request  
  - Missing fields:  
    ```json
    { "error": "Old password and new password are required" }
    ```
  - New password same as old:  
    ```json
    { "error": "New password must be different" }
    ```
- 500 Internal Server Error  
  ```json
  { "message": "Error details…" }
  ```

---

## Examples

### cURL: Get Profile

```bash
curl -H "Authorization: Bearer $TOKEN" \
     https://api.example.com/api/profile
```

### cURL: Update Profile

```bash
curl -X PATCH \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Jane Doe","email":"jane.doe@example.com"}' \
     https://api.example.com/api/profile
```

### cURL: Change Password

```bash
curl -X PATCH \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"oldPassword":"CurrentP@ssw0rd","newPassword":"NewP@ssw0rd1"}' \
     https://api.example.com/api/profile/password
```