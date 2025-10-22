import type { Metadata } from "next";

import Link from "next/link";

import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { NativeModelShowcase } from "@/components/catalog/NativeModelShowcase";
import { fetchCatalogLeathers, fetchCatalogStyles } from "@/lib/catalog/api";
import { createMockProducts } from "@/lib/catalog/products";
import type { CatalogLeather, CatalogProductSummary, CatalogStyle } from "@/lib/catalog/types";

export const metadata: Metadata = {
  title: "Katalog",
  description:
    "Poznaj kolekcję rzemieślniczych modeli JK Handmade Footwear i odfiltruj projekty po stylu oraz skórze."
};

export default async function CatalogPage() {
  try {
    const [styles, leathers] = await Promise.all([fetchCatalogStyles(), fetchCatalogLeathers()]);
    const products: CatalogProductSummary[] = createMockProducts(styles, leathers);

    return (
      <main className="page home-page catalog-page" aria-labelledby="catalog-heading">
        <section className="section section--muted catalog-hero" aria-labelledby="catalog-heading">
          <div className="container">
            <div className="section-header">
              <p className="section-header__kicker">Nowa ekspozycja warsztatu</p>
              <h1 id="catalog-heading">Katalog</h1>
              <p>
                Zanurz się w kolekcji projektów łączących rzemieślniczą precyzję z estetyką średniowiecznego minimalizmu.
                Wybierz interesujący Cię styl lub rodzaj skóry, aby zawęzić wyniki.
              </p>
              <p>
                Każdy produkt ma przypisany skrót lejkowy TOFU, MOFU lub BOFU — tak jak w formularzu natywnym, dzięki czemu
                szybko przejdziesz od inspiracji do zamówienia.
              </p>
            </div>
            <div className="catalog-funnel-legend" aria-label="Legendę lejka sprzedażowego">
              <Link
                href="#funnel-tofu"
                className="catalog-funnel-legend__item"
                aria-label="Przejdź do sekcji modeli inspiracyjnych"
              >
                <abbr title="Top of Funnel" className="badge badge--funnel">TOFU</abbr>
                <h2>Znajdź inspirację</h2>
                <p>
                  Modele pokazowe i lookbookowe sylwetki — szybki sposób, by złapać kierunek i zebrać
                  pomysły na zamówienie.
                </p>
              </Link>
              <Link
                href="#funnel-mofu"
                className="catalog-funnel-legend__item"
                aria-label="Przejdź do sekcji konfiguracji modeli"
              >
                <abbr title="Middle of Funnel" className="badge badge--funnel">MOFU</abbr>
                <h2>Porównaj warianty</h2>
                <p>
                  Modele gotowe do konfiguracji — zobacz dostępne skóry i dodatki, aby przygotować
                  brief do formularza.
                </p>
              </Link>
              <Link
                href="#funnel-bofu"
                className="catalog-funnel-legend__item"
                aria-label="Przejdź do sekcji dodatków kończących zamówienie"
              >
                <abbr title="Bottom of Funnel" className="badge badge--funnel">BOFU</abbr>
                <h2>Dokończ zamówienie</h2>
                <p>
                  Akcesoria, pielęgnacja i usługi wykończeniowe — wszystko, co dodasz na finiszu w tym
                  samym formularzu.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="catalog-products-heading">
          <div className="container">
            <h2 id="catalog-products-heading" className="visually-hidden">
              Dostępne modele
            </h2>
            <CatalogExplorer styles={styles} leathers={leathers} products={products} />
          </div>
        </section>

        <NativeModelShowcase />
      </main>
    );
  } catch (error) {
    console.error("Nie udało się pobrać danych katalogu", error);

    return (
      <main className="page home-page catalog-page" aria-labelledby="catalog-heading">
        <section className="section section--muted catalog-hero" aria-labelledby="catalog-heading">
          <div className="container">
            <h1 id="catalog-heading">Katalog</h1>
            <p>
              Aktualnie nie możemy wyświetlić katalogu. Odśwież stronę lub przejdź do sekcji kontakt, aby zamówić konsultację.
            </p>
          </div>
        </section>
      </main>
    );
  }
}
