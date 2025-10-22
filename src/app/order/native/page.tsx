import type { Metadata } from "next";
import { NativeOrderForm } from "./NativeOrderForm";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Zamówienie natywne | JK Handmade Footwear",
  description:
    "Wypełnij natywny formularz zamówienia JK Handmade Footwear, aby przekazać nam wszystkie szczegóły dotyczące wymarzonej pary butów.",
  alternates: {
    canonical: "/order/native"
  }
};

export default function NativeOrderPage() {
  return (
    <main className="page order-native-page" aria-labelledby="order-native-heading">
      <div className="container order-native__container">
        <header className="order-native__intro">
          <p className="order-native__eyebrow">Zamówienie bespoke</p>
          <h1 id="order-native-heading">Zamów parę szytą w naszej pracowni</h1>
          <p className="order-native__lead">
            Podaj niezbędne informacje, a przygotujemy dla Ciebie spersonalizowaną ofertę. W każdej chwili możesz wrócić do
            osadzonego formularza Google, korzystając z poniższego odnośnika.
          </p>
          <p className="order-native__fallback">
            Preferujesz dotychczasową wersję? {" "}
            <Link href="/order" className="order-native__fallback-link">
              Wypełnij w pełnej wersji
            </Link>
            .
          </p>
        </header>

        <NativeOrderForm />

        <nav className="page-navigation order-native__navigation" aria-label="Dalsze kroki po formularzu natywnym">
          <Link className="button button--primary" href="/catalog">
            Wróć do katalogu modeli
          </Link>
          <Link className="button button--ghost" href="/order">
            Skorzystaj z formularza Google
          </Link>
          <Link className="button button--ghost" href="/contact">
            Skontaktuj się z pracownią
          </Link>
        </nav>
      </div>
    </main>
  );
}
