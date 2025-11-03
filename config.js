export const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || "";

function normalizeResendValue(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
}

export function getResendApiKey() {
  const metaEnv = import.meta.env ?? {};
  const processEnv = globalThis?.process?.env ?? {};
  const browserEnv = typeof window === 'undefined' ? {} : window.__env__ ?? {};

  const candidates = [
    metaEnv[RESEND_API_ENV_NAME],
    processEnv[RESEND_API_ENV_NAME],
    browserEnv[RESEND_API_ENV_NAME],
  ];

  for (const candidate of candidates) {
    const normalized = normalizeResendValue(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return '';
}
