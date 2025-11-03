export const RESEND_API_ENV_NAME = 'VITE_RESEND_API_KEY';
export const RESEND_AUDIENCE_ENV_NAME = 'VITE_RESEND_AUDIENCE_ID';

const DEFAULT_RESEND_AUDIENCE_ID = 'b38826d1-e452-4e97-8a62-928ff782a6fd';

function getMetaEnv() {
  try {
    return typeof import.meta !== 'undefined' && import.meta && import.meta.env ? import.meta.env : {};
  } catch (error) {
    return {};
  }
}

function normalizeResendValue(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
}

export function getResendApiKey() {
  const metaEnv = getMetaEnv();
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

export function getResendAudienceId() {
  const metaEnv = getMetaEnv();
  const processEnv = globalThis?.process?.env ?? {};
  const browserEnv = typeof window === 'undefined' ? {} : window.__env__ ?? {};

  const candidates = [
    metaEnv[RESEND_AUDIENCE_ENV_NAME],
    processEnv[RESEND_AUDIENCE_ENV_NAME],
    browserEnv[RESEND_AUDIENCE_ENV_NAME],
  ];

  for (const candidate of candidates) {
    const normalized = normalizeResendValue(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return DEFAULT_RESEND_AUDIENCE_ID;
}

export const RESEND_API_KEY = getResendApiKey();
