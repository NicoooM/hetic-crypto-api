# FAQ

This document answers common questions about the authentication flow in the HETIC Crypto API Starter.

## 1. What authentication endpoints are available?

- **POST** `/auth/login`  
- **POST** `/auth/register`  
- **GET** `/auth/verify/:token`  
- **POST** `/auth/refresh`  
- **POST** `/auth/logout`  

All endpoints are handled by `AuthController` in `backend/src/controllers/auth.controller.ts`.

---

## 2. How do I register a new user?

Send a `POST` request to `/auth/register` with JSON body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "SuperSecret123"
}
```

On success, you’ll receive:

- HTTP 201 Created  
- `{ "message": "Registration successful. Please verify your email." }`

If input validation fails, you’ll get HTTP 400 with a Zod error message.

---

## 3. How is email verification handled?

After registration, the service sends a verification token by email. To verify:

```bash
curl GET http://localhost:3000/auth/verify/<token>
```

On success:

- HTTP 200 OK  
- `{ "message": "Email verified successfully" }`

Errors return HTTP 500 with an error message.

---

## 4. How do I log in and receive tokens?

Send a `POST` to `/auth/login`:

```json
{
  "email": "alice@example.com",
  "password": "SuperSecret123"
}
```

On success:

- HTTP 200 OK  
- A secure, HTTP-only `refreshToken` cookie  
- Response body: `{ "accessToken": "eyJhbGciOi..." }`

Response headers include:
- `Cache-Control: no-store`
- `Pragma: no-cache`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`

---

## 5. How do I refresh an expired access token?

Send a `POST` to `/auth/refresh` (no body needed). The browser will include the `refreshToken` cookie automatically.

On success:

- HTTP 200 OK  
- New `{ "accessToken": "eyJhbGciOi..." }`  

If the cookie is missing or invalid, you’ll get HTTP 401 or 400.

---

## 6. How do I log out?

Send a `POST` to `/auth/logout`. The server will:

- Invalidate the stored refresh token  
- Clear the `refreshToken` cookie  

Response:

- HTTP 200 OK  
- `{ "message": "Logged out successfully" }`

---

## 7. What error codes can I expect?

- 400 Bad Request: Input validation failed (Zod error)  
- 401 Unauthorized: Invalid credentials or missing/invalid refresh token  
- 500 Internal Server Error: Unexpected server error  

---

## 8. Where can I find input schemas?

Validation is performed with Zod in `backend/src/schemas/auth.schemas.ts`:

- `loginSchema` (email, password)  
- `registerSchema` (name, email, password)  
- `refreshTokenSchema` (cookie value)  

Errors are returned as JSON:
```json
{ "message": "Detailed Zod validation message" }
```

---

## 9. What environment variables are required?

- `NODE_ENV` (to set cookie `secure` flag)  
- `JWT_REFRESH_SECRET` (for hashing refresh tokens)  

Consult the root README for full setup instructions.