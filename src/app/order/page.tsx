import type { Metadata } from "next";
import React from "react";

import { ORDER_FORM_URL } from "@/config/order";

const IFRAME_TITLE = "Formularz zamówienia JK Handmade Footwear";

const getDirectOrderFormUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("embedded");
    return parsed.toString().replace(/\?$/, "");
  } catch {
    return url.replace("?embedded=true", "");
  }
};

const ORDER_FORM_DIRECT_URL = getDirectOrderFormUrl(ORDER_FORM_URL);

export const metadata: Metadata = {
  title: "Zamówienie | JK Handmade Footwear",
  description:
    "Wypełnij formularz zamówienia, aby rozpocząć proces stworzenia spersonalizowanych butów JK Handmade Footwear.",
  alternates: {
    canonical: "/order"
  },
  openGraph: {
    title: "Zamówienie | JK Handmade Footwear",
    description:
      "Rozpocznij proces zamówienia ręcznie tworzonych butów JK Handmade Footwear, wypełniając formularz online.",
    url: "/order"
  }
};

export default function OrderPage() {
  return (
    <main className="page order-page">
      <div className="container order-page__container">
        <header className="order-page__header">
          <p className="order-page__eyebrow">Zamówienie bespoke</p>
          <h1 className="order-page__title">Zamówienie</h1>
          <p className="order-page__lead">
            Wypełnij formularz, aby przekazać nam szczegóły dotyczące Twojej wizji idealnych butów. Na
            podstawie otrzymanych informacji przygotujemy dalsze kroki współpracy.
          </p>
          <p className="order-page__fallback">
            Jeśli osadzenie nie jest dostępne, przejdź do{" "}
            <a
              className="order-page__fallback-link"
              href={ORDER_FORM_DIRECT_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              pełnej wersji formularza
            </a>
            .
          </p>
        </header>

        <div className="order-form__frame-wrapper" data-testid="order-form-frame-wrapper">
          <iframe
            title={IFRAME_TITLE}
            src={ORDER_FORM_URL}
            className="order-form__iframe"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  );
}
