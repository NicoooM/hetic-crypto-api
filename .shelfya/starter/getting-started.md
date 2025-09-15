# Getting Started

Welcome to the Monolith crypto wallet tracker! This guide will help you quickly set up and run both the backend (API) and client (frontend) of the project. Monolith enables you to manage, analyze, and visualize cryptocurrency portfolios.

## Prerequisites

- [Bun](https://bun.sh) (for backend)
- [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/) (for client)
- [Git](https://git-scm.com/)

## 1. Clone the Repository

```bash
git clone https://github.com/NicoooM/hetic-crypto-api.git
cd hetic-crypto-api
```

## 2. Backend Setup

The backend is powered by Bun and uses Prisma for database management.

### Install Dependencies

```bash
cd backend
bun i
```

### Generate Prisma Client

```bash
bunx prisma generate
```

### Start the Backend Server

```bash
bun dev
```

The API will now be running. Endpoints are prefixed with `/api/v1`. See [API Routes](#api-routes) for examples.

## 3. Client Setup

The client is a React application bootstrapped with Create React App.

### Install Dependencies

```bash
cd ../client
npm install
```

### Start the Development Server

```bash
npm start
```

Your client will be available at [http://localhost:3000](http://localhost:3000).

## 4. API Routes

> All API endpoints are prefixed by `/api/v1`.

**Authentication**
- `POST /auth/register`: Create account
- `GET /auth/verify-email/<token>`: Verify email
- `POST /auth/login`: Login
- `POST /auth/logout`: Logout
- `POST /auth/refresh-access-token`: Refresh token

**Wallet**
- `POST /`: Create new wallet
- `GET /`: List wallets
- `DELETE /wallet/<walletId>`: Delete wallet
- `GET /history/<walletId>`: Wallet history
- `GET /portfolio/<walletId>`: Wallet statistics

**Profile**
- `GET /`: Get user info
- `PATCH /`: Update user info
- `PATCH /password`: Reset password

## 5. Client Routes Overview

- `/` — Home menu
- `/login` — Login
- `/register` — Register
- `/verify-email/<token>` — Email verification
- `/dashboard` — Dashboard
- `/profile` — User profile
- `/fiscalite` — Tax section (PDF generation, not connected to API)
- `/graph` — Transaction graph (not connected to API)

## 6. Useful Scripts

### Backend

- **Development:** `bun dev`
- **Prisma Migration:** `bunx prisma migrate dev`
- **Database Seeding:** `bun src/utils/seed.ts`

### Client

- **Development:** `npm start`
- **Production build:** `npm run build`
- **Testing:** `npm test`
- **Eject (advanced):** `npm run eject`

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Bun documentation](https://bun.sh/docs)

---

You're now ready to start developing and using Monolith! If you run into issues, check each directory's README for deeper instructions.