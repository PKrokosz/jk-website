import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności JK Handmade Footwear – informacje o administratorze danych, celach przetwarzania oraz prawach użytkownika."
};

export default function PrivacyPolicyPage() {
  return (
    <main className="page legal-page" aria-labelledby="privacy-policy-heading">
      <div className="container legal-page__container">
        <header className="legal-page__header">
          <h1 id="privacy-policy-heading">Polityka prywatności – JK Handmade Footwear</h1>
          <p>
            Niniejszy dokument określa zasady przetwarzania danych osobowych użytkowników serwisu jkhandmade.pl w
            związku z prowadzeniem korespondencji przez formularz kontaktowy.
          </p>
        </header>

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
        </section>
      </div>
    </main>
  );
}
