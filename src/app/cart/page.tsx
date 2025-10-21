"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useCart } from "@/components/cart/CartProvider";

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2
});

function formatDate(isoDate: string) {
  try {
    return new Date(isoDate).toLocaleString("pl-PL", {
      dateStyle: "long",
      timeStyle: "short"
    });
  } catch {
    return isoDate;
  }
}

export default function CartPage() {
  const { items, removeItem, clear } = useCart();

  const totals = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.net += item.totalNetGrosz;
          acc.vat += item.totalVatGrosz;
          acc.gross += item.totalGrossGrosz;
          return acc;
        },
        { net: 0, vat: 0, gross: 0 }
      ),
    [items]
  );

  if (items.length === 0) {
    return (
      <main className="page cart-page">
        <section className="section" aria-labelledby="cart-heading">
          <div className="container cart-empty">
            <div className="cart-empty__content">
              <p className="eyebrow">Koszyk</p>
              <h1 id="cart-heading">Twój koszyk czeka na pierwszą konfigurację</h1>
              <p>
                Skorzystaj z kalkulatora wyceny na stronie głównej, wybierz dodatki i zapisz konfigurację,
                abyśmy mogli przygotować konsultację i szczegółową wycenę.
              </p>
              <div className="cart-empty__actions">
                <Link className="button button--primary" href="/">
                  Wróć na stronę główną
                </Link>
                <Link className="button button--ghost" href="/catalog">
                  Przeglądaj katalog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page cart-page">
      <section className="section" aria-labelledby="cart-heading">
        <div className="container cart-layout">
          <header className="cart-header">
            <p className="eyebrow">Koszyk</p>
            <h1 id="cart-heading">Twoje konfiguracje do zamówienia</h1>
            <p>
              Prześlij nam poniższe informacje, abyśmy mogli przygotować konsultację i wstępną ofertę.
              Po finalizacji potwierdzimy terminy oraz dobierzemy szczegóły wykonania.
            </p>
          </header>

          <div className="cart-content">
            <div className="cart-items" role="list">
              {items.map((item) => (
                <article key={item.id} className="cart-card" role="listitem">
                  <header className="cart-card__header">
                    <div>
                      <p className="cart-card__timestamp">Dodano {formatDate(item.createdAt)}</p>
                      <h2>Model {item.modelLabel}</h2>
                    </div>
                    <button
                      type="button"
                      className="button button--ghost cart-card__remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Usuń konfigurację
                    </button>
                  </header>

                  <div className="cart-card__body">
                    <section aria-labelledby={`cart-item-${item.id}-summary`} className="cart-card__section">
                      <h3 id={`cart-item-${item.id}-summary`}>Elementy zamówienia</h3>
                      <ul className="cart-card__list">
                        <li>
                          <span>Model bazowy</span>
                          <span>{currencyFormatter.format(item.basePriceGrosz / 100)}</span>
                        </li>
                        {item.accessories.map((accessory) => (
                          <li key={accessory.id}>
                            <span>{accessory.label}</span>
                            <span>{currencyFormatter.format(accessory.priceGrosz / 100)}</span>
                          </li>
                        ))}
                        {item.extras.map((extra) => (
                          <li key={extra.id}>
                            <span>{extra.label}</span>
                            <span>{currencyFormatter.format(extra.priceGrosz / 100)}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section aria-labelledby={`cart-item-${item.id}-contact`} className="cart-card__section">
                      <h3 id={`cart-item-${item.id}-contact`}>Dane kontaktowe</h3>
                      <dl className="cart-card__details">
                        <div>
                          <dt>Klient</dt>
                          <dd>{item.contact.fullName}</dd>
                        </div>
                        <div>
                          <dt>E-mail</dt>
                          <dd>{item.contact.email}</dd>
                        </div>
                        {item.contact.preferredDelivery ? (
                          <div>
                            <dt>Preferowany termin</dt>
                            <dd>{item.contact.preferredDelivery}</dd>
                          </div>
                        ) : null}
                        {item.contact.notes ? (
                          <div>
                            <dt>Notatki</dt>
                            <dd>{item.contact.notes}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </section>
                  </div>

                  <footer className="cart-card__footer">
                    <div className="cart-card__totals">
                      <span>Suma brutto</span>
                      <strong>{currencyFormatter.format(item.totalGrossGrosz / 100)}</strong>
                    </div>
                    <Link className="cart-card__cta" href="mailto:pracownia@jk-footwear.pl">
                      Wyślij konfigurację do pracowni
                    </Link>
                  </footer>
                </article>
              ))}
            </div>

            <aside className="cart-summary" aria-label="Podsumowanie koszyka">
              <h2>Podsumowanie</h2>
              <dl className="cart-summary__list">
                <div>
                  <dt>Łącznie netto</dt>
                  <dd>{currencyFormatter.format(totals.net / 100)}</dd>
                </div>
                <div>
                  <dt>Łącznie VAT</dt>
                  <dd>{currencyFormatter.format(totals.vat / 100)}</dd>
                </div>
                <div className="cart-summary__total">
                  <dt>Łącznie brutto</dt>
                  <dd>{currencyFormatter.format(totals.gross / 100)}</dd>
                </div>
              </dl>
              <p className="cart-summary__hint">
                Konfiguracje zapisują się lokalnie na tym urządzeniu. Podczas konsultacji potwierdzimy
                finalną wycenę i terminy realizacji.
              </p>
              <div className="cart-summary__actions">
                <Link className="button button--primary" href="mailto:pracownia@jk-footwear.pl">
                  Wyślij zamówienie e-mailem
                </Link>
                <button type="button" className="button button--ghost" onClick={clear}>
                  Wyczyść koszyk
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
