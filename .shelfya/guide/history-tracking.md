# Wallet History Tracking

## Overview
The History Tracking module enables users and system components to retrieve the chronological financial history of a specific wallet. This module is core to tracking, auditing, and analyzing all token movements, allowing users to follow their wallet balance changes over time, primarily for portfolios, analytics, and reporting purposes.

## Key Features

- **Wallet History Retrieval**: Fetches the comprehensive transaction history for a specific wallet, providing daily balance changes and insights on all incoming and outgoing transactions, including both on-chain (normal) and internal operations.
  
- **Aggregation & Calculation**: Consolidates data from Etherscan (both normal and internal transactions) and processes it to calculate net daily balance changes, factoring in transaction values and gas costs, ensuring accurate historical portfolio tracking.
  
- **Date-based Filtering**: Allows filtering of history by start date to focus on specific periods, facilitating detailed analytics and user-defined reports.
  
- **User-specific Access**: Ensures that only the authenticated owner of a wallet can access its associated historical data.

## System Errors

- **Invalid Wallet ID**: Returned when the provided wallet identifier is malformed (e.g., non-numeric).  
  _Resolution_: Validate that the wallet ID in the request path is a number.

- **Wallet History Not Found**: Triggered if the system cannot find any historical data for the specified wallet.  
  _Resolution_: Ensure the wallet exists and has recorded transactions; check that filters (such as `startDate`) match existing data.

- **Internal Server Error**: Generic error for unforeseen server issues, such as database connectivity or upstream API failures.  
  _Resolution_: Check system logs; verify external dependencies (Etherscan API, database).

## Usage Examples

```typescript
// REST API Example: Get all history for a wallet (ID = 123)
GET /api/v1/history/123
Authorization: Bearer <user-access-token>

// Response: Array of daily balance changes
[
  {
    "walletId": "123",
    "date": "2024-05-01T00:00:00.000Z",
    "value": 1.025
  },
  {
    "walletId": "123",
    "date": "2024-05-02T00:00:00.000Z",
    "value": 1.04
  },
  ...
]

// REST API Example: Get history from a specific start date
GET /api/v1/history/123?startDate=2024-06-01
Authorization: Bearer <user-access-token>
```

## System Integration

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│ Etherscan API       │───▶│   History Tracking   │───▶│ Client & System │
│ (normal & internal) │    │   (This Module)      │    │   Consumers     │
└─────────────────────┘    └──────────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
[Transaction fetch,    [Aggregates, calculates,    [Dashboards, analytics,
 external data]         filters, exposes          reporting modules,
                       `/api/v1/history/:id`]     user portals]
```

- **Dependencies**: Etherscan API for raw transaction data, Prisma/database for storage and querying.
- **Process**: Fetches and aggregates transactions, applies user filters, and exposes the history via a secure API.
- **Consumers**: UI dashboard, analytics tools, portfolio statistics modules, and other user-facing/reporting systems.