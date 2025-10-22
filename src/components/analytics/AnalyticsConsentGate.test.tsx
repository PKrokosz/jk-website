import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ANALYTICS_CONFIG } from "@/config/analytics";
import {
  CONSENT_COOKIE_NAME,
  clearStoredConsent,
  persistConsent
} from "@/lib/cookie-consent";

import { AnalyticsConsentGate } from "./AnalyticsConsentGate";

vi.mock("next/script", () => ({
  __esModule: true,
  default: ({ id, src, strategy, children }: any) => (
    <script data-id={id} data-src={src} data-strategy={strategy}>
      {children}
    </script>
  )
}));

describe("AnalyticsConsentGate", () => {
  beforeEach(() => {
    clearStoredConsent();
    document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  });

  it("shows the consent banner by default and does not load analytics", () => {
    render(
      <AnalyticsConsentGate>
        <div>Test content</div>
      </AnalyticsConsentGate>
    );

    expect(screen.getByRole("dialog", { name: /Zgoda na pliki cookie/i })).toBeInTheDocument();
    expect(document.querySelector(`script[data-id="ga-loader"]`)).toBeNull();
  });

  it("stores decline decision and keeps analytics disabled", async () => {
    render(
      <AnalyticsConsentGate>
        <div>Test content</div>
      </AnalyticsConsentGate>
    );

    fireEvent.click(screen.getByRole("button", { name: /Tylko niezbędne/i }));

    await waitFor(() => {
      expect(document.querySelector(`script[data-id="ga-loader"]`)).toBeNull();
    });
    expect(document.cookie).toContain(`${CONSENT_COOKIE_NAME}=declined`);
    expect(
      screen.getByRole("button", { name: /Ustawienia prywatności/i })
    ).toBeInTheDocument();
  });

  it("loads analytics scripts after accepting consent", async () => {
    render(
      <AnalyticsConsentGate>
        <div>Test content</div>
      </AnalyticsConsentGate>
    );

    fireEvent.click(screen.getByRole("button", { name: /Akceptuję analitykę/i }));

    await waitFor(() => {
      const loader = document.querySelector(`script[data-id="ga-loader"]`);
      expect(loader).not.toBeNull();
      expect(loader?.getAttribute("data-src")).toContain(ANALYTICS_CONFIG.googleMeasurementId);
    });
  });

  it("respects stored consent on mount", async () => {
    persistConsent("accepted");

    render(
      <AnalyticsConsentGate>
        <div>Test content</div>
      </AnalyticsConsentGate>
    );

    await waitFor(() => {
      expect(document.querySelector(`script[data-id="ga-loader"]`)).not.toBeNull();
    });
    expect(screen.queryByRole("dialog", { name: /Zgoda na pliki cookie/i })).not.toBeInTheDocument();
  });
});
