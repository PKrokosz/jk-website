import type { Metadata } from "next";

const sections = [
  {
    id: "terms-scope",
    title: "1. Zakres obowiązywania",
    paragraphs: [
      "Regulamin określa zasady korzystania z serwisu jkhandmade.pl oraz składania zamówień na obuwie wykonywane na zamówienie (MTO)."
    ]
  },
  {
    id: "terms-ordering",
    title: "2. Składanie zamówień",
    paragraphs: [
      "Zamówienia można składać poprzez formularz kontaktowy lub indywidualną korespondencję e-mail. Po złożeniu zapytania kontaktujemy się z klientem w celu doprecyzowania szczegółów i przygotowania oferty.",
      "Złożenie zamówienia wymaga akceptacji regulaminu oraz potwierdzenia warunków realizacji (termin, cena, zakres prac)."
    ]
  },
  {
    id: "terms-payment",
    title: "3. Płatności",
    paragraphs: [
      "Warunki płatności (zaliczka, forma rozliczenia) ustalane są indywidualnie w korespondencji e-mail. Brak wpłaty zaliczki w uzgodnionym terminie może skutkować anulowaniem zamówienia."
    ]
  },
  {
    id: "terms-production",
    title: "4. Realizacja i terminy",
    paragraphs: [
      "Czas realizacji zamówienia zależy od wybranego modelu, materiałów i aktualnego obłożenia pracowni. O przewidywanym terminie realizacji informujemy w potwierdzeniu zamówienia."
    ]
  },
  {
    id: "terms-changes",
    title: "5. Zmiany w zamówieniu",
    paragraphs: [
      "Modyfikacje wprowadzone po rozpoczęciu produkcji mogą wymagać zmiany terminu realizacji lub dodatkowych kosztów. Każdą zmianę potwierdzamy pisemnie (e-mail)."
    ]
  },
  {
    id: "terms-complaints",
    title: "6. Reklamacje i zwroty",
    paragraphs: [
      "Obuwie wykonywane na zamówienie nie podlega zwrotowi, chyba że wynika to z bezwzględnie obowiązujących przepisów prawa. Reklamacje należy zgłaszać pisemnie w terminie 14 dni od wykrycia wady.",
      "W zgłoszeniu prosimy o opisanie wady oraz dołączenie dokumentacji zdjęciowej. Odpowiedzi udzielamy w terminie 14 dni kalendarzowych."
    ]
  },
  {
    id: "terms-liability",
    title: "7. Odpowiedzialność",
    paragraphs: [
      "Administrator nie ponosi odpowiedzialności za szkody wynikłe z niewłaściwego użytkowania obuwia lub braku konserwacji zgodnie z przekazanymi zaleceniami."
    ]
  },
  {
    id: "terms-final",
    title: "8. Postanowienia końcowe",
    paragraphs: [
      "W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego. Aktualna wersja regulaminu jest dostępna na stronie jkhandmade.pl.",
      "Data obowiązywania: 22.10.2025 r."
    ]
  }
];

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
            Dokument określa zasady korzystania z serwisu jkhandmade.pl oraz warunki składania zamówień na obuwie wykonywane na zamówienie.
          </p>
          <div className="legal-page__actions">
            <a className="button button--ghost" href="/api/legal/terms" download>
              Pobierz wersję PDF
            </a>
          </div>
        </header>

        {sections.map(({ id, title, paragraphs }) => (
          <section key={id} className="legal-page__section" aria-labelledby={id}>
            <h2 id={id}>{title}</h2>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        ))}
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
          <h1 id="terms-heading">Regulamin sklepu JK Handmade Footwear</h1>
          <p>
            Niniejszy regulamin określa zasady korzystania z serwisu internetowego prowadzonego pod adresem{" "}
            <a className="legal-page__link" href="https://jk-footwear.pl">
              https://jk-footwear.pl
            </a>
            , w tym składania zamówień na produkty wykonywane na miarę przez JK Handmade Footwear – Pracownię Butów Na Miarę.
          </p>
          <p>
            Aktualna wersja regulaminu obowiązuje od dnia 10 lutego 2025 r. Wszelkie pytania prosimy kierować na adres e-mail{" "}
            <a className="legal-page__link" href="mailto:kontakt@jkhandmade.pl">
              kontakt@jkhandmade.pl
            </a>{" "}
            lub telefonicznie pod numer +48 600 000 000.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-general-heading">
          <h2 id="terms-general-heading">1. Postanowienia ogólne</h2>
          <ul>
            <li>Właścicielem i administratorem serwisu jest JK Handmade Footwear – Pracownia Butów Na Miarę, ul. Miedziana 12, 01-123 Warszawa, NIP 525-000-00-00.</li>
            <li>Regulamin stanowi wzorzec umowy w rozumieniu art. 384 Kodeksu cywilnego i jest udostępniany nieodpłatnie.</li>
            <li>
              Kontakt ze Sprzedawcą jest możliwy poprzez e-mail{" "}
              <a className="legal-page__link" href="mailto:kontakt@jkhandmade.pl">
                kontakt@jkhandmade.pl
              </a>{" "}
              lub telefonicznie pod numerem +48 600 000 000.
            </li>
            <li>Językiem obsługi klienta, zawieranych umów oraz rozstrzygania sporów jest język polski.</li>
            <li>Serwis przeznaczony jest dla osób pełnoletnich posiadających pełną zdolność do czynności prawnych.</li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-definitions-heading">
          <h2 id="terms-definitions-heading">2. Definicje</h2>
          <ul>
            <li>
              <strong>Sprzedawca</strong> – JK Handmade Footwear – Pracownia Butów Na Miarę, prowadzący działalność gospodarczą w Warszawie.
            </li>
            <li>
              <strong>Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna zamawiająca Produkt za pośrednictwem Serwisu.
            </li>
            <li>
              <strong>Produkt</strong> – obuwie wykonywane na miarę (made-to-order) lub inne wyroby/usługi oferowane przez Sprzedawcę.
            </li>
            <li>
              <strong>Umowa</strong> – umowa o dzieło lub umowa sprzedaży zawarta między Sprzedawcą a Klientem, której szczegóły określają indywidualne ustalenia stron.
            </li>
            <li>
              <strong>Serwis</strong> – strona internetowa dostępna pod adresem{" "}
              <a className="legal-page__link" href="https://jk-footwear.pl">
                https://jk-footwear.pl
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-services-heading">
          <h2 id="terms-services-heading">3. Zakres usług</h2>
          <p>
            Za pośrednictwem Serwisu Klient może zapoznać się z ofertą Sprzedawcy, umówić konsultację, przesłać zapytanie dotyczące realizacji obuwia na miarę oraz złożyć wstępną rezerwację zamówienia. Zawarcie Umowy następuje po potwierdzeniu dostępności terminu oraz akceptacji oferty przez Klienta w formie wiadomości e-mail lub podczas spotkania w pracowni.
          </p>
          <p>
            Serwis może również prezentować dodatkowe usługi, takie jak renowacja obuwia lub warsztaty, które wymagają odrębnego potwierdzenia przez Sprzedawcę.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-orders-heading">
          <h2 id="terms-orders-heading">4. Proces zamówienia</h2>
          <ul>
            <li>Klient przekazuje podstawowe dane kontaktowe i opis oczekiwań poprzez formularz lub kontakt telefoniczny.</li>
            <li>Sprzedawca potwierdza otrzymanie zapytania, przedstawia orientacyjny harmonogram i umawia konsultację stacjonarną lub online.</li>
            <li>Podczas konsultacji ustalane są: wzór, materiały, wymiary, przewidywany termin realizacji oraz budżet.</li>
            <li>Umowa zostaje zawarta po akceptacji zamówienia przez Klienta i wpłacie uzgodnionej zaliczki (o ile jest wymagana).</li>
            <li>Sprzedawca potwierdza zawarcie Umowy oraz harmonogram realizacji w wiadomości e-mail przesłanej na adres Klienta.</li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-pricing-heading">
          <h2 id="terms-pricing-heading">5. Ceny i płatności</h2>
          <ul>
            <li>Podane na stronie ceny mają charakter orientacyjny i nie stanowią oferty w rozumieniu Kodeksu cywilnego.</li>
            <li>Ostateczna cena Produktu ustalana jest indywidualnie po konsultacji, w zależności od wybranych materiałów, zakresu personalizacji oraz terminu realizacji.</li>
            <li>Sprzedawca może wymagać zaliczki w wysokości określonej podczas konsultacji. Pozostała część ceny płatna jest przy odbiorze Produktu lub zgodnie z ustalonym harmonogramem.</li>
            <li>Płatność może być realizowana przelewem bankowym, gotówką w pracowni lub za pomocą innych metod zaakceptowanych przez Sprzedawcę.</li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-delivery-heading">
          <h2 id="terms-delivery-heading">6. Odbiór i dostawa</h2>
          <ul>
            <li>Standardowo odbiór Produktu następuje osobiście w pracowni Sprzedawcy po wcześniejszym umówieniu wizyty.</li>
            <li>Na życzenie Klienta Sprzedawca może zorganizować wysyłkę kurierską na adres wskazany przez Klienta. Koszt i ryzyko przesyłki ponosi Klient, chyba że strony ustalą inaczej.</li>
            <li>Klient zobowiązuje się do dokonania przymiarek i odbioru Produktu w terminach wskazanych przez Sprzedawcę. Brak współpracy może wydłużyć harmonogram realizacji.</li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-withdrawal-heading">
          <h2 id="terms-withdrawal-heading">7. Prawo odstąpienia</h2>
          <p>
            Ze względu na charakter Produktu wykonywanego według indywidualnych specyfikacji Klienta, zgodnie z art. 38 pkt 3 ustawy o prawach konsumenta prawo odstąpienia od umowy zawartej na odległość nie przysługuje po rozpoczęciu personalizacji lub produkcji.
          </p>
          <p>
            Do momentu rozpoczęcia prac konstrukcyjnych Klient może zrezygnować z zamówienia, jednak Sprzedawca zastrzega sobie prawo do zatrzymania poniesionych kosztów przygotowawczych, w tym materiałów oraz czasu pracy.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-complaints-heading">
          <h2 id="terms-complaints-heading">8. Reklamacje i rękojmia</h2>
          <ul>
            <li>Sprzedawca odpowiada wobec Klienta będącego konsumentem z tytułu rękojmi za wady fizyczne i prawne Produktu zgodnie z przepisami Kodeksu cywilnego.</li>
            <li>
              Reklamację należy zgłosić drogą mailową na adres{" "}
              <a className="legal-page__link" href="mailto:kontakt@jkhandmade.pl">
                kontakt@jkhandmade.pl
              </a>
              , opisując stwierdzoną wadę oraz dołączając dokumentację zdjęciową.
            </li>
            <li>Sprzedawca rozpatruje reklamację w terminie 14 dni kalendarzowych od dnia jej otrzymania. Brak odpowiedzi w tym terminie oznacza uznanie reklamacji.</li>
            <li>W przypadku zasadnej reklamacji Sprzedawca dokonuje nieodpłatnej naprawy, wymiany Produktu lub zwraca część ceny zgodnie z ustaleniami z Klientem.</li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-liability-heading">
          <h2 id="terms-liability-heading">9. Odpowiedzialność i zasady korzystania z serwisu</h2>
          <ul>
            <li>Sprzedawca dokłada należytej staranności, aby informacje w Serwisie były aktualne, jednak nie ponosi odpowiedzialności za szkody wynikłe z wykorzystania danych orientacyjnych bez konsultacji z ekspertem.</li>
            <li>Klient zobowiązuje się do podania prawdziwych danych kontaktowych oraz do nieprzekazywania treści bezprawnych.</li>
            <li>Wszelkie materiały (zdjęcia, opisy, logo) zamieszczone w Serwisie stanowią własność Sprzedawcy lub są wykorzystywane za zgodą uprawnionych podmiotów i podlegają ochronie praw autorskich.</li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-data-heading">
          <h2 id="terms-data-heading">10. Ochrona danych osobowych</h2>
          <p>
            Zasady przetwarzania danych osobowych Klientów opisane są w Polityce prywatności dostępnej pod adresem{" "}
            <a className="legal-page__link" href="/privacy-policy">/privacy-policy</a>
            .
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="terms-final-heading">
          <h2 id="terms-final-heading">11. Postanowienia końcowe</h2>
          <ul>
            <li>Sprzedawca zastrzega sobie prawo zmiany Regulaminu z ważnych przyczyn, w szczególności w przypadku zmiany przepisów prawa lub rozszerzenia oferty.</li>
            <li>O zmianie Regulaminu Klienci zostaną poinformowani poprzez publikację nowej wersji w Serwisie. Do zamówień przyjętych przed zmianą stosuje się wersję obowiązującą w dniu zawarcia Umowy.</li>
            <li>W sprawach nieuregulowanych Regulaminem zastosowanie mają przepisy prawa polskiego, w tym Kodeksu cywilnego oraz ustawy o prawach konsumenta.</li>
            <li>Wszelkie spory wynikłe z realizacji Umowy będą rozstrzygane w sposób polubowny, a w razie braku porozumienia – przez właściwy sąd powszechny.</li>
          </ul>
          <p>
            Regulamin udostępniany jest w wersji elektronicznej i może być pobrany, utrwalony oraz odtwarzany przez Klienta w dowolnym momencie.
          </p>
        </section>
      </div>
    </main>
  );
}
