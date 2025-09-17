# Frontend Routing

## Overview
The frontend routing module manages navigation between different pages of the web application. It connects URL paths to corresponding user interface components, controls access based on authentication, and provides the navigation structure needed for a seamless user experience.

## Key Features
- **Declarative Route Mapping**: Automatically matches URL paths to React components, defining what users see at each address.
- **Authentication-Based Protection**: Uses `ProtectedRoute` to restrict access to certain pages (`/dashboard`, `/profile`) to authenticated users only.
- **Nested Routes Support**: Encapsulates route definitions, enabling easy insertion of common layout elements like `Navbar`.
- **Email Verification Flow**: Allows users to verify their email address via a tokenized route (`/verify-email/:token`).
- **Centralized Navigation Layout**: Ensures the `Navbar` is present across all pages, enabling consistent navigation.

## System Errors
- **Unauthenticated Access (ProtectedRoute)**: If a user accesses protected routes (`/dashboard`, `/profile`) without authentication, they are redirected to the login page.  
  _Resolution_: Log in to access protected pages.
- **Invalid Verification Token**: Navigating to `/verify-email/:token` with an invalid or expired token may result in a verification failure message.  
  _Resolution_: Request a new verification email and follow the link.
- **Route Not Found**: Accessing a non-existent route renders no page and may show a blank or error state.  
  _Resolution_: Double-check the URL for typos or use the navigation bar to find the correct page.

## Usage Examples

```jsx
// Navigating programmatically
import { useNavigate } from 'react-router-dom';

function GoToDashboardButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
  );
}

// Accessing a protected route
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />

// Defining a custom public route
<Route path="/login" element={<Login />} />
```

## System Integration

```
┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│ React Router │───▶│ Frontend     │───▶│ Page        │
│ (dependency) │    │ Routing      │    │ Components  │
└──────────────┘    └──────────────┘    └─────────────┘
        │                 │                  │
        ▼                 ▼                  ▼
 [Provides route]   [Maps URL/path]   [Home, Login,
   definitions &      to page UI      Register, etc.]
      APIs             renders
```
- **Dependencies**: Uses React Router, AuthProvider, Navbar, and page components.
- **Process**: Users navigate; the router maps URLs and enforces authentication with ProtectedRoute.
- **Consumers**: Page components (Dashboard, Profile, Fiscalite, Graph, etc.) are rendered based on routes; navigation via Navbar.