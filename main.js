const RESEND_STORAGE_KEY = 'myaibank.resendKey';
const RESEND_FROM_EMAIL = 'MyAiBank Launch <launch@myaibank.ai>';
const RESEND_SUBJECT = 'Welcome to the MyAiBank waitlist';
const RESEND_PLAIN_TEXT =
  'Thanks for joining the MyAiBank waitlist! Keep an eye on your inbox for launch updates and your budgeting template.';

function buildResendHtml(emailAddress) {
  return `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f0d1f;">
      <h1 style="font-size: 20px; color: #1f0051;">Welcome to the MyAiBank waitlist 🎉</h1>
      <p style="font-size: 16px; line-height: 1.6;">
        Hi there,
        <br />
        Thanks for joining MyAiBank. We just reserved your spot on the launch list and will send over the budgeting template and
        AI finance tips as we count down to launch day.
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        <strong>Your email:</strong> ${emailAddress}
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        Talk soon,<br />
        The MyAiBank Team
      </p>
    </div>
  `;
}

const countdownUnits = ['days', 'hours', 'minutes', 'seconds'];

const toolCards = [
  {
    name: 'Subscription Hunter',
    tagline: 'Find recurring expenses instantly',
    description:
      'We automatically surface forgotten subscriptions, identify duplicate services, and recommend immediate actions to reclaim cash.',
    placeholder: 'Add your Subscription Hunter screenshot in this panel.',
  },
  {
    name: 'Savings Forecast',
    tagline: 'AI predicts your savings growth',
    description:
      'Connect your accounts to see projected balances, surplus momentum, and goal completion dates powered by MyAiBank intelligence.',
    placeholder: 'Add your Savings Forecast screenshot in this panel.',
  },
  {
    name: 'Financial Wellness Card',
    tagline: 'View last 30 days income, savings, and spending advice',
    description:
      'Track income, net worth shifts, and smart recommendations in one monthly snapshot that adapts to your cash flow.',
    placeholder: 'Add your Financial Wellness screenshot in this panel.',
  },
];

const essentialExamples = [
  'Rent or mortgage payments',
  'Groceries and utilities',
  'Health, transport, and insurance',
];

const lifestyleExamples = [
  'Dining out and entertainment',
  'Streaming services and hobbies',
  'Travel and personal treats',
];

const savingsExamples = [
  'High-yield savings deposits',
  'Investment or super contributions',
  'Emergency fund top-ups',
];

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function nextLaunchDate() {
  const now = new Date();
  const launchMonthIndex = 11; // December
  const hasPastLaunch =
    now.getMonth() > launchMonthIndex || (now.getMonth() === launchMonthIndex && now.getDate() >= 1);
  const year = hasPastLaunch ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(`${year}-12-01T00:00:00`);
}

function computeCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

function animateNumber(element, targetValue, { formatter = (value) => value.toFixed(0), suffix = '', duration = 900 } = {}) {
  if (!element) return;

  const startValue = Number.isFinite(element.__currentValue) ? element.__currentValue : 0;
  const startTime = performance.now();
  const delta = targetValue - startValue;

  if (element.__animationFrame) {
    cancelAnimationFrame(element.__animationFrame);
  }

  const step = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = startValue + delta * eased;
    element.textContent = `${formatter(value)}${suffix}`;

    if (progress < 1) {
      element.__animationFrame = requestAnimationFrame(step);
    } else {
      element.__currentValue = targetValue;
    }
  };

  element.__animationFrame = requestAnimationFrame(step);
}

function parseAmount(value) {
  if (typeof value === 'number') return value;
  if (value === null || value === undefined) return NaN;
  const normalized = value.toString().trim().replace(/[^0-9.-]/g, '');
  if (!normalized) return NaN;
  return Number(normalized);
}

