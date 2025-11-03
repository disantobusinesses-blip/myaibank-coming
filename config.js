/**
 * Configure the Resend API key for newsletter signups.
 *
 * You can expose the key in several ways:
 * - Set `window.RESEND_API_KEY` before this script loads.
 * - Attach a `data-resend-key` attribute to the script tag that imports this file.
 * - Inject a `<meta name="resend-api-key" content="YOUR_KEY">` tag in `index.html`.
 * - Populate `window.__ENV__`, `window.__env`, or `window.env` objects with `RESEND_API_KEY`.
 * - Edit the `FALLBACK_RESEND_KEY` constant below when working locally.
 */
(function configureResendKey(global) {
  if (typeof document === 'undefined' || !global) {
    return;
  }

  const FALLBACK_RESEND_KEY = '';

  const candidates = [];
  const pushCandidate = (value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        candidates.push(trimmed);
      }
    }
  };

  pushCandidate(global.RESEND_API_KEY);

  try {
    if (typeof RESEND_API_KEY !== 'undefined') {
      pushCandidate(String(RESEND_API_KEY));
    }
  } catch (error) {
    // Ignore reference errors when RESEND_API_KEY is not defined globally.
  }

  pushCandidate(global.__ENV__?.RESEND_API_KEY);
  pushCandidate(global.__env?.RESEND_API_KEY);
  pushCandidate(global.env?.RESEND_API_KEY);
  pushCandidate(global.process?.env?.RESEND_API_KEY);

  const currentScript = document.currentScript || document.querySelector('script[data-resend-key]');
  if (currentScript) {
    pushCandidate(currentScript.dataset?.resendKey);
    if (typeof currentScript.getAttribute === 'function') {
      pushCandidate(currentScript.getAttribute('data-resend-key'));
    }
  }

  if (candidates.length === 0) {
    const metaTag =
      document.querySelector('meta[name="resend-api-key"]') ||
      document.querySelector('meta[name="RESEND_API_KEY"]') ||
      document.querySelector('meta[property="resend-api-key"]') ||
      document.querySelector('meta[property="RESEND_API_KEY"]');
    if (metaTag) {
      pushCandidate(metaTag.content);
    }
  }

  if (candidates.length === 0) {
    pushCandidate(FALLBACK_RESEND_KEY);
  }

  if (candidates.length > 0) {
    global.RESEND_API_KEY = candidates[0];
  }
})(typeof window !== 'undefined' ? window : undefined);
