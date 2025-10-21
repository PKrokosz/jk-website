"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import type { PricingQuote } from "@/lib/pricing/calc";

export interface OrderDetailsFormValues {
  fullName: string;
  email: string;
  preferredDelivery?: string;
  notes?: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  configuration: {
    model: { id: string; label: string; priceGrosz: number } | null;
    accessories: Array<{ id: string; label: string; priceGrosz: number }>;
    extras: Array<{ id: string; label: string; priceGrosz: number }>;
    quote: PricingQuote;
  };
  onSubmit: (values: OrderDetailsFormValues) => void | Promise<void>;
}

const initialFormValues: OrderDetailsFormValues = {
  fullName: "",
  email: "",
  preferredDelivery: "",
  notes: ""
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2
});

export function OrderDetailsModal({
  isOpen,
  onClose,
  configuration,
  onSubmit
}: OrderDetailsModalProps) {
  const [formValues, setFormValues] = useState<OrderDetailsFormValues>(initialFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderDetailsFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const { model, accessories, extras, quote } = configuration;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormValues(initialFormValues);
    setErrors({});
    setFormError(null);
    setSubmitting(false);

    const timer = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const configurationItems = useMemo(() => {
    if (!model) {
      return [] as Array<{ id: string; label: string; amount: number }>;
    }

    const baseItems: Array<{ id: string; label: string; amount: number }> = [
      {
        id: model.id,
        label: `Model ${model.label}`,
        amount: model.priceGrosz
      }
    ];

    const accessoryItems = accessories.map((item) => ({
      id: item.id,
      label: item.label,
      amount: item.priceGrosz
    }));

    const extraItems = extras.map((item) => ({
      id: item.id,
      label: item.label,
      amount: item.priceGrosz
    }));

    return [...baseItems, ...accessoryItems, ...extraItems];
  }, [accessories, extras, model]);

  const breakdownItems = useMemo(
    () =>
      quote.breakdown.map((item) => ({
        label: item.label,
        amount: currencyFormatter.format(item.amountGrosz / 100)
      })),
    [quote.breakdown]
  );

  const hasContent = Boolean(model);

  if (!isOpen || !hasContent || !model) {
    return null;
  }

  const validate = (values: OrderDetailsFormValues) => {
    const nextErrors: Partial<Record<keyof OrderDetailsFormValues, string>> = {};

    if (values.fullName.trim().length === 0) {
      nextErrors.fullName = "Podaj imię i nazwisko, abyśmy wiedzieli, z kim się kontaktować.";
    }

    if (!emailRegex.test(values.email.trim())) {
      nextErrors.email = "Podaj poprawny adres e-mail.";
    }

    if (values.notes && values.notes.trim().length > 500) {
      nextErrors.notes = "Notatki mogą mieć maksymalnie 500 znaków.";
    }

    if (values.preferredDelivery && values.preferredDelivery.trim().length > 120) {
      nextErrors.preferredDelivery = "Preferencje terminu mogą mieć maksymalnie 120 znaków.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validate(formValues);

    if (Object.keys(validationResult).length > 0) {
      setErrors(validationResult);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setFormError(null);

    const payload: OrderDetailsFormValues = {
      fullName: formValues.fullName.trim(),
      email: formValues.email.trim(),
      preferredDelivery: formValues.preferredDelivery?.trim() || undefined,
      notes: formValues.notes?.trim() || undefined
    };

    try {
      await onSubmit(payload);
      setFormValues(initialFormValues);
    } catch (error) {
      console.error("Nie udało się zapisać konfiguracji w koszyku", error);
      setFormError("Nie udało się dodać konfiguracji. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="order-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="order-modal__panel order-details-modal">
        <button type="button" className="order-modal__close" onClick={onClose}>
          Zamknij
        </button>
        <div className="order-modal__header">
          <p className="order-details-modal__eyebrow">Twoja konfiguracja</p>
          <h2 id="order-details-title" className="order-modal__title">
            Uzupełnij dane zamówienia
          </h2>
          <p className="order-modal__description">
            Zapisz konfigurację w koszyku, aby kontynuować konsultacje i wycenę.
          </p>
        </div>
        <div className="order-modal__body order-details-modal__body">
          <section className="order-details-summary" aria-labelledby="order-details-summary-heading">
            <h3 id="order-details-summary-heading">Wybrane elementy</h3>
            <ul className="order-details-summary__list">
              {configurationItems.map((item) => (
                <li key={item.id}>
                  <span>{item.label}</span>
                  <span>{currencyFormatter.format(item.amount / 100)}</span>
                </li>
              ))}
            </ul>
            <dl className="order-details-summary__breakdown">
              {breakdownItems.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.amount}</dd>
                </div>
              ))}
            </dl>
            <div className="order-details-summary__total">
              <span>Suma brutto</span>
              <strong>{currencyFormatter.format(quote.totalGrossGrosz / 100)}</strong>
            </div>
          </section>

          <form className="order-details-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="order-full-name">Imię i nazwisko</label>
              <input
                id="order-full-name"
                ref={firstFieldRef}
                type="text"
                value={formValues.fullName}
                onChange={(event) => setFormValues((prev) => ({ ...prev, fullName: event.target.value }))}
                autoComplete="name"
                maxLength={120}
                required
                aria-invalid={errors.fullName ? "true" : undefined}
                aria-describedby={errors.fullName ? "order-full-name-error" : undefined}
              />
              {errors.fullName ? (
                <p id="order-full-name-error" className="order-details-form__error">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="order-email">Adres e-mail</label>
              <input
                id="order-email"
                type="email"
                value={formValues.email}
                onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
                autoComplete="email"
                required
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "order-email-error" : undefined}
              />
              {errors.email ? (
                <p id="order-email-error" className="order-details-form__error">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="order-preferred-delivery">Preferowany termin (opcjonalnie)</label>
              <input
                id="order-preferred-delivery"
                type="text"
                value={formValues.preferredDelivery}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, preferredDelivery: event.target.value }))
                }
                placeholder="Np. odbiór na koniec czerwca"
                autoComplete="off"
                maxLength={120}
                aria-invalid={errors.preferredDelivery ? "true" : undefined}
                aria-describedby={
                  errors.preferredDelivery ? "order-preferred-delivery-error" : undefined
                }
              />
              {errors.preferredDelivery ? (
                <p id="order-preferred-delivery-error" className="order-details-form__error">
                  {errors.preferredDelivery}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="order-notes">Notatki do zamówienia (opcjonalnie)</label>
              <textarea
                id="order-notes"
                value={formValues.notes}
                onChange={(event) => setFormValues((prev) => ({ ...prev, notes: event.target.value }))}
                rows={4}
                maxLength={500}
                aria-invalid={errors.notes ? "true" : undefined}
                aria-describedby={errors.notes ? "order-notes-error" : undefined}
              />
              {errors.notes ? (
                <p id="order-notes-error" className="order-details-form__error">
                  {errors.notes}
                </p>
              ) : (
                <p className="field__hint">Podaj dodatkowe informacje, które przydadzą się mistrzowi.</p>
              )}
            </div>

            {formError ? (
              <p role="alert" className="order-details-form__error order-details-form__error--global">
                {formError}
              </p>
            ) : null}

            <div className="order-details-form__actions">
              <button type="submit" className="button button--primary" disabled={submitting}>
                {submitting ? "Zapisywanie..." : "Dodaj do koszyka"}
              </button>
              <button type="button" className="button button--ghost" onClick={onClose}>
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
