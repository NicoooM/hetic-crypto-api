# Getting Started

## Overview
This guide provides a feature-centric introduction to launching and composing the HETIC Crypto Wallet Tracker system. It explains how the backend API and client application work together, what each does for users, and the core system connections and requirements. Use this guide to quickly deploy, configure, and understand how the wallet tracking platform functions as an integrated solution.

## Key Features

- **Unified Wallet Tracking**: Aggregates cryptocurrency wallet data from multiple sources (Cryptocompare, Etherscan) with a single API and dashboard interface.
- **User Authentication and Profile Management**: Supports secure user registration, login, email verification, profile data updates, and password reset flows, ensuring account safety and privacy.
- **Wallet Operations**: Allows users to add, view, and delete wallets, as well as retrieve wallet transaction histories and real-time portfolio statistics.
- **Data Visualization Dashboard**: Presents the aggregated wallet data in a comprehensive dashboard, with transaction graphs and PDF report generation.
- **API-Centric Architecture**: The backend exposes structured RESTful endpoints for all major operations, promoting extensibility and third-party integration.
- **Developer-Friendly Local Setup**: Includes ready-to-use Docker Compose for database and email testing, clear environment variable configuration, and rapid local API/client start.

## System Errors

- **Database Connection Error**: Occurs if environment variables for Postgres are misconfigured or the database container is down.  
  _Resolution_: Check `.env` variables and ensure the `postgres` Docker container is running via `docker-compose up`.
- **Missing API Keys**: The backend requires valid Cryptocompare and Etherscan API keys for external data fetching.  
  _Resolution_: Set these keys in your `.env` file before starting the backend service.
- **Email Delivery Issues**: User verification emails may fail locally if Mailhog is not running.  
  _Resolution_: Run the `mailhog` service via Docker Compose to capture and inspect emails in development.
- **CORS or Backend Not Responding**: If the client cannot connect to the backend, you may see CORS or network errors.  
  _Resolution_: Confirm backend and client URLs/ports align and backend server is running.

## Usage Examples

### 1. Start Backend Services (API + Infrastructure)
```bash
# Move to backend directory
cd backend

# Copy and configure environment variables
cp .env.example .env    # Edit .env to set passwords, database, and API keys

# Launch Postgres and Mailhog with Docker Compose
docker-compose up -d

# Install backend dependencies
bun i

# Start backend server (API)
bun dev
```

### 2. Start Client Application
```bash
# Move to client directory
cd client

# Install frontend dependencies
npm install

# Start the React app
npm start
```

### 3. Accessing the System
- Backend API (default): `http://localhost:8080/api/v1`
- Client App UI: `http://localhost:3000`
- Mailhog Web Interface (for email testing): `http://localhost:8025`

## System Integration

```mermaid
flowchart LR
  subgraph Datastore
    postgres[(Postgres Database)]
  end

  subgraph ExternalAPIs
    cryptocompare([Cryptocompare API])
    etherscan([Etherscan API])
  end

  subgraph Infrastructure
    mailhog([Mailhog (Email Testing)])
  end

  clientUI["React Client App"]
  backendAPI["Backend API Server"]

  clientUI -- REST API calls --> backendAPI
  backendAPI -- reads/writes --> postgres
  backendAPI -- fetches data --> cryptocompare
  backendAPI -- fetches data --> etherscan
  backendAPI -- sends auth emails --> mailhog
```

### Integration Summary
- The **client app** interacts exclusively with the backend via RESTful API endpoints, handling all user-facing features and visualizations.
- The **backend API** coordinates data from both internal (Postgres) and external systems (Cryptocompare, Etherscan), issuing email events through Mailhog in development.
- **Infrastructure containers** (Postgres, Mailhog) are managed via Docker Compose for local development ease.
- Direct consumption of third-party APIs is abstracted by the backend for security and data normalization.

> By following these steps and understanding the interactions, developers can set up, extend, or troubleshoot the system efficiently.