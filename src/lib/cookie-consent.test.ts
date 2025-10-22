import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_SECONDS,
  clearStoredConsent,
  getStoredConsent,
  parseConsentCookie,
  persistConsent
} from "./cookie-consent";

function getCookieValue(name: string) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, value] = cookie.trim().split("=");
    if (cookieName === name) {
      return value;
    }
  }
  return undefined;
}

describe("cookie-consent storage helpers", () => {
  beforeEach(() => {
    clearStoredConsent();
    document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  });

  afterEach(() => {
    clearStoredConsent();
  });

  it("returns null when no consent cookie is stored", () => {
    expect(getStoredConsent()).toBeNull();
  });

  it("parses stored consent values", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=accepted`;
    expect(getStoredConsent()).toBe("accepted");

    document.cookie = `${CONSENT_COOKIE_NAME}=declined`;
    expect(getStoredConsent()).toBe("declined");
  });

  it("ignores unsupported cookie values", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=maybe`;

    expect(getStoredConsent()).toBeNull();
  });

  it("parses consent from raw cookie string", () => {
    expect(parseConsentCookie("foo=bar")).toBeNull();
    expect(parseConsentCookie(`${CONSENT_COOKIE_NAME}=accepted`)).toBe("accepted");
  });

  it("persists accepted consent with correct attributes", () => {
    const setterSpy = vi.spyOn(document, "cookie", "set");

    persistConsent("accepted");

    expect(setterSpy).toHaveBeenCalledWith(
      `${CONSENT_COOKIE_NAME}=accepted; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`
    );
    expect(getCookieValue(CONSENT_COOKIE_NAME)).toBe("accepted");

    setterSpy.mockRestore();
  });

  it("persists declined consent", () => {
    persistConsent("declined");
    expect(getCookieValue(CONSENT_COOKIE_NAME)).toBe("declined");
  });
});
