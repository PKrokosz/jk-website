"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

const initialData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false
};

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function ContactForm() {
  const [data, setData] = useState<ContactFormData>(initialData);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = status === "submitting";

  const isSubmitDisabled = useMemo(
    () =>
      isSubmitting ||
      data.name.trim().length === 0 ||
      data.email.trim().length === 0 ||
      data.message.trim().length === 0 ||
      !data.consent,
    [data, isSubmitting]
  );

  const handleChange = (field: keyof ContactFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        event.currentTarget.type === "checkbox"
          ? (event.currentTarget as HTMLInputElement).checked
          : event.currentTarget.value;

      setData((current) => ({
        ...current,
        [field]: value
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    if (data.name.trim().length === 0) {
      setError("Podaj swoje imię, abyśmy wiedzieli, jak się do Ciebie zwracać.");
      setStatus("error");
      return;
    }

    if (!validateEmail(data.email)) {
      setError("Adres e-mail wygląda niepoprawnie. Sprawdź go proszę.");
      setStatus("error");
      return;
    }

    if (data.message.trim().length === 0) {
      setError("Napisz kilka słów o projekcie, abyśmy mogli przygotować odpowiedź.");
      setStatus("error");
      return;
    }

    if (!data.consent) {
      setError("Zaznacz zgodę na przetwarzanie danych, abyśmy mogli odpowiedzieć na wiadomość.");
      setStatus("error");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    setStatus("success");
    setData(initialData);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate aria-describedby="contact-status">
      <div className="field">
        <label htmlFor="contact-name">Imię</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={data.name}
          onChange={handleChange("name")}
          autoComplete="name"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="contact-email">Adres e-mail</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange("email")}
          autoComplete="email"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="contact-phone">Telefon (opcjonalnie)</label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={handleChange("phone")}
          autoComplete="tel"
        />
      </div>

      <div className="field">
        <label htmlFor="contact-message">Wiadomość</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={data.message}
          onChange={handleChange("message")}
          required
        />
      </div>

      <label className="checkbox">
        <input
          id="contact-consent"
          type="checkbox"
          checked={data.consent}
          onChange={handleChange("consent")}
          required
        />
        <span className="checkbox__content">
          <span className="checkbox__label">
            Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia odpowiedzi na zapytanie wysłane przez formularz kontaktowy.
          </span>
          <span className="field__hint">
            Administratorem danych jest <strong>JK Handmade Footwear</strong>. Dane nie będą przekazywane podmiotom trzecim i zostaną usunięte po zakończeniu korespondencji. Szczegóły znajdziesz w naszej {" "}
            <a href="/privacy-policy">Polityce prywatności</a>.
          </span>
        </span>
      </label>

      <div className="contact-actions">
        <button className="button button--primary" type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
        </button>
        <a className="button button--ghost" href="mailto:pracownia@jk-footwear.pl">
          Wyślij e-mail
        </a>
      </div>

      <div
        id="contact-status"
        role="status"
        aria-live="polite"
        className={`contact-status contact-status--${status}`}
      >
        {status === "success" ? (
          <p>
            Dziękujemy za wiadomość! Odezwiemy się najpóźniej w ciągu dwóch dni roboczych. Możesz także napisać bezpośrednio na
            <a href="mailto:pracownia@jk-footwear.pl"> pracownia@jk-footwear.pl</a>.
          </p>
        ) : null}

        {status === "error" && error ? <p>{error}</p> : null}
      </div>
    </form>
  );
}
