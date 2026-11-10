# Hosting And DNS

## Recommendation

Use `app.championoperations.com` for the CRM and leave the public Squarespace marketing site on the root domain for now.

Best first demo stack:

- Render Web Service from the root `Dockerfile`.
- Managed Postgres on the same host.
- `SPRING_PROFILES_ACTIVE=prod`.
- HTTPS custom domain: `app.championoperations.com`.

Good alternatives:

- Railway: fastest prototype experience and automatic custom-domain SSL.
- Fly.io: good Docker-first platform when you want more control.
- AWS App Runner or Azure App Service: stronger long-term enterprise path, more setup.

## Squarespace DNS

When the app host gives you its DNS target, add it in Squarespace DNS:

- Type: `CNAME`
- Host/name: `app`
- Value/target: host-provided target, such as `your-app.onrender.com` or a Railway/Fly target.

Keep the existing root and `www` Squarespace records unless you intentionally move the main website.

## Production Environment Variables

Set these in the host dashboard:

- `SPRING_PROFILES_ACTIVE=prod`
- `APP_CORS_ALLOWED_ORIGIN=https://app.championoperations.com`
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `APP_BOOTSTRAP_ADMIN_EMAIL`
- `APP_BOOTSTRAP_ADMIN_PASSWORD`
- `APP_BOOTSTRAP_ADMIN_NAME`
- `APP_TOKEN_ENCRYPTION_KEY_BASE64`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI=https://app.championoperations.com/api/integrations/google/callback`
- `GOOGLE_MAPS_API_KEY`
- `AIRTABLE_PERSONAL_ACCESS_TOKEN`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME=Leads`
- `MAKE_NEW_LEAD_WEBHOOK_URL`
- `MAKE_WEBHOOK_API_KEY` (only if API key authentication is enabled on the Make webhook)
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_FROM`
- `SESSION_COOKIE_SECURE=true`

## Email DNS

The exact SPF, DKIM, and DMARC records depend on the sender you choose.

For Google Workspace sending, SPF usually starts with:

```text
v=spf1 include:_spf.google.com ~all
```

DKIM is generated in Google Admin or the email provider dashboard. DMARC can start in monitoring mode:

```text
v=DMARC1; p=none; rua=mailto:dmarc@championoperations.com
```

Move DMARC toward `quarantine` or `reject` after mail flow is verified.
