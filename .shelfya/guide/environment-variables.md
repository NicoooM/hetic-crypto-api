# Environment Variables

## Overview
The environment variables module ensures critical configuration data is provided to the Crypto API backend at runtime. It validates the presence of all required environment variables and provides a foundation for secure, consistent deployment across different environments (development, staging, production). This module is essential for correctly connecting to databases, third-party APIs, authentication systems, and other key services.

## Key Features
- **Validation of Required Environment Variables**: Checks that all critical environment variables are set before the application starts, preventing the server from running with incomplete or incorrect configuration.
- **Support for External Integrations**: Exposes variables required for connecting to databases, third-party APIs (CryptoCompare, Etherscan), authentication, and email systems.
- **Environment-Specific Configuration**: Allows customizing application behavior (database, port, secrets, hosts) per deployment environment via .env files or environment injection.

## System Errors
- **MissingEnvVarError**: Triggered if any required environment variable is missing or empty at server start.
  - **Resolution**: Ensure all variables listed in the `.env.example` file and `REQUIRED_ENV_VARS` array are set with valid values before launching the backend.
- **InvalidEnvVarFormat**: (Potential) If a variable is present but malformed (e.g., wrong URL format, non-numeric port). While not strictly validated by this module, downstream failures can result.
  - **Resolution**: Double-check all variable formats and values, especially connection strings and port numbers.

## Usage Examples

```js
// Node.js: Load env variables, then validate
require('dotenv').config(); // Loads variables from .env file

const { verifyEnv } = require('./src/utils/verify-env');

// Will throw an error if any required variables are missing
verifyEnv();

// Now safe to start the server
const app = require('./src/app');
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

A sample `.env` file should look like:
```
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"
PORT=8080

CRYPTOCOMPARE_API_KEY=YOUR_CRYPTOCOMPARE_API_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000

SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=your-mail-username
SMTP_PASS=your-mail-password

API_URL=https://api.yourdomain.com
CLIENT_URL=https://yourdomain.com
```

## System Integration

```mermaid
flowchart LR
  dependencies[".env file / Environment"]
    --> envModule["Environment Variable Module<br/>(verifyEnv, constants)"]
    --> backendApp["Backend Application"]
  envModule-->|Validates/Exposes| backendApp
  backendApp-->|Uses Variables For| apiIntegrations["Third-Party APIs (CryptoCompare, Etherscan)"]
  backendApp-->|Uses Variables For| db["Database Connection"]
  backendApp-->|Uses Variables For| authSystem["Auth/JWT"]
  backendApp-->|Uses Variables For| mailSystem["SMTP/Mail System"]
```
