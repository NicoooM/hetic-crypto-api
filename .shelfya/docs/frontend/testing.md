# Frontend Testing

This document covers how to set up and run frontend tests using Jest and React Testing Library in the `client` application.

## 1. Setup

The project uses Create React App’s testing configuration with Jest, augmented by React Testing Library and `jest-dom` matchers.

- Dependencies are defined in `package.json`:
  ```jsonc
  {
    "devDependencies": {
      "@testing-library/react": "^13.0.0",
      "@testing-library/jest-dom": "^5.16.0",
      "jest": "^27.0.0",
      "ts-jest": "^27.0.0"
    }
  }
  ```
- The file `src/setupTests.ts` automatically imports `jest-dom` matchers:
  ```ts
  // client/src/setupTests.ts
  import '@testing-library/jest-dom';
  ```

## 2. Running Tests

From the `client` directory, use:

Yarn:
```bash
yarn test
```

NPM:
```bash
npm test
```

This runs Jest in watch mode. You can pass flags:

- `--coverage` to generate a coverage report.
- `--watchAll` to re-run all tests on file changes.

Example:
```bash
npm test -- --coverage
```

## 3. Writing Tests

1. Create a `*.test.tsx` or `*.test.ts` file alongside the component.
2. Use React Testing Library’s `render`, `screen`, and Jest matchers from `jest-dom`.

Example: testing a simple `Button` component.

```tsx
// client/src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}
```

```tsx
// client/src/components/Button.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button component', () => {
  it('renders with provided label and handles clicks', async () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    // Verify text content
    expect(screen.getByRole('button')).toHaveTextContent('Click me');

    // Simulate user click
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 4. Coverage Reports

To generate a coverage report, run:

```bash
npm test -- --coverage --coverageDirectory=coverage/frontend
```

The HTML report will be available in `client/coverage/frontend/index.html`.

## 5. Tips & Resources

- Use `screen.getBy*` queries for more readable tests.
- Combine user-event for realistic interactions: `npm install --save-dev @testing-library/user-event`.
- Refer to the official docs:
  - Jest: https://jestjs.io
  - React Testing Library: https://testing-library.com/docs/react-testing-library/intro
  - jest-dom: https://github.com/testing-library/jest-dom

With this setup, you can confidently write and run unit and integration tests for your React components.