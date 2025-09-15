# Backend Service Guide

This guide presents an overview of the core backend services powering your crypto portfolio application. Each service encapsulates a distinct domain of functionality—authentication, email, profile management, portfolio data, token handling, wallet management, and history tracking. Understanding these services helps you extend, integrate, and maintain the backend more efficiently.

## Auth Service

Handles user authentication, registration, and token lifecycle.

### Main Features

- **Login**: Validates credentials and email verification. Issues access and refresh tokens.
- **Register**: Creates a new user, hashes passwords, sends verification email.
- **Email Verification**: Marks user’s email as verified by validating a token.
- **Token Refresh**: Issues a new access token using a valid refresh token.
- **Logout**: Deletes the refresh token, effectively logging the user out.

#### Example: Register Flow

```typescript
const authService = new AuthService();
await authService.register({ name: "Alice", email: "alice@example.com", password: "secret" });
```

#### Example: Login Flow

```typescript
const tokens = await authService.login({ email: "alice@example.com", password: "secret" });
// tokens = { accessToken: "...", refreshToken: "..." }
```

## Email Service

Handles outbound email delivery, primarily used for email verification.

- Uses SMTP transport via nodemailer.
- Sends verification email containing a link with a JWT token.

#### Example

```typescript
const emailService = new EmailService();
await emailService.sendVerificationEmail("user@example.com", "jwt_token");
```

## History Service

Retrieves transaction and balance history for wallets.

- Supports filtering via `FiltersSchema`.

#### Example

```typescript
const historyService = new HistoryService();
const history = await historyService.get({ walletId: 1 });
```

## Profile Service

Manages user profile data and password changes.

- **Get**: Retrieve user's name and email.
- **Edit**: Update name/email; triggers re-verification if email changes.
- **Reset Password**: Change user's password by validating the old password.

#### Example: Edit Profile

```typescript
await profileService.edit({ id: 1, name: "Alice B", email: "aliceb@example.com" });
```

## Portfolio Service

Fetches the current status and analytics for a wallet.

- Retrieves wallet info, current ETH price, yesterday’s price, calculates wallet value and daily changes.
- Integrates with external APIs (CryptoCompare, Etherscan).

#### Example

```typescript
const portfolioService = new PortfolioService();
const info = await portfolioService.get(walletId);
```

## Token Service

Handles JWT access and refresh token creation and persistence.

- **Generate Access Token**: For API authentication.
- **Generate Refresh Token**: For session renewal.
- **Save Refresh Token**: Persist token in database.

#### Example

```typescript
const tokenService = new TokenService();
const accessToken = tokenService.generateAccessToken({ id: "1", email: "user@example.com" });
const refreshToken = tokenService.generateRefreshToken({ id: "1" });
await tokenService.saveRefreshToken(refreshToken, 1);
```

## Wallet Service

Manages wallet creation, deletion, and retrieval.

- **Create**: Adds a new wallet, initializes historical data.
- **Delete**: Removes wallet and associated history.
- **All**: Lists all wallets for a user.

#### Example: Create Wallet

```typescript
await walletService.create({ id: 1, address: "0x...", title: "Main ETH Wallet" });
```

---

## Next Steps

- Refer to the API schema for input/output data structures.
- Ensure environment variables for secrets and API keys are correctly set ([.env reference](../env.md) if available).
- See individual service files for custom error handling and advanced customization.

For further details, explore the codebase inside `backend/src/services/`, or reach out to maintainers with specific integration questions.