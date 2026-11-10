# Leads, Airtable, And Make.com

The Spring app now stores every lead in its own database table. When an agent creates a lead, the backend attempts two independent deliveries:

- Airtable: creates or updates one record in the configured base and table.
- Make.com: posts one `lead.created` JSON event to a custom webhook. The Make scenario can branch to an email module and an SMS module.

An Airtable or Make outage does not discard the lead. The Leads screen shows each delivery status and exposes `Retry integrations` when either delivery fails.

## Airtable

Create a base with a table named `Leads`, or change `AIRTABLE_TABLE_NAME` to match your table. The simplest setup is to create these fields as text or long-text fields:

`Name`, `Email`, `Phone`, `Lead Type`, `Status`, `Source`, `Property Address`, `Jurisdiction`, `Notes`, `CRM Lead ID`, and `Created At`.

Create an Airtable Personal Access Token with access limited to this base and record-write permission. Airtable no longer accepts legacy user API keys for this use case. See the [Airtable API guide](https://support.airtable.com/docs/api) and [Personal Access Token guide](https://support.airtable.com/docs/creating-personal-access-tokens).

Set these backend environment variables:

```text
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat...
AIRTABLE_BASE_ID=app...
AIRTABLE_TABLE_NAME=Leads
```

The token is read only by Spring. It is never sent to the browser.

## Make.com

Create a Make scenario beginning with **Webhooks > Custom webhook**, copy its URL, and set:

```text
MAKE_NEW_LEAD_WEBHOOK_URL=https://hook.us1.make.com/...
MAKE_WEBHOOK_API_KEY=
```

If API key authentication is enabled on the Make webhook, put the key in `MAKE_WEBHOOK_API_KEY`. The app sends it as the `x-make-apikey` header.

The webhook payload has this shape:

```json
{
  "eventType": "lead.created",
  "eventId": "database-lead-id",
  "occurredAt": "2026-07-27T12:00:00Z",
  "channels": ["email", "sms"],
  "lead": {
    "name": "Jordan Smith",
    "email": "jordan@example.com",
    "phone": "202-555-0147",
    "leadType": "BUYER",
    "status": "NEW",
    "source": "Website",
    "propertyAddress": "Washington, DC",
    "jurisdiction": "DC",
    "notes": "Looking this fall"
  }
}
```

`channels` only includes `email` when an email is present and `sms` when a phone number is present. In Make, add an email module and an SMS provider module after the webhook, then use filters based on `channels`. Common SMS choices are Twilio, Telnyx, or MessageBird. The CRM does not store those provider credentials.

Make's [custom webhook documentation](https://help.make.com/webhooks) covers webhook authentication, request headers, data structures, and scenario response behavior.

## Local testing

1. Add the variables to `backend/.env`.
2. Start the Spring app with `npm start`.
3. Open `http://127.0.0.1:8080/`, sign in as an agent, and select **Leads**.
4. Submit a test lead with both an email and phone number.
5. Confirm the Airtable record and the Make webhook bundle before activating outbound SMS/email steps.

For production, move the variables into the host's secret environment settings and use a separate Airtable base and Make scenario from local development.
