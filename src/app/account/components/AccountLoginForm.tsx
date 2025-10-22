"use client";

import * as React from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialData: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false
};

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function AccountLoginForm() {
  const [data, setData] = React.useState<LoginFormData>(initialData);
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const isSubmitting = status === "submitting";

  const isSubmitDisabled = React.useMemo(
    () => isSubmitting || data.email.trim().length === 0 || data.password.trim().length === 0,
    [data.email, data.password, isSubmitting]
  );

  const handleChange = (field: keyof LoginFormData) =>
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

    if (!validateEmail(data.email)) {
      setStatus("error");
      setError("Sprawdź adres e-mail — potrzebujemy go do znalezienia konta.");
      return;
    }

    if (data.password.trim().length === 0) {
      setStatus("error");
      setError("Podaj hasło, aby zalogować się do panelu klienta.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    setStatus("success");
    setData(initialData);
  };

  return (
    <form className="account-form" onSubmit={handleSubmit} noValidate aria-describedby="login-status">
      <div className="field">
        <label htmlFor="login-email">Adres e-mail</label>
        <input
          id="login-email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange("email")}
          autoComplete="email"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="login-password">Hasło</label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={data.password}
          onChange={handleChange("password")}
          autoComplete="current-password"
          required
        />
      </div>

      <label className="checkbox">
        <input
          id="login-remember"
          name="rememberMe"
          type="checkbox"
          checked={data.rememberMe}
          onChange={handleChange("rememberMe")}
        />
        <span className="checkbox__content">
          <span className="checkbox__label">Zapamiętaj mnie na tym urządzeniu.</span>
        </span>
      </label>

      <div className="account-form__actions">
        <button className="button button--primary" type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? "Logujemy..." : "Zaloguj się"}
        </button>
        <a className="button button--ghost" href="mailto:kontakt@jkhandmade.pl">
          Zapomniałem hasła
        </a>
      </div>

      <div id="login-status" role="status" aria-live="polite" className={`form-status form-status--${status}`}>
        {status === "success" ? (
          <p>
            Jesteś zalogowany! Panel klienta otworzy zakładkę z aktualnym zamówieniem i rekomendacjami pielęgnacji.
          </p>
        ) : null}

        {status === "error" && error ? <p>{error}</p> : null}
      </div>
    </form>
  );
}
