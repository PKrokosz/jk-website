"use client";

import React from "react";

import type { CookieConsentStatus } from "@/lib/cookie-consent";

interface CookieConsentBannerProps {
  isOpen: boolean;
  status: CookieConsentStatus | "unknown";
  onAccept(): void;
  onDecline(): void;
  onClose(): void;
}

export function CookieConsentBanner({
  isOpen,
  status,
  onAccept,
  onDecline,
  onClose
}: CookieConsentBannerProps) {
  if (!isOpen) {
    return null;
  }

  const hasRecordedDecision = status === "accepted" || status === "declined";
  const titleId = "cookie-consent-title";
  const descriptionId = "cookie-consent-description";

  return (
    <section
      aria-live="polite"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="cookie-banner"
      role="dialog"
    >
      <div className="cookie-banner__content">
        <h2 className="cookie-banner__title" id={titleId}>
          Zgoda na pliki cookie
        </h2>
        <p className="cookie-banner__description" id={descriptionId}>
          Używamy plików cookie wyłącznie do analityki Google, aby zrozumieć, jak użytkownicy korzystają z serwisu i ulepszać ofertę.
          Możesz zaakceptować lub odrzucić to śledzenie. Twoja decyzja jest przechowywana przez rok i możesz ją zmienić w dowolnym momencie.
        </p>
        <div className="cookie-banner__actions">
          <button
            className="cookie-banner__button cookie-banner__button--secondary"
            onClick={() => {
              onDecline();
              onClose();
            }}
            type="button"
          >
            Tylko niezbędne
          </button>
          <button
            className="cookie-banner__button"
            onClick={() => {
              onAccept();
              onClose();
            }}
            type="button"
          >
            Akceptuję analitykę
          </button>
        </div>
        {hasRecordedDecision ? (
          <button
            className="cookie-banner__link"
            onClick={onClose}
            type="button"
          >
            Zamknij komunikat
          </button>
        ) : null}
      </div>
    </section>
  );
}
