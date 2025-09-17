# Email Verification

## Overview
The Email Verification module manages the process of verifying user email addresses during registration. Its main role is to ensure that users provide a valid email address and complete verification before gaining full access to system features. The module sends verification emails containing unique tokens and validates those tokens when users attempt to verify their accounts.

## Key Features
- **Send Verification Email**: Automatically dispatches an email containing a verification link to the user upon registration. This ensures only users with accessible email accounts can activate their profiles.
- **Verify Email via Token**: Accepts a token from a verification link and verifies the user's email address, enabling account activation and further access.
- **Seamless Registration Workflow Integration**: Tightly coupled with the authentication process, prompting email verification after successful registration.

## System Errors
- **Email Sending Failure**: If the SMTP server cannot deliver the verification email (e.g., misconfiguration, network issues), an error message is generated.  
  *Resolution*: Ensure SMTP configuration (`SMTP_HOST`, `SMTP_PORT`) is correct and server is reachable.
- **Invalid or Expired Token**: If a user attempts to verify their email with an invalid or expired token, the verification will fail with a relevant error.  
  *Resolution*: Request a new verification email and use the newly provided token.
- **Malformed Registration Data**: If the registration payload is missing required fields or is invalid, the registration and subsequent verification will fail.  
  *Resolution*: Validate the input data (name, email, password) before submission.

## Usage Examples
Practical code examples showing how to use the module:

```typescript
// Registration triggers email verification
await fetch("/api/auth/register", {
  method: "POST",
  body: JSON.stringify({ name: "Alice", email: "alice@example.com", password: "123456" }),
  headers: { "Content-Type": "application/json" }
});

// After registration, user receives a verification link via email.
// Clicking the link calls the email verification endpoint with the token:
await fetch("/api/auth/verify-email/TOKEN_HERE", { method: "GET" });

// On success:
{
  message: "Email verified successfully"
}

// On failure (invalid/expired token):
{
  message: "Verification failed: Invalid or expired token"
}
```

## System Integration
Complete ASCII diagram showing how this module integrates with the system:

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ AuthService │───▶│ EmailService │───▶│  User Email │
│ Registration│    │  (Verification)  │     Inbox    │
└─────────────┘    └──────────────┘    └─────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
 [User registers]   [Sends token]     [Email received]
        │
        ▼
[User clicks link] ──────▶ AuthController.verifyEmail
        │
        ▼
[Email verified, account activated]
```

- **Dependencies**: AuthService (registration logic)
- **This Module**: EmailService (verification email sending & token management)
- **Used By**: End-user via their email inbox and verification endpoint through AuthController