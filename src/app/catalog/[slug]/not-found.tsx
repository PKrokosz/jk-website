import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="page" aria-labelledby="product-missing-heading">
      <section className="section">
        <div className="container">
          <h1 id="product-missing-heading">Nie znaleziono modelu</h1>
          <p>
            Wybrany model nie istnieje w naszym katalogu. Wróć do listy produktów lub skontaktuj się z pracownią, aby omówić
            indywidualny projekt.
          </p>
          <div className="callout__actions">
            <Link className="button button--primary" href="/catalog">
              Powrót do katalogu
            </Link>
            <Link className="button button--ghost" href="/contact">
              Skontaktuj się z nami
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
