import type { Metadata } from "next";

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2
});

const ORDER_ITEMS = [
  {
    id: "model",
    label: "Model Szpic",
    description: "Skóra licowa w odcieniu koniakowego brązu",
    priceGrosz: 75000
  },
  {
    id: "wax",
    label: "Wosk konserwujący",
    description: "Ręcznie mieszany wosk pszczeli do pielęgnacji",
    priceGrosz: 6000
  },
  {
    id: "trees",
    label: "Prawidła cedrowe",
    description: "Para regulowanych prawideł dla zachowania kształtu",
    priceGrosz: 9000
  },
  {
    id: "care",
    label: "Zestaw renowacyjny",
    description: "Szczotka końska, ściereczki i krem koloryzujący",
    priceGrosz: 9630
  }
] as const;

export const metadata: Metadata = {
  title: "Koszyk zamówienia | JK Handmade Footwear",
  description:
    "Podsumowanie konfiguracji bespoke JK Handmade Footwear z możliwością uzupełnienia danych kontaktowych i preferencji dostawy.",
  alternates: {
    canonical: "/order/cart"
  }
};

type OrderCartPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function OrderCartPage({ searchParams }: OrderCartPageProps) {
  const rawName = typeof searchParams?.name === "string" ? searchParams?.name : Array.isArray(searchParams?.name)
    ? searchParams?.name[0]
    : undefined;
  const customerName = rawName?.trim() ?? "";

  const grossTotal = ORDER_ITEMS.reduce((acc, item) => acc + item.priceGrosz, 0);
  const netTotal = Math.round(grossTotal / 1.23);
  const vatTotal = grossTotal - netTotal;

  return (
    <main className="page order-cart-page" aria-labelledby="order-cart-heading">
      <div className="container order-cart__container">
        <header className="order-cart__intro">
          <p className="order-cart__eyebrow">Koszyk zamówienia</p>
          <h1 id="order-cart-heading">Twoja konfiguracja jest gotowa do finalizacji</h1>
          <p>
            {customerName
              ? `Dziękujemy, ${customerName}. Poniżej znajdziesz wszystkie elementy zamówienia i pola do uzupełnienia.`
              : "Sprawdź elementy konfiguracji, uzupełnij dane kontaktowe i prześlij zamówienie do naszej pracowni."}
          </p>
        </header>

        <div className="order-cart__layout">
          <aside className="order-cart__summary" aria-label="Wybrane elementy zamówienia">
            <div className="order-cart__summary-header">
              <h2>Wybrane elementy</h2>
              <p>Po finalizacji skontaktujemy się, aby potwierdzić szczegóły dopasowania i terminy realizacji.</p>
            </div>

            <ul className="order-cart__items">
              {ORDER_ITEMS.map((item) => (
                <li key={item.id} className="order-cart__item">
                  <div>
                    <span className="order-cart__item-label">{item.label}</span>
                    <p className="order-cart__item-description">{item.description}</p>
                  </div>
                  <span className="order-cart__item-price">{currencyFormatter.format(item.priceGrosz / 100)}</span>
                </li>
              ))}
            </ul>

            <dl className="order-cart__totals">
              <div>
                <dt>Łącznie netto</dt>
                <dd>{currencyFormatter.format(netTotal / 100)}</dd>
              </div>
              <div>
                <dt>VAT (23%)</dt>
                <dd>{currencyFormatter.format(vatTotal / 100)}</dd>
              </div>
              <div className="order-cart__totals-highlight">
                <dt>Suma brutto</dt>
                <dd>{currencyFormatter.format(grossTotal / 100)}</dd>
              </div>
            </dl>

            <p className="order-cart__note">Kwoty mają charakter orientacyjny i zostaną potwierdzone podczas konsultacji.</p>
          </aside>

          <form className="order-cart__details" aria-labelledby="order-cart-details-heading">
            <section className="order-cart__section" aria-labelledby="order-cart-details-heading">
              <div className="order-cart__section-header">
                <h2 id="order-cart-details-heading">Dane kontaktowe</h2>
                <p>Te informacje pozwolą nam przygotować ofertę i ustalić szczegóły spotkania lub wysyłki.</p>
              </div>

              <div className="order-cart__fields">
                <div className="order-field">
                  <label htmlFor="cart-full-name">Imię i nazwisko</label>
                  <input id="cart-full-name" name="fullName" type="text" defaultValue={customerName} autoComplete="name" />
                </div>
                <div className="order-field">
                  <label htmlFor="cart-email">Adres e-mail</label>
                  <input id="cart-email" name="email" type="email" autoComplete="email" placeholder="np. jan@przyklad.pl" />
                </div>
                <div className="order-field">
                  <label htmlFor="cart-phone">Numer telefonu</label>
                  <input id="cart-phone" name="phone" type="tel" autoComplete="tel" placeholder="+48 123 456 789" />
                </div>
                <div className="order-field">
                  <label htmlFor="cart-preferred-contact">Preferowany kontakt</label>
                  <select id="cart-preferred-contact" name="preferredContact" defaultValue="call">
                    <option value="call">Telefon</option>
                    <option value="email">E-mail</option>
                    <option value="meeting">Spotkanie w pracowni</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="order-cart__section" aria-labelledby="order-cart-delivery-heading">
              <div className="order-cart__section-header">
                <h2 id="order-cart-delivery-heading">Preferencje dostawy</h2>
                <p>Podaj adres wysyłki lub informacje o odbiorze osobistym.</p>
              </div>

              <div className="order-cart__fields order-cart__fields--stacked">
                <div className="order-field">
                  <label htmlFor="cart-shipping-method">Sposób dostawy</label>
                  <select id="cart-shipping-method" name="shippingMethod" defaultValue="courier">
                    <option value="courier">Kurier na wskazany adres</option>
                    <option value="pickup">Odbiór w pracowni w Krakowie</option>
                    <option value="locker">Paczkomat InPost</option>
                  </select>
                </div>
                <div className="order-field">
                  <label htmlFor="cart-address">Adres dostawy / paczkomat</label>
                  <input id="cart-address" name="address" type="text" placeholder="np. ul. Długa 5, Kraków lub KRA123" />
                </div>
                <div className="order-field order-field--wide">
                  <label htmlFor="cart-notes">Dodatkowe uwagi</label>
                  <textarea
                    id="cart-notes"
                    name="notes"
                    rows={4}
                    placeholder="Notatki dotyczące tęgości, wydarzenia lub preferencji stylistycznych"
                  />
                </div>
              </div>
            </section>

            <div className="order-cart__actions">
              <button type="submit" className="button button--primary">
                Prześlij konfigurację
              </button>
              <p>Po otrzymaniu formularza skontaktujemy się w ciągu 24 godzin roboczych.</p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
