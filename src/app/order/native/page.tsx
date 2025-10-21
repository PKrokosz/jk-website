import type { Metadata } from "next";
import Link from "next/link";

import { NativeOrderForm } from "./NativeOrderForm";

export const metadata: Metadata = {
  title: "Zamówienie natywne | JK Handmade Footwear",
  description:
    "Rozpocznij zamówienie bespoke JK Handmade Footwear, podając imię i nazwisko, a następnie uzupełnij szczegóły w dedykowanym koszyku.",
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
            Podaj imię i nazwisko, a poprowadzimy Cię do koszyka z konfiguracją. Tam uzupełnisz wszystkie parametry, dodatki
            i preferencje dotyczące realizacji. W każdej chwili możesz wrócić do osadzonego formularza Google, korzystając z
            poniższego odnośnika.
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
      </div>
    </main>
  );
}
