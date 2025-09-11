# Profile API

Endpoints for retrieving and updating the authenticated user’s profile and password. All routes under `/api/v1/profile` require a valid JWT access token in the `Authorization` header.

Base URL:  
```
https://your-api.com/api/v1/profile
```  

## Authentication

Include the Bearer token in every request:

```
Authorization: Bearer <accessToken>
```

---

## GET /profile

Fetch the current user’s profile.

**Request**  
GET `/api/v1/profile`

Headers  
- `Authorization: Bearer <token>`

**Response**  
200 OK  
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com"
}
```

**Errors**  
- 401 Unauthorized – missing or invalid token  
- 500 Internal Server Error

---

## PATCH /profile

Update name and/or email. If you change the email, a new verification email will be sent.

**Schema**  
```ts
interface ProfilePayload {
  name: string;         // non-empty
  email: string;        // valid email address
}
```

**Request**  
PATCH `/api/v1/profile`

Headers  
- `Authorization: Bearer <token>`  
- `Content-Type: application/json`

Body  
```json
{
  "name": "Alice Smith",
  "email": "alice.smith@example.com"
}
```

**Response**  
200 OK  
```json
{
  "id": 1,
  "email": "alice.smith@example.com",
  "name": "Alice Smith",
  "isEmailVerified": false
}
```

**Errors**  
- 400 Bad Request – validation error or email already taken  
- 500 Internal Server Error

---

## PATCH /profile/password

Change the user’s password.

**Schema**  
```ts
interface PasswordPayload {
  oldPassword: string;   // min 8 chars, uppercase, lowercase, number & special char
  newPassword: string;   // same requirements, must differ from oldPassword
}
```

**Request**  
PATCH `/api/v1/profile/password`

Headers  
- `Authorization: Bearer <token>`  
- `Content-Type: application/json`

Body  
```json
{
  "oldPassword": "OldP@ssw0rd1",
  "newPassword": "NewP@ssw0rd2"
}
```

**Response**  
200 OK  
```json
{
  "message": "Password changed"
}
```

**Errors**  
- 400 Bad Request – missing fields, validation errors, or new password equals old  
- 500 Internal Server Error

---

## Examples

### cURL

```bash
# Get profile
curl -H "Authorization: Bearer $TOKEN" \
     https://your-api.com/api/v1/profile

# Update profile
curl -X PATCH -H "Authorization: Bearer $TOKEN" \
             -H "Content-Type: application/json" \
     -d '{"name":"Alice Smith","email":"alice.smith@example.com"}' \
     https://your-api.com/api/v1/profile

# Change password
curl -X PATCH -H "Authorization: Bearer $TOKEN" \
             -H "Content-Type: application/json" \
     -d '{"oldPassword":"OldP@ssw0rd1","newPassword":"NewP@ssw0rd2"}' \
     https://your-api.com/api/v1/profile/password
```

### JavaScript (axios)

```js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://your-api.com/api/v1',
  headers: { Authorization: `Bearer ${token}` }
});

// Get
API.get('/profile').then(res => console.log(res.data));

// Edit
API.patch('/profile', {
  name: 'Alice Smith',
  email: 'alice.smith@example.com'
}).then(res => console.log(res.data));

// Password
API.patch('/profile/password', {
  oldPassword: 'OldP@ssw0rd1',
  newPassword: 'NewP@ssw0rd2'
}).then(res => console.log(res.data));
```