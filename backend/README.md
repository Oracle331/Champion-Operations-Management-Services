# Champion Transaction CRM Backend

Spring Boot backend for secure real estate transaction CRM operations.

## Stack

- Spring Boot 3.5.x on Java 17+
- Spring Security
- Spring Data JPA
- Flyway
- PostgreSQL
- Spring Mail
- Google OAuth account-linking endpoints

Spring Boot 4.x is current, but this backend starts on the 3.5 line to keep Java 17 compatibility and lower migration friction. The project is structured so it can move to Boot 4 later.

## Local Run

Quick local API with embedded H2:

```powershell
.\run-local.ps1
```

Local Postgres and Mailpit, if Docker Desktop is installed:

```powershell
docker compose up -d
.\mvnw.cmd spring-boot:run
```

The first run creates an admin only when `APP_BOOTSTRAP_ADMIN_EMAIL` and `APP_BOOTSTRAP_ADMIN_PASSWORD` are set.

## Important Environment Variables

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `APP_BOOTSTRAP_ADMIN_EMAIL`
- `APP_BOOTSTRAP_ADMIN_PASSWORD`
- `APP_TOKEN_ENCRYPTION_KEY_BASE64`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_MAPS_API_KEY`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_FROM`
- `SESSION_COOKIE_SECURE`

## API Areas

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET /api/auth/csrf`
- `GET /api/users`
- `POST /api/users`
- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/transactions/{id}`
- `POST /api/transactions/{id}/comments`
- `POST /api/transactions/{id}/access`
- `POST /api/transactions/{id}/buyers`
- `PATCH /api/transactions/{id}/buyers/{partyId}`
- `GET /api/workflow-rules`
- `POST /api/workflow-rules`
- `GET /api/workflow-rules/audit`
- `GET /api/integrations/google/setup`
- `GET /api/integrations/google/authorize`
- `GET /api/integrations/google/callback`
- `GET /api/email/outbox`
- `POST /api/email/outbox`
- `POST /api/email/outbox/{id}/send`
