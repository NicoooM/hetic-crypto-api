# Frontend Transaction Graph

## Overview
The **Frontend Transaction Graph** module provides an interactive, animated D3-based visualization of crypto wallet transactions over time. It displays the flow of transactions from a central wallet to multiple recipients, allowing end-users to visually inspect transaction volume and chronology on the frontend. This helps users and stakeholders to intuitively grasp transaction patterns and understand wallet activity at a glance.

## Key Features

- **Animated Transaction Timeline**: Visualizes transactions chronologically as an animated timeline, progressively revealing nodes and links to reflect transaction history.
- **Interactive Graph**: Users can explore wallet nodes and view transaction details via dynamic tooltips positioned on hover.
- **Progress Bar & Date Indicator**: A timeline progress bar with a real-time date display lets users observe the temporal evolution of wallet activity.
- **Responsive Display**: The visualization adapts seamlessly to its container and integrates easily within dashboard or reporting pages.
- **Integration-friendly React Component**: Designed for use in any React view; just embed `<TransactionGraph />` to display the graph.

## System Errors

- **Visualization Render Error**: If D3 or SVG fails to render (e.g., SVG ref not found or data is malformed), the graph may not appear.
  - **Resolution**: Ensure that the parent component renders `<TransactionGraph />` in a visible, sized container and that data passed (if customized) matches the expected format.
- **Tooltip Display Issues**: Tooltips may not appear or may "leak" on page if D3 event handlers are improperly bound or destroyed.
  - **Resolution**: Always unmount and remount the component cleanly when navigating between pages; avoid concurrent React updates that might interfere with tooltip DOM elements.

## Usage Examples

```jsx
import Graph from "./pages/Graph";

// On any frontend route/component:
<Graph />

// Graph contains TransactionGraph by default. 
// To use TransactionGraph standalone:
import TransactionGraph from "./components/TransactionGraph";

function MyDashboardPage() {
  return (
    <div style={{ height: 700, width: "100%" }}>
      <TransactionGraph />
    </div>
  );
}
```

## System Integration

```
┌─────────────┐         ┌──────────────────┐           ┌───────────────────┐
│ Transaction │         │  Transaction     │           │  Application      │
│  Data       │◀───────▶│  Graph Component │──────────▶│  UI/Pages         │
│ (sample or  │         │  (D3, React)     │           │  (e.g. /Graph)    │
│  API-fed)   │         │                  │           │                   │
└─────────────┘         └──────────────────┘           └───────────────────┘
        │                        │                              │
        ▼                        ▼                              ▼
  [Static/Mocked]      [Visualization, timeline,          [Dashboards, 
   or Dynamic          tooltips, animation]               reports, user pages]
   JSON array]
```

**Integration Notes:**
- The `TransactionGraph` component expects transaction data in a specific node/link structure (as seen in the internal mock data). To connect real API data, adapt your loader to that shape and pass as props (with customization).
- Intended to be embedded in main visualization pages, e.g., `/Graph`, and consumes no backend state directly—decoupled for easy replacement or reuse.

---

This document helps developers and integrators understand where, why, and how to use the Frontend Transaction Graph module, avoiding internal D3 implementation specifics but detailing all system interactions and visible features.