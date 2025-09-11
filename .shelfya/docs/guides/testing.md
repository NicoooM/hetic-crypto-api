# Testing Guide

This guide walks through configuring and running tests for both the backend (Express + TypeScript) and the client (React + TypeScript).

## Table of Contents

- [Backend Testing](#backend-testing)  
  - [1. Setup](#1-setup)  
  - [2. Configure Jest](#2-configure-jest)  
  - [3. Write Integration Tests](#3-write-integration-tests)  
  - [4. Run Tests](#4-run-tests)  
- [Client Testing](#client-testing)  
  - [1. Built-in Setup](#1-built-in-setup)  
  - [2. Write Component Tests](#2-write-component-tests)  
  - [3. Run Tests](#3-run-tests)  

---

## Backend Testing

### 1. Setup

1. Create a `.env.test` file in `backend/` with test-specific env vars, e.g.:

   ```bash
   PORT=5001
   DATABASE_URL=postgres://user:pass@localhost:5432/crypto_test
   JWT_ACCESS_SECRET=your_test_secret
   JWT_REFRESH_SECRET=your_test_secret
   JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000
   JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000
   # …other REQUIRED_ENV_VARS
   ```

2. Install dev dependencies:

   ```bash
   cd backend
   npm install --save-dev jest ts-jest supertest @types/jest @types/supertest cross-env
   ```

### 2. Configure Jest

1. Generate a Jest config:

   ```bash
   npx ts-jest config:init
   ```

2. In `backend/jest.config.js`, ensure:

   ```js
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
     moduleNameMapper: {
       '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
       '^(utils|services|schemas|middleware|lib)/(.*)$': '<rootDir>/src/$1/$2',
     },
     globals: {
       'ts-jest': { tsconfig: 'tsconfig.json' },
     },
   };
   ```

3. Export the Express app for testing. In `src/index.ts`:

   ```ts
   // At bottom of file:
   export { app };
   ```

### 3. Write Integration Tests

Place your tests under `backend/src/__tests__`. Example: `auth.test.ts`

```ts
import request from 'supertest';
import { app } from '../index';
import { prisma } from 'lib/prisma';

beforeAll(async () => {
  // Optionally reset test database
  await prisma.user.deleteMany();
});
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth Endpoints', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com', password: 'P@ssword1', name: 'Test' });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Registration successful/);
  });

  it('should login and set refresh cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'P@ssword1' });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toContain('refreshToken');
    expect(res.body).toHaveProperty('accessToken');
  });
});
```

### 4. Run Tests

Add to `backend/package.json`:

```json
"scripts": {
  "test": "cross-env NODE_ENV=test jest --runInBand"
}
```

Then:

```bash
cd backend
npm test
```

---

## Client Testing

The client is scaffolded with Create React App and Jest + React Testing Library are preconfigured.

### 1. Built-in Setup

- `client/src/setupTests.ts` imports `@testing-library/jest-dom`.

### 2. Write Component Tests

Put tests next to components or under `client/src/__tests__`. Example: `LoginForm.test.tsx`

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../components/LoginForm';

test('renders login form and submits credentials', () => {
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'P@ssword1' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(handleSubmit).toHaveBeenCalledWith({ email: 'a@b.com', password: 'P@ssword1' });
});
```

### 3. Run Tests

```bash
cd client
npm test
```

Use the interactive watcher to run specific tests, update snapshots, or run all on CI:

```bash
npm test -- --watchAll=false --passWithNoTests
```

---

By following this guide you’ll have isolated integration tests for your Express API and component/unit tests for your React frontend. Happy testing!