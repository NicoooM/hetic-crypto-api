# Authentication Module

## Overview

The Authentication Module manages user authentication flows, including registration, login, email verification, access/refresh token issuance, logout, and protected resource access. It secures user identities, ensures verified access, and enables session management for API clients in the crypto platform. This module is foundational for all user-related features and system security.

## Key Features

- **User Registration**: Handles new user creation and triggers verification emails to ensure only valid email addresses are registered.
- **Email Verification**: Confirms user email legitimacy before enabling account access. Users must verify their email by following a link sent to them.
- **User Login**: Authenticates users’ credentials, issues secure JWT access and refresh tokens, and sets refresh tokens in secure, HTTP-only cookies.
- **Access Token Refresh**: Allows clients to obtain new access tokens using a valid refresh token, supporting seamless user sessions without re-login.
- **Logout**: Invalidates the user's refresh token to ensure session termination, and instructs the client to remove relevant authentication cookies.
- **Access Control Middleware**: Verifies and decodes JWT access tokens for protected routes to restrict access to authenticated and authorized users.
- **Rate Limiting**: Protects authentication endpoints (e.g., login, register) from brute force attacks by limiting repeated requests.

## System Errors

- **Invalid Credentials**: User provides incorrect email or password during login.
  - **Resolution**: Ensure credentials are correct and the user’s email is verified.
- **Email Not Verified**: Attempt to log in before completing email verification.
  - **Resolution**: Check email inbox (or spam) for verification instructions.
- **Email Already Registered**: Attempt to register with an email already in use.
  - **Resolution**: Use a different email or initiate password recovery if needed.
- **Invalid or Expired Refresh Token**: Token not found, malformed, or expired during token refresh.
  - **Resolution**: Request the user to log in again to generate new tokens.
- **Token Expired/Invalid**: Access token or email verification token is expired or invalid.
  - **Resolution**: Re-authenticate or request a new verification email.
- **Malformed Requests**: API input failed validation (e.g., missing fields or incorrect formats).
  - **Resolution**: Review and correct the request payload according to API schemas.
- **Internal Server Error**: Unexpected failure such as database issues or email delivery problems.
  - **Resolution**: Inspect logs, check service health, and retry as needed.

## Usage Examples

```typescript
// Register a new user
await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', password: 'SuperSecure1!' })
});
// → Receives: { message: "Registration successful. Please verify your email." }

// Verify email (user clicks email link)
await fetch('/api/auth/verify-email/<token>');
// → Receives: { message: "Email verified successfully" }

// Login with verified user
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'alice@example.com', password: 'SuperSecure1!' }),
  credentials: 'include' // to accept httpOnly cookie
});
// → Receives: { accessToken: '...' } + sets refreshToken in httpOnly, secure cookie

// Refresh access token (client automatically uses cookie)
const refreshed = await fetch('/api/auth/refresh-access-token', {
  method: 'POST',
  credentials: 'include'
});
// → Receives: { accessToken: '...' }

// Logout user
await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});
// → Receives: { message: "Logged out successfully" }

// Protect a route on server using middleware
app.get('/api/private', verifyAccessToken, (req, res) => {
  res.json({ message: "This is protected data." });
});
```

## System Integration

```
┌──────────────────┐        ┌──────────────────────────┐        ┌───────────────────┐
│   Email Service  │◀──────▶│   Authentication Module │◀──────▶│    User Service   │
│ (SMTP provider)  │ sends  │ - /login, /register     │        │ (Profile, wallets)│
│ verification mail│ tokens │ - /verify-email         │        │                   │
└──────────────────┘        │ - /refresh-access-token │        └───────────────────┘
               ▲            │ - /logout               │                  │
               │            └──────────────────────────┘                  │
               │                  ▲         ▲                            │
               │                  │         │                            │
               │           ┌──────┴─────────┴─────┐                      │
               │           │       Middleware     │                      │
               │           │   verifyAccessToken  │                      │
               │           └─────────┬────────────┘                      │
               │                     │                                   │
           Users receives      Protected API routes           Other modules
           register/verify    check authentication           can check
           email, login       via access token middleware    authentication state

[Process]: 
1. User registers → receives verification email  
2. User verifies → email service notifies backend  
3. Login issues tokens (accessToken, refreshToken), sets cookies  
4. Auth middleware protects sensitive endpoints using accessToken  
5. Refresh/Logout control session lifecycle

[Consumers]:
- Wallet APIs
- Profile APIs
- Any other service requiring authenticated access
```