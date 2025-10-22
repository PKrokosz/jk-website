"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  useCart,
  type CartItemOptionSummary
} from "@/components/cart/CartProvider";
import { ORDER_ACCESSORIES } from "@/config/orderAccessories";
import { ORDER_MODELS } from "@/config/orderModels";
import { ORDER_EXTRAS } from "@/config/orderExtras";
import { calculateQuote } from "@/lib/pricing/calc";

import { OrderDetailsModal, type OrderDetailsFormValues } from "@/components/ui/order/OrderDetailsModal";

interface ModelOption {
  id: string;
  label: string;
  description: string;
  priceGrosz: number;
}

interface AddonOption {
  id: string;
  label: string;
  description?: string;
  priceGrosz: number;
}

const models: ModelOption[] = ORDER_MODELS.map((model) => ({
  id: model.id,
  label: model.name,
  description: model.googleValue.replace(/-\s*(\d)/, " – $1"),
  priceGrosz: Math.round(model.price * 100)
}));

const defaultModelId = models[0]?.id ?? "";

const accessories: AddonOption[] = ORDER_ACCESSORIES.map((accessory) => ({
  id: accessory.id,
  label: accessory.name,
  description: accessory.description,
  priceGrosz: Math.round(accessory.price * 100)
}));

const serviceExtras: AddonOption[] = ORDER_EXTRAS.map((extra) => ({
  id: extra.id,
  label: extra.name,
  description: extra.description,
  priceGrosz: Math.round(extra.price * 100)
}));

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2
});

