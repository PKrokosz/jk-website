"use client";

import React, { useMemo, useState } from "react";

import Link from "next/link";
import type { Route } from "next";
import { CatalogLeather, CatalogProductSummary, CatalogStyle } from "@/lib/catalog/types";

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN"
});

interface CatalogExplorerProps {
  styles: CatalogStyle[];
  leathers: CatalogLeather[];
  products: CatalogProductSummary[];
}

type SortOrder = "price-asc" | "price-desc";

type PriceTierFilter = "all" | "low" | "medium" | "high";

type ToggleValue = string | number;
type ToggleHandler<T extends ToggleValue> = (value: T) => void;

function useToggleList<T extends ToggleValue>(initial: T[] = []): [T[], ToggleHandler<T>] {
  const [selected, setSelected] = useState<T[]>(initial);

  const toggle: ToggleHandler<T> = (value) => {
    setSelected((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      return [...current, value];
    });
  };

  return [selected, toggle];
}

const PRICE_TIER_LABELS: Record<Exclude<PriceTierFilter, "all">, string> = {
  low: "Niski",
  medium: "Średni",
  high: "Wysoki"
};

function resolvePriceTier(priceGrosz: number): Exclude<PriceTierFilter, "all"> {
  if (priceGrosz <= 80_000) {
    return "low";
  }

  if (priceGrosz <= 120_000) {
    return "medium";
  }

  return "high";
}

const SEGMENTS: Array<{
  id: string;
  label: string;
  description: string;
  categories: CatalogProductSummary["category"][];
}> = [
  {
    id: "footwear",
    label: "Buty",
    description: "Modele główne dostępne w formularzu natywnym z realnymi cenami warsztatowymi.",
    categories: ["footwear"]
  },
  {
    id: "accessories",
    label: "Akcesoria",
    description: "Pielęgnacja i dodatki, które dobierzesz podczas konfiguracji zamówienia.",
    categories: ["accessories"]
  },
  {
    id: "extras",
    label: "Dodatki",
    description: "Bukłak, karwasz i usługi wykończeniowe powiązane z formularzem natywnym.",
    categories: ["hydration", "care"]
  }
];

function formatPrice(priceGrosz: number) {
  return currencyFormatter.format(priceGrosz / 100);
}

