import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderModalTrigger } from "@/components/ui/order/OrderModalTrigger";
import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";
import { getProductBySlug, listProductSlugs } from "@/lib/catalog/products";
import type { CatalogLeather, CatalogProductDetail, CatalogStyle } from "@/lib/catalog/types";

interface ProductPageProps {
  params: { slug: string };
}

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN"
});

export function generateStaticParams() {
  return listProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = params;
  const product = getProductBySlug(slug, catalogStyles, catalogLeathers);

  if (!product) {
    return {
      title: "Model niedostępny",
      description: "Wybrany model nie istnieje w katalogu JK Handmade Footwear."
    } satisfies Metadata;
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    keywords: product.seo.keywords
  } satisfies Metadata;
}

function resolveStyle(styleId: number): CatalogStyle | undefined {
  return catalogStyles.find((style) => style.id === styleId);
}

function resolveLeather(leatherId: number): CatalogLeather | undefined {
  return catalogLeathers.find((leather) => leather.id === leatherId);
}

function resolveOrderHref(orderReference?: CatalogProductDetail["orderReference"]) {
  if (!orderReference) {
    return "/order/native";
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
  return query ? `/order/native?${query}` : "/order/native";
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

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = getProductBySlug(slug, catalogStyles, catalogLeathers);

  if (!product) {
    notFound();
  }

  const style = resolveStyle(product.styleId);
  const leather = resolveLeather(product.leatherId);
  const orderHref = resolveOrderHref(product.orderReference);
  const funnelCta = getFunnelCta(product.funnelStage);
  const sectionLinks = [
    { id: "gallery", label: "Galeria zdjęć" },
    { id: "craft-details", label: "Detale rzemieślnicze" },
    { id: "personalization", label: "Personalizacja" }
  ] as const;
  const heroImage = product.gallery[0];
  const formattedPrice = currencyFormatter.format(product.priceGrosz / 100);

  return (
    <main className="page product-page" aria-labelledby="product-heading">
      <nav className="breadcrumbs" aria-label="Ścieżka nawigacji">
        <div className="container">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/catalog">Catalog</Link>
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

        <section
          id="personalization"
          className="section product-section"
          aria-labelledby="variants-heading"
        >
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
                      const variantLeather = resolveLeather(color.leatherId);
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
}
