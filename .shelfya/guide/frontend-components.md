# Frontend Components

## Overview
This module provides key reusable frontend components for user navigation, access control, and transaction management in the Hetic Crypto API client. By standardizing navigation, ensuring route protection, and managing transaction input, these components enable a secure and consistent user experience across the application.

## Key Features

- **Navbar**
  - Provides dynamic site navigation based on authentication state.
  - Supports navigation to Dashboard, Profile, Login, and Register.
  - Enables user log out via integrated authentication context.

- **ProtectedRoute**
  - Guards application routes and restricts access to authenticated users only.
  - Redirects unauthenticated users to the Login page.
  - Easily wraps around components/pages that require authentication.

- **TransactionForm**
  - Presents a form for users to submit crypto transactions (deposit or withdrawal).
  - Accepts input for amount, unit price, fees, and transaction date.
  - Passes validated transaction data upwards for further processing (e.g., insertion into list, or API dispatch).

## System Errors

- **Unauthorized Access**
  - When a user without authentication attempts to access a protected route, they are redirected to the login page.
  - **Resolution**: The user must log in to access the requested page.

- **Transaction Input Error**
  - If required fields (amount, price, fees, date) are left empty or invalid in the TransactionForm, form submission is prevented.
  - **Resolution**: User must fill in all required fields with valid data.

- **Logout Failure (Potential)**
  - If user logout depends on an external API call (not currently active), backend/API failures could lead to partial logout or session inconsistencies.
  - **Resolution**: Ensure API responds correctly (if hooked), clear local authentication data, and verify user is redirected or logged out as intended.

## Usage Examples

```tsx
// Import the components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { TransactionForm, Transaction } from './components/TransactionForm';

// Use the Navbar at the top level of your app layout
function AppLayout() {
  return (
    <>
      <Navbar />
      {/* rest of your app */}
    </>
  );
}

// Wrap protected pages/routes
import { Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      {/* other routes */}
    </Routes>
  );
}

// Use TransactionForm and handle new transaction submissions
function TransactionsManager() {
  const handleAddTransaction = (transaction: Transaction) => {
    // Add transaction to state or trigger API call
    console.log(transaction);
  };

  return <TransactionForm onAddTransaction={handleAddTransaction} />;
}
```

## System Integration

```
┌──────────────┐         ┌───────────────┐         ┌─────────────────────┐
│  Auth System │ ───────▶│ Frontend      │◀────┐   │  Routing System     │
│  (context,   │         │ Components    │     │   │  (react-router)    │
│  user state) │         │ (Navbar,      │     │   │  ProtectedRoute    │
└──────────────┘         │ ProtectedRoute│     │   └─────────────────────┘
                         │ TransactionF. │─────┴──▶│ Application Pages   │
    [Supplies            └───────────────┘         │ (Dashboard, Profile,│
     user data, token]         │                   │  Transactions, etc.)│
                              ▼                   └─────────────────────┘
                        [Navigation,
                        transaction form
                        submission,
                        authentication
                        control]
```

**Details:**
- **Dependencies:** Relies on React context for auth state, uses react-router for navigation and route protection.
- **Process:** Components consume user authentication state to determine UI, handle user navigation, and manage transaction data.
- **Consumers:** Used by main application pages and the app's routing logic to deliver a gated, user-aware experience.