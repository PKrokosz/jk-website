import type { Metadata } from "next";

import { TransferDetails } from "./TransferDetails";

export const metadata: Metadata = {
  title: "Dziękujemy za zamówienie | JK Handmade Footwear",
  description:
    "Dziękujemy za złożenie zamówienia. Poniżej znajdziesz dane do przelewu, dzięki którym sfinalizujemy Twoją parę butów.",
  alternates: {
    canonical: "/order/thanks"
  }
};

interface ThanksPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const normalizeName = (value: string | string[] | undefined) => {
  if (!value) {
    return undefined;
  }

  const raw = Array.isArray(value) ? value[0] : value;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

export default function ThanksPage({ searchParams }: ThanksPageProps) {
  const customerName = normalizeName(searchParams.name);

  return (
    <main className="page order-thanks-page" aria-labelledby="order-thanks-heading">
      <div className="container order-thanks__container">
        <header className="order-thanks__intro">
          <p className="order-thanks__eyebrow">Dziękujemy</p>
          <h1 id="order-thanks-heading">Zamówienie dotarło do naszej pracowni</h1>
          <p>
            Prześlemy potwierdzenie wraz z terminem realizacji po zaksięgowaniu wpłaty. W razie pytań skontaktuj się z nami pod
            adresem <a href="mailto:pracownia@jk-footwear.pl">pracownia@jk-footwear.pl</a>.
          </p>
        </header>

        <TransferDetails customerName={customerName} />
      </div>
    </main>
  );
}