function resolveOrderHref(orderReference?: CatalogProductSummary["orderReference"]): Route {
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

function getFunnelCta(stage: CatalogProductSummary["funnelStage"]) {
  switch (stage) {
    case "BOFU":
      return "Dodaj w zamówieniu";
    case "MOFU":
      return "Skonfiguruj w formularzu";
    default:
      return "Zobacz w formularzu";
  }
}

export function CatalogExplorer({
  styles,
  leathers,
  products
}: CatalogExplorerProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("price-asc");
  const [priceTier, setPriceTier] = useState<PriceTierFilter>("all");
  const [selectedColors, toggleColor] = useToggleList<string>();

  const stylesById = useMemo(
    () => new Map(styles.map((style) => [style.id, style])),
    [styles]
  );

  const leathersById = useMemo(
    () => new Map(leathers.map((leather) => [leather.id, leather])),
    [leathers]
  );

  const leatherColorById = useMemo(() => {
    const entries = new Map<number, string>();
    leathers.forEach((leather) => {
      entries.set(leather.id, leather.color.toLowerCase());
    });
    return entries;
  }, [leathers]);

  const colorOptions = useMemo(() => {
    const entries = new Map<string, string>();
    leathers.forEach((leather) => {
      const value = leather.color.toLowerCase();
      if (!entries.has(value)) {
        entries.set(value, leather.color);
      }
    });

    return Array.from(entries.entries()).map(([value, label]) => ({ value, label }));
  }, [leathers]);

  const filteredProducts = useMemo(() => {
    const withFilters = products.filter((product) => {
      const tier = resolvePriceTier(product.priceGrosz);
      const matchesTier = priceTier === "all" || tier === priceTier;
      const color = leatherColorById.get(product.leatherId);
      const matchesColor =
        selectedColors.length === 0 || (color && selectedColors.includes(color));

      return matchesTier && matchesColor;
    });

    const sorted = [...withFilters].sort((a, b) =>
      sortOrder === "price-asc"
        ? a.priceGrosz - b.priceGrosz
        : b.priceGrosz - a.priceGrosz
    );

    return sorted;
  }, [products, priceTier, selectedColors, leatherColorById, sortOrder]);

  const funnelAnchors = useMemo(() => {
    const anchors = new Map<CatalogProductSummary["funnelStage"], string>();
    filteredProducts.forEach((product) => {
      if (!anchors.has(product.funnelStage)) {
        anchors.set(product.funnelStage, product.id);
      }
    });

    return anchors;
  }, [filteredProducts]);

  const totalMatches = filteredProducts.length;

  return (
    <div className="catalog-layout" role="region" aria-labelledby="catalog-products-heading">
      <aside
        className="catalog-sidebar"
        aria-label="Filtry katalogu"
        tabIndex={-1}
      >
        <div className="catalog-sidebar__inner">
          <h2 className="catalog-sidebar__title">Filtry</h2>
          <form className="catalog-filters" aria-label="Wybierz filtry dla listy produktów">
            <fieldset className="catalog-filters__group">
              <legend>Kolejność cen</legend>
              <div className="catalog-filters__options" role="radiogroup" aria-label="Sortuj po cenie">
                <div className="catalog-filters__option">
                  <input
                    id="filter-price-asc"
                    type="radio"
                    name="price-order"
                    value="price-asc"
                    checked={sortOrder === "price-asc"}
                    onChange={() => setSortOrder("price-asc")}
                  />
                  <label htmlFor="filter-price-asc">Od najniższej</label>
                </div>
                <div className="catalog-filters__option">
                  <input
                    id="filter-price-desc"
                    type="radio"
                    name="price-order"
                    value="price-desc"
                    checked={sortOrder === "price-desc"}
                    onChange={() => setSortOrder("price-desc")}
                  />
                  <label htmlFor="filter-price-desc">Od najwyższej</label>
                </div>
              </div>
            </fieldset>

            <fieldset className="catalog-filters__group">
              <legend>Poziom cenowy</legend>
              <div className="catalog-filters__options" role="radiogroup" aria-label="Filtruj po poziomie cenowym">
                {(["all", "low", "medium", "high"] as PriceTierFilter[]).map((tier) => {
                  const inputId = `filter-tier-${tier}`;
                  const isChecked = priceTier === tier;
                  const label = tier === "all" ? "Dowolny" : PRICE_TIER_LABELS[tier];

                  return (
                    <div key={tier} className="catalog-filters__option">
                      <input
                        id={inputId}
                        type="radio"
                        name="price-tier"
                        value={tier}
                        checked={isChecked}
                        onChange={() => setPriceTier(tier)}
                      />
                      <label htmlFor={inputId}>{label}</label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="catalog-filters__group">
              <legend>Kolor skóry</legend>
              <div className="catalog-filters__options" role="group" aria-label="Filtruj po kolorze skóry">
                {colorOptions.map((option) => {
                  const checkboxId = `filter-color-${option.value}`;
                  const checked = selectedColors.includes(option.value);

                  return (
                    <div key={option.value} className="catalog-filters__option">
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleColor(option.value)}
                      />
                      <label htmlFor={checkboxId}>{option.label}</label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </form>
        </div>
      </aside>

      <section className="catalog-results" aria-live="polite">
        <nav className="catalog-category-nav" aria-label="Segmenty katalogu">
          {SEGMENTS.map((segment) => (
            <a
              key={segment.id}
              className="catalog-category-nav__button"
              href={`#segment-${segment.id}`}
            >
              {segment.label}
            </a>
          ))}
        </nav>
        <header className="catalog-toolbar">
          <div className="catalog-toolbar__summary">
            {totalMatches === 0 ? (
              <p>
                Nie znaleziono butów spełniających wybrane kryteria. Spróbuj innych filtrów lub {" "}
                <Link href="/catalog">zobacz całą kolekcję</Link>.
              </p>
            ) : (
              <p>
                {totalMatches} produkt{totalMatches === 1 ? "" : "y"} dopasowan{totalMatches === 1 ? "y" : "ych"}
                {priceTier === "all"
                  ? " w wybranych segmentach"
                  : ` w segmencie cenowym ${PRICE_TIER_LABELS[priceTier as Exclude<PriceTierFilter, "all">].toLowerCase()}`}
              </p>
            )}
          </div>
        </header>
        {SEGMENTS.map((segment) => {
          const segmentProducts = filteredProducts.filter((product) =>
            segment.categories.includes(product.category)
          );
          const segmentSize = segmentProducts.length;
          const segmentCountLabel =
            segmentSize === 0
              ? "Brak pozycji"
              : `${segmentSize} ${segmentSize === 1 ? "pozycja" : segmentSize >= 5 ? "pozycji" : "pozycje"}`;

          return (
            <section
              key={segment.id}
              id={`segment-${segment.id}`}
              className="catalog-segment"
              aria-labelledby={`segment-${segment.id}-heading`}
            >
              <header className="catalog-segment__header">
                <div className="catalog-segment__title">
                  <h2 id={`segment-${segment.id}-heading`}>{segment.label}</h2>
                  <span className="catalog-segment__count" aria-live="polite">
                    {segmentCountLabel}
                  </span>
                </div>
                <p>{segment.description}</p>
              </header>
              {segmentProducts.length === 0 ? (
                <p className="catalog-segment__empty">
                  W tym segmencie brak modeli dla wybranych filtrów. Zmień ustawienia, aby poznać więcej propozycji.
                </p>
              ) : (
                <ul className="catalog-grid" role="list" aria-label={`Lista produktów: ${segment.label}`}>
                  {segmentProducts.map((product) => {
                    const style = stylesById.get(product.styleId);
                    const leather = leathersById.get(product.leatherId);
                    const titleId = `${product.id}-title`;
                    const descriptionId = `${product.id}-description`;
                    const leadId = `${product.id}-lead`;
                    const summaryId = `${product.id}-summary`;
                    const funnelId = `${product.id}-funnel`;
                    const funnelCta = getFunnelCta(product.funnelStage);
                    const orderHref = resolveOrderHref(product.orderReference);
                    const anchorId =
                      funnelAnchors.get(product.funnelStage) === product.id
                        ? `funnel-${product.funnelStage.toLowerCase()}`
                        : undefined;

                    return (
                      <li key={product.id} className="catalog-card" id={anchorId}>
                        <article
                          className="catalog-card__inner"
                          tabIndex={0}
                          aria-labelledby={titleId}
                          aria-describedby={`${leadId} ${summaryId} ${descriptionId} ${funnelId}`}
                        >
                          <header className="catalog-card__header">
                            <div className="catalog-card__tags">
                              <span className="badge badge--category">{product.categoryLabel}</span>
                              <abbr className="badge badge--funnel" title={product.funnelLabel}>
                                {product.funnelStage}
                              </abbr>
                            </div>
                            <p className="catalog-card__eyebrow">{style?.era ?? "Kolekcja"}</p>
                            <h3 id={titleId}>{product.name}</h3>
                          </header>

                          <p id={leadId} className="catalog-card__lead">
                            {product.highlight}
                          </p>

                          <ul
                            id={summaryId}
                            className="catalog-card__summary"
                            aria-label={`Najważniejsze informacje o modelu ${product.name}`}
                          >
                            <li>
                              <span className="catalog-card__summary-label">Styl</span>
                              <span className="catalog-card__summary-value">{style?.name ?? "Nieznany"}</span>
                            </li>
                            <li>
                              <span className="catalog-card__summary-label">Skóra</span>
                              <span className="catalog-card__summary-value">
                                {leather?.name ?? "Nieznana"}
                                {leather?.color ? (
                                  <span className="catalog-card__summary-hint"> ({leather.color})</span>
                                ) : null}
                              </span>
                            </li>
                            <li>
                              <span className="catalog-card__summary-label">Etap zamówienia</span>
                              <span className="catalog-card__summary-value" id={funnelId}>
                                {product.funnelLabel}
                              </span>
                            </li>
                          </ul>

                          <p id={descriptionId} className="catalog-card__description">
                            {product.description}
                          </p>

                          <footer className="catalog-card__footer">
                            <p className="catalog-card__price" aria-label={`Cena: ${formatPrice(product.priceGrosz)}`}>
                              {formatPrice(product.priceGrosz)}
                            </p>
                            <div className="catalog-card__cta-group">
                              <Link
                                className="catalog-card__cta"
                                href={`/catalog/${product.slug}`}
                                aria-label={`Poznaj szczegóły modelu ${product.name}`}
                                prefetch={false}
                              >
                                Poznaj szczegóły
                              </Link>
                              <Link
                                className="catalog-card__cta catalog-card__cta--secondary"
                                href={orderHref}
                                aria-label={`${funnelCta} dla produktu ${product.name} w formularzu zamówienia`}
                                prefetch={false}
                              >
                                {funnelCta}
                              </Link>
                            </div>
                          </footer>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </section>
    </div>
  );
}
