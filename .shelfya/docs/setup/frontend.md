# Frontend Setup

This guide walks you through setting up and running the React-based frontend for the HETIC Crypto API project.

## Prerequisites

- Node.js (>=14)
- npm or Yarn
- Access to the running backend API (default: `http://localhost:5000/api/v1`)

## 1. Clone & Install

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api/client
npm install
# or
yarn install
```

## 2. Configure Environment Variables

Create a `.env.local` file in `client/`:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

- **REACT_APP_API_BASE_URL**: Base URL of your backend API (with `/api/v1`).

The client uses this to send requests and include cookies for authentication.

## 3. Running in Development

```bash
npm start
# or
yarn start
```

- The app will launch at `http://localhost:3000`.
- API calls will be proxied to `REACT_APP_API_BASE_URL`.

## 4. Building for Production

```bash
npm run build
# or
yarn build
```

- Generates optimized files in `client/build/`.
- You can serve this folder with any static file server.

## 5. Testing

The project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/):

```bash
npm test
# or
yarn test
```

- Tests are configured in `client/src/setupTests.ts`.
- Run in watch mode or CI mode.

## 6. Authentication Workflow

- **Access Token** stored in `localStorage` under `token`.
- **Refresh Token** sent via `HttpOnly` cookie.
- Requests use an Axios instance with interceptors to:
  - Attach the `Authorization: Bearer <token>` header.
  - Automatically refresh access tokens on `401`/`403` responses.

## 7. Useful Scripts

Inside `client/`, you’ll find:

- `npm start` — start development server  
- `npm run build` — build for production  
- `npm test` — run tests  
- `npm run eject` — if you need to customize CRA configuration  

## 8. Further Resources

- React documentation: https://reactjs.org/docs/getting-started.html  
- Create React App: https://create-react-app.dev/  

With this setup, you’re ready to develop and contribute to the frontend of the HETIC Crypto API!