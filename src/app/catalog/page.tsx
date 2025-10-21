import type { Metadata } from "next";

import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { NativeModelShowcase } from "@/components/catalog/NativeModelShowcase";
import { createMockProducts } from "@/lib/catalog/products";
import type {
  CatalogLeather,
  CatalogProductSummary,
  CatalogStyle
} from "@/lib/catalog/types";

interface ApiResponse<T> {
  data: T;
}

async function fetchStyles(): Promise<CatalogStyle[]> {
  const response = await fetch("/api/styles", {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać listy stylów");
  }

  const { data } = (await response.json()) as ApiResponse<CatalogStyle[]>;

  return data;
}

async function fetchLeathers(): Promise<CatalogLeather[]> {
  const response = await fetch("/api/leather", {
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
      <main className="page" aria-labelledby="catalog-heading">
        <section className="section section--muted" aria-labelledby="catalog-heading">
          <div className="container">
            <div className="section-header">
              <p className="section-header__kicker">Nowa ekspozycja warsztatu</p>
              <h1 id="catalog-heading">Katalog</h1>
              <p>
                Zanurz się w kolekcji projektów łączących rzemieślniczą precyzję z estetyką średniowiecznego minimalizmu.
                Wybierz interesujący Cię styl lub rodzaj skóry, aby zawęzić wyniki.
              </p>
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
      <main className="page" aria-labelledby="catalog-heading">
        <section className="section" aria-labelledby="catalog-heading">
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
