# Routing Guide

This guide explains the routing structure of the Hetic Crypto API project, covering both backend API endpoints and frontend application routes. Use this guide to understand how users and clients interact with the system programmatically and via the web UI.

---

## Backend API Routing

All backend routes are prefixed and organized under several main categories. Authentication using access tokens is required for protected routes.

### Routes Overview

| API Path            | Auth Required | Purpose                        |
|---------------------|--------------|--------------------------------|
| `/auth`             | No           | User authentication & account  |
| `/wallet`           | Yes          | Manage wallets                 |
| `/history`          | Yes          | User-related history           |
| `/portfolio`        | No           | Portfolio data                 |
| `/profile`          | Yes          | View & edit profile            |


### 1. **Authentication (`/auth`)**

- `POST /auth/login`  
  Login user (rate limited).
- `POST /auth/register`  
  Register user (rate limited).
- `POST /auth/refresh-access-token`  
  Refresh the access token.
- `GET /auth/verify-email/:token`  
  Verify user’s email using the provided token.
- `POST /auth/logout`  
  Logout user.

**Example (login):**
```bash
curl -X POST https://<api-url>/auth/login -d '{"email":"...","password":"..."}'
```

---

### 2. **Wallet Management (`/wallet`)** _(Protected)_

- `GET /wallet/`  
  Get all wallets for the authenticated user.
- `POST /wallet/`  
  Create a new wallet.
- `DELETE /wallet/:id`  
  Delete an existing wallet.

**Authentication:**  
Requires an access token. Add it as a Bearer token in the `Authorization` header.

---

### 3. **History (`/history`)** _(Protected)_

- `GET /history/:id`  
  Get transaction or action history for a given resource ID.

---

### 4. **Portfolio (`/portfolio`)**

- `GET /portfolio/:id`  
  Fetch portfolio details by ID.

---

### 5. **User Profile (`/profile`)** _(Protected)_

- `GET /profile/`  
  Retrieve user profile.
- `PATCH /profile/`  
  Edit user profile.
- `PATCH /profile/password`  
  Change user password.

---

## Frontend Routing

The client uses React Router for navigation, with certain routes protected using the `ProtectedRoute` component, requiring user authentication.

### Main Routes

| Path              | Protected | Component         | Description                        |
|-------------------|-----------|-------------------|------------------------------------|
| `/`               | No        | Home              | Landing page                       |
| `/login`          | No        | Login             | User login                         |
| `/register`       | No        | Register          | User registration                  |
| `/verify-email/:token` | No    | VerifyEmail       | Email verification                 |
| `/dashboard`      | Yes       | Dashboard         | Main user dashboard                |
| `/profile`        | Yes       | Profile           | User profile page                  |
| `/fiscalite`      | No        | Fiscalite         | Taxation page                      |
| `/graph`          | No        | Graph             | Graph visualization                |

**Example:**
```jsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

**Note:**  
Some pages like `/fiscalite` and `/graph` may require protection in the future.

---

## Summary

- **Backend:** RESTful endpoints grouped by functionality, with JWT access token protection on user-specific resources.
- **Frontend:** Clear mapping of paths to React components, with `ProtectedRoute` ensuring secure access control on sensitive pages.

For API usage, always refer to the latest code for input/output details and required authentication. For UI navigation, the `Navbar` provides links to main pages after authentication. 

---

_If you have questions not answered here, check out the [FAQ] or [Getting Started] guides._