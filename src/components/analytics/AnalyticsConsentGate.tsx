"use client";

import React, { type ReactNode, useCallback, useEffect, useState } from "react";

import { ANALYTICS_CONFIG } from "@/config/analytics";
import { getStoredConsent, persistConsent, type CookieConsentStatus } from "@/lib/cookie-consent";

import { CookieConsentBanner } from "./CookieConsentBanner";
import { CookiePreferencesButton } from "./CookiePreferencesButton";
import { GoogleAnalytics } from "./GoogleAnalytics";

type ConsentStatus = CookieConsentStatus | "unknown";

interface AnalyticsConsentGateProps {
  children: ReactNode;
}

export function AnalyticsConsentGate({ children }: AnalyticsConsentGateProps) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("unknown");
  const [isBannerOpen, setIsBannerOpen] = useState(true);

  useEffect(() => {
    const storedConsent = getStoredConsent();

    if (storedConsent) {
      setConsentStatus(storedConsent);
      setIsBannerOpen(false);
    } else {
      setConsentStatus("unknown");
      setIsBannerOpen(true);
    }
  }, []);

  const handleAccept = useCallback(() => {
    persistConsent("accepted");
    setConsentStatus("accepted");
  }, []);

  const handleDecline = useCallback(() => {
    persistConsent("declined");
    setConsentStatus("declined");
  }, []);

  const closeBanner = useCallback(() => {
    setIsBannerOpen(false);
  }, []);

  const shouldRenderAnalytics = consentStatus === "accepted";
  const shouldShowPreferencesButton = !isBannerOpen;

  return (
    <>
      {children}
      <CookieConsentBanner
        isOpen={isBannerOpen}
        onAccept={handleAccept}
        onClose={closeBanner}
        onDecline={handleDecline}
        status={consentStatus}
      />
      {shouldShowPreferencesButton ? (
        <CookiePreferencesButton
          onClick={() => {
            setIsBannerOpen(true);
          }}
        />
      ) : null}
      {shouldRenderAnalytics ? (
        <GoogleAnalytics measurementId={ANALYTICS_CONFIG.googleMeasurementId} />
      ) : null}
    </>
  );
}

