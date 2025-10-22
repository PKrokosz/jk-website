import type { Metadata } from "next";

const sections = [
  {
    id: "privacy-policy-admin",
    title: "1. Administrator danych",
    paragraphs: [
      "Administratorem danych osobowych jest JK Handmade Footwear (zwany dalej „Administratorem”), ul. [adres], 00-000 Warszawa, e-mail: kontakt@jkhandmade.pl, NIP: [xxx-xxx-xx-xx], REGON: [xxxxxxx]."
    ]
  },
  {
    id: "privacy-policy-scope",
    title: "2. Zakres i cele przetwarzania",
    paragraphs: [
      "Przetwarzamy Twoje dane: imię, e-mail, telefon (opcjonalnie) oraz treść wiadomości – gdy korzystasz z formularza kontaktowego.",
      "Cele przetwarzania obejmują udzielenie odpowiedzi na zapytanie (art. 6 ust. 1 lit. f RODO), archiwizację korespondencji i obronę roszczeń (art. 6 ust. 1 lit. f RODO) oraz – jeśli wyrazisz zgodę – marketing bezpośredni (art. 6 ust. 1 lit. a RODO)."
    ]
  },
  {
    id: "privacy-policy-obligation",
    title: "3. Obowiązek podania danych",
    paragraphs: [
      "Podanie danych jest dobrowolne, ale niezbędne do udzielenia odpowiedzi na zapytanie wysłane przez formularz kontaktowy."
    ]
  },
  {
    id: "privacy-policy-recipients",
    title: "4. Odbiorcy danych",
    paragraphs: [
      "Dane mogą być powierzane dostawcom usług IT (hosting, e-mail) oraz innym partnerom działającym na podstawie umów powierzenia i tylko w zakresie koniecznym do realizacji usług."
    ]
  },
  {
    id: "privacy-policy-transfer",
    title: "5. Przekazywanie poza EOG",
    paragraphs: [
      "Co do zasady nie przekazujemy danych poza EOG. Jeśli zaistnieje taka potrzeba (np. dostawca e-mail spoza EOG), zastosujemy odpowiednie zabezpieczenia, np. standardowe klauzule umowne."
    ]
  },
  {
    id: "privacy-policy-retention",
    title: "6. Okres przechowywania",
    paragraphs: [
      "Dane przechowujemy przez okres prowadzenia korespondencji, a następnie do 12 miesięcy w celu obrony roszczeń, chyba że przepisy wymagają dłuższego przechowywania."
    ]
  },
  {
    id: "privacy-policy-rights",
    title: "7. Prawa osoby, której dane dotyczą",
    paragraphs: [
      "Masz prawo do dostępu, sprostowania, usunięcia, ograniczenia przetwarzania i przenoszenia danych oraz sprzeciwu (w tym wobec marketingu). Zrealizujesz je pisząc na kontakt@jkhandmade.pl."
    ]
  },
  {
    id: "privacy-policy-complaint",
    title: "8. Prawo skargi",
    paragraphs: [
      "Przysługuje Ci skarga do Prezesa UODO (ul. Stawki 2, 00-193 Warszawa), jeśli uznasz, że przetwarzanie narusza przepisy."
    ]
  },
  {
    id: "privacy-policy-cookies",
    title: "9. Pliki cookies i technologie podobne",
    paragraphs: [
      "Serwis wykorzystuje wyłącznie niezbędne cookies zapewniające poprawne działanie strony. Narzędzia analityczne/marketingowe wdrożymy wyłącznie po uzyskaniu zgody – wtedy polityka zostanie zaktualizowana."
    ]
  },
  {
    id: "privacy-policy-security",
    title: "10. Bezpieczeństwo",
    paragraphs: [
      "Stosujemy środki techniczne i organizacyjne adekwatne do ryzyka, w tym szyfrowanie transmisji (HTTPS) i kontrolę dostępu."
    ]
  },
  {
    id: "privacy-policy-changes",
    title: "11. Zmiany polityki",
    paragraphs: [
      "Polityka może podlegać zmianom. Aktualna wersja jest publikowana na tej stronie wraz z datą obowiązywania.",
      "Data wejścia w życie: 22.10.2025 r."
    ]
  }
];

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności JK Handmade Footwear – informacje o administratorze danych, celach przetwarzania oraz prawach użytkownika."
    "Polityka prywatności JK Handmade Footwear – informacje o administratorze danych, celach przetwarzania oraz prawach użytkownika.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="page legal-page" aria-labelledby="privacy-policy-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="privacy-policy-heading">Polityka prywatności – JK Handmade Footwear</h1>
          <p>
            Niniejszy dokument określa zasady przetwarzania danych osobowych użytkowników serwisu jkhandmade.pl w związku z
            prowadzeniem korespondencji przez formularz kontaktowy.
          </p>
          <div className="legal-page__actions">
            <a
              className="button button--ghost"
              href="/api/legal/privacy-policy"
              download
            >
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
        <section className="legal-page__section" aria-labelledby="privacy-policy-admin">
          <h2 id="privacy-policy-admin">1. Administrator danych</h2>
          <p>
            Administratorem danych osobowych jest JK Handmade Footwear (zwany dalej „Administratorem”), ul. [adres], 00-000
            Warszawa, e-mail: <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>, NIP: [xxx-xxx-xx-xx], REGON:
            [xxxxxxx].
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-scope">
          <h2 id="privacy-policy-scope">2. Zakres i cele przetwarzania</h2>
          <p>
            Przetwarzamy Twoje dane: imię, e-mail, telefon (opcjonalnie) oraz treść wiadomości – gdy korzystasz z
            formularza kontaktowego.
          </p>
          <ul>
            <li>
              udzielenie odpowiedzi na zapytanie (art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes w komunikacji z
              użytkownikami),
            </li>
            <li>
              archiwizacja korespondencji i obrona roszczeń (art. 6 ust. 1 lit. f RODO),
            </li>
            <li>
              jeśli wyrazisz dodatkowe zgody – marketing bezpośredni (art. 6 ust. 1 lit. a RODO).
            </li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-obligation">
          <h2 id="privacy-policy-obligation">3. Obowiązek podania danych</h2>
          <p>Podanie danych jest dobrowolne, ale niezbędne do udzielenia odpowiedzi.</p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-recipients">
          <h2 id="privacy-policy-recipients">4. Odbiorcy danych</h2>
          <p>
            Dane mogą być powierzane dostawcom usług IT (hosting, e-mail), wyłącznie w zakresie niezbędnym do realizacji
            celów, na podstawie umów powierzenia.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-transfer">
          <h2 id="privacy-policy-transfer">5. Przekazywanie poza EOG</h2>
          <p>
            Co do zasady nie przekazujemy danych poza EOG. Jeśli zaistnieje taka potrzeba (np. dostawca e-mail spoza EOG),
            zastosujemy odpowiednie zabezpieczenia (np. standardowe klauzule umowne).
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-retention">
          <h2 id="privacy-policy-retention">6. Okres przechowywania</h2>
          <p>
            Dane z formularza przechowujemy przez okres prowadzenia korespondencji, a następnie do 12 miesięcy w celu
            obrony roszczeń, chyba że przepisy wymagają dłużej lub nastąpi wcześniejsze, uzasadnione usunięcie.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-rights">
          <h2 id="privacy-policy-rights">7. Prawa osoby, której dane dotyczą</h2>
          <p>
            Masz prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, sprzeciwu (w tym
            wobec marketingu), przenoszenia danych – w zakresie przewidzianym RODO. Zrealizujesz je, pisząc na
            <a href="mailto:kontakt@jkhandmade.pl"> kontakt@jkhandmade.pl</a>.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-complaint">
          <h2 id="privacy-policy-complaint">8. Prawo skargi</h2>
          <p>
            Przysługuje Ci skarga do Prezesa UODO (ul. Stawki 2, 00-193 Warszawa), jeśli uznasz, że przetwarzanie narusza
            przepisy.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-cookies">
          <h2 id="privacy-policy-cookies">9. Pliki cookies i technologie podobne</h2>
          <p>
            Serwis wykorzystuje wyłącznie niezbędne cookies zapewniające poprawne działanie strony (np. preferencje
            interfejsu). Narzędzia analityczne/marketingowe wdrożymy wyłącznie po uzyskaniu zgody (baner zgód) – wtedy
            polityka zostanie zaktualizowana.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-automation">
          <h2 id="privacy-policy-automation">10. Zautomatyzowane podejmowanie decyzji</h2>
          <p>Nie stosujemy profilowania ani zautomatyzowanego podejmowania decyzji wywołującego skutki prawne.</p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-security">
          <h2 id="privacy-policy-security">11. Bezpieczeństwo</h2>
          <p>
            Stosujemy środki techniczne i organizacyjne adekwatne do ryzyka, w tym szyfrowanie transmisji (HTTPS) i
            kontrolę dostępu.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-changes">
          <h2 id="privacy-policy-changes">12. Zmiany polityki</h2>
          <p>
            Polityka może podlegać zmianom. Aktualna wersja jest publikowana na tej stronie wraz z datą obowiązywania.
          </p>
          <p>Data wejścia w życie: 22.10.2025 r.</p>
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
        </section>
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
