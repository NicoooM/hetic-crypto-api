# Environment Variables

## Overview
The Environment Variables module manages required configuration inputs for the backend system, ensuring secure, consistent, and correct operation across environments (development, staging, production). It serves as a single source of truth for API credentials, database access, system ports, and critical service endpoints. By verifying the presence and correctness of these environment variables at startup, the system reduces misconfiguration errors and secures sensitive information outside of code.

## Key Features

- **Mandatory Environment Enforcement**: Checks that all required environment variables are defined and non-empty before the backend application completes its initialization.
- **Centralized Configuration**: Lists and documents all variables needed for external integrations (databases, APIs, SMTP), security settings (JWT secrets, client URLs), and operational parameters (ports, rate limits).
- **Fail-fast Bootstrapping**: Prevents the application from running with incomplete or insecure configuration by halting startup on missing or empty variables.

## System Errors

- **Missing or Empty Environment Variable**:  
  _Description_: If any required environment variable is absent or blank, the system throws an error listing all missing variables at startup.  
  _Resolution_: Ensure all required variables (as listed in documentation and `.env.example`) are set with valid, non-empty values in your environment or `.env` file before launching the backend.

## Usage Examples

```javascript
// At the entry point of your backend application
import { verifyEnv } from "./src/utils/verify-env";

try {
  verifyEnv(); // Verifies all required environment variables before bootstrapping the server
  // Proceed to start your server here
} catch (error) {
  console.error(error.message);
  process.exit(1); // Exit if configuration is incomplete
}
```

Typical `.env` configuration (see `.env.example` file):
```
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"
PORT=8080
CRYPTOCOMPARE_API_KEY=XXX
ETHERSCAN_API_KEY=XXX
JWT_ACCESS_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=3600
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=smtpuser
SMTP_PASS=smtppass
API_URL=https://api.example.com
CLIENT_URL=https://client.example.com
```

## System Integration

```mermaid
flowchart LR
  envFile["Environment Variables (.env, process.env)"] --> verifyEnvModule["Environment Verification Module"]
  verifyEnvModule --> appStartup["Backend Application Startup"]
  envFile --> details["[Database/APIs/SMTP/Secrets]"]
  verifyEnvModule --> process["[Check for required variables]"]
  appStartup --> consumers["[All backend modules needing configuration]"]
```