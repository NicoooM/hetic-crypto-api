# Shelfya: Quick Start & Usage Guide

Welcome to **Shelfya**, an all-in-one crypto wallet tracker designed for easy management, analysis, and visualization of your cryptocurrency portfolios. This guide provides a quick orientation to the project's structure, setup, and usage.

## Project Overview

Shelfya lets you securely manage crypto wallets, fetch real-time data, and generate useful statistics and reports using integrated APIs like Cryptocompare and Etherscan. The project consists of two main parts:

- **Backend**: Bun-based API server (TypeScript)
- **Client**: React-based frontend

---

## Getting Started

### Backend Setup

1. **Install dependencies:**
   ```bash
   bun i
   ```

2. **Start the development server:**
   ```bash
   bun dev
   ```

3. **Generate the Prisma client:**
   ```bash
   bunx prisma generate
   ```

4. **Create a new database migration:**
   ```bash
   bunx prisma migrate dev
   ```

See more details in [`backend/README.md`](../backend/README.md).

---

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm start
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Other available scripts:**
   - Run tests: `npm test`
   - Build for production: `npm run build`
   - Eject (advanced): `npm run eject`

See more details in [`client/README.md`](../client/README.md).

---

## Key API Routes

All API routes are **prefixed with `/api/v1`**.

### Authentication

- **Register:** `POST /auth/register`
- **Verify Email:** `GET /auth/verify-email/<token>`
- **Login:** `POST /auth/login`
- **Logout:** `POST /auth/logout`
- **Refresh Token:** `POST /auth/refresh-access-token`

### Wallet Management

- **Create Wallet:** `POST /`
- **List Wallets:** `GET /`
- **Delete Wallet:** `DELETE /wallet/<walletId>`
- **Wallet History:** `GET /history/<walletId>`
- **Wallet Portfolio Stats:** `GET /portfolio/<walletId>`

### Profile

- **Get Profile:** `GET /`
- **Update Profile:** `PATCH /`
- **Reset Password:** `PATCH /password`

---

## Main Client Pages

- `/` - Home Menu
- `/login` - User Login
- `/register` - Registration
- `/verify-email/<token>` - Email Verification
- `/dashboard` - Portfolio Dashboard
- `/profile` - Account/Profile
- `/fiscalite` - Taxation area (PDF generation, not connected to API)
- `/graph` - Transaction Graphs (not connected to API)

---

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Bun Documentation](https://bun.sh)
- See the root [`README.md`](../README.md) for project context and API details.

---

## Troubleshooting

- Ensure you have [Bun](https://bun.sh) installed for backend operations.
- For client-side errors, consult the browser console and React error overlays.
- Backend and frontend run independently; check their respective README files for further help.

---

Start organizing your crypto assets with Shelfya today!