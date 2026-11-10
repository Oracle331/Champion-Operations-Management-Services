# Champion Transaction CRM

Web-based CRM prototype for managing Maryland, D.C., and Virginia residential real estate transaction timelines for Champion Operations.

## Current Shape

- Spring Boot hosts the CRM frontend and API together on one origin.
- Frontend source remains in `index.html`, `styles.css`, and `app.js`, and the Maven build copies those files into Spring static resources.
- The legacy dependency-free Node backend in `server.js` is no longer the local run path.

## Run Locally

Start the Spring-hosted app:

```powershell
npm start
```

Then open http://127.0.0.1:8080.

Prerequisites:

- Java 17 or newer. This machine currently has JDK 24.
- Maven is not required globally; the project includes `backend/mvnw.cmd`.
- Docker Desktop is optional. Use it for local Postgres/Mailpit, or use the default H2 dev profile for quick local API testing.

You can also start it directly:

```powershell
cd backend
.\run-local.ps1
```

Then open http://127.0.0.1:8080. This serves the CRM frontend and Spring API from the same local origin.

This repo now has an ignored `backend/.env` with generated local secrets for development. Do not commit that file.

Optional local Postgres/Mailpit run:

```powershell
cd backend
docker compose up -d
.\mvnw.cmd spring-boot:run
```

Health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8080/api/health
```

To point the frontend at the Spring API while it is running on `127.0.0.1:8080`:

```javascript
localStorage.setItem("champion-api-base", "http://127.0.0.1:8080");
location.reload();
```

Use the same host style for frontend and backend, for example `127.0.0.1` with `127.0.0.1`, so browser cookies behave predictably.

## Spring Backend Capabilities

- BCrypt-hashed database users with `ADMIN`, `AGENT`, `BUYER`, and `SELLER` roles.
- Access-section user provisioning with admin-controlled staff creation and agent-limited buyer/seller creation.
- Server-side session cookies with HttpOnly and SameSite settings.
- CSRF token endpoint for browser state-changing requests.
- CORS allowlist for local frontend ports.
- User provisioning endpoints for agents/admins.
- Transaction records, parties, multiple buyers, buyer status resets/removals, scoped transaction access, and comments.
- Versioned workflow rules with source URLs and a starter audit endpoint.
- Google Workspace account-linking endpoints with encrypted refresh-token storage.
- Email outbox with SMTP send support for local demos through Mailpit.
- Guest timeline links using `?guest=TOKEN`, restricted to a single read-only transaction timeline.
- Street View image fallback through the Spring backend when no listing photo is provided.
- Lead intake with Airtable mirroring and Make.com webhook delivery for email/SMS automation.

See [`docs/ACCESS_AND_USER_PROVISIONING.md`](docs/ACCESS_AND_USER_PROVISIONING.md) for the current role policy and the future `ALLOW_AGENT_AGENT_PROVISIONING` switch.

## Google And Email Setup

To finish Google Calendar and Gmail automation:

1. Create a Google Cloud project.
2. Enable the Gmail API and Google Calendar API.
3. Configure OAuth consent.
4. Create an OAuth Web Client.
5. Add redirect URIs:
   - Local: `http://localhost:8080/api/integrations/google/callback`
   - Hosted: `https://app.yourdomain.com/api/integrations/google/callback`
6. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.
7. Set `APP_TOKEN_ENCRYPTION_KEY_BASE64` to a 32-byte Base64 key.
8. Enable Street View Static API and set `GOOGLE_MAPS_API_KEY` for property-photo fallback.
9. Keep scopes narrow: Calendar events plus Gmail send are enough for the first automation pass.
10. Before sending from a real domain, configure SPF, DKIM, and DMARC.

## Lead Intake Integrations

See [`docs/LEADS_AIRTABLE_MAKE_SETUP.md`](docs/LEADS_AIRTABLE_MAKE_SETUP.md) for the Airtable field mapping, Personal Access Token setup, Make.com custom webhook setup, and payload shape. Configure `AIRTABLE_*` and `MAKE_*` only in the backend environment; the frontend never receives those credentials.

## Hosting Path

For the first demoable hosted version, my recommendation is **Render Web Service + managed Postgres** because it is the most direct path for a Spring Boot Docker app, environment variables, health checks, HTTPS, and a custom subdomain. Railway is also fast for prototypes. Fly.io is strong if you want more infrastructure control.

This repo includes a root `Dockerfile` that packages the frontend into the Spring app so the demo can run from one HTTPS origin.

The Squarespace website can stay where it is. For the CRM, create a subdomain such as `app.championoperations.com` and add the host-provided CNAME in Squarespace DNS. Once HTTPS is active, set the hosted Google redirect URI to `https://app.championoperations.com/api/integrations/google/callback`.

## Product Notes

The visible app focuses on CRM operations: dashboard, transactions, workflows, messages, access, integrations, and audit. Product-positioning and deployment notes are now kept in docs instead of separate app tabs.

The strongest differentiation path remains a DMV-specific transaction operations tool: jurisdiction-linked MD/DC/VA rules, source-backed workflow audits, secure guest portals, multi-buyer state handling, property media/map context, and low-cost setup that can scale into a proper Spring/Postgres platform.

## Source Anchors

The workflow rules are reminders, not legal advice. Before production use, review all forms, contract clauses, brokerage policy, and jurisdiction rules with counsel.

- EPA lead disclosure: https://www.epa.gov/lead/real-estate-disclosures-about-potential-lead-hazards
- Maryland disclosure/disclaimer: https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=10-702&enactments=false
- Maryland HOA resale disclosures: https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=11B-106&enactments=false
- Maryland condo resale certificate: https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=11-135&enactments=false
- D.C. seller disclosure timing: https://code.dccouncil.gov/us/dc/council/code/sections/42-1302
- D.C. TOPA offer of sale: https://code.dccouncil.gov/us/dc/council/code/sections/42-3404.03
- D.C. condo resale materials: https://code.dccouncil.gov/us/dc/council/code/sections/42-1904.11
- Virginia property disclosure timing: https://law.lis.virginia.gov/vacode/title55.1/chapter7/section55.1-709/
- Virginia buyer due diligence disclosure: https://law.lis.virginia.gov/vacode/title55.1/chapter7/section55.1-703/
- Virginia Resale Disclosure Act: https://law.lis.virginia.gov/vacodefull/title55.1/chapter23.1/
- Champion Operations brand reference: https://www.championoperations.com
