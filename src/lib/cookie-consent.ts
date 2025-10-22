export const CONSENT_COOKIE_NAME = "jk_cookie_consent";
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export type CookieConsentStatus = "accepted" | "declined";

type SupportedConsentValue = CookieConsentStatus;

export function parseConsentCookie(cookieString: string): CookieConsentStatus | null {
  const entries = cookieString.split(";").map((entry) => entry.trim());

  for (const entry of entries) {
    if (!entry) continue;

    const [name, value] = entry.split("=");
    if (name === CONSENT_COOKIE_NAME) {
      if (value === "accepted" || value === "declined") {
        return value as SupportedConsentValue;
      }
      return null;
    }
  }

  return null;
}

export function getStoredConsent(): CookieConsentStatus | null {
  if (typeof document === "undefined") {
    return null;
  }

  return parseConsentCookie(document.cookie ?? "");
}

export function persistConsent(status: CookieConsentStatus): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${CONSENT_COOKIE_NAME}=${status}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function clearStoredConsent(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}
