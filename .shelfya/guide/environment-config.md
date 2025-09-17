# Environment Configuration System

## Overview
The Environment Configuration module is responsible for managing and verifying all environment variables required for the operation of the backend system. This ensures that all dependencies, integrations, and application settings have their necessary configuration at startup. If environment variables are missing or misconfigured, the module prevents the application from running, reducing misconfiguration issues and integration failures.

## Key Features

- **Environment Variable Verification**: Automatically checks for the existence and validity of all required environment variables during application startup. Prevents the application from running with incomplete configuration.
- **Centralized Configuration List**: Maintains a single source (`REQUIRED_ENV_VARS`) of all necessary environment variables, making configuration management clearer and more maintainable.
- **Integration Readiness**: Ensures external services such as database, SMTP, and third-party APIs (e.g., CryptoCompare, Etherscan) are properly set up before the application attempts to interact with them.

## System Errors

- **Missing Environment Variable**:  
  **Description**: One or more required environment variables are not set or are empty when the application starts.  
  **Resolution**: Check the `.env` file and ensure all variables listed in `REQUIRED_ENV_VARS` are defined and non-empty. Refer to `.env.example` for expected variables.

- **Empty Environment Variable**:  
  **Description**: An environment variable is present but contains only whitespace or is empty.  
  **Resolution**: Assign a valid value to every required environment variable. Avoid leaving values blank in your `.env` file.

## Usage Examples

```typescript
// At application startup, typically in your main entrypoint (e.g., index.ts):

import { verifyEnv } from './utils/verify-env';

// Verify that all required configuration is present before proceeding.
verifyEnv();

// If verification fails, an error is thrown and the process will exit.
```

```env
# .env file example (use as template)
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"
PORT=8080
CRYPTOCOMPARE_API_KEY=your-cryptocompare-key
ETHERSCAN_API_KEY=your-etherscan-key
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=3600000
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password
API_URL=http://localhost:8080
CLIENT_URL=http://localhost:3000
```

## System Integration

```
┌──────────────┐       ┌─────────────────────────────┐         ┌────────────────────────┐
│  .env File   │──────▶│ Environment Config Module   │────────▶│ App Modules & Services │
│ (user config)│       │  (verify-env.ts/constants) │         │ (DB, Auth, APIs, etc.) │
└──────────────┘       └─────────────────────────────┘         └────────────────────────┘
        │                        │                                      │
        ▼                        ▼                                      ▼
 Environment values     Validates presence/validity        Supplies config for connections
      loaded                  on startup                       (DB, email, APIs, etc.)
```