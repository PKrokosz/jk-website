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
    "Regulamin serwisu JK Handmade Footwear dotyczący zamówień na obuwie wykonywane na zamówienie (MTO)."
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
