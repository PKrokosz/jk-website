import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderModalTrigger } from "@/components/ui/order/OrderModalTrigger";
import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";
import { getProductBySlug, listProductSlugs } from "@/lib/catalog/products";
import type { CatalogLeather, CatalogStyle } from "@/lib/catalog/types";

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

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = getProductBySlug(slug, catalogStyles, catalogLeathers);

  if (!product) {
    notFound();
  }

  const style = resolveStyle(product.styleId);
  const leather = resolveLeather(product.leatherId);

  return (
    <main className="page" aria-labelledby="product-heading">
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
        <header className="section section--muted">
          <div className="container product-hero">
            <div className="product-hero__content">
              <p className="section-header__kicker">Kolekcja {style?.era ?? "Rzemieślnicza"}</p>
              <h1 id="product-heading">{product.name}</h1>
              <p className="lead">{product.description}</p>
              <dl className="product-hero__meta">
                <div>
                  <dt>Styl</dt>
                  <dd>{style?.name ?? "Nieznany"}</dd>
                </div>
                <div>
                  <dt>Skóra bazowa</dt>
                  <dd>{leather?.name ?? "Nieznana"}</dd>
                </div>
              </dl>
              <div className="product-hero__cta">
                <OrderModalTrigger
                  className="button button--primary order-modal__trigger"
                  triggerLabel="Złóż zamówienie"
                  ctaLabel="Wypełnij formularz"
                />
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
                <p className="product-hero__price" aria-label={`Cena: ${currencyFormatter.format(product.priceGrosz / 100)}`}>
                  {currencyFormatter.format(product.priceGrosz / 100)}
                </p>
              </div>
            </div>

            <div className="product-gallery" aria-label="Galeria produktu">
              {product.gallery.map((image) => (
                <figure key={image.alt} className="product-gallery__item">
                  <Image src={image.src} alt={image.alt} width={600} height={400} />
                  <figcaption>{image.alt}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </header>

        <section className="section" aria-labelledby="details-heading">
          <div className="container product-details">
            <div>
              <h2 id="details-heading">Detale rzemieślnicze</h2>
              <p className="lead">{product.highlight}</p>
              <ul className="product-process">
                {product.craftProcess.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="product-variants" aria-labelledby="variants-heading">
              <h2 id="variants-heading">Warianty personalizacji</h2>
              <div className="product-variants__group">
                <h3>Kolory skóry</h3>
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
              </div>

              <div className="product-variants__group">
                <h3>Rozmiary</h3>
                <p>Dostępne rozmiary EU:</p>
                <ul className="size-list" aria-label="Lista dostępnych rozmiarów">
                  {product.variants.sizes.map((size) => (
                    <li key={size}>{size}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
