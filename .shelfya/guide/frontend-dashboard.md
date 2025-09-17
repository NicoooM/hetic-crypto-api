# Frontend Dashboard

## Overview
The Frontend Dashboard module provides users with an interactive interface to view and analyze the value and historical performance of their cryptocurrency wallet(s). It fetches portfolio and wallet data from backend APIs and visualizes this information as charts and summary tables. The dashboard allows users to select wallets, adjust time ranges, and clearly track fluctuations in their portfolio's value over various periods.

## Key Features

- **Wallet Selector**: Enables users to select between different available wallets, dynamically updating the entire dashboard content to reflect the selected wallet's performance.
- **Portfolio Value Chart**: Visualizes the selected wallet's value evolution over time using an interactive line chart, making trends and historical performance easy to understand.
- **Time Range Selection**: Lets users adjust the granularity of the displayed data (e.g., 7 days, 1 month, etc.) for focused analysis. (Note: Shortest timeframes may be disabled based on data availability.)
- **Portfolio Overview Table**: Presents a summary of the selected wallet's allocation, current price, daily variation, and total value, along with daily changes.
- **Error and Loading States**: Clearly displays loading indicators and user-friendly error messages to ensure the user stays informed about system state and issues.

## System Errors

- **Failed to fetch data. Please try again later.**  
  *Description*: This error appears when API calls to fetch wallet or portfolio data fail (e.g., network or server issues).  
  *Resolution*: Check the backend availability, ensure proper API endpoint configuration, and verify network connectivity.

- **No data available.**  
  *Description*: Displayed in the main chart area if the backend returns no historical data for the selected wallet and time range.  
  *Resolution*: Try selecting a different time range or wallet. Ensure there is transaction/activity history associated with the selected wallet.

- **Invalid date**  
  *Description*: Logged (not shown to users) if backend returns improperly formatted date strings.  
  *Resolution*: Ensure correct date formatting and parsing in data sources.

## Usage Examples

```tsx
// Use the Dashboard component as a main page or as part of a larger interface:
import Dashboard from "pages/Dashboard";

function App() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

// The Dashboard will automatically fetch wallet and portfolio data for the authenticated user.
// Users select their wallet and time range via dropdowns and buttons. All updates are reflected automatically.
```

## System Integration

```
┌──────────────┐    ┌────────────────────┐    ┌────────────────────────┐
│ REST API     │───▶│  Frontend Dashboard│───▶│ End User (Browser/App) │
│  (Back End)  │    │    (This Module)   │    │                        │
└──────────────┘    └────────────────────┘    └────────────────────────┘
        │                 │                             │
        ▼                 ▼                             ▼
 [GET /wallet]      [State, Chart,                 [View dashboard,
 [GET /history/:id]  Table rendering,               select wallet, 
 [GET /portfolio/:id]Loading/Error UI]           pick timeframe]
```

- **REST API (Back End)**:  
  Provides wallet, historical, and portfolio data to the dashboard module via HTTP endpoints.
- **Frontend Dashboard (This Module)**:  
  Fetches data, manages user interaction, renders charts and tables, and handles errors/loading.
- **End User**:  
  Views, navigates, and analyzes wallet/portfolio data via interactive UI components.
