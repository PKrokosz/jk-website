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
        </header>

        {sections.map(({ id, title, paragraphs }) => (
          <section key={id} className="legal-page__section" aria-labelledby={id}>
            <h2 id={id}>{title}</h2>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
