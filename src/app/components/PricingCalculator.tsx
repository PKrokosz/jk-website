"use client";

import { useMemo, useState } from "react";
import { calculateQuote } from "@/lib/pricing/calc";

interface SelectOption {
  id: number;
  label: string;
  description?: string;
  priceModGrosz?: number;
}

const styles: SelectOption[] = [
  { id: 1, label: "Oxford klasyczny", description: "Ponadczasowa sylwetka" },
  {
    id: 2,
    label: "Derby bespoke",
    description: "Więcej miejsca na podbiciu",
    priceModGrosz: 15000
  },
  {
    id: 3,
    label: "Monk z podwójną klamrą",
    description: "Podkreśla indywidualny charakter",
    priceModGrosz: 22000
  }
];

const leathers: SelectOption[] = [
  { id: 11, label: "Skóra cielęca", description: "Gładka, ręcznie polerowana" },
  {
    id: 12,
    label: "Skóra zamszowa",
    description: "Miękka faktura o głębokim kolorze",
    priceModGrosz: 12000
  },
  {
    id: 13,
    label: "Egzotyczna (krokodyl)",
    description: "Limitowana edycja",
    priceModGrosz: 42000
  }
];

const extras: SelectOption[] = [
  {
    id: 101,
    label: "Podeszwa garbowana roślinnie",
    description: "Trwalsza i biodegradowalna",
    priceModGrosz: 8000
  },
  {
    id: 102,
    label: "Grawer inicjałów",
    description: "Dodatkowy detal personalizujący",
    priceModGrosz: 4000
  },
  {
    id: 103,
    label: "Para drzewiaków",
    description: "Utrzymuje kształt obuwia",
    priceModGrosz: 9000
  }
];

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2
});

export function PricingCalculator() {
  const [selectedStyle, setSelectedStyle] = useState<SelectOption>(styles[0]);
  const [selectedLeather, setSelectedLeather] = useState<SelectOption>(leathers[0]);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);

  const quote = useMemo(() => {
    const options = [
      selectedStyle,
      selectedLeather,
      ...extras.filter((option) => selectedExtras.includes(option.id))
    ].map((option) => ({
      id: option.id,
      priceModGrosz: option.priceModGrosz ?? 0
    }));

    return calculateQuote({ options });
  }, [selectedExtras, selectedLeather, selectedStyle]);

  const toggleExtra = (id: number) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((extraId) => extraId !== id) : [...prev, id]
    );
  };

  return (
    <section className="section" aria-labelledby="calculator-heading">
      <div className="container">
        <div className="section-header">
          <h2 id="calculator-heading">Kalkulator wyceny</h2>
          <p>Szacunkowa wycena uwzględnia bazową parę oraz wybrane personalizacje.</p>
        </div>
        <div className="calculator">
          <form className="calculator__form" aria-describedby="calculator-note">
            <div className="field">
              <label htmlFor="style">Model</label>
              <select
                id="style"
                value={selectedStyle.id}
                onChange={(event) =>
                  setSelectedStyle(
                    styles.find((style) => style.id === Number(event.target.value)) ?? styles[0]
                  )
                }
              >
                {styles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                    {style.priceModGrosz ? " (" + currencyFormatter.format(style.priceModGrosz / 100) + ")" : ""}
                  </option>
                ))}
              </select>
              <p className="field__hint">{selectedStyle.description}</p>
            </div>

            <div className="field">
              <label htmlFor="leather">Skóra</label>
              <select
                id="leather"
                value={selectedLeather.id}
                onChange={(event) =>
                  setSelectedLeather(
                    leathers.find((item) => item.id === Number(event.target.value)) ?? leathers[0]
                  )
                }
              >
                {leathers.map((leather) => (
                  <option key={leather.id} value={leather.id}>
                    {leather.label}
                    {leather.priceModGrosz
                      ? " (" + currencyFormatter.format(leather.priceModGrosz / 100) + ")"
                      : ""}
                  </option>
                ))}
              </select>
              <p className="field__hint">{selectedLeather.description}</p>
            </div>

            <fieldset className="field">
              <legend>Dodatki</legend>
              <div className="field__group">
                {extras.map((extra) => {
                  const checked = selectedExtras.includes(extra.id);
                  return (
                    <label key={extra.id} className="checkbox">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleExtra(extra.id)}
                        aria-describedby={`extra-${extra.id}-hint`}
                      />
                      <span className="checkbox__content">
                        <span className="checkbox__label">{extra.label}</span>
                        <span id={`extra-${extra.id}-hint`} className="field__hint">
                          {extra.description}
                          {extra.priceModGrosz
                            ? ` (+${currencyFormatter.format(extra.priceModGrosz / 100)})`
                            : ""}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <p id="calculator-note" className="field__hint">
              Ceny mają charakter orientacyjny. Finalna wycena powstaje po konsultacji z mistrzem
              szewskim.
            </p>
          </form>

          <aside className="calculator__summary" aria-live="polite">
            <h3>Podsumowanie</h3>
            <dl className="summary-list">
              <div>
                <dt>Kwota netto</dt>
                <dd>{currencyFormatter.format(quote.totalNetGrosz / 100)}</dd>
              </div>
              <div>
                <dt>VAT</dt>
                <dd>{currencyFormatter.format(quote.totalVatGrosz / 100)}</dd>
              </div>
              <div className="summary-total">
                <dt>Suma brutto</dt>
                <dd>{currencyFormatter.format(quote.totalGrossGrosz / 100)}</dd>
              </div>
            </dl>
            <ul className="breakdown">
              {quote.breakdown.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <span>{currencyFormatter.format(item.amountGrosz / 100)}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
