import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności"
};

export default function PrivacyPolicyPage() {
  return (
    <main className="page legal-page" aria-labelledby="privacy-policy-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="privacy-policy-heading">Polityka prywatności</h1>
          <p>
            Dokument w przygotowaniu. Finalna treść zostanie opublikowana przed startem sprzedaży online.
          </p>
        </header>
        <section className="legal-page__section" aria-labelledby="privacy-policy-contact-heading">
          <h2 id="privacy-policy-contact-heading">Kontakt w sprawie danych</h2>
          <p>
            W razie pytań napisz na <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
