import type { Metadata } from "next";

import { LegalSections } from "@/components/legal/legal-sections";
import { privacyPolicySections } from "@/lib/legal/privacy-policy";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności JK Handmade Footwear – informacje o administratorze danych, celach przetwarzania oraz prawach użytkownika."
};

export default function PrivacyPolicyPage() {
  return (
    <main className="page legal-page" aria-labelledby="privacy-policy-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="privacy-policy-heading">Polityka prywatności – JK Handmade Footwear</h1>
          <p>
            Niniejszy dokument opisuje zasady przetwarzania danych osobowych użytkowników serwisu jkhandmade.pl oraz klientów
            korzystających z usług zamówień obuwia na miarę.
          </p>
          <p>Data wejścia w życie: 22.10.2025 r.</p>
          <div className="legal-page__actions">
            <a className="button button--ghost" href="/api/legal/privacy-policy" download>
              Pobierz wersję PDF
            </a>
          </div>
        </header>

        <LegalSections sections={privacyPolicySections} />
      </div>
    </main>
  );
}
