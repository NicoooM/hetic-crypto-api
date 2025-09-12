# Email Verification Guide

This guide explains how email verification works in your HETIC Crypto API, how to configure it, and how to integrate it into your client applications.

## Overview

When a new user registers, the system sends a verification email containing a unique token link. Clicking this link triggers the email verification endpoint, marking the user as verified in the backend.

## Setup

### Environment Variables

Ensure the following variables are set in your `.env` file:

- `SMTP_HOST`: Your SMTP server host (e.g., `smtp.gmail.com`)
- `SMTP_PORT`: Your SMTP server port (e.g., `587`)
- `CLIENT_URL`: The public URL of your client app (e.g., `https://my-app.example.com`)
- Other vars used by your auth flow:
  - `JWT_REFRESH_SECRET`
  - `JWT_REFRESH_TOKEN_EXPIRATION_TIME`
  - `NODE_ENV`

### Email Service

The `EmailService` uses [Nodemailer](https://nodemailer.com/) to send emails:

```ts
// backend/src/services/email.service.ts
import nodemailer from "nodemailer";

export class EmailService {
  #transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: false,    // use TLS if your server supports it
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await this.#transporter.sendMail({
      from: "no-reply@example.com",
      to: email,
      subject: "Verify your email",
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    });
  }
}
```

## Registration Flow

1. **Client** sends a `POST` to `/auth/register` with JSON body:
   ```json
   {
     "name": "Alice",
     "email": "alice@example.com",
     "password": "securePassword"
   }
   ```
2. **Server** validates the request, creates the user, generates a verification token, and calls `EmailService.sendVerificationEmail`.
3. **Client** receives a `201 Created` and message:
   ```json
   {
     "message": "Registration successful. Please verify your email."
   }
   ```

## Verifying the Email

### Endpoint

```
GET /auth/verify-email/:token
```

- **Params**:
  - `token` (string) – the verification token sent by email

### Example

Using `curl`:

```bash
curl -X GET https://api.example.com/auth/verify-email/abcdef123456
```

- **Success Response** (`200 OK`):
  ```json
  {
    "message": "Email verified successfully"
  }
  ```
- **Error Response** (`500 Internal Server Error`):
  ```json
  {
    "message": "Error message describing the failure"
  }
  ```

## Customizing the Email Template

You can modify the HTML in `sendVerificationEmail` to fit your brand:

```ts
html: `
  <div style="font-family: Arial, sans-serif; line-height:1.6;">
    <h2>Welcome to HETIC Crypto!</h2>
    <p>Click the button below to verify your email address:</p>
    <a href="${verificationUrl}" style="background:#28a745; color:#fff; padding:10px 20px; text-decoration:none;">Verify Email</a>
  </div>
`,
```

## Testing in Development

For local development, consider using an SMTP testing service:

- [Ethereal Email](https://ethereal.email/) – free SMTP testing
- [Mailtrap](https://mailtrap.io/) – inbox sandbox

Configure your `.env` accordingly and check the received emails in the testing dashboard.

## Troubleshooting

- **Failed to send email**: Check SMTP credentials, port, and network/firewall.
- **Link not working**: Ensure `CLIENT_URL` matches your front-end route handling `/verify-email/:token`.
- **Token expired or invalid**: Implement token expiration logic in `AuthService.verifyEmail` (not shown here).