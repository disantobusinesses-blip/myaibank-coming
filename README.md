# My AI Bank — Coming Soon

A simple "coming soon" landing page with a countdown to December 1st and a Resend-powered newsletter signup.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your Resend credentials:

   ```bash
   cp .env.example .env
   # Then edit .env to add your RESEND_API_KEY and RESEND_AUDIENCE_ID
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The site will be available at [http://localhost:3000](http://localhost:3000).

## Newsletter API

The Express server exposes two endpoints backed by the [Resend contacts API](https://resend.com/docs/api-reference/contacts):

- `POST /api/subscribe` — accepts `email`, `firstName`, and `lastName` fields in the request body and adds a contact to the configured audience.
- `GET /api/contact` — pass either an `id` or `email` query parameter to retrieve a contact from the same audience.

Both routes require `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` to be configured in the environment.
