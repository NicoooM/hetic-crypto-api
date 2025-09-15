# Environment Configuration Guide

This document explains how to configure the required environment variables for running the Hetic Crypto API backend. Proper environment variable setup is essential for both local development and deployment.

## 1. Required Environment Variables

The backend requires the following environment variables to run:

| Variable Name                    | Description                          |
|-----------------------------------|--------------------------------------|
| `JWT_ACCESS_SECRET`               | Secret key for JWT access tokens     |
| `JWT_REFRESH_SECRET`              | Secret key for JWT refresh tokens    |
| `JWT_ACCESS_TOKEN_EXPIRATION_TIME`| Access token expiry (e.g., `15m`)    |
| `JWT_REFRESH_TOKEN_EXPIRATION_TIME`| Refresh token expiry (ms, e.g., `604800000` for 7 days) |
| `SMTP_HOST`                       | SMTP server host                     |
| `SMTP_PORT`                       | SMTP server port                     |
| `SMTP_USER`                       | SMTP server username                 |
| `SMTP_PASS`                       | SMTP server password                 |
| `API_URL`                         | Base URL for the API                 |
| `CRYPTOCOMPARE_API_KEY`           | [CryptoCompare](https://min-api.cryptocompare.com/) API key |
| `ETHERSCAN_API_KEY`               | [Etherscan](https://etherscan.io/) API key |
| `CLIENT_URL`                      | URL of the frontend/client app       |
| `DATABASE_URL`                    | Full Postgres connection string      |
| `POSTGRES_USER`                   | Postgres username                    |
| `POSTGRES_PASSWORD`               | Postgres password                    |
| `POSTGRES_DB`                     | Postgres database name               |
| `PORT`                            | Port for backend to listen on        |

> **Note:** The backend will not start unless all required variables are set and non-empty.

## 2. Sample `.env` File

Copy the contents of [`backend/.env.example`](../../backend/.env.example) to `.env` in your `backend/` directory and update the values as needed:

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"
PORT=8080
CRYPTOCOMPARE_API_KEY=XXX
ETHERSCAN_API_KEY=XXX
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
API_URL=http://localhost:8080
CLIENT_URL=http://localhost:3000
```

Customize the values to match your environment (database, API keys, ports, etc.).

## 3. Docker Compose Integration

When using Docker Compose (`backend/docker-compose.yml`), the Postgres service reads its credentials directly from your `.env` file:

```yaml
services:
  postgres:
    ...
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ...
```

Be sure your `.env` is complete before running Docker Compose:

```sh
cd backend
cp .env.example .env          # if needed
# Edit .env with correct values!
docker-compose up
```

## 4. Automatic Environment Validation

The backend automatically checks your environment variables on startup. If any required variable is missing or empty, the app will exit and display an error:

```text
Missing or empty required environment variables: JWT_ACCESS_SECRET, API_URL, ...
```

## 5. Troubleshooting

- Double-check the values in your `.env` file.
- Never commit secrets or passwords to version control.
- For Mailhog setup (local email testing), see the `mailhog` service defined in `docker-compose.yml`.

## 6. Further Reading

- [CryptoCompare API Keys](https://www.cryptocompare.com/cryptopian/api-keys)
- [Etherscan API Keys](https://info.etherscan.com/api-keys/)
- [Docker Compose documentation](https://docs.docker.com/compose/environment-variables/)

> For advanced deployment or production scenarios, ensure you use unique and secure secrets for all sensitive variables.

---

**Environment variables are critical to secure and correctly running your Hetic Crypto API backend. Review and update them with care!**