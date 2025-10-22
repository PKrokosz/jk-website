"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useSearchParams } from "next/navigation";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  product: string;
  website: string;
}

const initialData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  product: "",
  website: ""
};

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function sanitizeProductQuery(value: string | null) {
  if (!value) {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, 120);
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const queryProduct = useMemo(
    () => sanitizeProductQuery(searchParams.get("product")),
    [searchParams]
  );

  const lastPrefilledProductRef = useRef<string | null>(
    queryProduct || null
  );
  const [data, setData] = useState<ContactFormData>(() => ({
    ...initialData,
    product: queryProduct
  }));
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData((current) => {
      const lastPrefilledProduct = lastPrefilledProductRef.current;

      if (queryProduct) {
        if (queryProduct === lastPrefilledProduct) {
          return current;
        }

        lastPrefilledProductRef.current = queryProduct;

        if (
          current.product.trim().length > 0 &&
          current.product !== lastPrefilledProduct
        ) {
          return current;
        }

        return {
          ...current,
          product: queryProduct
        };
      }

      if (lastPrefilledProduct && current.product === lastPrefilledProduct) {
        lastPrefilledProductRef.current = null;

        return {
          ...current,
          product: ""
        };
      }

      lastPrefilledProductRef.current = null;

      return current;
    });
  }, [queryProduct]);

  const isSubmitting = status === "submitting";

  const isSubmitDisabled = useMemo(
    () =>
      isSubmitting ||
      data.name.trim().length === 0 ||
      data.email.trim().length === 0 ||
      data.message.trim().length < 10 ||
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

    if (data.message.trim().length < 10) {
      setError("Napisz kilka słów o projekcie — minimum 10 znaków pomoże nam odpowiedzieć precyzyjnie.");
      setStatus("error");
      return;
    }

    if (!data.consent) {
      setError("Zaznacz zgodę na przetwarzanie danych, abyśmy mogli odpowiedzieć na wiadomość.");
      setStatus("error");
      return;
    }

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message.trim(),
      website: data.website.trim(),
      ...(data.product.trim().length > 0 ? { product: data.product.trim() } : {})
    };

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus("success");
        lastPrefilledProductRef.current = queryProduct || null;
        setData({
          ...initialData,
          product: queryProduct
        });
        return;
      }

      let errorMessage = "Wystąpił błąd. Spróbuj ponownie za chwilę.";

      if (response.status === 422) {
        errorMessage = "Sprawdź poprawność pól. Niektóre wymagają uzupełnienia.";
      } else if (response.status === 429) {
        errorMessage = "Za dużo prób. Spróbuj ponownie za minutę.";
      } else if (response.status === 502) {
        errorMessage =
          "Usługa poczty chwilowo niedostępna. Wyślij maila bezpośrednio: kontakt@jkhandmade.pl.";
      }

      setError(errorMessage);
      setStatus("error");
    } catch (submitError) {
      console.error("Contact form submit error", submitError);
      setError("Nie udało się wysłać formularza. Sprawdź połączenie i spróbuj ponownie.");
      setStatus("error");
    }
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
        <label htmlFor="contact-product">Model lub referencja (opcjonalnie)</label>
        <input
          id="contact-product"
          name="product"
          type="text"
          value={data.product}
          onChange={handleChange("product")}
          autoComplete="off"
          maxLength={120}
          placeholder="Np. Oxford No. 8, zamówienie grupowe"
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

      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Strona internetowa</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          value={data.website}
          onChange={handleChange("website")}
          tabIndex={-1}
          autoComplete="off"
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
            Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia odpowiedzi na zapytanie.
          </span>
          <span className="field__hint">
            Administratorem jest JK Handmade Footwear. Szczegóły w {" "}
            <a href="/privacy-policy">Polityce prywatności</a>.
          </span>
        </span>
      </label>

      <div className="contact-actions">
        <button className="button button--primary" type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
        </button>
        <a className="button button--ghost" href="mailto:kontakt@jkhandmade.pl">
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
            Dziękujemy za wiadomość. Odpowiemy do 2 dni roboczych. W pilnych sprawach: {" "}
            <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>.
          </p>
        ) : null}

        {status === "error" && error ? <p>{error}</p> : null}
      </div>
    </form>
  );
}
