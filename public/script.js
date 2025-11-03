const countdownElements = {
  days: document.getElementById('countdown-days'),
  hours: document.getElementById('countdown-hours'),
  minutes: document.getElementById('countdown-minutes'),
  seconds: document.getElementById('countdown-seconds'),
};

const subscribeForm = document.getElementById('subscribe-form');
const subscribeMessage = document.getElementById('subscribe-message');
const yearElement = document.getElementById('year');

const getNextDecemberFirst = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const decemberFirstThisYear = new Date(currentYear, 11, 1, 0, 0, 0, 0);

  if (now < decemberFirstThisYear) {
    return decemberFirstThisYear;
  }

  return new Date(currentYear + 1, 11, 1, 0, 0, 0, 0);
};

const targetDate = getNextDecemberFirst();

const updateCountdown = () => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdownElements.days.textContent = '0';
    countdownElements.hours.textContent = '0';
    countdownElements.minutes.textContent = '0';
    countdownElements.seconds.textContent = '0';
    return;
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  countdownElements.days.textContent = String(days);
  countdownElements.hours.textContent = String(hours).padStart(2, '0');
  countdownElements.minutes.textContent = String(minutes).padStart(2, '0');
  countdownElements.seconds.textContent = String(remainingSeconds).padStart(2, '0');
};

updateCountdown();
setInterval(updateCountdown, 1000);

yearElement.textContent = new Date().getFullYear();

const setMessage = (message, variant = 'info') => {
  subscribeMessage.textContent = message;
  subscribeMessage.classList.remove('newsletter__message--success', 'newsletter__message--error');

  if (variant === 'success') {
    subscribeMessage.classList.add('newsletter__message--success');
  }

  if (variant === 'error') {
    subscribeMessage.classList.add('newsletter__message--error');
  }
};

subscribeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(subscribeForm);
  const payload = {
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
  };

  if (!payload.email) {
    setMessage('Please provide a valid email address.', 'error');
    return;
  }

  setMessage('Submitting your subscription...');

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message ?? 'Unable to subscribe right now.');
    }

    setMessage(result?.message ?? 'Thanks for subscribing!', 'success');
    subscribeForm.reset();
  } catch (error) {
    setMessage(error.message || 'Subscription failed. Please try again later.', 'error');
  }
});
