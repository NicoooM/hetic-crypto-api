# Testing

This document covers how to run and write unit tests for the React client application, leveraging Jest and React Testing Library (with jest-dom matchers configured in `src/setupTests.ts`).

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Running Tests](#running-tests)  
- [Test Setup (`setupTests.ts`)](#test-setup-setupteststs)  
- [Writing Tests](#writing-tests)  
  - [Basic Example](#basic-example)  
- [Common jest-dom Matchers](#common-jest-dom-matchers)  
- [Debugging Tests](#debugging-tests)  
- [Further Reading](#further-reading)  

---

## Prerequisites

- Node.js (>=14.x)  
- npm or Yarn  
- A working checkout of the repository  

Ensure dependencies are installed:

```bash
cd client
npm install
# or
yarn install
```

---

## Running Tests

From the project root:

```bash
# Using npm
cd client
npm test

# Using Yarn
cd client
yarn test
```

This starts Jest in watch mode.  
- Press `a` to run all tests.  
- Press `p` and enter a pattern to run matching tests.  
- Press `q` to quit.

To run tests once (CI mode):

```bash
npm test -- --watchAll=false
# or
yarn test --watchAll=false
```

---

## Test Setup (`setupTests.ts`)

The file `client/src/setupTests.ts` is automatically loaded before your tests. It imports `@testing-library/jest-dom`, giving you access to custom DOM matchers such as:

```ts
import '@testing-library/jest-dom';
```

No additional configuration is needed—simply import and use the matchers in your test files.

---

## Writing Tests

Place your test files next to components (e.g. `MyComponent.test.tsx`) or under `__tests__` folders. Tests can use React Testing Library for rendering and querying.

### Basic Example

```tsx
// File: client/src/components/Hello.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from './Hello';

describe('Hello component', () => {
  it('renders greeting with provided name', () => {
    render(<Hello name="Crypto User" />);
    const greeting = screen.getByText(/hello, crypto user!/i);
    expect(greeting).toBeInTheDocument();
  });
});
```

Key steps:

1. **Render** the component: `render(<MyComponent />)`.  
2. **Query** the DOM: use `screen.getBy…`, `screen.findBy…`, or `screen.queryBy…`.  
3. **Assert** with Jest and jest-dom matchers: `toBeInTheDocument()`, `toHaveTextContent()`, etc.

---

## Common jest-dom Matchers

- `toBeInTheDocument()`  
- `toHaveTextContent(/regex|string/)`  
- `toHaveAttribute('attr', 'value')`  
- `toHaveClass('className')`  
- `toBeVisible()`  

See the full list in the jest-dom repo:  
https://github.com/testing-library/jest-dom#custom-matchers

---

## Debugging Tests

- Add `screen.debug()` after `render()` to print the DOM tree.  
- Use `await screen.findBy…` for async behavior.  
- Check Jest’s verbose output with `npm test -- --verbose`.  

---

## Further Reading

- React Testing Library: https://testing-library.com/docs/react-testing-library/intro  
- jest-dom matchers: https://github.com/testing-library/jest-dom  
- Jest documentation: https://jestjs.io/docs/getting-started  

Happy testing!