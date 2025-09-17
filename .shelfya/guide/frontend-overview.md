# Frontend Overview

## Overview
The frontend module is a React application that provides the user interface for the Hetic Crypto API system. Its primary purpose is to enable users to register, authenticate, and interact with application features such as dashboards, profiles, and data visualization. It integrates with the backend API for authentication, data fetching, and other workflow needs, acting as the main touchpoint for user interaction.

## Key Features

- **Authentication Flow**: Supports user login, registration, email verification, session management, and logout. Authentication status is securely managed using tokens stored in the browser.
- **Conditional Navigation**: Provides navigation elements and protected routes, showing or hiding dashboard/profile actions based on authentication state.
- **Protected Routes**: Sensitive pages (dashboard, profile) are only accessible to authenticated users via the `ProtectedRoute` component.
- **Data Presentation**: Users can access pages (Dashboard, Graph, Fiscalite) that present data visualizations and actionable information relevant to cryptocurrency activities.
- **Session Persistence**: Maintains user sessions across browser reloads using localStorage for authentication tokens.
- **Role-Based UI Elements**: The navigation bar dynamically changes to reflect login status, ensuring an appropriate experience for both guests and logged-in users.

## System Errors

- **Invalid Login Credentials**: If a user submits incorrect login information, the frontend will surface an authentication error (usually returned by the backend).  
  _Resolution_: Ensure credentials are correct and backend services are reachable.
- **Token Expiry or Invalid Session**: If the authentication token becomes invalid or expires, protected routes trigger a redirect to the login screen.  
  _Resolution_: Re-authenticate with valid credentials; ensure backend session management is functioning.
- **API Connection Errors**: Issues communicating with backend APIs (network failure, 500 errors) result in failed operations and error notifications in the UI.  
  _Resolution_: Check network connectivity and backend service availability.
- **useAuth Context Misuse**: Attempting to use the `useAuth` hook outside the `AuthProvider` will throw an error.  
  _Resolution_: Ensure all components using `useAuth` are nested within the AuthProvider (handled by the main App).

## Usage Examples

```jsx
// Example: Main application root with authentication context
import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import AppRoutes from "./AppRoutes"; // Hypothetical split for clarity

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  );
}

// Example: Using navigation links based on authentication
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return user ? (
    <>
      <Link to="/dashboard">Dashboard</Link>
      <button onClick={logout}>Logout</button>
    </>
  ) : (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  );
}

// Example: Consuming the login action
import { useAuth } from "../hooks/useAuth";
const { login } = useAuth();
login("email@example.com", "plaintextpassword");
```

## System Integration

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│   Browser/User  │──────▶│   Frontend (React)   │──────▶│    Backend API  │
│    (UI Layer)   │       │ (App, useAuth, etc.) │       │(Authentication, │
└─────────────────┘       └──────────────────────┘       │ Data Services)  │
          │                       │                      └─────────────────┘
          ▼                       ▼                             │
   User interacts with    Handles routing, auth,                ▼
   UI and navigation      protected pages, renders      API provides JWT,
                          data visualizations          user/session states

[Details]             [Process]                   [Consumers]
- Navigates UI        - Renders routes            - Data-driven UI
- Submits forms       - Calls backend APIs        - React components
- Views dashboards    - Updates auth state        - Route guards/redirects
```