# Portfolio & History Module

## Overview
The Portfolio & History module manages cryptocurrency wallet tracking, portfolio valuation, and historical record-keeping for users. It enables users to create and manage wallets, retrieve up-to-date portfolio data, and access historical changes in wallet value, supporting transparency and effective monitoring within the wider crypto API ecosystem.

## Key Features

- **Wallet Management**:  
  Allows users to create new wallets, view all their wallets, or delete existing ones. Each wallet is linked to a user account.

- **Portfolio Overview**:  
  Provides detailed information about a wallet's value, allocation, and performance. This includes current price data, daily price changes, and value changes.

- **Historical Data Retrieval**:  
  Enables retrieval of wallet transaction histories and value changes over time, aiding in tracking portfolio evolution and past performance review.

## System Errors

- **Invalid Wallet ID**:  
  Returned when a provided wallet ID cannot be parsed as an integer.  
  _Resolution_: Ensure the wallet ID in the request is correct and properly formatted.

- **Wallet Not Found**:  
  Returned when trying to delete or fetch a non-existent or unauthorized wallet.  
  _Resolution_: Verify that the wallet exists and belongs to the authenticated user.

- **Wallet History Not Found**:  
  Occurs if there are no historical records for the specified wallet.  
  _Resolution_: Confirm wallet activity has occurred; create transactions or wait for data population.

- **ETH Currency Not Found**:  
  Error returned during wallet creation if the ETH currency data is unavailable.  
  _Resolution_: Verify initial data seeding and the presence of core currency data in the system.

- **Internal Server Error**:  
  Any unexpected error during API usage.  
  _Resolution_: Check request parameters and server logs for further details.

## Usage Examples

```typescript
// 1. Create a wallet (POST /wallet)
await fetch('/api/wallet', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: "0xUserEthAddress", title: "Main Wallet" })
});

// 2. List all wallets (GET /wallet)
const wallets = await fetch('/api/wallet', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());

// 3. Get portfolio summary (GET /portfolio/:id)
const portfolio = await fetch(`/api/portfolio/${walletId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());

// 4. Retrieve wallet history (GET /history/:id?startDate=2024-01-01)
const history = await fetch(`/api/history/${walletId}?startDate=2024-01-01`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());

// 5. Delete a wallet (DELETE /wallet/:id)
await fetch(`/api/wallet/${walletId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## System Integration

```mermaid
flowchart LR
  apiClients["API Clients / Frontends"]
    --> walletController["Wallet Controller"]
    --> portfolioController["Portfolio Controller"]
    --> historyController["History Controller"]
  
  walletController --> walletService["Wallet Service"]
  portfolioController --> portfolioService["Portfolio Service"]
  historyController --> historyService["History Service"]

  walletService --> prismaDb["Database (wallet, walletHistory, currency)"]
  portfolioService --> prismaDb
  portfolioService --> cryptoCompare["CryptoCompare API"]
  portfolioService --> etherscan["Etherscan API"]

  historyService --> prismaDb

  prismaDb --> "[Persistent Storage]"
  cryptoCompare --> "[External Crypto Price Data]"
  etherscan --> "[External ETH Blockchain Data]"
```