export function PricingCalculator() {
  const [selectedModelId, setSelectedModelId] = useState<string>(defaultModelId);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [accessoriesOpen, setAccessoriesOpen] = useState(true);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const router = useRouter();
  const { addItem } = useCart();

  const selectedModel = useMemo(
    () => models.find((model) => model.id === selectedModelId) ?? null,
    [selectedModelId]
  );

  const quote = useMemo(() => {
    const accessoryOptions = accessories
      .filter((accessory) => selectedAccessories.includes(accessory.id))
      .map((accessory) => ({
        id: accessory.id,
        label: accessory.label,
        priceModGrosz: accessory.priceGrosz
      }));

    const extraOptions = serviceExtras
      .filter((extra) => selectedExtras.includes(extra.id))
      .map((extra) => ({
        id: extra.id,
        label: extra.label,
        priceModGrosz: extra.priceGrosz
      }));

    return calculateQuote({
      basePriceGrosz: selectedModel?.priceGrosz,
      baseLabel: selectedModel ? `Model ${selectedModel.label}` : undefined,
      options: [...accessoryOptions, ...extraOptions]
    });
  }, [selectedAccessories, selectedExtras, selectedModel]);

  useEffect(() => {
    if (
      selectedAccessories.length > 0 ||
      selectedExtras.length > 0 ||
      (defaultModelId && selectedModelId !== defaultModelId)
    ) {
      setHasInteracted(true);
    }
  }, [selectedAccessories, selectedExtras, selectedModelId]);

  const selectedAccessoryItems = useMemo(
    () => accessories.filter((accessory) => selectedAccessories.includes(accessory.id)),
    [selectedAccessories]
  );

  const selectedExtraItems = useMemo(
    () => serviceExtras.filter((extra) => selectedExtras.includes(extra.id)),
    [selectedExtras]
  );

  const handleModelChange = (value: string) => {
    setSelectedModelId(value);
    if (value !== defaultModelId) {
      setHasInteracted(true);
    }
  };

  const toggleAccessory = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((accessoryId) => accessoryId !== id) : [...prev, id]
    );
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((extraId) => extraId !== id) : [...prev, id]
    );
  };

  return (
    <section className="section" aria-labelledby="calculator-heading">
      <div className="container">
        <div className="section-header">
          <h2 id="calculator-heading">Kalkulator wyceny</h2>
          <p>
            Sprawdź, jak zmienia się orientacyjna cena przy wyborze modeli i dodatków dostępnych w
            formularzu zamówienia.
          </p>
        </div>
        <div className="calculator">
          <form className="calculator__form" aria-describedby="calculator-note">
            <div className="field">
              <label htmlFor="model">Model z katalogu</label>
              <select
                id="model"
                value={selectedModelId}
                onChange={(event) => handleModelChange(event.target.value)}
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label} ({currencyFormatter.format(model.priceGrosz / 100)})
                  </option>
                ))}
              </select>
              <p className="field__hint">
                {selectedModel?.description ?? "Wybierz model, aby zobaczyć cenę bazową."}
              </p>
            </div>

            <fieldset className="field collapsible-field">
              <legend>
                <button
                  type="button"
                  className="collapsible-trigger"
                  aria-expanded={accessoriesOpen}
                  aria-controls="accessories-panel"
                  onClick={() => setAccessoriesOpen((prev) => !prev)}
                >
                  <span className="collapsible-trigger__label">Akcesoria</span>
                  <span className="collapsible-trigger__meta">
                    {selectedAccessories.length > 0
                      ? `${selectedAccessories.length} wybrane`
                      : "Opcjonalne dodatki"}
                  </span>
                  <span aria-hidden className="collapsible-trigger__icon" />
                </button>
              </legend>
              <div
                className="field__group collapsible-panel"
                id="accessories-panel"
                hidden={!accessoriesOpen}
                aria-hidden={!accessoriesOpen}
              >
                {accessories.map((accessory) => {
                  const checked = selectedAccessories.includes(accessory.id);
                  return (
                    <label key={accessory.id} className="checkbox">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAccessory(accessory.id)}
                        aria-describedby={`accessory-${accessory.id}-hint`}
                      />
                      <span className="checkbox__content">
                        <span className="checkbox__label">{accessory.label}</span>
                        <span id={`accessory-${accessory.id}-hint`} className="field__hint">
                          {accessory.description}
                          {` (+${currencyFormatter.format(accessory.priceGrosz / 100)})`}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="field collapsible-field">
              <legend>
                <button
                  type="button"
                  className="collapsible-trigger"
                  aria-expanded={extrasOpen}
                  aria-controls="extras-panel"
                  onClick={() => setExtrasOpen((prev) => !prev)}
                >
                  <span className="collapsible-trigger__label">Dodatkowe usługi</span>
                  <span className="collapsible-trigger__meta">
                    {selectedExtras.length > 0
                      ? `${selectedExtras.length} wybrane`
                      : "Rozszerzenia serwisowe"}
                  </span>
                  <span aria-hidden className="collapsible-trigger__icon" />
                </button>
              </legend>
              <div
                className="field__group collapsible-panel"
                id="extras-panel"
                hidden={!extrasOpen}
                aria-hidden={!extrasOpen}
              >
                {serviceExtras.map((extra) => {
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
            {selectedModel && (
              <button
                type="button"
                className="order-button order-button--active"
                onClick={() => setIsOrderModalOpen(true)}
                disabled={!hasInteracted}
                aria-disabled={!hasInteracted}
              >
                Dodaj konfigurację do koszyka
              </button>
            )}
          </aside>
        </div>
      </div>
      <OrderDetailsModal
        isOpen={isOrderModalOpen && Boolean(selectedModel)}
        onClose={() => setIsOrderModalOpen(false)}
        configuration={{
          model: selectedModel,
          accessories: selectedAccessoryItems,
          extras: selectedExtraItems,
          quote
        }}
        onSubmit={(values: OrderDetailsFormValues) => {
          if (!selectedModel) {
            return;
          }

          const accessoriesSummary: CartItemOptionSummary[] = selectedAccessoryItems.map((item) => ({
            id: item.id,
            label: item.label,
            priceGrosz: item.priceGrosz
          }));

          const extrasSummary: CartItemOptionSummary[] = selectedExtraItems.map((item) => ({
            id: item.id,
            label: item.label,
            priceGrosz: item.priceGrosz
          }));

          addItem({
            modelId: selectedModel.id,
            modelLabel: selectedModel.label,
            basePriceGrosz: selectedModel.priceGrosz,
            accessories: accessoriesSummary,
            extras: extrasSummary,
            totalNetGrosz: quote.totalNetGrosz,
            totalVatGrosz: quote.totalVatGrosz,
            totalGrossGrosz: quote.totalGrossGrosz,
            breakdown: quote.breakdown,
            contact: values
          });

          setIsOrderModalOpen(false);
          router.push("/cart");
        }}
      />
    </section>
  );
}
