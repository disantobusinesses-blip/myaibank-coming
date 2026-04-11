export const CONSENT_STORAGE_KEY = "myaibank_cookie_consent"
export const CONSENT_VERSION = 1

export type ConsentState = {
  essential: true
  analytics: boolean
  version: number
  timestamp: string
}

export function loadConsent(): ConsentState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function saveConsent(analytics: boolean): ConsentState {
  const state: ConsentState = {
    essential: true,
    analytics,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state))
  return state
}

export function clearConsent(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CONSENT_STORAGE_KEY)
}

export function updateGAConsent(analytics: boolean): void {
  if (typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag
  if (typeof gtag !== "function") return
  gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}
