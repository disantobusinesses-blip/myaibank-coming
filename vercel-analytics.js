const SCRIPT_ID = 'vercel-analytics-script';
const SCRIPT_SRC = 'https://vercel.live/analytics/script.js';

function ensureQueue() {
  if (typeof window === 'undefined') {
    return;
  }

  if (typeof window.va === 'function') {
    return;
  }

  const queue = function vercelAnalyticsQueue() {
    (window.va.q = window.va.q || []).push(arguments);
  };

  queue.q = [];
  window.va = queue;
}

function injectScript() {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.defer = true;
  script.src = SCRIPT_SRC;
  script.dataset.sdkn = '@vercel/analytics';
  script.dataset.sdkv = 'stub';
  script.onerror = (event) => {
    console.warn('[Vercel Analytics] failed to load', event);
  };

  document.head.appendChild(script);
}

export function Analytics() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    ensureQueue();
    injectScript();
  } catch (error) {
    console.warn('[Vercel Analytics] initialization failed', error);
  }
}
