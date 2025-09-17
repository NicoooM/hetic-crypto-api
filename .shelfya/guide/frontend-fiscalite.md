# Frontend Fiscalité Module

## Overview
The Frontend Fiscalité module provides users with an interactive dashboard to visualize, calculate, and report cryptocurrency capital gains (plus-values) for tax purposes. It displays a summary table of all portfolio transactions, computes taxable gains according to French fiscal rules, and enables users to generate a PDF fiscal report, facilitating fiscal compliance and record-keeping.

## Key Features
- **Transaction Visualization**: Displays a detailed, paginated table of all deposit and withdrawal transactions, including dates, amounts, prices, fees, and computed gains.
- **Automated Capital Gains Calculation**: Computes realized gains for each withdrawal using portfolio aggregation logic specific to French fiscal law.
- **Total and Taxable Gain Summaries**: Calculates and highlights both the total capital gain and the portion taxable at the standard 30% rate.
- **PDF Report Generation**: Allows the user to export their transaction table and fiscal summary as a formatted and ready-to-download PDF.
- **User-Friendly UI**: Offers an accessible and responsive interface for browsing, reviewing, and exporting fiscal data.

## System Errors
- **PDF Generation Error**: If PDF generation fails (e.g., library loading issue or rendering failure), the export will not complete.  
  **Resolution**: Verify browser compatibility and ensure network access for dependencies. Reload the page or try a different browser if issues persist.
- **Invalid Transaction Data**: If transaction data is missing or malformed, calculations and summary figures may be incorrect or unavailable.  
  **Resolution**: Ensure transaction import and synchronization processes provide complete and properly formatted transaction objects.

## Usage Examples
Practical code examples showing how to use the module:

```tsx
// 1. Display fiscal summary page (typically routed in your app):
import Fiscalite from './pages/Fiscalite';
// ...
<Route path="/fiscalite" element={<Fiscalite />} />

// 2. Generate fiscal report as PDF (from UI):
// User clicks "Générer le PDF" button; no extra code required.
// The system automatically generates and opens a downloadable PDF with all data.

// 3. Customizing transaction sources:
// To use real data, replace the fakeTransactions array with fetched transaction data:
// const [transactions, setTransactions] = useState<Transaction[]>([]);
// useEffect(() => {
//   fetch('/api/transactions')
//     .then(res => res.json())
//     .then(setTransactions);
// }, []);
```

## System Integration
Complete ASCII diagram showing how this module integrates with the system:

```
┌──────────────────┐     ┌─────────────────────────┐     ┌───────────────────┐
│  Transaction API │ ◀── │  Frontend Fiscalité     │ ──▶ │   Users / Export  │
│ (Backend Source) │     │    (Dashboard & PDF)    │     │  (UI, PDF Output) │
└──────────────────┘     └─────────────────────────┘     └───────────────────┘
        │                          │                              │
        ▼                          ▼                              ▼
 [Provides transaction]   [Calculates, displays,          [Downloads PDF or
     [data, pricing]        and exports reports]            views fiscal data]
```
- **Dependencies**: Relies on back-end API or static data for transaction history; uses the `pdf-lib` library for PDF export.
- **Process**: Fetches/display transactions, calculates taxable gains, summarizes, and offers a downloadable PDF.
- **Consumers**: Accessed directly by end-users via the web frontend for fiscal compliance, to document/report gains.