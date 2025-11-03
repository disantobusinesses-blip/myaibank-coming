function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const submitButton = document.getElementById('newsletter-submit');
  const hint = document.getElementById('newsletter-hint');
  const success = document.getElementById('newsletter-success');
  const error = document.getElementById('newsletter-error');

  const statusElements = { submitButton, hint, success, error };
  let status = 'idle';

  const setStatus = (newStatus, message = '') => {
    status = newStatus;
    if (submitButton) {
      submitButton.disabled = status === 'submitting';
      submitButton.textContent = status === 'submitting' ? 'Joining…' : 'Join the waitlist';
    }
    if (hint) hint.hidden = status !== 'idle';
    if (success) success.hidden = status !== 'success';
    if (error) {
      error.hidden = status !== 'error';
      error.textContent = status === 'error' ? message : '';
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput?.value?.trim() ?? '';
    if (!email || !email.includes('@')) {
      setStatus('error', 'Please enter a valid email address.');
      return;
    }

    setStatus('submitting');

    try {
      const resendKey = import.meta.env.VITE_RESEND_API_KEY;
      const audienceId = import.meta.env.VITE_RESEND_AUDIENCE_ID;

      if (!resendKey) {
        setStatus('error', 'Missing VITE_RESEND_API_KEY.');
        return;
      }
      if (!audienceId) {
        setStatus('error', 'Missing VITE_RESEND_AUDIENCE_ID.');
        return;
      }

      const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok && response.status !== 409) {
        const data = await response.json().catch(() => ({}));
        setStatus('error', data.message || 'Could not save contact. Try again.');
        return;
      }

      emailInput.value = '';
      setStatus('success');
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error', 'Network issue. Please try again.');
    }
  });
}
