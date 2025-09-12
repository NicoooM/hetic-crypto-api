# Controllers Guide

This guide overviews the REST controllers in the Crypto API backend. Each controller handles incoming HTTP requests, validates input, invokes a service layer, and returns appropriate HTTP responses.

---

## AuthController

Handles user authentication, registration, email verification, token refresh, and logout.

### Endpoints

- **POST** `/auth/login`  
- **POST** `/auth/register`  
- **GET** `/auth/verify/:token`  
- **POST** `/auth/refresh-token`  
- **POST** `/auth/logout`  

### Usage

#### Login

Request  
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response  
- **200 OK** with JSON `{ accessToken: string }`  
- Sets `refreshToken` cookie (HttpOnly, Secure, SameSite=Strict)  
- Headers for no-cache and clickjacking protection

Errors  
- **400 Bad Request** on schema validation  
- **401 Unauthorized** on invalid credentials

#### Register

Request  
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongPassword"
}
```

Response  
- **201 Created**  
  `{ message: "Registration successful. Please verify your email." }`

Errors  
- **400 Bad Request** on schema validation  
- **500 Internal Server Error** on unexpected failures

#### Verify Email

Request  
```http
GET /auth/verify/eyJhbGciOiJIUzI1Ni...
```

Response  
- **200 OK**  
  `{ message: "Email verified successfully" }`

Errors  
- **500 Internal Server Error** on invalid or expired token

#### Refresh Access Token

Request  
```http
POST /auth/refresh-token
Cookie: refreshToken=<your_refresh_token>
```

Response  
- **200 OK** with JSON `{ accessToken: string }`

Errors  
- **400 Bad Request** on missing/invalid cookie  
- **401 Unauthorized** on expired or invalid refresh token

#### Logout

Request  
```http
POST /auth/logout
Cookie: refreshToken=<your_refresh_token>
```

Response  
- **200 OK**  
  `{ message: "Logged out successfully" }`  
- Clears `refreshToken` cookie

---

## WalletController

Manages user wallets (addresses) for tracking portfolios.

### Endpoints

- **GET** `/wallets`  
- **POST** `/wallets`  
- **DELETE** `/wallets/:id`  

### Usage

#### List Wallets

Request  
```http
GET /wallets
Authorization: Bearer <access_token>
```

Response  
- **200 OK** with JSON array of wallets  

#### Create Wallet

Request  
```http
POST /wallets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "address": "0xABC123...",
  "title": "My Main Wallet"
}
```

Response  
- **201 Created**  
  Returns the created wallet object

Errors  
- **400 Bad Request** if required fields are missing  
- **500 Internal Server Error** otherwise

#### Delete Wallet

Request  
```http
DELETE /wallets/42
Authorization: Bearer <access_token>
```

Response  
- **204 No Content**

Errors  
- **400 Bad Request** on invalid wallet ID  
- **404 Not Found** if wallet does not exist  
- **500 Internal Server Error** otherwise

---

## HistoryController

Fetches transaction or price history for a given wallet.

### Endpoint

- **GET** `/wallets/:id/history[?startDate=YYYY-MM-DD]`  

### Usage

Request  
```http
GET /wallets/42/history?startDate=2024-01-01
Authorization: Bearer <access_token>
```

Response  
- **200 OK** with JSON array of history entries

Errors  
- **400 Bad Request** on invalid wallet ID  
- **404 Not Found** if no history is found  
- **500 Internal Server Error** otherwise

---

## PortfolioController

Calculates portfolio allocation and value for a specific wallet.

### Endpoint

- **GET** `/wallets/:id/portfolio`  

### Usage

Request  
```http
GET /wallets/42/portfolio
Authorization: Bearer <access_token>
```

Response  
- **200 OK**  
  ```json
  {
    "allocation": { /* percentage per asset */ },
    "price":   { /* current prices */ },
    "dailyPrice": { /* historical price series */ },
    "value":   { /* current portfolio value */ },
    "dailyValue": { /* daily value changes */ }
  }
  ```

Errors  
- **500 Internal Server Error** on calculation failure

---

## ProfileController

Allows users to view and edit their profile, and reset their password.

### Endpoints

- **GET** `/profile`  
- **PUT** `/profile`  
- **POST** `/profile/reset-password`  

### Usage

#### Get Profile

Request  
```http
GET /profile
Authorization: Bearer <access_token>
```

Response  
- **200 OK** with user profile JSON

#### Edit Profile

Request  
```http
PUT /profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

Response  
- **200 OK** with updated user object

Errors  
- **400 Bad Request** on missing email  
- **400 Bad Request** if email already in use  
- **500 Internal Server Error** otherwise

#### Reset Password

Request  
```http
POST /profile/reset-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "oldPassword": "currentPass",
  "newPassword": "newSecurePass"
}
```

Response  
- **200 OK**  
  `{ message: "Password changed" }`

Errors  
- **400 Bad Request** if fields missing or passwords match  
- **500 Internal Server Error** otherwise

---

For full request/response schemas and service-layer details, see the corresponding service and schema modules in `backend/src/services` and `backend/src/schemas`.