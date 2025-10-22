import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin serwisu JK Handmade Footwear dotyczący zamówień na obuwie wykonywane na zamówienie (MTO)."
};

export default function TermsPage() {
  return (
    <main className="page legal-page" aria-labelledby="terms-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="terms-heading">Regulamin serwisu JK Handmade Footwear (MTO)</h1>
          <p>
            Dokument określa zasady korzystania z serwisu jkhandmade.pl oraz warunki składania zamówień na obuwie
            wykonywane na zamówienie.
          </p>
        </header>

        <section className="legal-page__section" aria-labelledby="terms-general">
          <h2 id="terms-general">1. Postanowienia ogólne</h2>
          <ol>
            <li>
              Regulamin określa zasady korzystania z serwisu jkhandmade.pl oraz warunki składania zamówień na obuwie
              wykonywane na zamówienie (MTO).
            </li>
            <li>
              Usługodawcą/Sprzedawcą jest JK Handmade Footwear, ul. [adres], 00-000 Warszawa, NIP: [xxx-xxx-xx-xx], REGON:
              [xxxxxxx], e-mail: <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>.
            </li>
            <li>Kontakt podstawowy: formularz kontaktowy lub e-mail.</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-definitions">
          <h2 id="terms-definitions">2. Definicje</h2>
          <p>
            „Klient” – osoba fizyczna (w tym konsument lub przedsiębiorca na prawach konsumenta), osoba prawna lub jednostka
            organizacyjna.
          </p>
          <p>„MTO” – produkt wykonywany na indywidualne zamówienie wg specyfikacji Klienta.</p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-products">
          <h2 id="terms-products">3. Informacje o produktach i cenach</h2>
          <ol>
            <li>
              Informacje w katalogu mają charakter zaproszenia do zawarcia umowy (nie stanowią oferty w rozumieniu k.c.).
            </li>
            <li>Ceny orientacyjne mogą być prezentowane brutto (z VAT), ostateczna wycena następuje po konsultacji/specyfikacji.</li>
            <li>
              Zastrzegamy możliwość modyfikacji zakresu, materiałów i terminów przy nietypowych projektach – ustalane
              indywidualnie.
            </li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-orders">
          <h2 id="terms-orders">4. Składanie zamówień i zawarcie umowy</h2>
          <ol>
            <li>
              Zamówienie następuje poprzez formularz zamówienia lub kontakt e-mail z podaniem specyfikacji (model, materiały,
              wymiary, dodatki).
            </li>
            <li>
              Po weryfikacji przesyłamy potwierdzenie przyjęcia zamówienia wraz z terminem wykonania i kwotą zaliczki/ceny.
            </li>
            <li>Umowa zostaje zawarta z chwilą akceptacji potwierdzenia oraz zaksięgowania zaliczki (jeśli wymagana).</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-payment">
          <h2 id="terms-payment">5. Płatność</h2>
          <ol>
            <li>Płatność odbywa się przelewem na rachunek wskazany w potwierdzeniu/na stronie „Dziękujemy”.</li>
            <li>W przypadku zaliczki – prace rozpoczynamy po zaksięgowaniu. Saldo płatne wg ustaleń (przed odbiorem/wysyłką).</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-fulfilment">
          <h2 id="terms-fulfilment">6. Realizacja i odbiór</h2>
          <ol>
            <li>Termin realizacji ustalany jest indywidualnie (zależny od złożoności, dostępności materiałów, kolejki).</li>
            <li>Odbiór w pracowni (Warszawa) lub wysyłka kurierem (koszt i ryzyko transportu wg umowy).</li>
            <li>W trakcie realizacji możliwe są przymiarki/korekty – zakres i terminy ustalane z Klientem.</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-withdrawal">
          <h2 id="terms-withdrawal">7. Prawo odstąpienia od umowy</h2>
          <ol>
            <li>
              Brak prawa odstąpienia dla MTO: zgodnie z art. 38 pkt 3 Ustawy z 30 maja 2014 r. o prawach konsumenta, prawo
              odstąpienia nie przysługuje w odniesieniu do rzeczy nieprefabrykowanych, wyprodukowanych wg specyfikacji
              konsumenta lub służących zaspokojeniu jego zindywidualizowanych potrzeb.
            </li>
            <li>Jeżeli w serwisie pojawią się produkty gotowe (nie-MTO), zasady odstąpienia będą podane przy produkcie.</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-warranty">
          <h2 id="terms-warranty">8. Rękojmia i reklamacje</h2>
          <ol>
            <li>Odpowiadamy z tytułu rękojmi zgodnie z Kodeksem cywilnym.</li>
            <li>
              Reklamację złóż mailowo: <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a> (opisz wadę, dołącz
              zdjęcia, numer zamówienia).
            </li>
            <li>
              Rozpatrzymy w terminie do 14 dni. W razie zasadności – naprawa, wymiana, obniżenie ceny lub odstąpienie, zgodnie z
              przepisami.
            </li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-privacy">
          <h2 id="terms-privacy">9. Dane osobowe</h2>
          <p>Przetwarzanie danych odbywa się wg Polityki prywatności.</p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-final">
          <h2 id="terms-final">10. Postanowienia końcowe</h2>
          <ol>
            <li>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego.</li>
            <li>
              Spory z konsumentem mogą być rozwiązywane polubownie; Konsument może skorzystać z ODR
              (<a href="https://ec.europa.eu/odr" target="_blank" rel="noreferrer">
                ec.europa.eu/odr
              </a>
              ).
            </li>
            <li>
              Regulamin może ulegać zmianom z ważnych przyczyn (np. zmiana prawa); do umów zawartych przed zmianą stosuje się
              wersję obowiązującą w dniu zawarcia.
            </li>
          </ol>
          <p>Data obowiązywania: 22.10.2025 r.</p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-disclaimer">
          <h2 id="terms-disclaimer">Uwaga prawna</h2>
          <p>
            Teksty przygotowano zgodnie z polskim prawem konsumenckim i RODO na dzień publikacji. Rekomendujemy krótką konsultację
            prawną przed finalnym wdrożeniem.
          </p>
        </section>
      </div>
    </main>
  );
}
