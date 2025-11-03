/**
 * MyAiBank Newsletter Configuration — Resend API
 * Supports frontend (Vite) and backend (Vercel functions).
 */

// Default Audience ID (replace with your Resend audience if needed)
const DEFAULT_RESEND_AUDIENCE_ID = "b38826d1-e452-4e97-8a62-928ff782a6fd";

// Detect build environment
const isServer = typeof process !== "undefined" && !!process.env;

// ✅ Frontend: Vite exposes variables with import.meta.env
// ✅ Backend: Vercel exposes variables through process.env
export const RESEND_API_KEY = isServer
  ? process.env.VITE_RESEND_API_KEY || ""
  : import.meta.env.VITE_RESEND_API_KEY || "";

export const RESEND_AUDIENCE_ID = isServer
  ? process.env.VITE_RESEND_AUDIENCE_ID || DEFAULT_RESEND_AUDIENCE_ID
  : import.meta.env.VITE_RESEND_AUDIENCE_ID || DEFAULT_RESEND_AUDIENCE_ID;

/**
 * Helper to confirm configuration is loaded
 */
export function verifyResendConfig() {
  const hasKey = !!RESEND_API_KEY;
  const hasAudience = !!RESEND_AUDIENCE_ID;
  if (!hasKey) {
    console.error("⚠️ Resend API key missing. Please set VITE_RESEND_API_KEY in Vercel environment variables.");
  }
  if (!hasAudience) {
    console.error("⚠️ Resend Audience ID missing. Please set VITE_RESEND_AUDIENCE_ID in Vercel environment variables.");
  }
  return { hasKey, hasAudience };
}
