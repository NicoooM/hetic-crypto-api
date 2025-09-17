# Environment Configuration Module

## Overview
This module manages the configuration of required environment variables for the backend service. It ensures that all critical settings—such as database credentials, API secrets, and service URLs—are present and valid before the application runs. This prevents runtime errors due to missing or misconfigured environment data, acting as a safeguard for both deployment and local development.

## Key Features
- **Automatic Environment Validation**: Checks for the presence of all required environment variables at startup, immediately halting execution if any are missing or empty.
- **Centralized Variable List**: Maintains a single point of truth for all environment variables expected by the application, supporting maintainability and consistency across different environments (dev, test, prod).
- **Integration Readiness**: Ensures that all external services (like databases, email providers, and third-party APIs) have the necessary configuration to be used reliably throughout the system.

## System Errors
- **MissingOrEmptyEnvVar**: Thrown when one or more required environment variables are missing or are set to an empty value.
  - **Description**: On application start, if any variable from the required list is missing or blank, the system throws an error with the names of those variables.
  - **Resolution**: Ensure all variables listed in the [`.env.example`](../../backend/.env.example) file are present and properly assigned in your environment configuration.

## Usage Examples

```typescript
import { verifyEnv } from "./utils/verify-env";

// Place this early in your app's entry point (e.g., before starting Express)
verifyEnv(); // Throws if any required env var is missing/empty

// If verification passes, continue app startup...
```

Example `.env` file (see `.env.example` for a full reference):
```
POSTGRES_USER=myuser
POSTGRES_PASSWORD=securepassword
POSTGRES_DB=maindb
DATABASE_URL="postgresql://myuser:securepassword@localhost:5432/maindb"
PORT=8080
CRYPTOCOMPARE_API_KEY=your-key
ETHERSCAN_API_KEY=your-key
# ... other required variables
```

## System Integration

```mermaid
flowchart LR
  envFile[".env file(s) and system env"] --> envConfig["Environment Configuration Module"] --> appCore["Application Startup"]
  envConfig --> errorHandler["Startup Error Handler"]
  appCore --> services["Database/API/SMTP Services"]
  services --> externalProviders["[External Providers]"]
```