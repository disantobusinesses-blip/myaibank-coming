/**
 * Configure the Brevo API key for newsletter signups.
 *
 * Replace the empty string with your public API key or assign the value at runtime
 * (for example, via a server-side template). The main script will also read
 * from meta tags named `vite-brevo-key` or `brevo-key` if you prefer HTML-based
 * configuration.
 */
if (typeof window !== 'undefined' && typeof window.VITE_BREVO_KEY === 'undefined') {
  window.VITE_BREVO_KEY = '';
}
