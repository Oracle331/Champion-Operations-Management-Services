# Google Workspace Setup

## Current features

- `/api/integrations/google/setup`
- `/api/integrations/google/authorize`
- `/api/integrations/google/callback`
- Server-side authorization-code exchange.
- Encrypted refresh-token storage.
- Local `GOOGLE_REDIRECT_URI=http://localhost:8080/api/integrations/google/callback`.

## Google Cloud setup

1. Create or choose a Google Cloud project.
2. Enable the Gmail API.
3. Enable the Google Calendar API.
4. Enable the Street View Static API if you want automatic property-photo fallback.
5. Configure OAuth consent.
6. Create an OAuth Web Client.
7. Add authorized redirect URIs:
   - Local: `http://localhost:8080/api/integrations/google/callback`
   - Hosted: `https://app.example.com/api/integrations/google/callback`
8. Create or choose a restricted Google Maps API key for Street View Static API.
9. Copy the client ID, client secret, and Maps API key into `backend/.env` locally and into host environment variables in production.

## Current Scopes

- `openid`
- `profile`
- `email`
- `https://www.googleapis.com/auth/calendar.events`
- `https://www.googleapis.com/auth/gmail.send`

These are intentionally narrow for first-pass scheduling and email sending.

## Street View Fallback

Set `GOOGLE_MAPS_API_KEY` after enabling the Street View Static API. The frontend does not receive this key; it requests `/api/properties/street-view`, and Spring requests the image from Google.
