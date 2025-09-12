# Testing

This guide explains how to write and run tests in the client using Jest and React Testing Library.

## 1. Prerequisites

- Node.js ≥ v14
- Dependencies installed in the `client` folder:
  ```bash
  cd client
  npm install
  ```

## 2. Test Environment Setup

Jest and jest-dom are configured via `client/src/setupTests.ts`:

```ts
// client/src/setupTests.ts
// Adds custom jest matchers for asserting on DOM nodes:
//   expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';
```

These matchers make it easier to test UI elements.

## 3. Running Tests

From the `client` directory:

- Run in watch mode (default):
  ```bash
  npm test
  ```
- Run once with coverage report:
  ```bash
  npm test -- --coverage --watchAll=false
  ```

## 4. Writing Tests

Place your tests next to components using the `.test.tsx` or `.spec.tsx` suffix. Jest auto-detects these files.

Example for a simple counter component:

```tsx
// client/src/components/Counter.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments count when button is clicked', () => {
  render(<Counter initialCount={0} />);
  const button = screen.getByRole('button', { name: /increment/i });

  // Initial state
  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  // After click
  fireEvent.click(button);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Common Query APIs

- `getBy…` – throws if no match  
- `queryBy…` – returns `null` if no match  
- `findBy…` – returns a promise (for async elements)

## 5. Useful jest-dom Matchers

- `toBeInTheDocument()`  
- `toHaveTextContent(/regex/)`  
- `toHaveAttribute('href', '/home')`  
- `toBeVisible()`  

See [jest-dom](https://github.com/testing-library/jest-dom) for the full list.

## 6. Tips & Best Practices

- Use `userEvent` from `@testing-library/user-event` for more realistic interactions.  
- Mock network requests with [MSW](https://mswjs.io) or Jest mocks.  
- Keep tests focused on behavior rather than implementation details.

## 7. References

- Jest: https://jestjs.io  
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro  
- jest-dom: https://github.com/testing-library/jest-dom