# Getting Started

This guide will help you set up and run the HETIC Crypto API locally, including both the backend server and the React client. By the end, you’ll be able to make authenticated requests with automatic token refresh.

## Prerequisites

- Node.js v14+  
- npm or Yarn  
- Git

## Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

## 1. Backend Setup

1. Navigate to the backend folder and install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/` and set at least:

   ```
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

   - `PORT` is where the API will listen (default: 5000).  
   - `CLIENT_URL` is the allowed origin for CORS (default: `http://localhost:3000`).

3. Start the server:

   ```bash
   npm run dev    # or `npm start` for production
   ```

   You should see:
   ```
   Listening on port 5000...
   ```

4. Base URL  
   All endpoints are mounted under `/api/v1`, e.g.:
   ```
   http://localhost:5000/api/v1/<resource>
   ```

## 2. Client Setup

1. In a new terminal, navigate to the client folder and install:

   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file in `client/`:

   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
   ```

   - `REACT_APP_API_BASE_URL` points to your backend API.

3. Start the React development server:

   ```bash
   npm start
   ```

   The app runs by default on `http://localhost:3000` and communicates with the API.

## 3. Authentication Flow

The client’s API service uses Axios interceptors to:

- Attach the access token from `localStorage` to every request.
- Automatically refresh the access token on `401/403` responses.
- Store the new token and retry failed requests.
- Redirect to `/login` after a failed refresh.

### Example: Login and Fetch Profile

```typescript
import API from './services/api';

async function login(email: string, password: string) {
  // Send credentials; server sets a refresh token cookie
  const { data } = await API.post('/auth/login', { email, password });
  localStorage.setItem('token', data.accessToken);
}

async function getProfile() {
  // Automatically includes Authorization header
  const { data } = await API.get('/users/me');
  return data;
}

// Usage
await login('user@example.com', 'password123');
const profile = await getProfile();
console.log(profile);
```

## 4. Troubleshooting

- Check console output in both backend and client for errors.
- Ensure cookies are enabled in your browser (refresh token uses HTTP-only cookies).
- Verify that your `.env` variables match the defaults if you’ve changed ports or hosts.

---

You’re now ready to explore and build on the HETIC Crypto API. Happy coding!