export default function ProductLoading() {
  return (
    <main className="page" aria-busy="true" aria-labelledby="product-loading-heading">
      <section className="section section--muted">
        <div className="container">
          <h1 id="product-loading-heading" className="skeleton-heading">
            Ładujemy szczegóły modelu
          </h1>
          <p className="skeleton-text">Prosimy o chwilę cierpliwości...</p>
        </div>
      </section>
    </main>
  );
}
