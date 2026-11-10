# Champion Operations Management Services

I built this CRM prototype to track residential real estate transactions in Maryland, D.C., and Virginia. Agents can manage milestones, buyers and sellers, access, and messages in one workspace. A read-only guest link shows the timeline for one transaction.

## Run locally

Install a JDK (Java 17 or newer), set `JAVA_HOME`, and run this from the project root in PowerShell:

```powershell
.\backend\run-local.ps1
```

Open http://127.0.0.1:8080. The default development profile uses H2. To create a local admin, copy `backend/.env.example` to `backend/.env` and set `APP_BOOTSTRAP_ADMIN_EMAIL` and a strong `APP_BOOTSTRAP_ADMIN_PASSWORD`. Keep that file outside Git.

The Maven wrapper handles dependencies. To build and check the app with a JDK and Node installed:

```powershell
node --check app.js
cd backend
.\mvnw.cmd package
```

## Project layout

- `index.html`, `app.js`, and `styles.css` are the frontend. Maven packages them into the Spring Boot app.
- `backend/src/main` contains the Java API, security configuration, and Flyway migrations.
- `backend/compose.yaml` provides local PostgreSQL and Mailpit services. The root Dockerfile packages the app for hosting.
- `server.js` is the original Node prototype. The current launcher runs Spring Boot.

## Integrations

The app can link a Google Workspace account, send mail through SMTP, and forward leads to Airtable and Make. Configure credentials in the backend environment. See the [Google Workspace setup](docs/GOOGLE_WORKSPACE_SETUP.md), [lead intake setup](docs/LEADS_AIRTABLE_MAKE_SETUP.md), and [deployment guide](docs/HOSTING_AND_DNS.md). The [access guide](docs/ACCESS_AND_USER_PROVISIONING.md) explains the roles and who can create accounts.

Workflow rules are reminders for the transaction team. Confirm applicable deadlines against the source rules, contracts, and brokerage policies before using them in a live transaction.
