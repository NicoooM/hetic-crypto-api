# Wallets API Module

## Overview
The Wallets API module manages user cryptocurrency wallets within the system. It enables authenticated users to create, list, and delete wallets. Additionally, when a wallet is created, its historical value is synchronized and stored based on blockchain transaction history and historical ETH prices. This module helps users organize and track their cryptocurrency wallets, ensuring all wallet data is associated with their account and kept up-to-date with historical valuation.

## Key Features

- **Create Wallet**: Lets authenticated users register a new wallet address, enriches it with transaction history and historical valuation (in ETH and local currency), and saves all these details for further tracking and analytics.
- **List Wallets**: Allows a user to retrieve all wallets associated with their account.
- **Delete Wallet**: Permits users to remove a wallet and all related wallet history from their account.

## System Errors

- **Invalid Wallet ID**: If a wallet ID is missing or not numeric during delete operations, the system returns a `400 Bad Request` error with an appropriate message.
  - **Resolution**: Ensure the wallet ID provided in the request is valid and numeric.
- **Wallet Not Found**: Deleting a wallet that does not exist or isn’t owned by the user returns a `404 Not Found` error.
  - **Resolution**: Check if the wallet exists and belongs to the authenticated user.
- **Missing Required Fields**: During wallet creation, missing the `address` or `title` field returns a `400 Bad Request` error.
  - **Resolution**: Provide both wallet address and title in the creation request.
- **ETH Currency Missing**: If the ETH currency record does not exist in the system when creating a wallet, a `500 Internal Server Error` is returned with "ETH currency not found."
  - **Resolution**: Ensure the `currency` table has an ETH (Ethereum) record present.
- **General/Internal Error**: Any unexpected error returns a `500 Internal Server Error` with details in the message.
  - **Resolution**: Examine the error message for troubleshooting; check service, database, or external API dependencies.

## Usage Examples

```javascript
// Using fetch to interact with the Wallets API

// 1. Create a new wallet
fetch('/api/wallets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <your-token>'
  },
  body: JSON.stringify({
    address: '0xABCDEF...',
    title: 'My ETH Wallet'
  })
})
  .then(res => res.json())
  .then(wallet => console.log('Created wallet:', wallet));

// 2. List all wallets for the authenticated user
fetch('/api/wallets', {
  headers: {
    'Authorization': 'Bearer <your-token>'
  }
})
  .then(res => res.json())
  .then(wallets => console.log('My wallets:', wallets));

// 3. Delete a wallet by ID
fetch('/api/wallets/123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <your-token>'
  }
})
  .then(res => {
    if(res.status === 204) {
      console.log('Wallet deleted successfully');
    }
  });
```

## System Integration

```
┌──────────────────────┐     ┌───────────────┐      ┌────────────────────┐
│  Express Router      │ ───▶│ Wallets API   │ ───▶ │   User Frontend    │
│  (/api/wallets)      │     │  Module       │      │  (Dashboard, etc.) │
│  [HTTP requests]     │     │               │      │                    │
└──────────────────────┘     └───────────────┘      └────────────────────┘
           │                        │                        │
           ▼                        ▼                        ▼
   Authentication &         Wallet Service Layer       User interacts via
    Authorization           (create/list/delete)          web/mobile UI
           │                        │
           ▼                        ▼
   ┌───────────────────────┐   ┌──────────────────┐
   │ Database (Prisma ORM) │   │ Etherscan Utils  │
   │  - Wallets            │   │ (Fetch wallet    │
   │  - WalletHistory      │   │  transaction     │
   │  - Currency           │   │  history)        │
   └───────────────────────┘   └──────────────────┘
```
**Details**:  
- **Dependencies**:  
  - API requests routed through Express and authenticated.
  - Uses Prisma ORM for DB access (wallets, walletHistory, currency).  
  - Uses Etherscan utility for blockchain history.
- **Process**:  
  - Validates input and user, executes create/list/delete in service layer, manages data persistence and enrichment (with historical pricing).
- **Consumers**:  
  - Used by the user-facing frontend for display, dashboard, and wallet management functionality.