/**
 * Configure the Brevo API key for newsletter signups.
 *
 * You can expose the key in several ways:
 * - Set `window.VITE_BREVO_KEY` before this script loads.
 * - Attach a `data-brevo-key` attribute to the script tag that imports this file.
 * - Inject a `<meta name="vite-brevo-key" content="YOUR_KEY">` tag in `index.html`.
 * - Populate `window.__ENV__`, `window.__env`, or `window.env` objects with `VITE_BREVO_KEY`.
 * - Edit the `FALLBACK_BREVO_KEY` constant below when working locally.
 */
(function configureBrevoKey(global) {
  if (typeof document === 'undefined' || !global) {
    return;
  }

  const FALLBACK_BREVO_KEY = '';

  const candidates = [];
  const pushCandidate = (value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        candidates.push(trimmed);
      }
    }
  };

  pushCandidate(global.VITE_BREVO_KEY);

  try {
    if (typeof VITE_BREVO_KEY !== 'undefined') {
      pushCandidate(String(VITE_BREVO_KEY));
    }
  } catch (error) {
    // Ignore reference errors when VITE_BREVO_KEY is not defined globally.
  }

  pushCandidate(global.__ENV__?.VITE_BREVO_KEY);
  pushCandidate(global.__env?.VITE_BREVO_KEY);
  pushCandidate(global.env?.VITE_BREVO_KEY);

  const currentScript = document.currentScript || document.querySelector('script[data-brevo-key]');
  if (currentScript) {
    pushCandidate(currentScript.dataset?.brevoKey);
    if (typeof currentScript.getAttribute === 'function') {
      pushCandidate(currentScript.getAttribute('data-brevo-key'));
    }
  }

  if (candidates.length === 0) {
    const metaTag =
      document.querySelector('meta[name="vite-brevo-key"]') ||
      document.querySelector('meta[name="brevo-key"]') ||
      document.querySelector('meta[property="vite-brevo-key"]') ||
      document.querySelector('meta[property="brevo-key"]');
    if (metaTag) {
      pushCandidate(metaTag.content);
    }
  }

  if (candidates.length === 0) {
    pushCandidate(FALLBACK_BREVO_KEY);
  }

  if (candidates.length > 0) {
    global.VITE_BREVO_KEY = candidates[0];
  }
})(typeof window !== 'undefined' ? window : undefined);
