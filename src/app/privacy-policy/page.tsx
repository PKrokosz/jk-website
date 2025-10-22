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
            Niniejszy dokument opisuje zasady przetwarzania danych osobowych użytkowników serwisu jkhandmade.pl oraz
            klientów korzystających z naszych usług zamówień obuwia na miarę.
          </p>
          <p>Data wejścia w życie: 22.10.2025 r.</p>
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
            {paragraphs.map((paragraph, index) => {
              return <p key={index}>{paragraph}</p>;
            })}
          </section>
        ))}
        <section className="legal-page__section" aria-labelledby="privacy-policy-admin">
          <h2 id="privacy-policy-admin">1. Administrator danych</h2>
          <p>
            Administratorem danych osobowych jest JK Handmade Footwear, ul. [adres], 00-000 Warszawa, NIP: [xxx-xxx-xx-xx],
            REGON: [xxxxxxx]. Kontakt: <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-scope">
          <h2 id="privacy-policy-scope">2. Zakres i cele przetwarzania</h2>
          <p>Przetwarzamy dane użytkowników w następujących celach:</p>
          <ul>
            <li>udzielenie odpowiedzi na zapytania i prowadzenie korespondencji (art. 6 ust. 1 lit. f RODO),</li>
            <li>realizacja zamówień oraz obsługa klienta (art. 6 ust. 1 lit. b RODO),</li>
            <li>archiwizacja i obrona roszczeń (art. 6 ust. 1 lit. f RODO),</li>
            <li>działania marketingowe po uzyskaniu zgody (art. 6 ust. 1 lit. a RODO).</li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-data-types">
          <h2 id="privacy-policy-data-types">3. Kategorie przetwarzanych danych</h2>
          <p>W zależności od relacji z użytkownikiem przetwarzamy w szczególności:</p>
          <ul>
            <li>dane identyfikacyjne (imię, nazwisko, nazwa firmy),</li>
            <li>dane kontaktowe (adres e-mail, numer telefonu, adres korespondencyjny),</li>
            <li>dane dotyczące zamówień (model obuwia, preferencje personalizacji),</li>
            <li>dane techniczne (adres IP, identyfikatory urządzeń, logi systemowe).</li>
          </ul>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-obligation">
          <h2 id="privacy-policy-obligation">4. Obowiązek podania danych</h2>
          <p>
            Podanie danych jest dobrowolne, lecz niezbędne do udzielenia odpowiedzi lub realizacji zamówienia. Brak danych może
            uniemożliwić świadczenie usług.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-recipients">
          <h2 id="privacy-policy-recipients">5. Odbiorcy danych</h2>
          <p>
            Dane mogą być powierzane wyłącznie zaufanym podmiotom wspierającym naszą działalność (np. dostawcy hostingu,
            systemy CRM, księgowość) na podstawie umów powierzenia i przy zachowaniu odpowiednich zabezpieczeń.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-transfers">
          <h2 id="privacy-policy-transfers">6. Przekazywanie poza EOG</h2>
          <p>
            Co do zasady nie przekazujemy danych poza Europejski Obszar Gospodarczy. Jeśli zaistnieje taka potrzeba, stosujemy
            odpowiednie zabezpieczenia, w tym standardowe klauzule umowne.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-retention">
          <h2 id="privacy-policy-retention">7. Okres przechowywania</h2>
          <p>
            Dane przetwarzamy przez czas niezbędny do realizacji celu. Dane korespondencyjne przechowujemy do 12 miesięcy od
            zakończenia kontaktu, a dane związane z zamówieniami – przez okres wynikający z przepisów podatkowych i rachunkowych.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-rights">
          <h2 id="privacy-policy-rights">8. Prawa osoby, której dane dotyczą</h2>
          <p>Masz prawo do:</p>
          <ul>
            <li>dostępu do swoich danych i uzyskania ich kopii,</li>
            <li>sprostowania i uzupełnienia danych,</li>
            <li>usunięcia danych („prawo do bycia zapomnianym”) w przypadkach przewidzianych prawem,</li>
            <li>ograniczenia przetwarzania oraz przenoszenia danych,</li>
            <li>sprzeciwu wobec przetwarzania, w tym wobec marketingu bezpośredniego.</li>
          </ul>
          <p>
            Z praw można skorzystać, kontaktując się z nami poprzez adres <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-complaint">
          <h2 id="privacy-policy-complaint">9. Prawo do wniesienia skargi</h2>
          <p>
            Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych, jeśli uznasz, że przetwarzamy dane niezgodnie z
            prawem. Zachęcamy do wcześniejszego kontaktu – postaramy się wyjaśnić sprawę polubownie.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-cookies">
          <h2 id="privacy-policy-cookies">10. Pliki cookies i technologie podobne</h2>
          <p>
            Serwis korzysta z niezbędnych plików cookies zapewniających poprawne działanie strony. Narzędzia analityczne lub
            marketingowe uruchamiamy dopiero po uzyskaniu wyraźnej zgody użytkownika.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-security">
          <h2 id="privacy-policy-security">11. Środki bezpieczeństwa</h2>
          <p>
            Stosujemy zabezpieczenia techniczne i organizacyjne adekwatne do ryzyka, w tym szyfrowanie transmisji (HTTPS),
            kontrolę dostępu oraz regularne przeglądy bezpieczeństwa systemów informatycznych.
          </p>
        </section>

        <section className="legal-page__section" aria-labelledby="privacy-policy-changes">
          <h2 id="privacy-policy-changes">12. Zmiany polityki</h2>
          <p>
            Polityka może być aktualizowana w przypadku zmian przepisów lub naszej oferty. Aktualna wersja jest publikowana na
            tej stronie i oznaczona datą obowiązywania.
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

        <section className="legal-page__section" aria-labelledby="privacy-policy-contact">
          <h2 id="privacy-policy-contact">13. Kontakt</h2>
          <p>
            W sprawach dotyczących ochrony danych prosimy o kontakt e-mailowy na adres
            <a href="mailto:kontakt@jkhandmade.pl"> kontakt@jkhandmade.pl</a> lub korespondencyjny na adres siedziby
            administratora.
          </p>
        </section>
      </div>
    </main>
  );
}
