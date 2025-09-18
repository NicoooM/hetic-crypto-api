# Monolith Crypto API

## Overview
The Monolith Crypto API is a unified wallet tracker enabling users to retrieve, visualize, and analyze cryptocurrency wallet data. It aggregates portfolio information from multiple sources such as CryptoCompare and Etherscan, providing both API endpoints and a connected frontend client for end-to-end wallet management. Designed primarily for educational purposes, it exemplifies an integrated approach to crypto asset monitoring, account management, and data representation.

## Key Features
- **Authentication & Account Management**: Supports user registration, login, logout, email verification, and secure access token refresh to ensure secure entry points and persistent sessions.
- **Wallet Operations**: Enables users to create, list, and delete wallets, retrieve wallet histories, and fetch detailed wallet statistics for portfolio analysis.
- **Profile Management**: Provides endpoints for viewing and updating user profile information, including password reset capabilities.
- **Data Aggregation**: Integrates data from external services such as CryptoCompare and Etherscan, consolidating wallet-related insights and transactional histories.
- **Client Integration**: Delivers an interactive frontend client for users to view dashboards, manage profiles, visualize data, and access fiscal and graph tools.

## System Errors
- **Authentication Error**: Invalid credentials, expired token, or unauthorized access.  
  _Resolution_: Ensure correct login credentials or refresh the access token as needed.
- **Validation Error**: Malformed request bodies or missing required fields.  
  _Resolution_: Verify API input parameters and ensure all required fields are present.
- **Resource Not Found**: Accessing wallets or endpoints with non-existent IDs.  
  _Resolution_: Confirm the wallet ID exists and the route is used as specified.
- **External API Failure**: Downstream errors from CryptoCompare or Etherscan leading to incomplete or missing data.  
  _Resolution_: Retry after some time or check the health of external APIs.

## Usage Examples

```http
# Register a new user
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword"
}

# Login to get JWT tokens
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword"
}

# Create a new wallet
POST /api/v1/wallet
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "address": "0x123abc...789"
}

# Fetch wallet portfolio statistics
GET /api/v1/wallet/portfolio/<walletId>
Authorization: Bearer <access_token>
```

## System Integration

```mermaid
flowchart LR
  subgraph dependencies
    cc[CryptoCompare API]
    es[Etherscan API]
    db[Database]
  end

  cc --> thisModule["Monolith Crypto API"]
  es --> thisModule
  db --> thisModule

  thisModule --> authProcess["Authentication & Profile Management"]
  thisModule --> walletProcess["Wallet Management"]
  thisModule --> dataAgg["Data Aggregation"]

  authProcess --> usedBy["Frontend Client"]
  walletProcess --> usedBy
  dataAgg --> usedBy

  usedBy --> dashboard["Dashboard"]
  usedBy --> profile["Profile View"]
  usedBy --> fiscal["Fiscal Tools"]
  usedBy --> graph["Transaction Graph"]
```
