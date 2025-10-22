import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin serwisu JK Handmade Footwear dotyczący zamówień na obuwie wykonywane na zamówienie (MTO).",
};

export default function TermsPage() {
  return (
    <main className="page legal-page" aria-labelledby="terms-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="terms-heading">Regulamin serwisu JK Handmade Footwear (MTO)</h1>
          <p>
            Dokument określa zasady korzystania z serwisu jkhandmade.pl oraz warunki składania zamówień na obuwie wykonywane na
            zamówienie.
          </p>
          <p>Data obowiązywania: 22.10.2025 r.</p>
        </header>

        <section className="legal-page__section" aria-labelledby="terms-general">
          <h2 id="terms-general">1. Postanowienia ogólne</h2>
          <ol>
            <li>Właścicielem serwisu jest JK Handmade Footwear, ul. [adres], 00-000 Warszawa, NIP: [xxx-xxx-xx-xx], REGON: [xxxxxxx].</li>
            <li>Kontakt: <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>.</li>
            <li>Regulamin stanowi wzorzec umowy w rozumieniu art. 384 Kodeksu cywilnego.</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-definitions">
          <h2 id="terms-definitions">2. Definicje</h2>
          <p>
            „Klient” – osoba fizyczna, prawna lub jednostka organizacyjna składająca zamówienie. „Produkt” – obuwie wykonywane na
            miarę (MTO) lub inne usługi oferowane przez JK Handmade Footwear.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-offer">
          <h2 id="terms-offer">3. Informacje o ofercie</h2>
          <ol>
            <li>Informacje w katalogu mają charakter zaproszenia do zawarcia umowy i nie stanowią oferty w rozumieniu Kodeksu cywilnego.</li>
            <li>Ceny prezentowane w serwisie są orientacyjne; ostateczna wycena następuje po konsultacji.</li>
            <li>Zakres personalizacji, dostępność materiałów i termin realizacji uzgadniamy indywidualnie.</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-orders">
          <h2 id="terms-orders">4. Składanie zamówień</h2>
          <ol>
            <li>Zamówienia przyjmujemy poprzez formularz zamówienia, kontakt e-mail lub w pracowni.</li>
            <li>Po weryfikacji przekazujemy potwierdzenie z terminem realizacji i informacją o zaliczce.</li>
            <li>Umowa zostaje zawarta po akceptacji potwierdzenia przez Klienta i wpłacie zaliczki (jeżeli wymagana).</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-payment">
          <h2 id="terms-payment">5. Płatności</h2>
          <ol>
            <li>Płatność odbywa się przelewem na rachunek wskazany w potwierdzeniu zamówienia lub gotówką w pracowni.</li>
            <li>Zaliczka (jeśli wymagana) jest warunkiem rozpoczęcia prac. Pozostała część ceny płatna zgodnie z ustaleniami stron.</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-fulfilment">
          <h2 id="terms-fulfilment">6. Realizacja i odbiór</h2>
          <ol>
            <li>Termin realizacji ustalany jest indywidualnie w zależności od złożoności projektu i dostępności materiałów.</li>
            <li>Odbiór następuje w pracowni (Warszawa) lub poprzez wysyłkę kurierską – warunki ustalane z Klientem.</li>
            <li>W trakcie realizacji możliwe są przymiarki/korekty uzgodnione podczas konsultacji.</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-withdrawal">
          <h2 id="terms-withdrawal">7. Prawo odstąpienia</h2>
          <p>
            Produkty MTO są wykonywane według indywidualnej specyfikacji, dlatego zgodnie z art. 38 pkt 3 ustawy o prawach
            konsumenta prawo odstąpienia nie przysługuje. Dla produktów gotowych zasady odstąpienia podamy przy danym produkcie.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-warranty">
          <h2 id="terms-warranty">8. Rękojmia i reklamacje</h2>
          <ol>
            <li>Odpowiadamy z tytułu rękojmi zgodnie z Kodeksem cywilnym.</li>
            <li>Reklamacje przyjmujemy mailowo na adres <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>.</li>
            <li>Na reklamację odpowiadamy w ciągu 14 dni roboczych – w przypadku zasadności oferujemy naprawę, wymianę lub inne środki przewidziane prawem.</li>
          </ol>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-privacy">
          <h2 id="terms-privacy">9. Dane osobowe</h2>
          <p>Dane osobowe przetwarzamy zgodnie z Polityką prywatności opublikowaną w serwisie.</p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-final">
          <h2 id="terms-final">10. Postanowienia końcowe</h2>
          <ol>
            <li>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego.</li>
            <li>Spory rozstrzygamy polubownie, a w razie braku porozumienia – przez właściwy sąd powszechny.</li>
            <li>Regulamin może ulegać zmianom z ważnych przyczyn (np. zmiana prawa). Do zamówień przyjętych przed zmianą stosuje się wersję obowiązującą w dniu zawarcia umowy.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
