"use client";

import React, { useMemo, useState } from "react";

import Link from "next/link";
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

type SortOrder = "name-asc" | "name-desc";

type ToggleHandler = (value: number) => void;

function useToggleList(initial: number[] = []): [number[], ToggleHandler] {
  const [selected, setSelected] = useState<number[]>(initial);

  const toggle: ToggleHandler = (value) => {
    setSelected((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      return [...current, value];
    });
  };

  return [selected, toggle];
}

function formatPrice(priceGrosz: number) {
  return currencyFormatter.format(priceGrosz / 100);
}

export function CatalogExplorer({
  styles,
  leathers,
  products
}: CatalogExplorerProps) {
  const [selectedStyleIds, toggleStyle] = useToggleList();
  const [selectedLeatherIds, toggleLeather] = useToggleList();
  const [sortOrder, setSortOrder] = useState<SortOrder>("name-asc");

  const stylesById = useMemo(
    () => new Map(styles.map((style) => [style.id, style])),
    [styles]
  );

  const leathersById = useMemo(
    () => new Map(leathers.map((leather) => [leather.id, leather])),
    [leathers]
  );

  const filteredProducts = useMemo(() => {
    const withFilters = products.filter((product) => {
      const matchesStyle =
        selectedStyleIds.length === 0 || selectedStyleIds.includes(product.styleId);
      const matchesLeather =
        selectedLeatherIds.length === 0 || selectedLeatherIds.includes(product.leatherId);

      return matchesStyle && matchesLeather;
    });

    const sorted = [...withFilters].sort((a, b) =>
      sortOrder === "name-asc"
        ? a.name.localeCompare(b.name, "pl")
        : b.name.localeCompare(a.name, "pl")
    );

    return sorted;
  }, [products, selectedStyleIds, selectedLeatherIds, sortOrder]);

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
              <legend>Styl</legend>
              <div className="catalog-filters__options" role="group" aria-label="Filtruj po stylu">
                {styles.map((style) => {
                  const checkboxId = `filter-style-${style.id}`;
                  const checked = selectedStyleIds.includes(style.id);

                  return (
                    <div key={style.id} className="catalog-filters__option">
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleStyle(style.id)}
                      />
                      <label htmlFor={checkboxId}>{style.name}</label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="catalog-filters__group">
              <legend>Skóra</legend>
              <div className="catalog-filters__options" role="group" aria-label="Filtruj po materiale">
                {leathers.map((leather) => {
                  const checkboxId = `filter-leather-${leather.id}`;
                  const checked = selectedLeatherIds.includes(leather.id);

                  return (
                    <div key={leather.id} className="catalog-filters__option">
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLeather(leather.id)}
                      />
                      <label htmlFor={checkboxId}>
                        {leather.name}
                        <span className="catalog-filters__hint">({leather.color})</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </form>
        </div>
      </aside>

      <section className="catalog-results" aria-live="polite">
        <header className="catalog-toolbar">
          <div className="catalog-toolbar__summary">
            {filteredProducts.length === 0 ? (
              <p>Brak wyników dla wybranych filtrów.</p>
            ) : (
              <p>
                {filteredProducts.length} produkt{filteredProducts.length === 1 ? "" : "y"} w kolekcji
              </p>
            )}
          </div>
          <div className="catalog-toolbar__sort">
            <label htmlFor="catalog-sort" className="catalog-toolbar__label">
              Sortuj
            </label>
            <select
              id="catalog-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              aria-label="Sortuj listę produktów"
            >
              <option value="name-asc">Nazwa A–Z</option>
              <option value="name-desc">Nazwa Z–A</option>
            </select>
          </div>
        </header>

        <ul className="catalog-grid" role="list" aria-label="Lista produktów">
          {filteredProducts.map((product) => {
            const style = stylesById.get(product.styleId);
            const leather = leathersById.get(product.leatherId);
            const titleId = `${product.id}-title`;
            const descriptionId = `${product.id}-description`;
            const metaId = `${product.id}-meta`;

            return (
              <li key={product.id} className="catalog-card">
                <article
                  className="catalog-card__inner"
                  tabIndex={0}
                  aria-labelledby={titleId}
                  aria-describedby={`${descriptionId} ${metaId}`}
                >
                  <header className="catalog-card__header">
                    <p className="catalog-card__eyebrow">{style?.era ?? "Kolekcja"}</p>
                    <h3 id={titleId}>{product.name}</h3>
                  </header>

                  <p id={descriptionId} className="catalog-card__description">
                    {product.description}
                  </p>

                  <dl id={metaId} className="catalog-card__meta">
                    <div>
                      <dt>Styl</dt>
                      <dd>{style?.name ?? "Nieznany"}</dd>
                    </div>
                    <div>
                      <dt>Skóra</dt>
                      <dd>
                        {leather?.name ?? "Nieznana"}
                        {leather?.color ? <span className="catalog-card__meta-hint"> ({leather.color})</span> : null}
                      </dd>
                    </div>
                    <div>
                      <dt>Detal</dt>
                      <dd>{product.highlight}</dd>
                    </div>
                  </dl>

                  <footer className="catalog-card__footer">
                    <p className="catalog-card__price" aria-label={`Cena: ${formatPrice(product.priceGrosz)}`}>
                      {formatPrice(product.priceGrosz)}
                    </p>
                    <Link
                      className="catalog-card__cta"
                      href={`/catalog/${product.slug}`}
                      aria-label={`Poznaj szczegóły modelu ${product.name}`}
                      prefetch={false}
                    >
                      Poznaj szczegóły
                    </Link>
                  </footer>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
