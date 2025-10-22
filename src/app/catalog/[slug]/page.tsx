import React from "react";
import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderModalTrigger } from "@/components/ui/order/OrderModalTrigger";
import {
  CatalogApiError,
  fetchCatalogLeathers,
  fetchCatalogProductDetail,
  fetchCatalogProducts,
  fetchCatalogStyles
} from "@/lib/catalog/api";
import { listProductSlugs } from "@/lib/catalog/products";
import type { CatalogLeather, CatalogProductDetail } from "@/lib/catalog/types";

interface ProductPageProps {
  params: { slug: string };
}

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN"
});

export async function generateStaticParams() {
  try {
    const products = await fetchCatalogProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch (error) {
    console.error("Nie udało się pobrać slugów produktów z API", error);
    return listProductSlugs().map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const product = await fetchCatalogProductDetail(slug);

    return {
      title: product.seo.title,
      description: product.seo.description,
      keywords: product.seo.keywords
    } satisfies Metadata;
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) {
      return {
        title: "Model niedostępny",
        description: "Wybrany model nie istnieje w katalogu JK Handmade Footwear."
      } satisfies Metadata;
    }

    console.error("Nie udało się pobrać danych produktu do metadanych", error);
    return {
      title: "Model niedostępny",
      description: "Aktualnie nie możemy wyświetlić informacji o tym modelu."
    } satisfies Metadata;
  }
}

function resolveOrderHref(orderReference?: CatalogProductDetail["orderReference"]): Route {
  const baseHref = "/order/native" as const;

  if (!orderReference) {
    return baseHref;
  }

  const params = new URLSearchParams();

  if (orderReference.type === "model") {
    params.set("model", orderReference.id);
  } else if (orderReference.type === "accessory") {
    params.set("accessory", orderReference.id);
  } else if (orderReference.type === "service") {
    params.set("service", orderReference.id);
  }

  const query = params.toString();
  return (query ? `${baseHref}?${query}` : baseHref) as Route;
}

