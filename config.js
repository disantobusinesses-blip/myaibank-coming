export function getResendApiKey() {
  const env = import.meta.env ?? {};
  const value = env.VITE_RESEND_API_KEY;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return '';
}
