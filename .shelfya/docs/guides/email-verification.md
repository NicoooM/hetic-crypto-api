# Email Verification Guide

This guide explains how email verification works in the HETIC Crypto API. After registration, users receive a verification link that they must click to activate their account.

## 1. Configuration

Ensure the following environment variables are set before starting the server:

- `SMTP_HOST`  
- `SMTP_PORT`  
- `SMTP_USER`  
- `SMTP_PASS`  
- `CLIENT_URL` (e.g. `https://app.example.com`)  
- `JWT_ACCESS_SECRET`  
- `JWT_REFRESH_SECRET`  

These control SMTP settings, the front-end URL, and JWT signing.

## 2. Registration & Email Dispatch

When a user registers:

1. **Endpoint**: `POST /api/v1/auth/register`  
2. **Payload**:
   ```json
   {
     "name": "Alice",
     "email": "alice@example.com",
     "password": "S3cureP@ss!"
   }
   ```
3. **Response** (201 Created):
   ```json
   {
     "message": "Registration successful. Please verify your email."
   }
   ```
4. The server generates a JWT verification token (expires in 7 days) and sends an email via `nodemailer`:

   ```html
   <h1>Email Verification</h1>
   <p>Please click the link below to verify your email:</p>
   <a href="https://app.example.com/verify-email/{token}">
     https://app.example.com/verify-email/{token}
   </a>
   ```

## 3. Verifying the Email

1. User clicks the link in the email.  
2. The front-end route `/verify-email/:token` should extract `token` and call the backend:

   ```bash
   curl -X GET https://api.example.com/api/v1/auth/verify-email/<token>
   ```

3. **Success Response** (200 OK):
   ```json
   {
     "message": "Email verified successfully"
   }
   ```

4. **Error Response** (500 Internal Server Error):
   ```json
   {
     "message": "Failed to verify email => <error details>"
   }
   ```

## 4. Front-end Example (React)

```tsx
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

export function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`/api/v1/auth/verify-email/${token}`)
      .then(() => {
        alert("Email verified! Please log in.");
        history.push("/login");
      })
      .catch(() => {
        alert("Verification failed. Please request a new link.");
      });
  }, [token, history]);

  return <p>Verifying your email…</p>;
}
```

## 5. Next Steps

- After successful verification, users can log in via `POST /api/v1/auth/login`.  
- Unverified users will receive an error if they attempt to log in. Ensure you prompt them to verify first.