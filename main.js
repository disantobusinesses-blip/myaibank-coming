import { Analytics } from '@vercel/analytics/next';

const env = (typeof process !== 'undefined' && process.env) || {};
const BREVO_API_BASE_URL = env.BREVO_API_BASE_URL || 'https://api.brevo.com/v3';
const BREVO_CONTACT_LIST_ID = Number.parseInt(env.BREVO_CONTACT_LIST_ID ?? '', 10);

function getBrevoApiKey() {
  const apiKey = env.BREVO_API_KEY;
  return typeof apiKey === 'string' ? apiKey.trim() : '';
}

function getBrevoListIds() {
  if (Number.isNaN(BREVO_CONTACT_LIST_ID)) {
    return [];
  }

  return [BREVO_CONTACT_LIST_ID];
}

function formatError(message) {
  if (!message) return 'We couldn’t save that email right now. Please try again in a moment.';
  return message;
}

function setStatus({ button, hint, success, error }, status, message = '') {
  if (button) {
    button.disabled = status === 'submitting';
    button.textContent = status === 'submitting' ? 'Joining…' : 'Join the waitlist';
  }

  if (hint) {
    hint.hidden = status !== 'idle';
  }

  if (success) {
    success.hidden = status !== 'success';
  }

  if (error) {
    error.hidden = status !== 'error';
    error.textContent = status === 'error' ? message : '';
  }
}

if (typeof window !== 'undefined') {
  try {
    Analytics();
  } catch (analyticsError) {
    console.warn('[Vercel Analytics] init failed', analyticsError);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const footerYear = document.getElementById('footer-year');

  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  const form = document.getElementById('newsletter-form');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const submitButton = document.getElementById('newsletter-submit');
  const hint = document.getElementById('newsletter-hint');
  const success = document.getElementById('newsletter-success');
  const error = document.getElementById('newsletter-error');

  const statusElements = { button: submitButton, hint, success, error };
  let status = 'idle';

  setStatus(statusElements, status);

  const resetStatus = () => {
    if (status !== 'idle') {
      status = 'idle';
      setStatus(statusElements, status);
    }
  };

  emailInput?.addEventListener('input', resetStatus);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const email = emailInput?.value?.trim() ?? '';
    if (!email) {
      status = 'error';
      setStatus(statusElements, status, 'Add a valid email address to join the newsletter.');
      return;
    }

    const apiKey = getBrevoApiKey();
    if (!apiKey) {
      status = 'error';
      setStatus(
        statusElements,
        status,
        'Newsletter signups unavailable: Brevo API key missing.'
      );
      return;
    }

    const listIds = getBrevoListIds();
    if (!listIds.length) {
      status = 'error';
      setStatus(statusElements, status, 'Newsletter signups unavailable: Brevo list not configured.');
      return;
    }

    status = 'submitting';
    setStatus(statusElements, status);

    try {
      const response = await fetch(`${BREVO_API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email,
          listIds,
          updateEnabled: true,
        }),
      });

      let responseBodyText = '';
      try {
        responseBodyText = await response.clone().text();
      } catch (readError) {
        responseBodyText = '';
      }

      console.log('[Brevo] response', response.status, responseBodyText);

      if (!response.ok) {
        let details = '';
        try {
          const payload = responseBodyText ? JSON.parse(responseBodyText) : await response.json();
          details =
            payload?.message || payload?.errors?.[0]?.message || payload?.code || '';
        } catch (parseError) {
          details = '';
        }

        status = 'error';
        setStatus(statusElements, status, formatError(details));
        return;
      }

      if (emailInput) {
        emailInput.value = '';
      }

      status = 'success';
      setStatus(statusElements, status);
    } catch (networkError) {
      console.error('[Brevo] request failed', networkError);
      status = 'error';
      setStatus(statusElements, status, 'We hit a network issue while reaching Brevo. Please try again.');
    }
  });
});
