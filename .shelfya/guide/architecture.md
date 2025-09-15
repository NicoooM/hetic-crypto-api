# Architecture Guide

This document provides an overview of the architecture for the **Hetic Crypto API** project, covering both the backend and frontend stacks, their technology choices, and how key components interact.

---

## Overview

Hetic Crypto API is a full-stack application for cryptocurrency management and analytics. It consists of:

- **Backend**: RESTful API built with Express.js, PostgreSQL via Prisma ORM, and security middlewares.
- **Frontend**: Single-page application (SPA) built in React with TypeScript.
- **Services**: Docker-based infrastructure supporting PostgreSQL and a local email server (Mailhog).

---

## Backend Architecture

### Technology Stack

- **Node.js with Express**: Handles HTTP requests, applies middleware (security, CORS, cookies, request IP).
- **Prisma ORM**: Database schema management and queries using PostgreSQL.
- **Other Middleware**: Helmet (security), cors (cross-origin requests), cookie-parser, request-ip.
- **Authentication**: Cookie and JWT-based, with role-based users (ADMIN, USER).

#### Key File: `backend/src/index.ts`

```typescript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";
...
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(requestIp.mw());
app.use("/api/v1", router);

app.listen(port, ...);
```

### Database Schema

Defined using Prisma, the schema supports users, wallets, currencies, and historical data.

#### Main Models

- **User**: Holds authentication data, email verification, roles, and associated wallets.
- **Wallet**: Each wallet belongs to a user and stores address, title, and historical transactions.
- **Currency**: Supported tokens (e.g., BTC, ETH), their symbol, and price history.
- **WalletHistory**: Transaction records linking wallets, currencies, date, quantity, and values.
- **CurrencyHistory**: Historical price data for currencies.
- **RefreshToken**: Manages session refresh tokens for users.

#### Example Model

```prisma
model User {
  id              Int      @id @default(autoincrement())
  role            Role     @default(USER)
  name            String?  @db.VarChar(255)
  email           String   @unique
  password        String   @db.VarChar(255)
  wallets         Wallet[]
  isEmailVerified Boolean  @default(false)
  refreshToken    RefreshToken[]
}
```

### Infrastructure

Docker Compose provisions:

- **Postgres**: Persistent PostgreSQL database.
- **Mailhog**: Local SMTP server for email verification and notifications.

#### Example: `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:latest
    ...
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  mailhog:
    image: mailhog/mailhog:latest
    ...
    ports:
      - "1025:1025"
      - "8025:8025"
```

---

## Frontend Architecture

### Technology Stack

- **React**: Component-based view layer, React Router for navigation.
- **TypeScript**: Type safety and tooling.
- **AuthProvider**: Handles authentication state across pages.
- **ProtectedRoute**: Restricts access to authenticated areas.
- **UI/Visualization**: Integration with chart libraries (d3, recharts), file previews (pdf-lib).

#### Key File: `client/src/App.tsx`

```tsx
<AuthProvider>
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      ...
    </Routes>
  </Router>
</AuthProvider>
```

---

## Integration Between Backend and Frontend

- **API Communication**: The frontend talks to backend REST API endpoints under `/api/v1`.
- **Authentication**: Uses cookies and JWTs for secure sessions.
- **CORS**: Backend is configured to accept requests from the frontend domain (`CLIENT_URL`).

---

## Development Setup

1. **Clone the repository**
2. **Start the backend**: Use Docker Compose for services, then run the server (`bun --hot src/index.ts`).
3. **Start the frontend**: `npm start` in the client directory.

---

## Further Reading

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

This architecture is modular and extensible, providing secure and scalable foundations for developing cryptocurrency management tools.