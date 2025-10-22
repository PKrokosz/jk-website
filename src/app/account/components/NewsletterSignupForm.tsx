"use client";

import * as React from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

type NewsletterPreference = "workshop" | "new_models" | "care_guides";

interface NewsletterFormData {
  email: string;
  preference: NewsletterPreference;
  consent: boolean;
}

const initialData: NewsletterFormData = {
  email: "",
  preference: "new_models",
  consent: false
};

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function NewsletterSignupForm() {
  const [data, setData] = React.useState<NewsletterFormData>(initialData);
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const isSubmitting = status === "submitting";

  const isSubmitDisabled = React.useMemo(
    () => isSubmitting || data.email.trim().length === 0,
    [data.email, isSubmitting]
  );

  const handleInputChange = (field: "email" | "consent") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.currentTarget.type === "checkbox"
          ? (event.currentTarget as HTMLInputElement).checked
          : event.currentTarget.value;

      setData((current) => ({
        ...current,
        [field]: value
      }));
    };

  const handlePreferenceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;

    setData((current) => ({
      ...current,
      preference: value as NewsletterPreference
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    if (!validateEmail(data.email)) {
      setStatus("error");
      setError("Adres e-mail wygląda na niepoprawny. Sprawdź i spróbuj ponownie.");
      return;
    }

    if (!data.consent) {
      setStatus("error");
      setError("Potrzebujemy zgody, aby wysyłać Ci newsletter.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 350));

    setStatus("success");
    setData(initialData);
  };

  return (
    <form className="account-form" onSubmit={handleSubmit} noValidate aria-describedby="newsletter-status">
      <div className="field">
        <label htmlFor="newsletter-email">Adres e-mail</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleInputChange("email")}
          autoComplete="email"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="newsletter-preference">Najbardziej interesują mnie</label>
        <select
          id="newsletter-preference"
          name="preference"
          value={data.preference}
          onChange={handlePreferenceChange}
        >
          <option value="new_models">Nowe modele i limitowane serie</option>
          <option value="workshop">Zapisy na warsztaty i konsultacje na żywo</option>
          <option value="care_guides">Poradniki pielęgnacji i renowacji</option>
        </select>
      </div>

      <label className="checkbox">
        <input
          id="newsletter-consent"
          name="consent"
          type="checkbox"
          checked={data.consent}
          onChange={handleInputChange("consent")}
          required
        />
        <span className="checkbox__content">
          <span className="checkbox__label">Wyrażam zgodę na przesyłanie newslettera JK Handmade Footwear.</span>
          <span className="field__hint">Możesz wypisać się w dowolnym momencie jednym kliknięciem.</span>
        </span>
      </label>

      <div className="account-form__actions">
        <button className="button button--primary" type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? "Zapisujemy..." : "Zapisz się"}
        </button>
      </div>

      <div
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={`form-status form-status--${status}`}
      >
        {status === "success" ? (
          <p>
            Witamy w newsletterze! Najbliższa wysyłka zawiera zaproszenie na konsultacje online oraz przewodnik pielęgnacyjny.
          </p>
        ) : null}

        {status === "error" && error ? <p>{error}</p> : null}
      </div>
    </form>
  );
}
