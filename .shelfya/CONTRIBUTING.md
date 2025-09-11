# Contributing to HETIC Crypto API

Thank you for your interest in improving the HETIC Crypto API! This guide walks you through the workflow, setup, and best practices for contributing.

## Table of Contents

- [Getting Started](#getting-started)  
- [Local Development Setup](#local-development-setup)  
- [Environment Variables](#environment-variables)  
- [Running the App](#running-the-app)  
- [Code Style & Formatting](#code-style--formatting)  
- [Testing](#testing)  
- [Branching & Commit Messages](#branching--commit-messages)  
- [Pull Request Process](#pull-request-process)  
- [Reporting Issues](#reporting-issues)  

## Getting Started

1. Fork the repository on GitHub  
2. Clone your fork locally  
   ```bash
   git clone https://github.com/<your-username>/hetic-crypto-api.git
   cd hetic-crypto-api
   ```

## Local Development Setup

Install dependencies for both services:

```bash
# Backend
cd backend
npm install

# Client
cd ../client
npm install
```

## Environment Variables

Create a `.env` file in `backend/` with the following keys:

```
JWT_ACCESS_SECRET=…
JWT_REFRESH_SECRET=…
JWT_ACCESS_TOKEN_EXPIRATION_TIME=…
JWT_REFRESH_TOKEN_EXPIRATION_TIME=…
SMTP_HOST=…
SMTP_PORT=…
SMTP_USER=…
SMTP_PASS=…
API_URL=http://localhost:5000
CRYPTOCOMPARE_API_KEY=…
ETHERSCAN_API_KEY=…
CLIENT_URL=http://localhost:3000
DATABASE_URL=…
POSTGRES_USER=…
POSTGRES_PASSWORD=…
POSTGRES_DB=…
PORT=5000
```

Adjust values to match your local setup. The client uses `REACT_APP_API_BASE_URL` in `client/.env`.

## Running the App

Start the backend server:

```bash
cd backend
npm run dev
```

Start the React client:

```bash
cd client
npm start
```

The API will be available at `http://localhost:5000/api/v1` and the client at `http://localhost:3000`.

## Code Style & Formatting

- Language: TypeScript  
- Validation: Zod schemas under `backend/src/schemas`  
- Controllers: `backend/src/controllers`  
- Services: `backend/src/services`  
- Keep imports and file naming consistent with existing modules.

Run linters and formatters before committing:

```bash
# In each folder
npm run lint
npm run format
```

## Testing

### Client

Uses Jest and React Testing Library:

```bash
cd client
npm test
```

### Backend

Add tests under `backend/src/__tests__` as needed. No built-in test runner—feel free to integrate Jest or similar.

## Branching & Commit Messages

- Create feature branches off `main`:  
  `git checkout -b feat/your-feature-name`
- Use Conventional Commits:  
  ```
  feat(auth): add email verification endpoint
  fix(wallet): handle invalid wallet IDs
  docs(contributing): update environment variable list
  ```

## Pull Request Process

1. Push your feature branch to your fork  
2. Open a PR against the `main` branch  
3. Include:
   - A clear title and description  
   - Issue reference (e.g., “Closes #123”)  
   - Screenshots or logs if relevant  
4. Ensure all checks pass (lint, tests)  
5. Address review comments promptly

## Reporting Issues

- For bugs, include:
  - Steps to reproduce  
  - Expected vs. actual behavior  
  - Error messages or logs  
- For feature requests, describe:
  - Use case and motivation  
  - Proposed API or UI changes  

Thank you for helping improve HETIC Crypto API! We look forward to your contributions.