# Frontend Getting Started

This guide walks you through setting up, running, and using the React client.

## Prerequisites

- Node.js ≥ 14
- npm or yarn
- Backend API running (default: http://localhost:5000)

## Installation

```bash
cd client
npm install
# or
yarn install
```

## Environment Variables

Create a `.env` file in the `client` folder:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

This sets the base URL for all API calls. If omitted, it defaults to `http://localhost:5000/api/v1`.

## Running the App

```bash
npm start
# or
yarn start
```

The app will be available at http://localhost:3000.

## Testing

This project uses Jest + React Testing Library. A default setup file lives at `src/setupTests.ts` to enable [jest-dom](https://github.com/testing-library/jest-dom) matchers.

```bash
npm test
# or
yarn test
```

## API Service (`src/services/api.ts`)

All HTTP calls should use the shared `API` instance:

```ts
import API from './services/api';
```

Key features:

- **Base URL**: `process.env.REACT_APP_API_BASE_URL` or `http://localhost:5000/api/v1`
- **Credentials**: `withCredentials: true` sends cookies (for refresh tokens)
- **Authorization header**: Auto-injects `Bearer <accessToken>` from `localStorage`
- **Token refresh**: 
  - On `401/403`, calls `POST /auth/refresh`
  - Updates access token, retries pending requests
  - On failure, clears token and redirects to `/login`

### TokenService

```ts
TokenService.getToken()     // string | null
TokenService.setToken(token: string)
TokenService.removeToken()
```

### Usage Examples

```ts
// 1. Log in and store access token
const login = async (email: string, password: string) => {
  const { data } = await API.post('/auth/login', { email, password });
  TokenService.setToken(data.accessToken);
  return data.user;
};

// 2. Fetch protected profile
const getProfile = async () => {
  const { data } = await API.get('/users/me');
  return data;
};

// 3. Log out
const logout = async () => {
  await API.post('/auth/logout');
  TokenService.removeToken();
};
```

## Additional Resources

- Axios Docs: https://axios-http.com/
- React Environment Variables: https://create-react-app.dev/docs/adding-custom-environment-variables/