function discoverResendKeyFromDocument() {
  const globalKey = (typeof window !== 'undefined' && window.RESEND_API_KEY) || '';
  if (globalKey?.trim()) return globalKey.trim();

  if (typeof window !== 'undefined') {
    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      let shouldRewrite = false;

      let storage;
      try {
        storage = window.localStorage;
      } catch (storageError) {
        storage = undefined;
      }

      const applyRewrite = () => {
        if (shouldRewrite && typeof window.history?.replaceState === 'function') {
          const search = params.toString();
          const newUrl = `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
          window.history.replaceState({}, '', newUrl);
        }
      };

      if (params.has('clearResendKey')) {
        shouldRewrite = true;
        params.delete('clearResendKey');
        if (storage) {
          try {
            storage.removeItem(RESEND_STORAGE_KEY);
          } catch (storageError) {
            // Ignore storage access issues when clearing the key.
          }
        }
      }

      const paramKey =
        params.get('resendKey') ||
        params.get('resend_key') ||
        params.get('resendApiKey') ||
        params.get('resend_api_key');
      if (paramKey?.trim()) {
        const trimmed = paramKey.trim();
        if (storage) {
          try {
            storage.setItem(RESEND_STORAGE_KEY, trimmed);
          } catch (storageError) {
            // Ignore quota errors when persisting the key.
          }
        }
        params.delete('resendKey');
        params.delete('resend_key');
        params.delete('resendApiKey');
        params.delete('resend_api_key');
        shouldRewrite = true;
        applyRewrite();
        return trimmed;
      }

      let storedKey = '';
      if (storage) {
        try {
          storedKey = storage.getItem(RESEND_STORAGE_KEY) || '';
        } catch (storageError) {
          storedKey = '';
        }
      }

      if (storedKey?.trim()) {
        applyRewrite();
        return storedKey.trim();
      }

      applyRewrite();
    } catch (error) {
      // Ignore issues parsing the current URL or accessing Web APIs.
    }
  }

  const windowEnv = typeof window !== 'undefined' && window.env?.RESEND_API_KEY;
  if (windowEnv?.trim()) return windowEnv.trim();

  const altGlobal = typeof window !== 'undefined' && window.__RESEND_KEY__;
  if (typeof altGlobal === 'string' && altGlobal.trim()) {
    return altGlobal.trim();
  }

  const metaSelectors = [
    'meta[name="resend-api-key"]',
    'meta[name="RESEND_API_KEY"]',
    'meta[property="resend-api-key"]',
    'meta[property="RESEND_API_KEY"]',
  ];

  for (const selector of metaSelectors) {
    const metaTag = document.querySelector(selector);
    if (metaTag?.content?.trim()) {
      return metaTag.content.trim();
    }
  }

  const dataAttributes = [
    document.documentElement?.dataset?.resendApiKey,
    document.documentElement?.dataset?.resendKey,
    document.body?.dataset?.resendApiKey,
    document.body?.dataset?.resendKey,
  ];

  for (const dataKey of dataAttributes) {
    if (dataKey?.trim()) {
      return dataKey.trim();
    }
  }

  const configScript = document.querySelector('script[data-resend-key]');
  if (configScript?.dataset?.resendKey?.trim()) {
    return configScript.dataset.resendKey.trim();
  }

  const envScript = document.getElementById('resend-env');
  if (envScript?.textContent) {
    try {
      const parsed = JSON.parse(envScript.textContent);
      const value = parsed?.RESEND_API_KEY || parsed?.resendKey;
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    } catch (error) {
      // Ignore malformed inline JSON and continue to fallbacks.
    }
  }

  return '';
}

async function fetchResendKeyFromEnvFiles() {
  const sources = [
    './resend.json',
    './resend.config.json',
    './resend-env.json',
    './env.json',
    './resend.env',
    './resend.key',
    './.env',
    './.env.local',
  ];

  const parseEnvText = (text) => {
    if (!text) return '';
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (!key) continue;
      if (key.trim() === 'RESEND_API_KEY') {
        return rest.join('=').trim();
      }
    }
    return '';
  };

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: 'no-store' });
      if (!response.ok) {
        continue;
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        try {
          const json = await response.json();
          const value =
            typeof json?.RESEND_API_KEY === 'string'
              ? json.RESEND_API_KEY
              : typeof json?.resendApiKey === 'string'
              ? json.resendApiKey
              : typeof json?.resend_key === 'string'
              ? json.resend_key
              : '';
          if (value?.trim()) {
            return value.trim();
          }
        } catch (error) {
          // Ignore JSON parse errors and continue.
        }
      } else {
        const text = await response.text();
        const parsed = parseEnvText(text);
        if (parsed?.trim()) {
          return parsed.trim();
        }
      }
    } catch (error) {
      // Ignore fetch issues (for example, file not found) and continue searching.
    }
  }

  return '';
}

let cachedResendKey = '';
let resolvingResendKeyPromise = null;

async function resolveResendKey() {
  if (cachedResendKey?.trim()) {
    return cachedResendKey;
  }

  const immediate = discoverResendKeyFromDocument();
  if (immediate?.trim()) {
    cachedResendKey = immediate.trim();
    if (typeof window !== 'undefined') {
      window.RESEND_API_KEY = cachedResendKey;
    }
    return cachedResendKey;
  }

  if (!resolvingResendKeyPromise) {
    resolvingResendKeyPromise = (async () => {
      const fetched = await fetchResendKeyFromEnvFiles();
      if (fetched?.trim()) {
        cachedResendKey = fetched.trim();
        if (typeof window !== 'undefined') {
          window.RESEND_API_KEY = cachedResendKey;
        }
      }
      return cachedResendKey;
    })();
  }

  await resolvingResendKeyPromise;
  return cachedResendKey;
}

function initParticles() {
  const container = document.getElementById('particle-field');
  if (!container) return;

  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 32; index += 1) {
    const particle = document.createElement('span');
    particle.style.setProperty('--particle-left', `${Math.random() * 100}%`);
    particle.style.setProperty('--particle-top', `${Math.random() * 100}%`);
    particle.style.setProperty('--particle-duration', `${12 + Math.random() * 12}s`);
    particle.style.setProperty('--particle-delay', `${Math.random() * -20}s`);
    particle.style.setProperty('--particle-size', `${2 + Math.random() * 3}px`);
    particle.style.setProperty('--particle-opacity', String(0.08 + Math.random() * 0.12));
    fragment.appendChild(particle);
  }

  container.appendChild(fragment);
}

function initCursorLight() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const handlePointerMove = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    hero.style.setProperty('--cursor-x', `${x}px`);
    hero.style.setProperty('--cursor-y', `${y}px`);
    hero.style.setProperty('--cursor-opacity', '1');
    document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
  };

  const handlePointerLeave = () => {
    hero.style.setProperty('--cursor-opacity', '0');
  };

  hero.addEventListener('pointermove', handlePointerMove);
  hero.addEventListener('pointerleave', handlePointerLeave);
}

function initScrollParallax() {
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? doc.scrollTop / max : 0;
    doc.style.setProperty('--scroll-progress', progress.toString());
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initCountdown() {
  const countdownContainer = document.getElementById('countdown');
  if (!countdownContainer) return;

  const valueMap = {};
  countdownContainer.querySelectorAll('.countdown__tile').forEach((tile) => {
    const unit = tile.getAttribute('data-unit');
    const valueElement = tile.querySelector('.countdown__value');
    if (unit && valueElement) {
      valueMap[unit] = valueElement;
    }
  });

  const targetDate = nextLaunchDate();

  const update = () => {
    const values = computeCountdown(targetDate);
    countdownUnits.forEach((unit) => {
      const element = valueMap[unit];
      if (!element) return;
      const nextValue = values[unit];
      if (element.textContent !== nextValue) {
        element.textContent = nextValue;
        element.classList.add('countdown__value--pulse');
        if (element.__pulseTimeout) {
          clearTimeout(element.__pulseTimeout);
        }
        element.__pulseTimeout = setTimeout(() => {
          element.classList.remove('countdown__value--pulse');
        }, 350);
      }
    });
  };

  update();
  setInterval(update, 1000);
}

function setNewsletterStatus(statusElements, status, message = '') {
  const { submitButton, hint, success, error } = statusElements;
  if (submitButton) {
    submitButton.disabled = status === 'submitting';
    submitButton.textContent = status === 'submitting' ? 'Joining…' : 'Join the waitlist';
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

  setNewsletterStatus(statusElements, status);

  const resetStatus = () => {
    if (status !== 'idle') {
      status = 'idle';
      setNewsletterStatus(statusElements, status);
    }
  };

  emailInput?.addEventListener('input', resetStatus);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    status = 'submitting';
    setNewsletterStatus(statusElements, status);

    const resendApiKey = await resolveResendKey();
    if (!resendApiKey) {
      status = 'error';
      setNewsletterStatus(
        statusElements,
        status,
        'Newsletter signups are temporarily unavailable. Please configure the Resend API key.'
      );
      return;
    }

    const email = emailInput?.value?.trim() ?? '';

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [email],
          subject: RESEND_SUBJECT,
          html: buildResendHtml(email),
          text: RESEND_PLAIN_TEXT,
        }),
      });

      if (!response.ok) {
        let message = '';
        try {
          const payload = await response.json();
          message =
            payload?.message ||
            payload?.name ||
            payload?.error ||
            payload?.errors?.[0]?.message ||
            '';
        } catch (error) {
          message = '';
        }

        status = 'error';
        setNewsletterStatus(
          statusElements,
          status,
          message
            ? `We couldn’t send the confirmation yet: ${message}`
            : 'We couldn’t reach Resend right now. Please try again in a moment.'
        );
        return;
      }

      if (emailInput) {
        emailInput.value = '';
      }

      status = 'success';
      setNewsletterStatus(statusElements, status);
    } catch (error) {
      status = 'error';
      setNewsletterStatus(
        statusElements,
        status,
        'We hit a network issue while connecting to Resend. Please try again.'
      );
    }
  });
}

function populateExampleLists() {
  const listMap = {
    essentials: essentialExamples,
    lifestyle: lifestyleExamples,
    savings: savingsExamples,
  };

  document.querySelectorAll('[data-list]').forEach((list) => {
    const key = list.getAttribute('data-list');
    const items = listMap[key];
    if (!items) return;
    list.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  });
}

function populateToolCarousel() {
  const carousel = document.getElementById('tool-carousel');
  if (!carousel) return;

  carousel.innerHTML = '';
  const fragment = document.createDocumentFragment();

  toolCards.forEach((tool) => {
    const article = document.createElement('article');
    article.className = 'tool-card';
    article.setAttribute('role', 'listitem');

    const copy = document.createElement('div');
    copy.className = 'tool-card__copy';

    const heading = document.createElement('h3');
    heading.textContent = tool.name;

    const tagline = document.createElement('p');
    tagline.className = 'tool-card__tagline';
    tagline.textContent = tool.tagline;

    const description = document.createElement('p');
    description.textContent = tool.description;

    copy.append(heading, tagline, description);

    const media = document.createElement('div');
    media.className = 'tool-card__media';

    const placeholder = document.createElement('p');
    placeholder.className = 'tool-card__placeholder';
    placeholder.textContent = tool.placeholder;
    media.appendChild(placeholder);

    article.append(copy, media);
    fragment.appendChild(article);
  });

  carousel.appendChild(fragment);
}

function initDemo() {
  const form = document.getElementById('demo-form');
  if (!form) return;

  const incomeInput = document.getElementById('income');
  const spendingInput = document.getElementById('spending');
  const incomeFrequency = document.getElementById('income-frequency');
  const spendingFrequency = document.getElementById('spending-frequency');
  const errorElement = document.getElementById('demo-error');
  const placeholder = document.getElementById('demo-placeholder');
  const cards = document.getElementById('demo-cards');

  const fieldElements = {
    monthlyIncome: cards?.querySelector('[data-field="monthlyIncome"]'),
    monthlySpending: cards?.querySelector('[data-field="monthlySpending"]'),
    incomeNote: cards?.querySelector('[data-field="incomeNote"]'),
    spendingNote: cards?.querySelector('[data-field="spendingNote"]'),
    essentials: cards?.querySelector('[data-field="essentials"]'),
    wants: cards?.querySelector('[data-field="wants"]'),
    savings: cards?.querySelector('[data-field="savings"]'),
    debtToIncome: cards?.querySelector('[data-field="debtToIncome"]'),
    dtiPercent: cards?.querySelector('[data-field="dtiPercent"]'),
  };

  const showPlaceholder = () => {
    if (placeholder) placeholder.hidden = false;
    if (cards) cards.hidden = true;
  };

  const showCards = () => {
    if (placeholder) placeholder.hidden = true;
    if (cards) cards.hidden = false;
  };

  const showError = (message) => {
    if (errorElement) {
      errorElement.hidden = false;
      errorElement.textContent = message;
    }
  };

  const hideError = () => {
    if (errorElement) {
      errorElement.hidden = true;
      errorElement.textContent = '';
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const parsedIncome = parseAmount(incomeInput?.value);
    const parsedSpending = parseAmount(spendingInput?.value);

    if (
      !Number.isFinite(parsedIncome) ||
      !Number.isFinite(parsedSpending) ||
      parsedIncome <= 0 ||
      parsedSpending < 0
    ) {
      showError('Enter valid amounts for income and spending to explore the demo.');
      showPlaceholder();
      return;
    }

    hideError();

    const incomeMultiplier = incomeFrequency?.value === 'weekly' ? 4 : 1;
    const spendingMultiplier = spendingFrequency?.value === 'weekly' ? 4 : 1;

    const monthlyIncome = parsedIncome * incomeMultiplier;
    const monthlySpending = parsedSpending * spendingMultiplier;
    const essentials = monthlyIncome * 0.5;
    const wants = monthlyIncome * 0.3;
    const savings = monthlyIncome * 0.2;
    const debtToIncome = monthlyIncome > 0 ? (monthlySpending / monthlyIncome) * 100 : 0;

    showCards();

    if (fieldElements.monthlyIncome) {
      animateNumber(fieldElements.monthlyIncome, monthlyIncome, { formatter: (value) => currencyFormatter.format(value) });
    }

    if (fieldElements.monthlySpending) {
      animateNumber(fieldElements.monthlySpending, monthlySpending, { formatter: (value) => currencyFormatter.format(value) });
    }

    if (fieldElements.incomeNote) {
      fieldElements.incomeNote.hidden = incomeMultiplier === 1;
    }

    if (fieldElements.spendingNote) {
      fieldElements.spendingNote.hidden = spendingMultiplier === 1;
    }

    if (fieldElements.essentials) {
      animateNumber(fieldElements.essentials, essentials, { formatter: (value) => currencyFormatter.format(value) });
    }

    if (fieldElements.wants) {
      animateNumber(fieldElements.wants, wants, { formatter: (value) => currencyFormatter.format(value) });
    }

    if (fieldElements.savings) {
      animateNumber(fieldElements.savings, savings, { formatter: (value) => currencyFormatter.format(value) });
    }

    if (fieldElements.debtToIncome) {
      animateNumber(fieldElements.debtToIncome, debtToIncome, {
        formatter: (value) => value.toFixed(1),
        suffix: ' / 100',
      });
    }

    if (fieldElements.dtiPercent) {
      fieldElements.dtiPercent.textContent = percentFormatter.format(debtToIncome / 100);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursorLight();
  initScrollParallax();
  initCountdown();
  initNewsletter();
  populateExampleLists();
  populateToolCarousel();
  initDemo();
});
