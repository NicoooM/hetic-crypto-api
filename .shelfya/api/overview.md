# API Overview

## Overview
The API module serves as the primary interface for all client applications and external systems to interact with the cryptocurrency wallet tracker. It aggregates user authentication, wallet management, transaction history, portfolio statistics, and profile operations. All API endpoints are grouped under the `/api/v1` namespace. This unified entry point enables secure access and integration of cryptocurrency wallet functionalities with third-party services or frontend applications.

## Key Features
- **User Authentication**: Handles user registration, login, email verification, session management, and access token refresh to ensure secure access.
- **Wallet Management**: Allows users to create, list, and delete cryptocurrency wallets, providing individual portfolio management capabilities.
- **Transaction History Retrieval**: Fetches detailed histories for each wallet, enabling users to analyze past transactions or synchronize with external reporting tools.
- **Portfolio Statistics**: Provides real-time analytics and aggregated data for individual wallets, integrating with third-party providers like Cryptocompare and Etherscan.
- **Profile Management**: Lets users view and update personal information and reset their password, supporting a robust account management workflow.

## System Errors
- **Authentication Failure**: Invalid credentials or expired tokens result in `401 Unauthorized` responses. Ensure correct login details or refresh the access token.
- **Resource Not Found**: Accessing a non-existent wallet or data will return `404 Not Found`. Verify wallet IDs or request parameters.
- **Validation Error**: Incorrect input data (e.g., malformed email, weak password) results in `400 Bad Request`. Refer to API requirements and validate your input.
- **Rate Limiting**: Excessive authentication or registration requests are blocked with `429 Too Many Requests`. Wait before retrying or review request frequency.

## Usage Examples

```http
# Register a new user
POST /api/v1/auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

# Login and obtain tokens
POST /api/v1/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

# Create a new wallet (requires authentication)
POST /api/v1/wallet
Authorization: Bearer <access_token>
Content-Type: application/json
{
  "name": "My Main Wallet",
  "address": "0xABCDEF123456..."
}

# Get wallet transaction history
GET /api/v1/history/<walletId>
Authorization: Bearer <access_token>
```

## System Integration

```
┌────────────────┐      ┌───────────────┐      ┌─────────────────┐
│  Auth Service  │─────▶│    API        │─────▶│   Frontend      │
│ (Email, Token) │      │   (This       │      │  Client Apps    │
├────────────────┤      │   Module)     │      └─────────────────┘
│  Crypto APIs   │─────▶│               │─────▶│Third-Party      │
│ (Cryptocompare │      │               │      │Integrations     │
│  Etherscan)    │      │               │      └─────────────────┘
└────────────────┘      └───────────────┘
                               │
                               ▼
                   ┌────────────────────────┐
                   │ Database / Persistence │
                   └────────────────────────┘
```
- **Dependencies**: Relies on authentication mechanisms and external crypto data providers.
- **Process**: All public API endpoints route through centralized authentication, wallet/history/portfolio/profile submodules.
- **Consumers**: Primarily used by frontend applications and can be extended for third-party service integrations. All data is securely stored and managed in the project’s database.