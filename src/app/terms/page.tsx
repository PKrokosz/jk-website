import type { Metadata } from "next";

import { LegalSections } from "@/components/legal/legal-sections";
import { termsSections } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin serwisu JK Handmade Footwear dotyczący zamówień na obuwie wykonywane na zamówienie (MTO)."
};

export default function TermsPage() {
  return (
    <main className="page legal-page" aria-labelledby="terms-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="terms-heading">Regulamin serwisu JK Handmade Footwear (MTO)</h1>
          <p>
            Dokument określa zasady korzystania z serwisu jkhandmade.pl oraz warunki składania zamówień na obuwie wykonywane na
            zamówienie.
          </p>
          <p>Data obowiązywania: 22.10.2025 r.</p>
          <div className="legal-page__actions">
            <a className="button button--ghost" href="/api/legal/terms" download>
              Pobierz wersję PDF
            </a>
          </div>
        </header>

        <LegalSections sections={termsSections} />
      </div>
    </main>
  );
}
