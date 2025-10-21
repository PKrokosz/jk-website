import type { Metadata } from "next";
import React from "react";

import { ORDER_FORM_EMBED_URL } from "@/lib/order-form";

export const metadata: Metadata = {
  title: "Zamów buty na miarę | JK Handmade Footwear",
  description:
    "Wypełnij formularz zamówienia, aby rozpocząć proces stworzenia spersonalizowanych butów JK Handmade Footwear.",
  alternates: {
    canonical: "/order"
  },
  openGraph: {
    title: "Zamów buty na miarę | JK Handmade Footwear",
    description:
      "Wypełnij formularz zamówienia, aby zamówić ręcznie robione buty JK Handmade Footwear.",
    url: "/order"
  }
};

const iframeTitle = "Formularz zamówienia JK Handmade Footwear";

export default function OrderPage() {
  return (
    <div className="page page--order">
      <div className="container order-page__container">
        <header className="order-page__header">
          <p className="order-page__eyebrow">Zamówienie bespoke</p>
          <h1 className="order-page__title">Zamów buty na miarę</h1>
          <p className="order-page__lead">
            Formularz poprowadzi Cię krok po kroku przez wymagane informacje, które
            pomagają nam stworzyć idealne dopasowanie.
          </p>
          <p className="order-page__fallback">
            Jeśli formularz nie wyświetla się poprawnie, przejdź bezpośrednio do
            <a
              className="order-page__fallback-link"
              href={ORDER_FORM_EMBED_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              wersji w serwisie Google Forms
            </a>
            .
          </p>
        </header>

        <div className="order-form__frame-wrapper" data-testid="order-form-frame-wrapper">
          <iframe
            title={iframeTitle}
            src={ORDER_FORM_EMBED_URL}
            className="order-form__iframe"
            loading="lazy"
            allow="encrypted-media"
          />
        </div>
      </div>
    </div>
  );
}
