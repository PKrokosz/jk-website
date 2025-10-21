export const metadata = {
  title: "Catalog"
};

export default function CatalogPage() {
  return (
    <main className="page" aria-labelledby="catalog-heading">
      <section className="section" role="presentation">
        <div className="container">
          <h1 id="catalog-heading">Catalog</h1>
          <p>Przegląd kolekcji i przykładowych realizacji w przygotowaniu.</p>
        </div>
      </section>
    </main>
  );
}
