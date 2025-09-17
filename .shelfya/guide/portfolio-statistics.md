# Portfolio Statistics Module

## Overview
The Portfolio Statistics module provides users and external systems with up-to-date analytics and insights about cryptocurrency wallets. It aggregates and exposes key metrics—such as asset allocation, price changes, and total wallet value—via a single public API endpoint. This feature enables wallet tracking solutions to display relevant portfolio data and supports informed decision-making within dashboards and reporting interfaces.

## Key Features
- **Get Portfolio Statistics**: Returns comprehensive statistics for a specific wallet, including allocation, latest cryptocurrency price, daily price change (%), wallet value (in fiat), and daily value change.
- **Real-Time and Historical Data Integration**: Combines live price data from CryptoCompare and asset balances from Etherscan with recent wallet history stored in local database. Enables current and daily comparative analytics.
- **Single-Endpoint Access**: All metrics are provided in response to a single API call, simplifying integration for client applications and external consumers.

## System Errors
- **Wallet Not Found**: If the wallet ID is invalid or does not exist, statistics will not be calculated, and an error will be returned.
  - *Resolution*: Ensure the wallet is created and the correct ID is specified.
- **External API Failure**: If CryptoCompare or Etherscan APIs are unavailable or rate-limited, data might be incomplete or trigger a server error.
  - *Resolution*: Retry the request after some time or check external API status; ensure valid API keys are configured.
- **Internal Server Error**: Any unexpected failure in the statistics aggregation process will surface as a generic server-side error.
  - *Resolution*: Check backend logs for details and verify the integrity of wallet and history data.

## Usage Examples
Practical code example for requesting portfolio statistics via the public API:

```javascript
// Fetch portfolio statistics for a wallet with ID '123'
fetch('https://your-api-host/api/v1/portfolio/123')
  .then(response => response.json())
  .then(data => {
    // Example response structure:
    // {
    //   allocation: ...,
    //   price: ...,
    //   dailyPrice: ...,
    //   value: ...,
    //   dailyValue: ...
    // }
    console.log('Current Wallet Value:', data.value);
    console.log('24h Change (%):', data.dailyPrice);
  })
  .catch(error => {
    // Handle system errors here
    console.error('Failed to fetch portfolio statistics:', error);
  });
```

## System Integration

```
┌──────────────────┐    ┌───────────────────────────────┐    ┌─────────────────────────┐
│   Database       │───▶│   Portfolio Statistics Module │───▶│   Dashboard & API Users │
│ (Wallet,History) │    │     (GET /portfolio/:id)      │    │ (UI, reporting, clients)│
└──────────────────┘    └───────────────────────────────┘    └─────────────────────────┘
         │                         │                                  │
         ▼                         ▼                                  ▼
 [Wallet Data &        [Aggregates: allocation,         [Consumes statistics data
  Value History]        price, dailyPrice, value]        for visualization or alerts]
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│           External APIs: CryptoCompare, Etherscan                │
│    (Live price, historical price, wallet balance)                │
└──────────────────────────────────────────────────────────────────┘
```

This diagram illustrates:
- Data flow from internal wallet/history storage and external price/balance APIs.
- Portfolio Statistics module's central role in collecting, aggregating, and exposing metrics.
- Direct consumption by dashboard features, client apps, and reporting tools.