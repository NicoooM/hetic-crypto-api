# Frontend Profile Module

## Overview
The Profile module provides end-users with a comprehensive interface to manage their personal account information and associated cryptocurrency wallets within the Hetic Crypto web application. It enables users to update their profile details, change their password, and add or remove crypto wallets—all from a centralized dashboard. This module integrates closely with authentication and backend API layers to ensure data is always consistent and user actions are securely executed.

## Key Features

- **Profile Data Management**: View and update account information such as name and email. Ensures real-time synchronization with backend profile data.
- **Password Management**: Change account passwords securely, with client-side validation and backend update, including enforcement of matching confirmation.
- **Wallet Management**: Add new cryptocurrency wallets by providing a title and address, view a list of all attached wallets, and remove wallets as needed.
- **Integrated Feedback & Error Handling**: Provides users with clear feedback and error messages for all operations, helping with troubleshooting and transparency.
- **Authentication and Navigation Integration**: Securely manages session state and redirects on sensitive actions (e.g., mandatory logout on password change).

## System Errors

- **Profile Retrieval Error**:  
  _Description_: Occurs when the frontend cannot fetch user profile data from the backend.  
  _Resolution_: Ensures API endpoint `/profile` is reachable and the user’s authentication token is valid.

- **Wallet Operations Error**:  
  _Description_: Issues encountered while fetching, adding, or deleting wallets (e.g., network problems, validation failures).  
  _Resolution_: Check API connectivity, input formatting, and ensure correct backend wallet API behavior.

- **Password Mismatch**:  
  _Description_: User’s new password and confirmation do not match during a password update attempt.  
  _Resolution_: Double-check both fields and ensure they are identical before resubmitting.

- **Password Update Error**:  
  _Description_: Backend rejects password change (e.g., invalid current password, policy violations).  
  _Resolution_: The error message from the backend will be shown; users should verify input and try again.

- **Success/Feedback Clarity**:  
  _Description_: Both successful and unsuccessful operations display contextual feedback (color-coded for clarity).  
  _Resolution_: No action needed; this helps users confirm status of their actions.

## Usage Examples

```jsx
// Display profile with wallet and authentication features
import Profile from "./pages/Profile";

// E.g., with React Router
<Route path="/profile" element={<Profile />} />

// The user can:
// - View and edit their name and email
// - Change their current password
// - Manage (add/delete) their list of wallets

// Example: Add a wallet in the Profile UI
// Fill in "Wallet title" and "Wallet address" fields, then click "Add a wallet"

// Example: Update password
// Enter old password, new password, and confirm new password, then click "Update Password"
```

## System Integration

```
┌───────────────────────┐           ┌─────────────────────┐         ┌───────────────────────┐
│   Authentication      │           │   Profile Module    │         │   Backend API Server  │
│   (useAuth hook)      │◀─────────▶│   (Profile.tsx)     │◀───────▶│  (/profile, /wallet)  │
└───────────────────────┘           └─────────────────────┘         └───────────────────────┘
          │                                │                                │
          ▼                                ▼                                ▼
 [Logout, Auth Context]      [Renders UI, Sends API Calls]      [Profile & Wallet Endpoints]
                                              │
                                              ▼
                                ┌─────────────────────────────┐
                                │  React Router Integration   │
                                │     (Navigation, Routing)   │
                                └─────────────────────────────┘
                                              │
                                              ▼
                                 ┌────────────────────┐
                                 │   End Users        │
                                 │ (Profile Page UI)  │
                                 └────────────────────┘
```

- **Dependencies**: Relies on central authentication (`useAuth`), navigation (`useNavigate`), and the service API module.
- **Process**: Interacts with backend endpoints for `/profile` and `/wallet` to fetch/update data.
- **Consumers**: Used by authenticated users who view/edit profiles and manage wallets on the frontend application.