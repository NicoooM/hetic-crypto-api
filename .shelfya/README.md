# Shelfya Configuration

This directory holds the configuration and deployment settings for Shelfya. Use it to define how your backend and frontend services are built, deployed, and run on Shelfya’s platform.

## Required Files

- `shelfya.yml`  
  Defines build steps, services, environment variables, and routing.  
- `.env` (or use Shelfya’s dashboard env settings)  
  Holds your environment variables (see below).

## Environment Variables

Configure these in Shelfya’s environment settings or in your local `.env` file:

- **PORT**  
  The port on which the Express backend listens (e.g., `5000`).

- **CLIENT_URL**  
  The allowed CORS origin for your backend (e.g., `https://your-app.com`).

- **REACT_APP_API_BASE_URL**  
  The base URL your React client uses to send API requests (e.g., `https://your-api.com/api/v1`).

## Example shelfya.yml

```yaml
version: "1.0"
services:
  backend:
    path: ../backend
    build:
      install: npm install
      start: npm run start
    env:
      PORT: 5000
      CLIENT_URL: https://your-app.com

  frontend:
    path: ../client
    build:
      install: npm install
      build: npm run build
      start: npm run serve
    env:
      REACT_APP_API_BASE_URL: https://your-api.com/api/v1

routes:
  - service: frontend
    path: /
  - service: backend
    path: /api/v1
```

## Deploying

1. Commit your `shelfya.yml` and push to your Git repository.
2. On Shelfya’s dashboard, connect your repo and branch.
3. Verify that the environment variables match those in this folder.
4. Trigger a deployment; Shelfya will handle build and routing.

For more details, visit Shelfya’s documentation: https://docs.shelfya.com/overview.