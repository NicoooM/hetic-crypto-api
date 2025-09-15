# Client Usage Guide

This guide explains how to use the client-side application of the HETIC Crypto API project. Learn how to register, log in, manage your profile and wallets, visualize your portfolio, generate crypto fiscal reports, and more.

---

## Getting Started

### Installation & Launch

1. **Install dependencies**

   ```
   cd client
   npm install
   ```

2. **Start the front-end server**

   ```
   npm start
   ```

3. Open your browser at `http://localhost:3000`.

---

## Main Features

### 1. Authentication

- **Register:**  
  Go to `/register`. Fill in your **email**, **name**, **password**, and **confirm password**.  
  Example:
  ```plaintext
  Email: your@email.com
  Name: John Doe
  Password: ********
  Confirm Password: ********
  ```

- **Login:**  
  Go to `/login`. Enter your **email** and **password** to access your dashboard.

---

### 2. Profile & Wallet Management

- **Access:** `/profile` (login required)
- **Actions:**
  - **Edit Profile:** Update your name or email.
  - **Change Password:** Enter your old and new passwords. You’ll be logged out after updating.
  - **My Wallets:**  
    - **Add:** Enter a wallet title and address, then click "Add a wallet".
      ```
      Wallet title: Binance Main
      Wallet address: 0x123abc...
      ```
    - **Remove:** Click the trash icon next to an existing wallet.

---

### 3. Dashboard

- **Access:** `/dashboard` (login required)
- **Features:**
  - **Select Wallet:** Choose among your wallets via dropdown.
  - **Portfolio Value Chart:** See how your portfolio value has changed over time.
  - **Time Range:** Switch between periods (`7D`, `1M`, etc.). Some short periods like `1H` and `24H` may be disabled.
  - **Portfolio Overview:** View allocation, price, daily variation, and value.

Example:
```plaintext
| Allocation | Prix   | Variation 24h | Valeur   | Variation Valeur 24h |
|------------|--------|---------------|----------|----------------------|
|   100%     | 30000€ |   +2.5%       | 45000€   |       +1125€         |
```

---

### 4. Fiscal (Tax) Reporting

- **Access:** `/fiscalite`
- **Features:**
  - **View Sample Transactions:** List of deposit/withdraw actions with corresponding price, amount, date, fees, and calculated capital gains ("plus-value").
  - **Fiscal Summary:**  
    - Total capital gains.
    - Taxable amount (30% of gains).
  - **Export:** Click "Générer le PDF" to download a report of your transactions and gains.

---

### 5. Transaction Visualization

- **Access:** `/graph`
- **Features:**  
  Visualize your transaction history graphically. Helpful for spotting trends in your deposits and withdrawals.

---

## Navigation Quick Reference

- `/` – Home
- `/login` – Log in
- `/register` – Register a new account
- `/dashboard` – View portfolio and charts
- `/profile` – Manage user profile and wallets
- `/fiscalite` – Crypto capital gains/tax reporting
- `/graph` – Transaction graph visualization

*Note: Some pages require authentication. Use your credentials to access protected routes.*

---

## Tips

- For the best experience, keep your wallets updated on your profile.
- Export your fiscal report before closing tax season.
- If you encounter any issues, try reloading the page or logging out and in again.

---

## Support

For technical help or bug reports, please refer to the [repository issues page](https://github.com/NicoooM/hetic-crypto-api/issues).

---

Happy investing!