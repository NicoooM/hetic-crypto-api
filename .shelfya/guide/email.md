# Email Service Guide

This guide explains how to configure and use the `EmailService` to send verification emails in your NicoooM/hetic-crypto-api project.

## Prerequisites

- Node.js installed (>= 14.x)
- An SMTP provider (e.g., Gmail, SendGrid, Mailgun) with valid credentials
- Environment variables set in your `.env` file (see below)
- `nodemailer` installed (already included in the backend dependencies)

## Environment Configuration

Add the following variables to your `.env` file at the root of the backend:

```dotenv
SMTP_HOST=smtp.example.com
SMTP_PORT=587
CLIENT_URL=http://localhost:3000
```

- **SMTP_HOST**: The SMTP server host from your provider.
- **SMTP_PORT**: The port number (usually 587 for TLS).
- **CLIENT_URL**: The base URL of your client application (used to build the verification link).

> Make sure to restart your server after updating environment variables.

## EmailService Overview

Located at `backend/src/services/email.service.ts`, `EmailService` uses [nodemailer](https://nodemailer.com/) to send emails.

Key methods:

- `constructor()`: Initializes the transporter with the SMTP config.
- `sendVerificationEmail(email: string, token: string)`: Sends a verification link to the user’s email.

```typescript
import nodemailer from "nodemailer";

export class EmailService {
  #transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: false, // Set to true if you use port 465
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    try {
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
    } catch (error) {
      throw new Error(`Failed to send verification email => ${error}`);
    }
  }
}
```

## Usage Example

1. Import and instantiate the service:

   ```typescript
   import { EmailService } from "./services/email.service";

   const emailService = new EmailService();
   ```

2. Generate a verification token (e.g., JWT or random string):

   ```typescript
   const token = crypto.randomBytes(32).toString("hex");
   ```

3. Send the email:

   ```typescript
   try {
     await emailService.sendVerificationEmail("user@example.com", token);
     console.log("Verification email sent!");
   } catch (err) {
     console.error(err.message);
   }
   ```

## Troubleshooting

- **Connection errors**: Verify your SMTP credentials and host/port.
- **Port security**: If using port 465, set `secure: true` in `createTransport`.
- **Invalid link**: Ensure `CLIENT_URL` matches your front-end domain.

## Further Reading

- Nodemailer documentation: https://nodemailer.com/about/  
- Email security and best practices: https://owasp.org/www-project-secure-headers/