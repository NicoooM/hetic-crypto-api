# Profile API

All profile endpoints are protected. Include an `Authorization: Bearer <token>` header in each request.

Base URL: `/api/profile`

---

## GET /api/profile

Fetch the authenticated user's profile.

**Request**

```
GET /api/profile
Authorization: Bearer <token>
```

**Response**

- Status 200 OK  
  ```json
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    // ...other profile fields
  }
  ```

- Status 500 Internal Server Error  
  ```json
  { "message": "Error details…" }
  ```

**Example (curl)**

```bash
curl -H "Authorization: Bearer $TOKEN" \
     https://your-api.com/api/profile
```

---

## PATCH /api/profile

Update the authenticated user's name and email.

**Request**

```
PATCH /api/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**

```json
{
  "name": "New Name",         // optional
  "email": "new@example.com"  // required
}
```

**Response**

- Status 200 OK  
  ```json
  {
    "id": 1,
    "name": "New Name",
    "email": "new@example.com"
  }
  ```

- Status 400 Bad Request  
  - Missing email  
    ```json
    { "error": "Email is required" }
    ```
  - Email already in use  
    ```json
    { "error": "Account edition failed" }
    ```

- Status 500 Internal Server Error  
  ```json
  { "message": "Error details…" }
  ```

**Example (fetch)**

```js
fetch("/api/profile", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ email: "new@example.com", name: "New Name" })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
```

---

## PATCH /api/profile/password

Change the authenticated user's password.

**Request**

```
PATCH /api/profile/password
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**

```json
{
  "oldPassword": "currentPass",  // required
  "newPassword": "newPass123"     // required, must differ from oldPassword
}
```

**Response**

- Status 200 OK  
  ```json
  { "message": "Password changed" }
  ```

- Status 400 Bad Request  
  - Missing fields  
    ```json
    { "error": "Old password and new password are required" }
    ```
  - New password equals old  
    ```json
    { "error": "New password must be different" }
    ```

- Status 500 Internal Server Error  
  ```json
  { "message": "Error details…" }
  ```

**Example (curl)**

```bash
curl -X PATCH \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{ "oldPassword": "currentPass", "newPassword": "newPass123" }' \
     https://your-api.com/api/profile/password
```

---

For more details on authentication and error handling, see the [Authentication Guide](../getting-started/authentication.md).