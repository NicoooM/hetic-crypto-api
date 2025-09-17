# History API Module

## Overview
The History API module provides read access to wallet transaction history for authenticated users. It is designed to retrieve a filtered list of wallet transaction records, optionally narrowed by wallet ID and start date. This is used in crypto applications to display a user’s asset transaction history, supporting both user dashboards and audit features.

## Key Features

- **Fetch Wallet History**: Retrieves all transaction history records for a specified wallet, scoped to the requesting authenticated user.
- **Filter by Start Date**: Supports optional filtering to only include transactions from a specific start date onward.
- **User-Scoped Data**: Ensures only authenticated users can access their own wallet history, enforcing basic access control.

## System Errors

- **Invalid Wallet ID**:  
  Occurs when the provided wallet ID in the route is not a valid number.  
  _Resolution_: Ensure that the wallet ID in the request is a valid integer.

- **Wallet History Not Found**:  
  Returned if no transaction history is found for the wallet/user combination or the filters applied.  
  _Resolution_: Check that the wallet exists, is associated with the current user, and that transactions exist after the optional start date.

- **Internal Server Error**:  
  Any unhandled runtime issues in the database call or request pipeline.  
  _Resolution_: Review error message for diagnostics. Common causes include database connectivity or schema errors.

## Usage Examples

```typescript
// Fetch wallet transaction history as an authenticated user

// GET /history/:id?startDate=2023-01-01
fetch("/history/123?startDate=2023-01-01", {
  method: "GET",
  headers: {
    "Authorization": "Bearer <user-access-token>"
  }
})
  .then(res => res.json())
  .then(history => {
    // handle array of history records
  })
  .catch(error => {
    // handle errors
  });
```

## System Integration

```
┌───────────────┐    ┌──────────────┐    ┌───────────────┐
│ Auth Middleware│──▶│ History API  │──▶│   Frontend    │
│   (express)   │    │   Module     │    │   Client App  │
└───────────────┘    └──────────────┘    └───────────────┘
        │                  │                   │
        ▼                  ▼                   ▼
 [User context,    [Routes/filter parsing,   [Wallet history
  req.user setup]   DB queries, error]        display]
                  │
                  ▼
          ┌────────────┐
          │  Database  │
          └────────────┘
             │
            [walletHistory]
```

- **Dependencies**: Relies on authentication middleware to set `req.user`, and uses Prisma for database queries.
- **Process**: Endpoint parses filters, invokes the service to fetch history, and returns results or applicable errors.
- **Consumers**: Typically used by frontend clients to display the user's transaction history.