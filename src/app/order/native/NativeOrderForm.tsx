"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ORDER_ACCESSORIES } from "@/config/orderAccessories";
import { ORDER_COLORS, ORDER_SIZES } from "@/config/orderOptions";
import { ORDER_MODELS } from "@/config/orderModels";
import { orderFormSchema, type OrderFormInput } from "@/lib/order/schema";

interface NativeOrderFormState {
  fullName: string;
  phoneNumber: string;
  parcelLockerCode: string;
  email: string;
  footLength: string;
  instepCircumference: string;
  calfCircumference: string;
  modelId: string;
  color: string;
  size: string;
  accessories: string[];
  waterskinSelected: boolean;
  waterskinSymbol: string;
  bracerSelected: boolean;
  bracerColor: string;
  shoeTrees: boolean;
  discountCode: string;
  notes: string;
}

const INITIAL_STATE: NativeOrderFormState = {
  fullName: "",
  phoneNumber: "",
  parcelLockerCode: "",
  email: "",
  footLength: "",
  instepCircumference: "",
  calfCircumference: "",
  modelId: "",
  color: ORDER_COLORS[0]?.id ?? "brown",
  size: ORDER_SIZES[0]?.id ?? "36",
  accessories: [],
  waterskinSelected: false,
  waterskinSymbol: "",
  bracerSelected: false,
  bracerColor: "",
  shoeTrees: false,
  discountCode: "",
  notes: ""
};

const measurementHint = "Podaj wymiar w centymetrach, używając kropki lub przecinka w przypadku wartości dziesiętnych.";

type FieldErrorMap = Record<string, string | undefined>;

const toOrderFormInput = (state: NativeOrderFormState): OrderFormInput => ({
  fullName: state.fullName,
  phoneNumber: state.phoneNumber,
  parcelLockerCode: state.parcelLockerCode,
  email: state.email,
  footLength: state.footLength,
  instepCircumference: state.instepCircumference,
  calfCircumference: state.calfCircumference,
  modelId: state.modelId,
  color: state.color,
  size: state.size,
  accessories: state.accessories,
  waterskin: {
    selected: state.waterskinSelected,
    symbol: state.waterskinSymbol
  },
  bracer: {
    selected: state.bracerSelected,
    color: state.bracerColor
  },
  shoeTrees: state.shoeTrees,
  discountCode: state.discountCode,
  notes: state.notes
});

const getError = (errors: FieldErrorMap, path: string) => errors[path];

