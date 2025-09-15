# Profile API

All **/profile** endpoints require a valid authentication token (e.g. a JWT) in the `Authorization: Bearer <token>` header.

## GET /api/profile

Retrieve the authenticated user’s profile.

Request  
```
GET /api/profile
Authorization: Bearer eyJhbGciOi...
```

Response 200  
```json
{
  "id": 12,
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "createdAt": "2023-05-10T14:23:00.000Z",
  "updatedAt": "2023-06-01T09:45:00.000Z"
}
```

Errors  
- 500 Internal Server Error  
  ```json
  { "message": "Unexpected error message" }
  ```

## PATCH /api/profile

Edit name and email for the authenticated user.

Request  
```
PATCH /api/profile
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

Response 200  
```json
{
  "id": 12,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "createdAt": "2023-05-10T14:23:00.000Z",
  "updatedAt": "2023-06-15T11:20:00.000Z"
}
```

Errors  
- 400 Bad Request (missing email)  
  ```json
  { "error": "Email is required" }
  ```
- 400 Bad Request (duplicate email)  
  ```json
  { "error": "Account edition failed" }
  ```
- 500 Internal Server Error  
  ```json
  { "message": "Unexpected error message" }
  ```

## PATCH /api/profile/password

Change the authenticated user’s password. Both `oldPassword` and `newPassword` are required, and they must differ.

Request  
```
PATCH /api/profile/password
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{
  "oldPassword": "currentSecret123",
  "newPassword": "newSecret456"
}
```

Response 200  
```json
{ "message": "Password changed" }
```

Errors  
- 400 Bad Request (missing fields)  
  ```json
  { "error": "Old password and new password are required" }
  ```
- 400 Bad Request (identical passwords)  
  ```json
  { "error": "New password must be different" }
  ```
- 500 Internal Server Error  
  ```json
  { "message": "Unexpected error message" }
  ```