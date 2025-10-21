import type { Metadata } from "next";

import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { NativeModelShowcase } from "@/components/catalog/NativeModelShowcase";
import { createMockProducts } from "@/lib/catalog/products";
import { resolveApiUrl } from "@/lib/http/base-url";
import type {
  CatalogLeather,
  CatalogProductSummary,
  CatalogStyle
} from "@/lib/catalog/types";

interface ApiResponse<T> {
  data: T;
}

async function fetchStyles(): Promise<CatalogStyle[]> {
  const response = await fetch(resolveApiUrl("/api/styles"), {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy stylów");
  }

  const { data } = (await response.json()) as ApiResponse<CatalogStyle[]>;

  return data;
}

async function fetchLeathers(): Promise<CatalogLeather[]> {
  const response = await fetch(resolveApiUrl("/api/leather"), {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy skór");
  }

  const { data } = (await response.json()) as ApiResponse<CatalogLeather[]>;

  return data;
}

export const metadata: Metadata = {
  title: "Katalog",
  description:
    "Poznaj kolekcję rzemieślniczych modeli JK Handmade Footwear i odfiltruj projekty po stylu oraz skórze."
};

export default async function CatalogPage() {
  try {
    const [styles, leathers] = await Promise.all([fetchStyles(), fetchLeathers()]);
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
              <article className="catalog-funnel-legend__item">
                <abbr title="Top of Funnel" className="badge badge--funnel">TOFU</abbr>
                <h2>Top of Funnel</h2>
                <p>Inspiracje i modele pokazowe — idealne, gdy dopiero poznajesz katalog i szukasz kierunku.</p>
              </article>
              <article className="catalog-funnel-legend__item">
                <abbr title="Middle of Funnel" className="badge badge--funnel">MOFU</abbr>
                <h2>Middle of Funnel</h2>
                <p>Produkty gotowe do konfiguracji: porównuj skóry, dodatki oraz przygotuj brief do formularza.</p>
              </article>
              <article className="catalog-funnel-legend__item">
                <abbr title="Bottom of Funnel" className="badge badge--funnel">BOFU</abbr>
                <h2>Bottom of Funnel</h2>
                <p>Elementy finalizujące zamówienie — akcesoria, bukłaki i prawidła, które dodasz prosto w formularzu.</p>
              </article>
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
