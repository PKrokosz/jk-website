import Link from "next/link";

import { PricingCalculator } from "./components/PricingCalculator";

const galleryItems = [
  {
    title: "Oxford nocna skóra",
    description: "Lakierowana czerń z ręcznym polerem."
  },
  {
    title: "Derby kasztan",
    description: "Przeznaczone do codziennej pracy w biurze."
  },
  {
    title: "Monk zamszowy",
    description: "Podwójna klamra w kolorze espresso."
  },
  {
    title: "Trzewik bespoke",
    description: "Skórzana podszewka i kontrastowe sznurowanie."
  }
];

export default function Home() {
  return (
    <main className="page">
      <section className="section hero" aria-labelledby="hero-heading">
        <div className="container hero__content">
          <div>
            <p className="eyebrow">JK Handmade Footwear</p>
            <h1 id="hero-heading">Buty miarowe szyte w Warszawie pod Twój rytm dnia</h1>
            <p className="lead">
              Od pierwszej miary po finalne polerowanie — prowadzimy Cię przez proces, który
              kończy się parą dopasowaną do kroku, garderoby i okazji.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="mailto:pracownia@jk-footwear.pl">
                Umów konsultację
              </a>
              <Link className="button button--ghost" href="/api/pricing/quote">
                Zobacz API wyceny
              </Link>
            </div>
          </div>
          <div className="hero__badge" aria-hidden="true">
            <span>Made-to-order</span>
            <span>Warszawa</span>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="process-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="process-heading">Proces made-to-order w 4 krokach</h2>
            <p>
              Transparentnie komunikujemy każdą fazę powstawania butów, abyś wiedział, kiedy
              możesz spodziewać się przymiarek i odbioru.
            </p>
          </div>
          <ol className="process">
            <li>
              <h3>Konsultacja w pracowni</h3>
              <p>Analizujemy styl życia, przeznaczenie obuwia i Twoje inspiracje wizualne.</p>
            </li>
            <li>
              <h3>Pomiary i kopyto</h3>
              <p>Tworzymy indywidualne kopyto oraz prototyp, który testujemy razem z Tobą.</p>
            </li>
            <li>
              <h3>Ręczne szycie</h3>
              <p>Dobieramy skórę, szyjemy cholewkę i montujemy podeszwę przy użyciu tradycyjnych technik.</p>
            </li>
            <li>
              <h3>Finisz i odbiór</h3>
              <p>Polerujemy, dopasowujemy wkładki oraz przekazujemy instrukcję pielęgnacji.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section section--muted" aria-labelledby="portfolio-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="portfolio-heading">Portfolio realizacji</h2>
            <p>Wybrane projekty, które pokazują różnorodność sylwetek i wykończeń.</p>
          </div>
          <div className="gallery-grid" role="list">
            {galleryItems.map((item) => (
              <article key={item.title} role="listitem" className="gallery-card">
                <div className="gallery-card__media" aria-hidden="true" />
                <div className="gallery-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PricingCalculator />

      <section className="section" aria-labelledby="cta-heading">
        <div className="container callout">
          <div>
            <h2 id="cta-heading">Gotowy na pierwszy krok?</h2>
            <p>
              Napisz do nas i umów termin konsultacji w pracowni. Sprawdzisz status aplikacji pod
              kątem wdrożenia MVP w zakładce zdrowia systemu.
            </p>
          </div>
          <div className="callout__actions">
            <a className="button button--primary" href="mailto:pracownia@jk-footwear.pl">
              Rezerwuj termin
            </a>
            <Link className="button button--ghost" href="/healthz">
              Status aplikacji
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
