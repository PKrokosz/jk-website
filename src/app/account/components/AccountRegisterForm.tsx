"use client";

import * as React from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  joinNewsletter: boolean;
}

const initialData: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
  joinNewsletter: true
};

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password: string) {
  return password.trim().length >= 8;
}

export function AccountRegisterForm() {
  const [data, setData] = React.useState<RegisterFormData>(initialData);
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const isSubmitting = status === "submitting";

  const isSubmitDisabled = React.useMemo(
    () =>
      isSubmitting ||
      data.name.trim().length === 0 ||
      data.email.trim().length === 0 ||
      data.password.trim().length === 0 ||
      data.confirmPassword.trim().length === 0 ||
      !data.acceptTerms,
    [data, isSubmitting]
  );

  const handleChange = (field: keyof RegisterFormData) =>
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    if (data.name.trim().length < 2) {
      setStatus("error");
      setError("Podaj imię i nazwisko, abyśmy mogli przygotować personalizowaną obsługę.");
      return;
    }

    if (!validateEmail(data.email)) {
      setStatus("error");
      setError("Adres e-mail wygląda niepoprawnie — sprawdź literówki.");
      return;
    }

    if (!validatePassword(data.password)) {
      setStatus("error");
      setError("Hasło powinno mieć minimum 8 znaków, abyśmy mogli bezpiecznie przechowywać konto.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setStatus("error");
      setError("Powtórzone hasło nie zgadza się z pierwszym. Spróbuj ponownie.");
      return;
    }

    if (!data.acceptTerms) {
      setStatus("error");
      setError("Zaznacz akceptację regulaminu konta, aby kontynuować.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    setStatus("success");
    setData(initialData);
  };

  return (
    <form className="account-form" onSubmit={handleSubmit} noValidate aria-describedby="register-status">
      <div className="field">
        <label htmlFor="register-name">Imię i nazwisko</label>
        <input
          id="register-name"
          name="name"
          type="text"
          value={data.name}
          onChange={handleChange("name")}
          autoComplete="name"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="register-email">Adres e-mail</label>
        <input
          id="register-email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange("email")}
          autoComplete="email"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="register-password">Hasło</label>
        <input
          id="register-password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange("password")}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="field__hint">Minimum 8 znaków, połączenie liter i cyfr.</p>
      </div>

      <div className="field">
        <label htmlFor="register-confirm-password">Powtórz hasło</label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          value={data.confirmPassword}
          onChange={handleChange("confirmPassword")}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <label className="checkbox">
        <input
          id="register-terms"
          name="acceptTerms"
          type="checkbox"
          checked={data.acceptTerms}
          onChange={handleChange("acceptTerms")}
          required
        />
        <span className="checkbox__content">
          <span className="checkbox__label">
            Akceptuję regulamin konta klienta JK Handmade Footwear i politykę prywatności.
          </span>
          <span className="field__hint">Pełna dokumentacja trafi do Ciebie po aktywacji konta.</span>
        </span>
      </label>

      <label className="checkbox">
        <input
          id="register-newsletter"
          name="joinNewsletter"
          type="checkbox"
          checked={data.joinNewsletter}
          onChange={handleChange("joinNewsletter")}
        />
        <span className="checkbox__content">
          <span className="checkbox__label">Chcę otrzymywać newsletter o nowych modelach i terminach warsztatów.</span>
        </span>
      </label>

      <div className="account-form__actions">
        <button className="button button--primary" type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? "Zakładamy konto..." : "Załóż konto"}
        </button>
      </div>

      <div
        id="register-status"
        role="status"
        aria-live="polite"
        className={`form-status form-status--${status}`}
      >
        {status === "success" ? (
          <p>
            Konto zostało utworzone! Sprawdź skrzynkę e-mail, aby potwierdzić rejestrację i ustawić preferencje konta.
          </p>
        ) : null}

        {status === "error" && error ? <p>{error}</p> : null}
      </div>
    </form>
  );
}
