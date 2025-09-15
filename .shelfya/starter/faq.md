# FAQ

## Authentication

### How do I log in?
Send a POST request to `/auth/login` with a JSON body:
```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```
On success, you’ll receive:
- `accessToken` in the JSON response
- `refreshToken` as an HTTP-only cookie (expires in `JWT_REFRESH_TOKEN_EXPIRATION_TIME`)

Example using `curl`:
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourPassword"}' \
  -c cookies.txt
```

### How do I register a new account?
POST to `/auth/register`:
```json
{
  "name": "Your Name",
  "email": "newuser@example.com",
  "password": "securePassword"
}
```
On success, you’ll receive:
```json
{ "message": "Registration successful. Please verify your email." }
```

### How is email verification handled?
After registering, the backend sends an email with a verification link:
```
GET /auth/verify-email/:token
```
Visiting that URL confirms your address. On success:
```json
{ "message": "Email verified successfully" }
```

### How do I refresh my access token?
When your `accessToken` expires, call:
```
POST /auth/refresh
```
No body required. The server reads your `refreshToken` cookie, validates it, and returns:
```json
{ "accessToken": "newJwtAccessToken" }
```

### How do I log out?
Call:
```
POST /auth/logout
```
If a valid `refreshToken` cookie is present, it’s invalidated server-side. The cookie is cleared and you receive:
```json
{ "message": "Logged out successfully" }
```

## Profile Management

### How do I fetch my profile?
GET your profile at:
```
GET /profile
```
Requires a valid `accessToken` in the `Authorization` header (`Bearer <token>`). Returns your user object:
```json
{
  "id": 42,
  "name": "Your Name",
  "email": "you@example.com",
  // ...other fields
}
```

### How do I update my profile?
Send a PUT request to `/profile`:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```
Requires `Authorization: Bearer <accessToken>`. On success, returns the updated user.

### How do I change my password?
POST to `/profile/reset-password` with:
```json
{
  "oldPassword": "currentPassword",
  "newPassword": "newSecurePassword"
}
```
Requires `Authorization: Bearer <accessToken>`. On success:
```json
{ "message": "Password changed" }
```

## Errors & Validation

- **400 Bad Request**  
  - Validation failures (via Zod)  
  - Missing required fields  

- **401 Unauthorized**  
  - Invalid login credentials  
  - Missing or invalid `refreshToken`  

- **500 Internal Server Error**  
  - Unexpected server errors  

Error responses follow the shape:
```json
{ "message": "Error description" }
```
or for profile edits:
```json
{ "error": "Account edition failed" }
```

## Security Notes

- `refreshToken` is stored as an HTTP-only, secure, `SameSite=strict` cookie.
- Access tokens should be sent in the `Authorization` header.
- Responses set headers to prevent caching and clickjacking:
  - `Cache-Control: no-store`
  - `Pragma: no-cache`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`