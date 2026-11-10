# Deploying the CRM

1. Build the root Dockerfile and run the container with `SPRING_PROFILES_ACTIVE=prod`.
2. Set `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` for PostgreSQL. Configure `APP_BOOTSTRAP_ADMIN_EMAIL` and `APP_BOOTSTRAP_ADMIN_PASSWORD` for the first admin account.
3. Point your chosen hostname, such as `app.example.com`, at the DNS target from your host. Enable HTTPS and set `SESSION_COOKIE_SECURE=true`.
4. Set `APP_CORS_ALLOWED_ORIGIN` to your HTTPS origin. Check `/api/health` after deployment.

Set integration credentials in the host environment. For Google account linking, set `GOOGLE_REDIRECT_URI` to the hosted callback, for example `https://app.example.com/api/integrations/google/callback`. Add the same URI to your OAuth client and set `APP_TOKEN_ENCRYPTION_KEY_BASE64` to a Base64-encoded 32-byte key.

See [Google Workspace setup](GOOGLE_WORKSPACE_SETUP.md) and [lead intake setup](LEADS_AIRTABLE_MAKE_SETUP.md) for optional integrations. If the app sends mail from your domain, use the SPF and DKIM records from your mail provider and configure DMARC for that domain.
