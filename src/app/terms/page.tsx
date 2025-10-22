import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin sklepu"
};

export default function TermsPage() {
  return (
    <main className="page legal-page" aria-labelledby="terms-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="terms-heading">Regulamin sklepu</h1>
          <p>
            Regulamin jest w trakcie opracowania i zostanie udostępniony przed uruchomieniem sprzedaży online.
          </p>
        </header>
        <section className="legal-page__section" aria-labelledby="terms-contact-heading">
          <h2 id="terms-contact-heading">Wsparcie klienta</h2>
          <p>
            Skontaktuj się z nami pod adresem <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a> lub telefonicznie pod numerem <a href="tel:+48555123456">+48 555 123 456</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
