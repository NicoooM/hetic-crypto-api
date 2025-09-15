# FAQ

## What environment variables are required to run the API?

The application checks for a number of required environment variables at startup. Make sure you define the following in your `.env` (or your deployment environment):

```text
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_TOKEN_EXPIRATION_TIME
JWT_REFRESH_TOKEN_EXPIRATION_TIME
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
API_URL
CRYPTOCOMPARE_API_KEY
ETHERSCAN_API_KEY
CLIENT_URL
DATABASE_URL
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
PORT
```

## How do I set token expiration times?

- **Access token expiration**  
  Controlled by `JWT_ACCESS_TOKEN_EXPIRATION_TIME`.  
- **Refresh token expiration**  
  Controlled by `JWT_REFRESH_TOKEN_EXPIRATION_TIME`.  
  By default, the refresh token expiration is set to 7 days (in milliseconds):

```ts
// backend/src/constants.ts
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days
```

You can override these values via your environment:

```env
JWT_ACCESS_TOKEN_EXPIRATION_TIME=3600000   # 1 hour in ms
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000 # 7 days in ms
```

## What are the rate-limiting defaults for authentication endpoints?

To protect against brute-force or spam requests, the app uses these rate limits:

- **Window**: 15 minutes (`AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000`)
- **Login attempts**: max 5 requests per window (`LOGIN_LIMITER_MAX_REQUESTS = 5`)
- **Registration attempts**: max 3 requests per window (`REGISTER_LIMITER_MAX_REQUESTS = 3`)

If you exceed the limit, you’ll receive a `429 Too Many Requests` response.

## What is the default bcrypt salt rounds value?

We use bcrypt to hash passwords with a default of 10 salt rounds:

```ts
export const BCRYPT_SALT_ROUNDS = 10;
```

If you want stronger hashing (at the cost of performance), you can adjust this in your code or expose it via an environment variable.

## How do I configure SMTP settings for email notifications?

Set the following SMTP variables so the server can send emails (verification, password reset, etc.):

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

## Where do I put my API keys for external services?

- `CRYPTOCOMPARE_API_KEY` for CryptoCompare
- `ETHERSCAN_API_KEY` for Etherscan

Add them to your `.env`:

```env
CRYPTOCOMPARE_API_KEY=your_crypto_compare_key
ETHERSCAN_API_KEY=your_etherscan_key
```

---

If you have other questions, please open an issue or consult the README for more details.