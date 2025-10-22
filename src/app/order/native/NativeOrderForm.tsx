"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export function NativeOrderForm() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError("Wpisz imię i nazwisko, aby kontynuować.");
      return;
    }

    const params = new URLSearchParams();
    params.set("name", trimmedName);
    router.push(`/order/cart?${params.toString()}`);
  };

  const handleChange = (value: string) => {
    setFullName(value);
    if (error) {
      setError(null);
    }
  };

  return (
    <form className="order-native__form order-native__form--lead" onSubmit={handleSubmit} noValidate>
      <section className="order-native__section" aria-labelledby="order-lead-heading">
        <div className="order-native__section-header">
          <h2 id="order-lead-heading">Zacznij od przedstawienia się</h2>
          <p>
            Potrzebujemy tylko imienia i nazwiska, aby przygotować dla Ciebie przestrzeń z konfiguracją. W kolejnym kroku
            uzupełnisz wszystkie szczegóły zamówienia.
          </p>
        </div>

        <div className="order-native__grid">
          <div className="order-field order-field--wide">
            <label htmlFor="fullName">Imię i nazwisko</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(event) => handleChange(event.target.value)}
              aria-invalid={error ? "true" : undefined}
              aria-describedby="fullName-error"
              autoComplete="name"
              placeholder="np. Jan Kowalski"
            />
            <p id="fullName-error" className="order-field__error">
              {error}
            </p>
          </div>
        </div>
      </section>

      <div className="order-native__actions order-native__actions--start">
        <button type="submit" className="button button--primary">
          Przejdź do koszyka
        </button>
      </div>
    </form>
  );
}
