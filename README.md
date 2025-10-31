# MyAiBank Coming Soon

A dark purple, glassmorphic coming-soon experience for the MyAiBank launch. The page is built with React and Vite so we can layer on interactive features like the live countdown and newsletter opt-in.

## Getting started

1. Copy the environment template and add your Brevo public API key (Contacts > Settings > API keys):

   ```bash
   cp .env.example .env
   # edit .env and set VITE_BREVO_KEY to your Brevo public API key
   ```

2. Install dependencies and start the local dev server:

   ```bash
   npm install
   npm run dev
   ```

The site will be available at the URL Vite prints in the terminal (typically `http://localhost:5173`). Newsletter submissions will be sent to Brevo list **5** (`https://app.brevo.com/contact/list/id/5`).

## Production build

```bash
npm run build
```

The optimized assets will be written to the `dist/` directory. Preview the build with:

```bash
npm run preview
```
