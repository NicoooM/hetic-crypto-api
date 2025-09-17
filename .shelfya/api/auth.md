# Authentication API

## Overview
The Authentication API module manages user authentication and authorization workflows, including user login, registration, email verification, token refresh, and logout. It provides secure endpoints for frontend clients to authenticate users, maintain session security, and handle user onboarding and verification. The module acts as the main gateway for all authentication-related operations in the system.

## Key Features

- **User Login**: Authenticates users with email and password, issues short-lived access tokens and secure HTTP-only refresh tokens.
- **User Registration**: Handles new user onboarding, creates user records, and sends email verification links to ensure email ownership.
- **Email Verification**: Verifies user's email addresses using tokenized links sent via email, enabling access to protected features.
- **Access Token Refresh**: Issues new access tokens for authenticated sessions by validating HTTP-only refresh tokens.
- **User Logout**: Securely invalidates refresh tokens, removing client-side cookies and server-side token references to fully terminate sessions.
- **Rate Limiting**: Applies rate limiting on authentication endpoints (login and register) to prevent brute-force attacks.

## System Errors

- **Invalid Credentials**: Occurs when login email or password is incorrect, or the email is not registered.  
  *Resolution*: Check email/password. Ensure user is registered and has verified their email.

- **Email Not Verified**: Login rejected if the user’s email is not verified.  
  *Resolution*: Complete email verification process via link sent to inbox.

- **Email Already Registered**: Registration fails if the provided email already exists.  
  *Resolution*: Use password reset (if available) or another email.

- **Invalid/Expired Token**: Error when refresh or verification tokens are invalid or expired.  
  *Resolution*: Re-login to obtain new tokens or request a fresh verification email.

- **Malformed Request**: Occurs when body or cookie schema validation fails (e.g., missing or invalid fields).  
  *Resolution*: Ensure all required fields are provided and properly structured.

- **Internal Server Error**: Any unexpected failure in persistent storage or external services.  
  *Resolution*: Retry request or contact system administrator.

## Usage Examples

```typescript
// Register a new user
await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", email: "alice@email.com", password: "SuperSecure1!" })
});
// Response: { message: "Registration successful. Please verify your email." }

// Verify user's email
await fetch("/api/auth/verify-email/<token>", { method: "GET" });
// Response: { message: "Email verified successfully" }

// Log in
await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "alice@email.com", password: "SuperSecure1!" }),
  credentials: "include"
});
// Response: { accessToken: "<jwt...>" } and sets HTTP-only refreshToken cookie

// Refresh access token (uses refreshToken cookie)
await fetch("/api/auth/refresh-access-token", {
  method: "POST",
  credentials: "include"
});
// Response: { accessToken: "<newAccessToken>" }

// Logout
await fetch("/api/auth/logout", {
  method: "POST",
  credentials: "include"
});
// Response: { message: "Logged out successfully" }
```

## System Integration

```
┌────────────┐    ┌──────────────┐    ┌───────────────┐
│HTTP Client │───▶│ Auth API     │───▶│  Token Service│
│(Frontend)  │    │ (This Module)│    │ / DB / Mailer │
└────────────┘    └──────────────┘    └───────────────┘
         │                │                  │
         ▼                ▼                  ▼
   User sends       Processes requests   - Stores users
   credentials,     - Issues tokens      - Manages tokens
   tokens, etc.     - Sends emails       - Sends emails
                    - Validates identity   (Email Service)
                    - Handles cookies    - Persists tokens
                                         - Validates/verifies
                                             refresh tokens
 
   [Frontend]     [Auth endpoints]   [Token, DB, Email]
```

**Key Integration Points:**
- Communicates with persistent storage (user and refresh token tables) for user and token management.
- Communicates with EmailService to send verification emails.
- Invokes TokenService for token creation and validation.
- Consumes HTTP requests from frontend clients and secures responses with cookies and headers.