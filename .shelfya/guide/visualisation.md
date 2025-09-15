# Transaction Visualization Guide

This guide explains how transaction visualization works in the Hetic Crypto API client, describes its main features, and shows you how to interact with the transaction graph view.

## Overview

The transaction visualization page provides an animated, interactive graph of wallet transactions using D3.js. You can find this feature under the **Visualisation des transactions** section in the web client.

- Each **node** represents either the main wallet or one of its transactions.
- **Edges** (links) show transaction flow between the main wallet and individual transactions.
- The graph evolves over time, showing transactions as they occur chronologically.

## How It Works

### Data Model

Nodes and links use the following structure:

```ts
interface Node {
  id: string;
  date: Date;
}

interface Link {
  source: string;
  target: string;
  date: Date;
  value: number; // transaction amount
}
```

A typical sample creates:
- One `mainWallet` node,
- Many `transactionX` nodes (one per transaction within a time period),
- Links between `mainWallet` and each transaction node, annotated with value and date.

### Visualization Features

1. **Animated Timeline**  
   A timeline animated at the top of the graph progressively reveals transactions as they occur over time. The current date appears to the right of the progress bar.

2. **Force-Directed Graph**  
   - Nodes are dynamically positioned using physical simulation for readability.
   - The main wallet is clearly marked (larger red circle).

3. **Node Size**
   - Transaction nodes are sized according to their amount (`value`). Larger transactions result in bigger nodes. The main wallet remains prominent.

4. **Tooltips**
   - Hovering over a node displays a tooltip showing:
     - Wallet/node identifier
     - Transaction value (`Value: ...`)
   - The tooltip follows your cursor for clarity.

## User Guide

### 1. Accessing the Visualization

- Navigate to the **Visualisation des transactions** page.
- The graph appears within a card, with a progress bar and current date above it.

### 2. Interacting With the Graph

- **Watch the animation**: The graph progressively builds as transactions are "unlocked" day by day along the timeline.
- **Hover over nodes**:
  - The main wallet node is red and bigger.
  - Transaction nodes are greenish and sized by transaction amount.
  - Hover to see details in a tooltip.
- **Observe timeline**:
  - The progress bar at the top fills as the animation proceeds.
  - The current date indicator updates in line with the graph's visible data.

### 3. Customizing Data

By default, the graph uses sample data. You can customize the graph with your own transaction data by adjusting the `sampleData` structure in `TransactionGraph.tsx`.

```ts
const sampleData: GraphData = {
  nodes: [
    { id: "mainWallet", date: new Date('2024-01-01') },
    { id: "transaction1", date: new Date('2024-01-02') },
    // ...your additional nodes
  ],
  links: [
    { source: "mainWallet", target: "transaction1", date: new Date('2024-01-02'), value: 300 },
    // ...your additional links
  ]
};
```
> **Tip**: All dates should correspond, and transaction dates drive the animation's timeline.

## Technical Details

- **Visualization Library:** [D3.js](https://d3js.org/)
- **Component:** `TransactionGraph` in `client/src/components/TransactionGraph.tsx`
- **Container Page:** `Graph` in `client/src/pages/Graph.tsx`
- **Styling:** Tailwind CSS used for layout, colors, and transitions.

## Example

![Screenshot Example](https://via.placeholder.com/928x600?text=Transaction+Graph+Visualization)

*This simulates the graph layout you will see. Real visuals may differ based on data and animations.*

---

For questions or issues, please refer to the project README, or open a GitHub issue for support.