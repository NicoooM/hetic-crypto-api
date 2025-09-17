# Wallets Module

## Overview
The Wallets module manages cryptocurrency wallets for authenticated users. It enables users to create, view, and delete their wallets, and links wallet data to real-time and historical information through system integrations (e.g., Etherscan, CryptoCompare). This module acts as the primary entry point for all wallet-related management in the API, centralizing storage, validation, and enrichment of wallet data.

## Key Features

- **Create Wallet**:  
  Allows authenticated users to register a new wallet (by address and title). On creation, it fetches wallet history and enriches it with ETH price data, ensuring that each wallet includes historical valuation in real currency.

- **List Wallets**:  
  Retrieves all wallets associated with the current user, supporting front-end dashboards and overviews.

- **Delete Wallet**:  
  Removes a specified wallet belonging to the user, including the automatic cleanup of its associated wallet history.

- **Wallet History Enrichment**:  
  On wallet creation, pulls transaction history from Etherscan and price history from CryptoCompare, computes equivalent values, and persists historical snapshots for accurate analytics.

- **API-First Public Integration**:  
  Exposes RESTful endpoints for all capabilities to facilitate easy integration with front-end clients and other system modules.

## System Errors

- **Invalid Wallet ID**:  
  Description: Provided wallet ID is missing or not a valid number (e.g., when deleting or fetching).  
  Resolution: Ensure the walletId parameter in the route is a numeric value.

- **Wallet Not Found (`P2025`)**:  
  Description: Targeted wallet does not exist or does not belong to the requesting user.  
  Resolution: Confirm that the wallet exists and belongs to the authenticated user.

- **Missing Required Fields**:  
  Description: Address or title missing when attempting to create a wallet.  
  Resolution: Both `address` and `title` fields must be provided in the request body.

- **ETH Currency Not Found**:  
  Description: The system could not find ETH in the list of supported currencies (internal sync issue).  
  Resolution: Ensure the currency data is correctly initialized.

- **General Internal Error**:  
  Description: Unexpected error occurred while communicating with services or the database.  
  Resolution: See error response message for further details.

## Usage Examples

```typescript
// Create a new wallet
POST /api/v1/wallet
{
  "address": "0x1234abc...",
  "title": "My Main ETH Wallet"
}
// Response: 201 Created
{
  "id": 12,
  "userId": 24,
  "address": "0x1234abc...",
  "title": "My Main ETH Wallet"
}

// List user's wallets
GET /api/v1/wallet
// Response: 200 OK
[
  {
    "id": 12,
    "userId": 24,
    "address": "0x1234abc...",
    "title": "My Main ETH Wallet"
  },
  ...
]

// Delete a wallet (and its history)
DELETE /api/v1/wallet/12
// Response: 204 No Content
```

## System Integration

```
┌────────────────────┐      ┌──────────────┐     ┌──────────────┐
│  User Authentication│────▶│  Wallets     │────▶│ Frontend/API │
│   & Accounts       │      │   Module     │     │  Consumers   │
└────────────────────┘      └──────────────┘     └──────────────┘
           │                      │                     │
           ▼                      ▼                     ▼
   [User ID validation]    [Fetch wallet,          [Dashboard,
   [Session context]       fetch/compute           Portfolio,
                           crypto & history]       Reports]
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Data Providers                   │
│         (Etherscan, CryptoCompare via services/utils)       │
└─────────────────────────────────────────────────────────────┘
```

**Legend:**  
- **Dependencies:** User authentication (supplies user context); external price/history APIs for wallet enrichment  
- **This Module:** Handles wallet CRUD, enriches new wallets with history+pricing  
- **Used By:** Client dashboards, analytics modules, and any consumer of user wallet lists or records