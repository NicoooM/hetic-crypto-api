# FAQ

## Environment Variables

### What environment variables are required?
The API expects the following variables to be defined (e.g., in a `.env` file):

- `JWT_ACCESS_SECRET`  
- `JWT_REFRESH_SECRET`  
- `JWT_ACCESS_TOKEN_EXPIRATION_TIME` (in milliseconds)  
- `JWT_REFRESH_TOKEN_EXPIRATION_TIME` (in milliseconds)  
- `SMTP_HOST`  
- `SMTP_PORT`  
- `SMTP_USER`  
- `SMTP_PASS`  
- `API_URL`  
- `CLIENT_URL`  
- `CRYPTOCOMPARE_API_KEY`  
- `ETHERSCAN_API_KEY`  
- `DATABASE_URL`  
- `POSTGRES_USER`  
- `POSTGRES_PASSWORD`  
- `POSTGRES_DB`  
- `PORT`

### How do I catch missing or empty variables?
At startup, the project calls `verifyEnv()` (in `backend/src/utils/verify-env.ts`). It will throw an error if any required variable is missing or blank:

```bash
Error: Missing or empty required environment variables: SMTP_PASS, DATABASE_URL
```

Ensure all entries are present and non-empty before running the server.

### Sample `.env` file

```dotenv
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=900000       # 15 minutes
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000   # 7 days
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=supersecret
API_URL=https://api.yourdomain.com
CLIENT_URL=https://app.yourdomain.com
CRYPTOCOMPARE_API_KEY=abc123
ETHERSCAN_API_KEY=xyz789
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=dbname
PORT=4000
```

## JWT Configuration

### How long do tokens live?
- **Access tokens**: Set via `JWT_ACCESS_TOKEN_EXPIRATION_TIME` (ms).  
- **Refresh tokens**: Default is `7 * 24 * 60 * 60 * 1000` ms (7 days), defined in `JWT_REFRESH_TOKEN_EXPIRATION_TIME`.

## Security & Rate Limiting

### What Bcrypt salt rounds are used?
By default, the app uses `BCRYPT_SALT_ROUNDS = 10` for hashing passwords.

### How are login/register attempts limited?
- Window: `15 minutes` (`AUTH_LIMITER_WINDOW_MS = 15 * 60 * 1000`)  
- Max login attempts: `5` requests  
- Max register attempts: `3` requests  

These values are defined in `backend/src/constants.ts` and can be adjusted there.

## Email & Notifications

Why SMTP?
The API sends transactional emails (e.g., password resets, confirmations). Configure your SMTP server credentials via `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`.

## Crypto & Blockchain Integrations

- `CRYPTOCOMPARE_API_KEY`: Required to fetch price data from CryptoCompare.  
- `ETHERSCAN_API_KEY`: Required to query on-chain data via Etherscan.  

Keep these keys secure and do not commit them to version control.

---

Still have questions? Check the code in `backend/src/constants.ts` and `backend/src/utils/verify-env.ts` for default values and validation logic.