function getFunnelCta(stage: CatalogProductDetail["funnelStage"]) {
  switch (stage) {
    case "BOFU":
      return "Dodaj w zamówieniu";
    case "MOFU":
      return "Skonfiguruj w formularzu";
    default:
      return "Zobacz w formularzu";
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  try {
    const [product, styles, leathers] = await Promise.all([
      fetchCatalogProductDetail(slug),
      fetchCatalogStyles(),
      fetchCatalogLeathers()
    ]);

    const leatherById = new Map<number, CatalogLeather>(leathers.map((entry) => [entry.id, entry]));
    const style = styles.find((entry) => entry.id === product.styleId);
    const leather = leatherById.get(product.leatherId);
    const orderHref = resolveOrderHref(product.orderReference);
    const funnelCta = getFunnelCta(product.funnelStage);
    const sectionLinks = [
      { id: "gallery", label: "Galeria zdjęć" },
      { id: "craft-details", label: "Detale rzemieślnicze" },
      { id: "personalization", label: "Personalizacja" }
    ] as const;
    const heroImage = product.gallery[0];
    const formattedPrice = currencyFormatter.format(product.priceGrosz / 100);

    const resolveVariantLeather = (leatherId: number): CatalogLeather | undefined =>
      leatherById.get(leatherId);

    return (
      <main className="page product-page" aria-labelledby="product-heading">
        <nav className="breadcrumbs" aria-label="Ścieżka nawigacji">
          <div className="container">
            <ol>
              <li>
                <Link href="/">Strona główna</Link>
              </li>
              <li>
                <Link href="/catalog">Katalog</Link>
              </li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </div>
        </nav>

        <article aria-labelledby="product-heading">
          <header className="section section--muted product-intro">
            <div className="container">
              <div className="product-intro__layout">
                <aside className="product-summary" aria-labelledby="product-heading">
                  <div className="product-summary__tags">
                    <span className="badge badge--category">{product.categoryLabel}</span>
                    <abbr className="badge badge--funnel" title={product.funnelLabel}>
                      {product.funnelStage}
                    </abbr>
                  </div>
                  <p className="product-summary__kicker">Kolekcja {style?.era ?? "Rzemieślnicza"}</p>
                  <h1 id="product-heading">{product.name}</h1>
                  <p className="lead">{product.description}</p>
                  <dl className="product-summary__meta">
                    <div>
                      <dt>Kategoria</dt>
                      <dd>{product.categoryLabel}</dd>
                    </div>
                    <div>
                      <dt>Styl</dt>
                      <dd>{style?.name ?? "Nieznany"}</dd>
                    </div>
                    <div>
                      <dt>Skóra bazowa</dt>
                      <dd>{leather?.name ?? "Nieznana"}</dd>
                    </div>
                    <div>
                      <dt>Lejek sprzedażowy</dt>
                      <dd>{product.funnelLabel}</dd>
                    </div>
                  </dl>
                  <div className="product-summary__actions">
                    <OrderModalTrigger
                      className="button button--primary order-modal__trigger"
                      triggerLabel="Złóż zamówienie"
                      ctaLabel="Wypełnij formularz"
                    />
                    <Link
                      className="button button--ghost"
                      href={orderHref}
                      aria-label={`${funnelCta} dla produktu ${product.name} w formularzu zamówienia`}
                      prefetch={false}
                    >
                      {funnelCta}
                    </Link>
                    <Link
                      className="button button--ghost"
                      href={`/contact?product=${product.slug}`}
                      prefetch={false}
                    >
                      Skontaktuj się z nami
                    </Link>
                    <Link className="button button--primary order-modal__mobile-link" href="/order/native">
                      Złóż zamówienie
                    </Link>
                    <p className="product-summary__price" aria-label={`Cena: ${formattedPrice}`}>
                      {formattedPrice}
                    </p>
                    <nav className="product-summary__nav" aria-label="Sekcje strony produktu">
                      <h2 className="visually-hidden">Szybka nawigacja po stronie produktu</h2>
                      <ol>
                        {sectionLinks.map((section) => (
                          <li key={section.id}>
                            <a href={`#${section.id}`}>{section.label}</a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </div>
                </aside>

                <div className="product-intro__media" aria-label={`Galeria wprowadzająca produktu ${product.name}`}>
                  {heroImage ? (
                    <figure className="product-intro__figure">
                      <div className="product-intro__image">
                        <Image
                          src={heroImage.src}
                          alt={heroImage.alt}
                          fill
                          sizes="(min-width: 1280px) 640px, (min-width: 768px) 70vw, 100vw"
                        />
                      </div>
                      <figcaption>{heroImage.alt}</figcaption>
                    </figure>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <section id="gallery" className="section product-section" aria-labelledby="gallery-heading">
            <div className="container">
              <div className="product-section__header">
                <p className="section-header__kicker">Galeria</p>
                <h2 id="gallery-heading">Zbliżenia warsztatowe</h2>
              </div>
              <div className="product-gallery" aria-label="Galeria produktu">
                {product.gallery.map((image, index) => (
                  <figure key={`${image.src}-${index}`} className="product-gallery__figure">
                    <div className="product-gallery__image">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      />
                    </div>
                    <figcaption>{image.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section id="craft-details" className="section product-section" aria-labelledby="details-heading">
            <div className="container product-details">
              <div>
                <div className="product-section__header">
                  <p className="section-header__kicker">Proces</p>
                  <h2 id="details-heading">Detale rzemieślnicze</h2>
                </div>
                <p className="lead">{product.highlight}</p>
                <ol className="product-process">
                  {product.craftProcess.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section id="personalization" className="section product-section" aria-labelledby="variants-heading">
            <div className="container product-variants">
              <div className="product-section__header">
                <p className="section-header__kicker">Personalizacja</p>
                <h2 id="variants-heading">Warianty personalizacji</h2>
              </div>
              <div className="product-variants__grid">
                <div className="product-variants__group">
                  <h3>Kolory skóry</h3>
                  {product.variants.colors.length > 0 ? (
                    <ul>
                      {product.variants.colors.map((color) => {
                        const variantLeather = resolveVariantLeather(color.leatherId);
                        return (
                          <li key={color.id}>
                            <span className="badge">{variantLeather?.name ?? color.name}</span>
                            {variantLeather?.color ? (
                              <span className="product-variants__hint">{variantLeather.color}</span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="product-variants__empty">
                      Kolory dobieramy podczas konsultacji i potwierdzamy w formularzu natywnym.
                    </p>
                  )}
                </div>

                <div className="product-variants__group">
                  <h3>Rozmiary</h3>
                  {product.variants.sizes.length > 0 ? (
                    <>
                      <p>Dostępne rozmiary EU:</p>
                      <ul className="size-list" aria-label="Lista dostępnych rozmiarów">
                        {product.variants.sizes.map((size) => (
                          <li key={size}>{size}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="product-variants__empty">
                      Rozmiar ustalamy na podstawie pomiarów przekazanych w formularzu zamówienia.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    );
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) {
      notFound();
    }

    if (error instanceof Error && (error.message === "NEXT_NOT_FOUND" || error.message === "NOT_FOUND")) {
      throw error;
    }
    console.error("Nie udało się pobrać danych produktu", error);
  }

  return (
    <main className="page product-page" aria-labelledby="product-heading">
      <section className="section section--muted product-intro" aria-labelledby="product-heading">
        <div className="container">
          <h1 id="product-heading">Produkt niedostępny</h1>
          <p>
            Aktualnie nie możemy wyświetlić danych produktu. Odśwież stronę lub skontaktuj się z nami, aby uzyskać pomoc
            przy zamówieniu.
          </p>
        </div>
      </section>
    </main>
  );
}
