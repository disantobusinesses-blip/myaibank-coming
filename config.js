/**
 * Configure the Brevo API key for newsletter signups.
 *
 * Replace the empty string with your public API key or assign the value at runtime
 * (for example, via a server-side template). The main script will also read
 * from meta tags named `vite-brevo-key` or `brevo-key` if you prefer HTML-based
 * configuration.
 */
if (typeof window !== 'undefined' && typeof window.VITE_BREVO_KEY === 'undefined') {
  let inferredKey = '';

  try {
    if (typeof VITE_BREVO_KEY !== 'undefined' && VITE_BREVO_KEY) {
      inferredKey = String(VITE_BREVO_KEY);
    }
  } catch (error) {
    inferredKey = '';
  }

  if (!inferredKey && typeof window !== 'undefined') {
    const inlineConfig = window.__ENV__?.VITE_BREVO_KEY || window.__env?.VITE_BREVO_KEY;
    if (inlineConfig) {
      inferredKey = String(inlineConfig);
    }
  }

  window.VITE_BREVO_KEY = inferredKey;
}
