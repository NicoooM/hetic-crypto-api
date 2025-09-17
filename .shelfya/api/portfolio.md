# Portfolio API Module

## Overview
The Portfolio API module provides a read-only endpoint designed to retrieve a consolidated financial overview of a specific cryptocurrency wallet. It aggregates wallet allocation, real-time asset prices, daily price changes, total wallet value in fiat, and value evolution since the previous day. This feature empowers clients and integrated services to present or analyze users' cryptocurrency portfolio status without handling the complexities of multiple data sources.

## Key Features

- **Portfolio Overview Endpoint**:  
  Offers a single API entry point (`GET /portfolio/:id`) to access all relevant wallet overview metrics for a user-specified wallet.

- **Real-Time Price Fetching**:  
  Retrieves up-to-date ETH-to-EUR exchange rates using external pricing APIs, allowing for current value calculations.

- **Historical Price Comparison**:  
  Calculates the 24-hour percentage change in ETH price, giving context to the current wallet valuation.

- **Wallet Value Calculation**:  
  Computes the live wallet balance in EUR by fetching data from the Etherscan API and applying the latest exchange rates.

- **Daily Performance Delta**:  
  Determines the change in wallet value compared to its last recorded historical value, indicating performance over the last day.

## System Errors

- **Internal Server Error**:  
  - **Description**: Any failure in data retrieval, external API call, or service logic results in an internal server error.
  - **Resolution**: Check logs for error details (often related to unavailable external APIs or incorrect wallet ID). Retry later or validate API key configuration and service dependencies.

- **Invalid Wallet ID**:  
  - **Description**: If the provided wallet `id` does not exist, the response fields will be empty or defaulted, as the error is not explicitly surfaced.
  - **Resolution**: Ensure the wallet `id` exists in the database before querying this endpoint.

## Usage Examples

```typescript
// Request portfolio overview for wallet with ID 42
import axios from "axios";

axios.get("https://yourapi.com/portfolio/42")
  .then(response => {
    console.log("Allocation:", response.data.allocation);    // Portion of asset type (currently always 1)
    console.log("Current ETH Price (EUR):", response.data.price); 
    console.log("24h ETH Change (%):", response.data.dailyPrice); 
    console.log("Wallet Value (EUR):", response.data.value); 
    console.log("Value Change vs Yesterday (EUR):", response.data.dailyValue); 
  })
  .catch(error => {
    console.error("Portfolio fetch failed:", error.response?.data?.message);
  });
```

## System Integration

```
┌─────────────────────────┐        ┌───────────────────────────────┐        ┌──────────────────────────┐
│   Database (Prisma)     │ ─────▶ │     Portfolio API Module      │ ─────▶ │  API Consumers          │
│  (wallets, history)     │        │   (GET /portfolio/:id)        │        │ (Frontend, Services)    │
└─────────────────────────┘        │                               │        └──────────────────────────┘
          │                        │   ┌────────────────────────┐           │
          │                        │   │ External APIs:        │           │
          ▼                        │   │ - Etherscan           │           │
 Wallet address,                   │   │ - CryptoCompare       │           │
 historical value                  └──▶│ (price, balance)      │───────────┘
                                     └────────────────────────┘
```

- **Dependencies**: Uses Prisma ORM to read wallet addresses and history from the local database.  
- **Process**: Calls external APIs (Etherscan for ETH balance, CryptoCompare for current and historical prices) and combines the results to serve a consolidated overview.
- **Consumers**: Any service or front-end needing a complete, up-to-date financial snapshot of user wallets.