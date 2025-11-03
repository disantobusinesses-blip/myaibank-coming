# MyAiBank Coming Soon

A dark purple, glassmorphic coming-soon experience for the MyAiBank launch. The page is now delivered as plain HTML, CSS, and
vanilla JavaScript so it can run without a build step while keeping the live countdown, AI demo, and Resend-powered newsletter confirmations.

## Getting started

1. (Optional) Copy the environment template so you have a record of the Resend key you plan to use:

   ```bash
   cp .env.example .env
   # edit .env and add your Resend API key to RESEND_API_KEY
   ```

2. Provide the key to the front-end using any of these options (you can mix and match depending on your hosting setup):

   - Edit `config.js` and set the `FALLBACK_RESEND_KEY` constant to your Resend API key for local development.
   - Add a `data-resend-key="YOUR_KEY"` attribute to the `<script src="./config.js">` tag in `index.html`.
   - Populate the `<meta name="resend-api-key" content="YOUR_KEY">` tag in `index.html`.
   - Visit the site with `?resendKey=YOUR_KEY` in the URL once; the key is stored in `localStorage` and you can clear it later with `?clearResendKey`.
   - Copy `resend.config.json.example` to `resend.config.json` and add your key to the JSON. The page will fetch this automatically at runtime (you can also name the file `resend.json`).
   - Keep a `.env`, `.env.local`, or `resend.env` file with `RESEND_API_KEY=YOUR_KEY` next to `index.html`. When served statically those values are read after the first submit attempt.
   - Expose `window.RESEND_API_KEY` or `window.__ENV__.RESEND_API_KEY` before the page loads (for example via a server-side template).

3. Serve the folder with any static server (for example, Python’s built-in server) or open `index.html` directly in your
   browser:

   ```bash
   python -m http.server 8000
   # open http://localhost:8000/
   ```

Newsletter submissions trigger a welcome email via Resend so new subscribers immediately receive the budgeting template link.

## Assets

The layout ships with text placeholders where hero visuals and tool screenshots belong. When you are ready to showcase your
branding, swap the placeholder `<p>` elements in the hero and tool cards for `<img>` tags pointing at your assets.

## Structure

- `index.html` – markup for the hero, countdown, demo, and tool carousel.
- `styles.css` – dark futuristic theme with parallax, particle, and hover animations.
- `main.js` – countdown timer, newsletter submission flow, and 50/30/20 demo logic.
- `config.js` – single place to expose `window.RESEND_API_KEY` when running locally or deploying.

No build step is required; running `npm install` will simply confirm there are no Node dependencies.