export function NativeOrderForm() {
  const router = useRouter();
  const [state, setState] = React.useState<NativeOrderFormState>(INITIAL_STATE);
  const [showOptionalCalf, setShowOptionalCalf] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldErrorMap>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectedModel = React.useMemo(
    () => ORDER_MODELS.find((model) => model.id === state.modelId) ?? null,
    [state.modelId]
  );

  const shouldShowCalfCircumference =
    selectedModel?.requiresCalfMeasurement || showOptionalCalf || state.calfCircumference.trim().length > 0;

  const handleChange = <K extends keyof NativeOrderFormState>(key: K, value: NativeOrderFormState[K]) => {
    setState((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAccessoryToggle = (id: string) => {
    setState((prev) => {
      const set = new Set(prev.accessories);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return {
        ...prev,
        accessories: Array.from(set)
      };
    });
  };

  const handleModelSelect = (id: string) => {
    handleChange("modelId", id);
    const model = ORDER_MODELS.find((item) => item.id === id);
    const requiresCalf = model?.requiresCalfMeasurement ?? false;
    setShowOptionalCalf(requiresCalf);
    if (!requiresCalf) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.calfCircumference;
        return next;
      });
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const result = orderFormSchema.safeParse(toOrderFormInput(state));

    if (!result.success) {
      const fieldErrors: FieldErrorMap = {};
      for (const issue of result.error.issues) {
        if (issue.path.length > 0) {
          fieldErrors[issue.path.join(".")] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/order/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(result.data)
      });

      if (!response.ok) {
        setSubmitError("Nie udało się wysłać formularza. Spróbuj ponownie lub skorzystaj z pełnego formularza.");
        setIsSubmitting(false);
        return;
      }

      const params = new URLSearchParams();
      params.set("name", result.data.fullName);
      router.push(`/order/thanks?${params.toString()}`);
    } catch (error) {
      setSubmitError("Wystąpił błąd podczas wysyłania. Sprawdź połączenie i spróbuj ponownie.");
      setIsSubmitting(false);
    }
  };

  return (
    <form className="order-native__form" onSubmit={onSubmit} noValidate>
      <section className="order-native__section" aria-labelledby="order-contact-heading">
        <div className="order-native__section-header">
          <h2 id="order-contact-heading">Dane kontaktowe</h2>
          <p>Podaj swoje podstawowe dane, abyśmy mogli potwierdzić zamówienie.</p>
        </div>

        <div className="order-native__grid">
          <div className="order-field">
            <label htmlFor="fullName">Imię i nazwisko</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={state.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              required
              aria-invalid={getError(errors, "fullName") ? "true" : undefined}
              aria-describedby="fullName-error"
            />
            <p id="fullName-error" className="order-field__error">
              {getError(errors, "fullName")}
            </p>
          </div>

          <div className="order-field">
            <label htmlFor="phoneNumber">Numer telefonu</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={state.phoneNumber}
              onChange={(event) => handleChange("phoneNumber", event.target.value)}
              required
              aria-invalid={getError(errors, "phoneNumber") ? "true" : undefined}
              aria-describedby="phoneNumber-error"
            />
            <p id="phoneNumber-error" className="order-field__error">
              {getError(errors, "phoneNumber")}
            </p>
          </div>

          <div className="order-field">
            <label htmlFor="email">Adres mailowy</label>
            <input
              id="email"
              name="email"
              type="email"
              value={state.email}
              onChange={(event) => handleChange("email", event.target.value)}
              required
              aria-invalid={getError(errors, "email") ? "true" : undefined}
              aria-describedby="email-error"
            />
            <p id="email-error" className="order-field__error">
              {getError(errors, "email")}
            </p>
          </div>

          <div className="order-field">
            <label htmlFor="parcelLockerCode">Kod paczkomatu</label>
            <input
              id="parcelLockerCode"
              name="parcelLockerCode"
              type="text"
              value={state.parcelLockerCode}
              onChange={(event) => handleChange("parcelLockerCode", event.target.value)}
              required
              aria-invalid={getError(errors, "parcelLockerCode") ? "true" : undefined}
              aria-describedby="parcelLockerCode-error"
            />
            <p id="parcelLockerCode-error" className="order-field__error">
              {getError(errors, "parcelLockerCode")}
            </p>
          </div>
        </div>
      </section>

      <section className="order-native__section" aria-labelledby="order-measurements-heading">
        <div className="order-native__section-header">
          <h2 id="order-measurements-heading">Pomiary</h2>
          <p>Zmierz stopę w najdłuższym i najszerszym miejscu. Dla wysokich modeli wymagany jest też obwód łydki.</p>
        </div>

        <div className="order-native__grid order-native__grid--measurements">
          <div className="order-field">
            <label htmlFor="footLength">Długość stopy (cm)</label>
            <input
              id="footLength"
              name="footLength"
              inputMode="decimal"
              value={state.footLength}
              onChange={(event) => handleChange("footLength", event.target.value)}
              required
              aria-invalid={getError(errors, "footLength") ? "true" : undefined}
              aria-describedby="footLength-hint footLength-error"
            />
            <p id="footLength-hint" className="order-field__hint">
              {measurementHint}
            </p>
            <p id="footLength-error" className="order-field__error">
              {getError(errors, "footLength")}
            </p>
          </div>

          <div className="order-field">
            <label htmlFor="instepCircumference">Obwód śródstopia (cm)</label>
            <input
              id="instepCircumference"
              name="instepCircumference"
              inputMode="decimal"
              value={state.instepCircumference}
              onChange={(event) => handleChange("instepCircumference", event.target.value)}
              required
              aria-invalid={getError(errors, "instepCircumference") ? "true" : undefined}
              aria-describedby="instepCircumference-hint instepCircumference-error"
            />
            <p id="instepCircumference-hint" className="order-field__hint">
              {measurementHint}
            </p>
            <p id="instepCircumference-error" className="order-field__error">
              {getError(errors, "instepCircumference")}
            </p>
          </div>

          {shouldShowCalfCircumference ? (
            <div className="order-field">
              <label htmlFor="calfCircumference">Obwód łydki (cm)</label>
              <input
                id="calfCircumference"
                name="calfCircumference"
                inputMode="decimal"
                value={state.calfCircumference}
                onChange={(event) => handleChange("calfCircumference", event.target.value)}
                aria-invalid={getError(errors, "calfCircumference") ? "true" : undefined}
                aria-describedby="calfCircumference-hint calfCircumference-error"
              />
              <p id="calfCircumference-hint" className="order-field__hint">
                {selectedModel?.requiresCalfMeasurement
                  ? "Wybrany model wymaga pomiaru łydki."
                  : "Pole opcjonalne — uzupełnij, jeśli zamawiasz wysokie buty."}
              </p>
              <p id="calfCircumference-error" className="order-field__error">
                {getError(errors, "calfCircumference")}
              </p>
            </div>
          ) : (
            <button
              type="button"
              className="order-field__toggle"
              onClick={() => setShowOptionalCalf(true)}
            >
              Dodaj obwód łydki
            </button>
          )}
        </div>
      </section>

      <section className="order-native__section" aria-labelledby="order-model-heading">
        <div className="order-native__section-header">
          <h2 id="order-model-heading">Wybierz model</h2>
          <p>Karty prezentują sylwetki butów wraz z cenami. Kliknij model, aby go zaznaczyć.</p>
        </div>

        <fieldset className="order-models" aria-describedby="order-model-error">
          <legend className="sr-only">Wybór modelu obuwia</legend>
          <div className="order-models__grid" role="radiogroup" aria-label="Modele butów">
            {ORDER_MODELS.map((model) => {
              const isSelected = state.modelId === model.id;
              return (
                <label
                  key={model.id}
                  htmlFor={`model-${model.id}`}
                  className={`order-model-card${isSelected ? " order-model-card--selected" : ""}`}
                >
                  <input
                    id={`model-${model.id}`}
                    type="radio"
                    name="modelId"
                    value={model.id}
                    checked={isSelected}
                    onChange={() => handleModelSelect(model.id)}
                    className="sr-only"
                    aria-checked={isSelected}
                    required
                  />
                  <div className="order-model-card__media">
                    <Image
                      src={model.image}
                      alt=""
                      width={480}
                      height={320}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="order-model-card__body">
                    <h3>{model.name}</h3>
                    <p>{model.price} zł</p>
                  </div>
                </label>
              );
            })}
          </div>
          <p id="order-model-error" className="order-field__error">
            {getError(errors, "modelId")}
          </p>
        </fieldset>
      </section>

      <section className="order-native__section" aria-labelledby="order-options-heading">
        <div className="order-native__section-header">
          <h2 id="order-options-heading">Kolor i rozmiar</h2>
          <p>Wybierz podstawowe parametry pary. Później doprecyzujemy detale w konsultacji.</p>
        </div>

        <div className="order-native__grid">
          <div className="order-field">
            <label htmlFor="color">Kolor buta</label>
            <select
              id="color"
              name="color"
              value={state.color}
              onChange={(event) => handleChange("color", event.target.value)}
              aria-invalid={getError(errors, "color") ? "true" : undefined}
              aria-describedby="color-error"
            >
              {ORDER_COLORS.map((colorOption) => (
                <option key={colorOption.id} value={colorOption.id}>
                  {colorOption.label}
                </option>
              ))}
            </select>
            <p id="color-error" className="order-field__error">
              {getError(errors, "color")}
            </p>
          </div>

          <div className="order-field">
            <label htmlFor="size">Rozmiar (EU 36–49)</label>
            <select
              id="size"
              name="size"
              value={state.size}
              onChange={(event) => handleChange("size", event.target.value)}
              aria-invalid={getError(errors, "size") ? "true" : undefined}
              aria-describedby="size-error"
            >
              {ORDER_SIZES.map((sizeOption) => (
                <option key={sizeOption.id} value={sizeOption.id}>
                  {sizeOption.label}
                </option>
              ))}
            </select>
            <p id="size-error" className="order-field__error">
              {getError(errors, "size")}
            </p>
          </div>
        </div>
      </section>

      <section className="order-native__section" aria-labelledby="order-accessories-heading">
        <div className="order-native__section-header">
          <h2 id="order-accessories-heading">Akcesoria</h2>
          <p>Możesz dodać zestaw pielęgnacyjny, bukłak, karwasz oraz prawidła do kompletu.</p>
        </div>

        <fieldset className="order-accessories" aria-describedby="order-accessories-hint">
          <legend className="sr-only">Wybierz akcesoria</legend>
          <div className="order-accessories__grid">
            {ORDER_ACCESSORIES.map((accessory) => {
              const isChecked = state.accessories.includes(accessory.id);
              return (
                <label key={accessory.id} className="order-accessories__item">
                  <input
                    type="checkbox"
                    name="accessories"
                    value={accessory.id}
                    checked={isChecked}
                    onChange={() => handleAccessoryToggle(accessory.id)}
                  />
                  <span>
                    <span className="order-accessories__name">{accessory.name}</span>
                    <span className="order-accessories__price">{accessory.price} zł</span>
                  </span>
                  <span className="order-accessories__description">{accessory.googleValue}</span>
                </label>
              );
            })}
          </div>
          <p id="order-accessories-hint" className="order-field__hint">
            Możesz zaznaczyć dowolną liczbę akcesoriów.
          </p>
        </fieldset>

        <div className="order-native__conditional-group">
          <label className="order-conditional">
            <input
              type="checkbox"
              name="waterskin"
              checked={state.waterskinSelected}
              onChange={(event) => {
                handleChange("waterskinSelected", event.target.checked);
                if (!event.target.checked) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next["waterskin.symbol"];
                    return next;
                  });
                }
              }}
            />
            <span>
              <span className="order-conditional__title">Dodaj bukłak (250 zł)</span>
              <span className="order-conditional__hint">Opcjonalnie wskaż symbol do wytłoczenia.</span>
            </span>
          </label>

          {state.waterskinSelected ? (
            <div className="order-field order-field--nested">
              <label htmlFor="waterskinSymbol">Inny symbol</label>
              <input
                id="waterskinSymbol"
                name="waterskinSymbol"
                type="text"
                value={state.waterskinSymbol}
                onChange={(event) => handleChange("waterskinSymbol", event.target.value)}
                aria-invalid={getError(errors, "waterskin.symbol") ? "true" : undefined}
                aria-describedby="waterskinSymbol-hint waterskinSymbol-error"
              />
              <p id="waterskinSymbol-hint" className="order-field__hint">
                Wpisz opis symbolu lub link do pliku (maks. 200 znaków).
              </p>
              <p id="waterskinSymbol-error" className="order-field__error">
                {getError(errors, "waterskin.symbol")}
              </p>
            </div>
          ) : null}
        </div>

        <div className="order-native__conditional-group">
          <label className="order-conditional">
            <input
              type="checkbox"
              name="bracer"
              checked={state.bracerSelected}
              onChange={(event) => {
                handleChange("bracerSelected", event.target.checked);
                if (!event.target.checked) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next["bracer.color"];
                    return next;
                  });
                }
              }}
            />
            <span>
              <span className="order-conditional__title">Dodaj karwasz (280 zł)</span>
              <span className="order-conditional__hint">Podaj kolor, jeśli zamawiasz ten dodatek.</span>
            </span>
          </label>

          {state.bracerSelected ? (
            <div className="order-field order-field--nested">
              <label htmlFor="bracerColor">Kolor karwasza</label>
              <input
                id="bracerColor"
                name="bracerColor"
                type="text"
                value={state.bracerColor}
                onChange={(event) => handleChange("bracerColor", event.target.value)}
                aria-invalid={getError(errors, "bracer.color") ? "true" : undefined}
                aria-describedby="bracerColor-hint bracerColor-error"
                required
              />
              <p id="bracerColor-hint" className="order-field__hint">
                Krótki opis koloru lub referencja do wzornika.
              </p>
              <p id="bracerColor-error" className="order-field__error">
                {getError(errors, "bracer.color")}
              </p>
            </div>
          ) : null}
        </div>

        <label className="order-conditional">
          <input
            type="checkbox"
            name="shoeTrees"
            checked={state.shoeTrees}
            onChange={(event) => handleChange("shoeTrees", event.target.checked)}
          />
          <span>
            <span className="order-conditional__title">Dodaj prawidła sosnowe (150 zł)</span>
            <span className="order-conditional__hint">Pomagają utrzymać kształt cholewki podczas przechowywania.</span>
          </span>
        </label>
      </section>

      <section className="order-native__section" aria-labelledby="order-additional-heading">
        <div className="order-native__section-header">
          <h2 id="order-additional-heading">Dodatkowe informacje</h2>
          <p>Podaj hasło rabatowe lub dodatkowe wskazówki dla rzemieślnika.</p>
        </div>

        <div className="order-native__grid">
          <div className="order-field">
            <label htmlFor="discountCode">Hasło rabatowe</label>
            <input
              id="discountCode"
              name="discountCode"
              type="text"
              value={state.discountCode}
              onChange={(event) => handleChange("discountCode", event.target.value)}
              aria-invalid={getError(errors, "discountCode") ? "true" : undefined}
              aria-describedby="discountCode-error"
            />
            <p id="discountCode-error" className="order-field__error">
              {getError(errors, "discountCode")}
            </p>
          </div>

          <div className="order-field order-field--wide">
            <label htmlFor="notes">Inne uwagi</label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={state.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              aria-invalid={getError(errors, "notes") ? "true" : undefined}
              aria-describedby="notes-error"
            />
            <p id="notes-error" className="order-field__error">
              {getError(errors, "notes")}
            </p>
          </div>
        </div>
      </section>

      {submitError ? (
        <div className="order-native__alert" role="alert">
          {submitError}{" "}
          <Link href="/order" className="order-native__fallback">
            Otwórz pełny formularz
          </Link>
        </div>
      ) : null}

      <div className="order-native__actions">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Wysyłanie…" : "Zamów teraz"}
        </button>
        <Link className="button button--ghost" href="/order">
          Otwórz pełny formularz
        </Link>
      </div>
    </form>
  );
}
