Run the API locally while keeping the Render Postgres DB

By default this project is configured to use the same Render Postgres database
that the deployed container uses. That means you can run the API locally and it
will still connect to the Render DB.

Quick start (Linux / bash):

1. Install dependencies (if not already):

```
cd api
npm install
```

2. Run in development mode (auto-restarts):

```
npm run dev
```

3. Run in production mode:

```
PORT=3000 npm start
```

Environment variables you can set to override defaults:
- DATABASE_URL: full postgres URL (preferred), e.g. postgres://user:pass@host:5432/dbname
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME: used when DATABASE_URL is not set
- DB_SSL: set to 'true' or 'false' to explicitly enable/disable SSL (default: true)
- PORT: the port the server listens on (default: 3000)
- ACCESS_TOKEN_SECRET: secret for JWTs (default provided)

Notes:
- The project uses Sequelize with SSL enabled by default to match Render's managed Postgres.
- If your local network blocks outbound DB connections or you want to test without
  connecting to Render, you can run a local Postgres and set DATABASE_URL to point to it.
