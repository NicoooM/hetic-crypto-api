# HETIC Crypto API

Welcome to the HETIC Crypto API: a RESTful backend built with Express and TypeScript. This service powers authentication, wallet management, portfolio insights, transaction history, and user profiles for your crypto application.

## 🚀 Quick Start

1. Clone the repo  
   ```bash
   git clone https://github.com/NicoooM/hetic-crypto-api.git
   cd hetic-crypto-api/backend
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create a `.env` file in `backend/` with at least:  
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   # plus any JWT or database variables your app needs
   ```

4. Run in development mode  
   ```bash
   npm run dev
   ```
   The server starts on the port you specified.

## ⚙️ Middleware & Security

- **cookie-parser** for parsing cookies  
- **cors** with `origin` set to your front-end URL (default: `http://localhost:3000`)  
- **helmet** for secure HTTP headers  
- **express.json()** for JSON payloads  
- **request-ip** to capture client IP  
- A custom `verifyEnv()` call on startup ensures all required env variables are set.

All routes are mounted under `/api/v1`.

## 📚 API Routes

### Authentication (`/api/v1/auth`)
- `POST /signup` – Register a new user  
- `POST /login` – Login and receive an access token  
- `POST /refresh` – Refresh your access token  
- `POST /logout` – Invalidate the current token  

### Wallet Management (`/api/v1/wallet`)
> Requires Bearer access token  
- `GET /` – List all wallets  
- `POST /` – Create a new wallet  
- `PUT /:id` – Update wallet details  
- `DELETE /:id` – Remove a wallet  

### Transaction History (`/api/v1/history`)
> Requires Bearer access token  
- `GET /` – Fetch transaction history  
- `POST /` – Add a transaction  
- `DELETE /:id` – Delete a transaction  

### Portfolio Insights (`/api/v1/portfolio`)
- `GET /` – View aggregated portfolio data  
- `POST /refresh` – Refresh portfolio valuations  

### User Profile (`/api/v1/profile`)
> Requires Bearer access token  
- `GET /` – Retrieve your profile  
- `PUT /` – Update profile information  

## 🔑 Authentication

All protected routes expect an `Authorization` header:
```
Authorization: Bearer <access_token>
```

## 💡 Example: Fetch Wallets

```bash
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:5000/api/v1/wallet
```

## 📖 Further Reading

- Express.js docs: https://expressjs.com/  
- Cors configuration: https://github.com/expressjs/cors  
- Helmet security: https://github.com/helmetjs/helmet  

Feel free to explore the route handlers in `backend/src/routes/` for more details on parameter names and request payloads. Enjoy building with HETIC Crypto API!