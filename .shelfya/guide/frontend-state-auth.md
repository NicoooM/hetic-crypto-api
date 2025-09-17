# Frontend State Authentication

## Overview
This module provides centralized user authentication state management for the frontend application. It coordinates user login/logout, maintains authentication tokens, handles API authorization, and ensures that authentication state is consistent across the app. The main goal is to provide seamless, secure access to authenticated endpoints and respond appropriately to authentication failures.

## Key Features

- **Authentication Context Provider**: Supplies app-wide authentication state (logged in/out) to React components via a context API.  
  *Purpose*: Enables components to know if the user is authenticated and to trigger login/logout actions.

- **Login/Logout Management**: Provides methods to log users in or out.  
  *Purpose*: Handles credential submission to the backend, token storage in localStorage, and proper state clean-up on logout.

- **Token Storage and Handling**: Uses browser localStorage to persist JWT access tokens across page reloads.  
  *Purpose*: Maintains the user's session even if they refresh their browser, until they explicitly log out or the token expires.

- **API Request Authorization**: Automatically attaches the authentication token to outbound API requests.  
  *Purpose*: Ensures backend endpoints are accessed only by authorized users.

- **Automatic Token Refresh**: Transparently refreshes expired access tokens using cookies (refresh tokens) when encountering 401/403 errors from the API.  
  *Purpose*: Provides a smooth user experience by minimizing interruptions due to expired tokens.

- **Error-Triggered Logout**: If token refresh fails, the module removes invalid tokens and forces a redirect to the login page after a short delay.  
  *Purpose*: Ensures the user is always in a valid, authenticated state and prevents unauthorized API access after session expiration.

## System Errors

- **Missing AuthContext**:  
  *Description*: Calling `useAuth` outside of an `AuthProvider` throws an error.  
  *Resolution*: Make sure you wrap your app or component tree with `<AuthProvider>...</AuthProvider>`.

- **Invalid Credentials**:  
  *Description*: Login with wrong credentials will result in backend API failure.  
  *Resolution*: User will not be logged in; frontend should display appropriate error messaging.

- **Token Expired/Refresh Failure**:  
  *Description*: If the access token is expired and the refresh attempt fails, all tokens are cleared and the user is redirected to the login page after 25 seconds.  
  *Resolution*: User must log in again. This typically signals a server/session issue.

- **API Authorization Failure (401/403)**:  
  *Description*: Triggered if an endpoint is accessed with an invalid or missing JWT token.  
  *Resolution*: Triggers automatic token refresh or logout/redirection if refresh fails.

## Usage Examples

```tsx
// App entry point - wrap your React tree with AuthProvider:
import { AuthProvider } from 'hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <YourAppComponents />
    </AuthProvider>
  );
}

// In a component - access authentication state and actions:
import { useAuth } from 'hooks/useAuth';

function Profile() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return (
      <button onClick={() => login('user@email.com', 'password')}>
        Log In
      </button>
    );
  }

  return (
    <div>
      Welcome! <button onClick={logout}>Log Out</button>
    </div>
  );
}
```

## System Integration

```
┌──────────────────┐    ┌───────────────────────┐    ┌─────────────────────────┐
│ API Backend      │<───│    API Service        │───▶│ React Auth Context      │
│ (auth endpoints) │    │ (axios, token mgmt)   │    │ (AuthProvider/useAuth)  │
└──────────────────┘    └───────────────────────┘    └─────────────────────────┘
         ▲                      ▲                            ▲
         │                      │                            │
         │     [Sends/refresh   │      [Provides token,      │
         │      JWT tokens,     │       handles login/logout]│
         │      validates       │                            │
         │      credentials]    │                            │
         │                      │                            │
         ▼                      ▼                            ▼
[Auth endpoints:        [Handles request         [React components access
 login, logout,         interception, token      user state/auth actions
 refresh, protected     refresh, error           via useAuth]
 resources]             handling]
```
