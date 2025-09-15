# Frequently Asked Questions (FAQ)

Welcome to the FAQ for **Monolith**, your all-in-one wallet tracker for cryptocurrencies. Below you'll find answers to common questions about using the API and client application.

## What is Monolith?

Monolith is a project that helps you track, visualize, and analyze your cryptocurrency wallets. It uses APIs from Cryptocompare and Etherscan to gather and present data about your assets.

## How do I create an account?

To register, use the API or the web client:

- **API Route:**  
  `POST /api/v1/auth/register`
- **Web Client:**  
  Go to `/register` and fill out the registration form.

After registering, you'll receive a verification email. Use the link provided, or:

- **API Route:**  
  `GET /api/v1/auth/verify-email/<token>`
- **Web Client:**  
  Visit `/verify-email/<token>`

## How do I log in or out?

- **API:**
    - Log in: `POST /api/v1/auth/login`
    - Log out: `POST /api/v1/auth/logout`
- **Web Client:**  
  Use the `/login` page.

## How can I manage my wallets?

- **Add a Wallet:**  
  `POST /api/v1/` (API)
- **List my Wallets:**  
  `GET /api/v1/` (API)
- **Delete a Wallet:**  
  `DELETE /api/v1/wallet/<walletId>` (API)

After logging in through the client dashboard (`/dashboard`), you can view and manage your wallets.

## How do I see my wallet data and history?

- **Wallet History:**  
  `GET /api/v1/history/<walletId>`
- **Wallet Statistics:**  
  `GET /api/v1/portfolio/<walletId>`

Visit `/dashboard` on the client to access visualizations.

## How do I update my profile or password?

- **Profile Information:**  
  - Get: `GET /api/v1/`
  - Update: `PATCH /api/v1/`
- **Change Password:**  
  `PATCH /api/v1/password`

On the client, use `/profile` to view or update your personal data.

## Is there support for taxes and graphs?

Yes! The client has:

- `/fiscalite`: Tax features and PDF generation (not linked to the API)
- `/graph`: Transaction graphs (not linked to the API)

## What if I need to refresh my access token?

- **API Route:**  
  `POST /api/v1/auth/refresh-access-token`

## Where can I find the dashboard?

- **URL:** `/dashboard`  
This is your main hub to track your portfolios and assets.

## Still need help?

If you have questions not answered here, please check the project documentation or contact the development team.