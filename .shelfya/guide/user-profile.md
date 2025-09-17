# User Profile Module

## Overview
The User Profile Module enables authenticated users to view and manage their account information, including updating profile details and resetting their password. It acts as the central interface for profile-related operations and ensures secure handling of sensitive user data. The module is essential for maintaining personal account settings and for supporting security features such as password changes and email verification.

## Key Features

- **Retrieve Profile Information**: Authenticated users can fetch their current profile information, including name and email. This supports account overview and user-facing profile screens.
  
- **Update Profile Details**: Users can update their profile name and email. The module checks for email changes to determine if email re-verification is needed, ensuring account security.
  
- **Reset Password**: Users are able to securely change their passwords by providing their current password and a new one, enforcing password validation rules.

## System Errors

- **Missing Required Fields**:  
  Description: If profile update or password reset requests lack required fields (e.g., email, name, oldPassword, newPassword), the module rejects the request.  
  Resolution: Ensure all required fields are supplied when making PATCH requests.
  
- **Email Already in Use**:  
  Description: When attempting to update to an email that already exists for another user, the system prevents the operation (`Account edition failed`).  
  Resolution: Use a unique email address that is not already registered.
  
- **Password Validation Errors**:  
  Description: When the provided old password is incorrect, or if the new and old passwords are identical, the request is rejected with an error.  
  Resolution: Double-check the old password and provide a new password that differs from the current one.

- **Internal Server Error**:  
  Description: General error fallback for unexpected conditions (e.g., database issues).  
  Resolution: Check the server logs for more details; ensure backend services are running and correctly configured.

## Usage Examples

```javascript
// 1. Retrieve profile information (GET /api/v1/profile)
fetch('/api/v1/profile', {
  method: 'GET',
  headers: { Authorization: `Bearer ${yourToken}` }
})
  .then(res => res.json())
  .then(profile => console.log(profile));

// 2. Update profile details (PATCH /api/v1/profile)
fetch('/api/v1/profile', {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    Authorization: `Bearer ${yourToken}`
  },
  body: JSON.stringify({ name: "Alice", email: "alice@example.com" })
})
  .then(res => res.json())
  .then(updatedUser => console.log(updatedUser));

// 3. Reset password (PATCH /api/v1/profile/password)
fetch('/api/v1/profile/password', {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    Authorization: `Bearer ${yourToken}`
  },
  body: JSON.stringify({ oldPassword: "oldPass123", newPassword: "newPass456" })
})
  .then(res => res.json())
  .then(response => console.log(response));
```

## System Integration

```
┌───────────────┐                     ┌───────────────┐                        ┌───────────────┐
│ Authentication│───(user id context)─▶│  User Profile │◀────(DB queries)──────▶│     Prisma    │
│   & Sessions  │                     │    Module     │                        │   (Database)  │
└───────────────┘       ▲             └───────────────┘                        └───────────────┘
        │               │                     │
        │    (API)      ▼                (API/Events)
        │─────────────▶ [GET, PATCH, PATCH/password]
        │                                   │
        │                         ┌─────────▼─────────┐
        │                         │   Email Service   │
        │                 (for email updates/verification)
┌───────────────┐                └────────────────────┘
│   Client App  │
│  (Dashboard,  │
│   Profile UI) │
└───────────────┘
        ▲
        │   (api calls, data binding)
        │
```

- **Dependencies**: Requires authenticated user context (from Authentication & Sessions), Prisma for database access, and Email Service for verification.
- **Process**: Handles API requests for profile actions.
- **Consumers**: Used by client interfaces (dashboard/profile pages). Interacts with Email Service when email is changed.

This module is critical for managing user identity and ensuring secure, user-driven profile operations within the Crypto API system.