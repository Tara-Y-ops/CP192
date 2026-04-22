## Momentum MVP1

Momentum is a local-demo MVP for a reflection -> action -> review loop. It is built for fast testing of the solo core flow:

`auth -> onboarding -> reflection -> action selection -> complete -> review -> dashboard/history`

The current implementation is optimized for demo use:

- lightweight cookie-based demo login
- persistent per-browser demo data in HTTP-only cookies
- fixed reflection prompts
- AI action suggestions with a deterministic fallback when `OPENAI_API_KEY` is missing
- status flow: `reflecting -> pending -> completed -> reviewed`

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional AI Setup

Set:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
```

If no API key is present, the app still works and generates local fallback suggestions.

## Demo Notes

- Demo sessions are local to the browser via an HTTP-only cookie.
- Demo data is also stored per browser in HTTP-only cookies, so it works on serverless hosting.
- History is intentionally bounded because this is still a demo build.
- `supabase/schema.sql` is included as the matching schema if you want to move the MVP to Supabase later.

## API Surface

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/profile`
- `POST /api/cycles`
- `POST /api/cycles/:id/generate-actions`
- `POST /api/cycles/:id/select-action`
- `POST /api/cycles/:id/complete`
- `POST /api/cycles/:id/review`
- `GET /api/dashboard`
- `GET /api/history`

## Acceptance Scenarios

- New user completes onboarding and reaches the dashboard
- User creates one reflection and gets 3 action options
- User chooses either AI or custom action
- User marks the action complete and submits the review
- Dashboard and history persist across refreshes
- AI failure still leaves a usable custom-action path
