# Profile API Module

## Overview
The Profile API module manages user profile information within the system. It provides authenticated users with endpoints to view, update their personal data (name, email), and securely change their password. It ensures all profile modifications are validated, sensitive updates (like email changes) trigger verification workflows, and password policies are enforced.

## Key Features

- **Retrieve Profile**: Allows an authenticated user to fetch their current profile information (name and email).
- **Update Profile**: Enables users to modify their name and email, with validation and email verification when needed.
- **Change Password**: Users can update their password by providing their existing and new password; enforces password change policies and notifies users of errors.
- **Email Verification Workflow**: If the email address is changed, the module initiates a verification email to the updated address.
- **Input Validation**: Ensures data provided for updates fits expected formats through schema validation.

## System Errors

- **Missing Email**: When updating the profile, if the `email` field is missing, the API returns a `400 Bad Request` error with `Email is required`.  
  _Resolution_: Always provide a valid email when updating profile information.

- **Duplicate Email / Edition Failed**: Attempting to update to an email address already in use triggers a `400 Bad Request` error with `Account edition failed`.  
  _Resolution_: Use an email address not already registered in the system.

- **Missing Password Fields**: When changing password, if either the old or new password is missing, the API returns a `400 Bad Request` error with `Old password and new password are required`.  
  _Resolution_: Provide both the old and new password fields.

- **Passwords Match**: If the new password is the same as the old password, the API returns a `400 Bad Request` error with `New password must be different`.  
  _Resolution_: Provide a new password that is different from the current one.

- **Old Password Incorrect**: If the provided old password does not match the stored one, the API returns a `500 Internal Server Error` with a relevant message.  
  _Resolution_: Re-try with the correct current password.

- **Unhandled/Internal Server Errors**: Any unexpected failure will result in a `500 Internal Server Error` with the error's message.  
  _Resolution_: Check request formatting and, if persistent, contact API support.

## Usage Examples

```javascript
// Fetch user profile (GET /api/profile)
fetch('/api/profile', {
  method: 'GET',
  headers: { Authorization: 'Bearer <token>' }
}).then(res => res.json());

// Update profile (PATCH /api/profile)
fetch('/api/profile', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer <token>'
  },
  body: JSON.stringify({ name: "Alice", email: "alice@example.com" })
}).then(res => res.json());

// Change password (PATCH /api/profile/password)
fetch('/api/profile/password', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer <token>'
  },
  body: JSON.stringify({ oldPassword: "old1234", newPassword: "new5678" })
}).then(res => res.json());
```

## System Integration

```
┌──────────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Auth Middleware │─────▶│ Profile API  │─────▶│  User Database  │
│ (req.user set)   │      │ (This Module)│      │ (Prisma - Users)│
└──────────────────┘      └──────────────┘      └───────┬─────────┘
              │                │                             ▲
              ▼                │                             │
      [user context]      [GET/EDIT/RESET]           [user records]
                                 │
                           ┌─────────────┐
                           │Email Service│
                           └─────────────┘
                                 ▲
                      [trigger verification email]
```

- **Dependencies**:  
  - Auth Middleware (sets `req.user` for current user context)
  - User Database (via Prisma ORM)
  - Email Service (for address verification on email change)
- **Process**:  
  - Handles GET (read), PATCH (edit), and PATCH/password (change password) for `/api/profile`.
  - Validates input data, updates records, triggers verification as needed.
- **Consumers**:  
  - Frontend or external clients needing user profile functionality.  
  - Cross-module processes that require trusted user identity management.