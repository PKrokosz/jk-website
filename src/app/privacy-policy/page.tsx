import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności"
};

export default function PrivacyPolicyPage() {
  return (
    <main className="page legal-page" aria-labelledby="privacy-policy-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="privacy-policy-heading">Polityka prywatności</h1>
          <p>
            Niniejsza polityka prywatności opisuje zasady przetwarzania danych osobowych przez JK Handmade
            Footwear oraz wyjaśnia, w jaki sposób dbamy o poufność i bezpieczeństwo informacji naszych klientów,
            subskrybentów oraz użytkowników serwisu internetowego.
          </p>
          <p>
            Aktualna wersja polityki została przyjęta dnia 10 lutego 2025 r. i jest dostępna pod adresem{" "}
            <a className="legal-page__link" href="https://jk-footwear.pl/privacy-policy">
              https://jk-footwear.pl/privacy-policy
            </a>
            .
          </p>
        </header>
        <section className="legal-page__section" aria-labelledby="privacy-policy-administrator-heading">
          <h2 id="privacy-policy-administrator-heading">1. Administrator danych</h2>
          <p>
            Administratorem danych osobowych jest JK Handmade Footwear – Pracownia Butów Na Miarę, z siedzibą przy ul.
            Miedzianej 12 w Warszawie (01-123), NIP 525-000-00-00. Można się z nami skontaktować pisząc na adres{" "}
            <a className="legal-page__link" href="mailto:kontakt@jkhandmade.pl">
              kontakt@jkhandmade.pl
            </a>{" "}
            lub telefonicznie pod numerem +48 600 000 000.
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-basis-heading">
          <h2 id="privacy-policy-basis-heading">2. Zakres i cele przetwarzania danych</h2>
          <p>
            Przetwarzamy dane osobowe wyłącznie w niezbędnym zakresie i w następujących celach:
          </p>
          <ul>
            <li>obsługa zapytań przesyłanych przez formularze kontaktowe lub zamówień indywidualnych (podstawa: art. 6 ust. 1 lit. b RODO),</li>
            <li>realizacja obowiązków księgowych i podatkowych związanych z prowadzoną działalnością (podstawa: art. 6 ust. 1 lit. c RODO),</li>
            <li>prowadzenie działań marketingowych, w tym kampanii reklamowych online oraz wysyłka newslettera za zgodą użytkownika (podstawa: art. 6 ust. 1 lit. a i f RODO),</li>
            <li>zapewnienie bezpieczeństwa i utrzymania serwisu internetowego, w tym monitorowanie ruchu w celach statystycznych (podstawa: art. 6 ust. 1 lit. f RODO).</li>
          </ul>
          <p>
            Dane gromadzimy poprzez formularze, korespondencję e-mail, zapisy sprzedaży oraz pliki cookie lub inne identyfikatory
            internetowe wykorzystywane przez narzędzia analityczne i marketingowe.
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-scope-heading">
          <h2 id="privacy-policy-scope-heading">3. Kategorie przetwarzanych danych</h2>
          <p>W zależności od relacji z użytkownikiem możemy przetwarzać w szczególności:</p>
          <ul>
            <li>dane identyfikacyjne (imię i nazwisko, nazwa firmy),</li>
            <li>dane kontaktowe (adres e-mail, numer telefonu, adres korespondencyjny),</li>
            <li>dane transakcyjne (historia zamówień, informacje o płatnościach),</li>
            <li>dane techniczne dotyczące urządzenia i logów dostępowych (adres IP, typ przeglądarki, strefa czasowa),</li>
            <li>preferencje marketingowe i zgody komunikacyjne.</li>
          </ul>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-retention-heading">
          <h2 id="privacy-policy-retention-heading">4. Okres przechowywania danych</h2>
          <p>
            Dane przechowujemy przez okres niezbędny do realizacji celu, dla którego zostały zebrane. Jeżeli przetwarzanie odbywa się
            na podstawie zgody – do czasu jej wycofania. Dane rozliczeniowe przechowujemy przez 5 lat licząc od końca roku, w którym
            powstał obowiązek podatkowy. Dane związane z roszczeniami przechowujemy do czasu ich przedawnienia wynikającego z
            przepisów prawa.
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-recipients-heading">
          <h2 id="privacy-policy-recipients-heading">5. Odbiorcy danych</h2>
          <p>
            Dostęp do danych mogą mieć wyłącznie upoważnieni pracownicy i współpracownicy JK Handmade Footwear oraz podmioty,
            którym powierzamy dane na podstawie umów powierzenia, w szczególności dostawcy systemów CRM, usług hostingowych,
            narzędzi księgowych oraz partnerzy marketingowi, tacy jak Google Ireland Limited, Meta Platforms Ireland Limited,
            LinkedIn Ireland Unlimited Company oraz operatorzy kampanii reklamowych. Każdy podmiot przetwarzający dane działa
            zgodnie z naszymi instrukcjami i zapewnia odpowiednie środki bezpieczeństwa.
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-rights-heading">
          <h2 id="privacy-policy-rights-heading">6. Prawa osób, których dane dotyczą</h2>
          <p>Każdemu użytkownikowi przysługuje prawo do:</p>
          <ul>
            <li>dostępu do swoich danych oraz uzyskania ich kopii,</li>
            <li>sprostowania danych, jeśli są nieprawidłowe lub niekompletne,</li>
            <li>usunięcia danych (prawo do bycia zapomnianym) w przypadkach przewidzianych prawem,</li>
            <li>ograniczenia przetwarzania danych,</li>
            <li>przenoszenia danych dostarczonych nam na podstawie zgody lub umowy,</li>
            <li>wniesienia sprzeciwu wobec przetwarzania realizowanego na podstawie uzasadnionego interesu, w tym wobec profilowania,</li>
            <li>wycofania zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania przed jej wycofaniem.</li>
          </ul>
          <p>
            W celu skorzystania ze swoich praw prosimy o kontakt mailowy na adres{" "}
            <a className="legal-page__link" href="mailto:kontakt@jkhandmade.pl">
              kontakt@jkhandmade.pl
            </a>
            . Ponadto użytkownik ma prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych.
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-marketing-heading">
          <h2 id="privacy-policy-marketing-heading">7. Pliki cookie i technologie marketingowe</h2>
          <p>
            Serwis wykorzystuje pliki cookie oraz podobne technologie w celu zapewnienia prawidłowego działania strony, analizowania
            ruchu i prowadzenia kampanii marketingowych. W module zarządzania skryptami marketingowymi kontrolujemy aktywację
            narzędzi takich jak Google Tag Manager, Meta Pixel czy LinkedIn Insight Tag. Aktywacja narzędzi odbywa się wyłącznie po
            spełnieniu wymogów prawnych, w tym po uzyskaniu wymaganych zgód marketingowych.
          </p>
          <p>
            Użytkownik może zarządzać preferencjami dotyczącymi plików cookie poprzez ustawienia swojej przeglądarki oraz
            korzystając z menedżerów zgód udostępnianych na stronie. Szczegółowe informacje o używanych narzędziach i czasie
            przechowywania poszczególnych plików cookie znajdują się w tabeli konfiguracji marketingowej dostępnej na żądanie pod
            adresem{" "}
            <a className="legal-page__link" href="mailto:kontakt@jkhandmade.pl">
              kontakt@jkhandmade.pl
            </a>
            .
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-security-heading">
          <h2 id="privacy-policy-security-heading">8. Środki bezpieczeństwa</h2>
          <p>
            Stosujemy adekwatne środki techniczne i organizacyjne, w tym szyfrowanie transmisji (HTTPS), segmentację dostępów oraz
            okresowe przeglądy bezpieczeństwa systemów informatycznych. Pracownicy i współpracownicy są szkoleni w zakresie ochrony
            danych i zobowiązani do zachowania poufności.
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-transfers-heading">
          <h2 id="privacy-policy-transfers-heading">9. Przekazywanie danych poza EOG</h2>
          <p>
            W przypadku korzystania z narzędzi dostawców mających siedziby poza Europejskim Obszarem Gospodarczym dane mogą być
            przekazywane do państw trzecich. W takich przypadkach stosujemy odpowiednie zabezpieczenia prawne, w szczególności
            standardowe klauzule umowne zatwierdzone przez Komisję Europejską, a także dbamy, aby partnerzy zapewniali poziom ochrony
            zgodny z RODO.
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-updates-heading">
          <h2 id="privacy-policy-updates-heading">10. Zmiany polityki prywatności</h2>
          <p>
            Polityka prywatności może ulegać zmianom w przypadku dostosowania do nowych przepisów prawa, zmian technologicznych lub
            wprowadzenia nowych usług. Aktualna wersja dokumentu będzie zawsze dostępna na niniejszej stronie wraz z datą ostatniej
            aktualizacji. O istotnych zmianach będziemy informować użytkowników za pomocą komunikatów w serwisie lub drogą
            elektroniczną.
          </p>
        </section>
        <section className="legal-page__section" aria-labelledby="privacy-policy-contact-heading">
          <h2 id="privacy-policy-contact-heading">11. Kontakt</h2>
          <p>
            W sprawach związanych z przetwarzaniem danych osobowych prosimy o kontakt na adres{" "}
            <a className="legal-page__link" href="mailto:kontakt@jkhandmade.pl">
              kontakt@jkhandmade.pl
            </a>{" "}
            lub korespondencyjnie na adres siedziby administratora. Na życzenie udostępniamy szczegółowy rejestr czynności
            przetwarzania oraz dodatkowe informacje o zastosowanych zabezpieczeniach.
          </p>
        </section>
      </div>
    </main>
  );
}
