import { type LegalSection } from "./types";

const text = (value: string) => ({
  type: "text" as const,
  text: value
});

const link = (label: string, href: string) => ({
  type: "link" as const,
  text: label,
  href
});

export const privacyPolicySections = [
  {
    id: "privacy-policy-admin",
    title: "1. Administrator danych",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Administratorem danych osobowych jest JK Handmade Footwear – Pracownia Butów Na Miarę z siedzibą przy ul. Miedzianej 12, 01-123 Warszawa, NIP 525-000-00-00."
          ),
          text(" Kontakt: "),
          link("kontakt@jkhandmade.pl", "mailto:kontakt@jkhandmade.pl"),
          text(" oraz telefonicznie pod numerem +48 600 000 000.")
        ]
      }
    ]
  },
  {
    id: "privacy-policy-scope",
    title: "2. Zakres i cele przetwarzania",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Przetwarzamy dane osobowe w związku z obsługą formularza kontaktowego, przygotowaniem ofert oraz realizacją zamówień na obuwie wykonywane na zamówienie."
          )
        ]
      },
      {
        type: "list",
        variant: "unordered",
        items: [
          [
            text(
              "udzielenie odpowiedzi na zapytania i prowadzenie korespondencji (art. 6 ust. 1 lit. f RODO),"
            )
          ],
          [
            text(
              "realizacja zamówień i obsługa klienta (art. 6 ust. 1 lit. b RODO),"
            )
          ],
          [
            text(
              "archiwizacja korespondencji oraz dochodzenie roszczeń (art. 6 ust. 1 lit. f RODO),"
            )
          ],
          [
            text(
              "działania marketingowe prowadzone wyłącznie na podstawie udzielonej zgody (art. 6 ust. 1 lit. a RODO)."
            )
          ]
        ]
      }
    ]
  },
  {
    id: "privacy-policy-data-types",
    title: "3. Kategorie przetwarzanych danych",
    blocks: [
      {
        type: "paragraph",
        content: [
          text("W zależności od relacji z użytkownikiem przetwarzamy w szczególności:")
        ]
      },
      {
        type: "list",
        variant: "unordered",
        items: [
          [text("dane identyfikacyjne (imię, nazwisko, nazwa firmy),")],
          [text("dane kontaktowe (adres e-mail, numer telefonu, adres korespondencyjny),")],
          [text("dane dotyczące zamówień (model obuwia, preferencje personalizacji),")],
          [text("dane techniczne (adres IP, identyfikatory urządzeń, logi systemowe).")]
        ]
      }
    ]
  },
  {
    id: "privacy-policy-obligation",
    title: "4. Obowiązek podania danych",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Podanie danych jest dobrowolne, lecz niezbędne do udzielenia odpowiedzi na zapytanie lub realizacji zamówienia. Brak danych może uniemożliwić świadczenie usług."
          )
        ]
      }
    ]
  },
  {
    id: "privacy-policy-recipients",
    title: "5. Odbiorcy danych",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Dane mogą być powierzane wyłącznie zaufanym podmiotom wspierającym naszą działalność (np. dostawcom hostingu, systemom CRM, biuru rachunkowemu) na podstawie umów powierzenia i przy zachowaniu odpowiednich zabezpieczeń."
          )
        ]
      }
    ]
  },
  {
    id: "privacy-policy-transfers",
    title: "6. Przekazywanie poza EOG",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Co do zasady nie przekazujemy danych poza Europejski Obszar Gospodarczy. Jeśli zaistnieje taka potrzeba, stosujemy odpowiednie zabezpieczenia, w tym standardowe klauzule umowne."
          )
        ]
      }
    ]
  },
  {
    id: "privacy-policy-retention",
    title: "7. Okres przechowywania",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Dane przechowujemy przez czas prowadzenia korespondencji, a następnie do 12 miesięcy w celu obrony roszczeń lub do czasu upływu terminów wynikających z przepisów podatkowych i rachunkowych."
          )
        ]
      }
    ]
  },
  {
    id: "privacy-policy-rights",
    title: "8. Prawa osoby, której dane dotyczą",
    blocks: [
      {
        type: "paragraph",
        content: [text("Masz prawo do:")]
      },
      {
        type: "list",
        variant: "unordered",
        items: [
          [text("dostępu do swoich danych i uzyskania ich kopii,")],
          [text("sprostowania i uzupełnienia danych,")],
          [
            text(
              "usunięcia danych („prawo do bycia zapomnianym”) w przypadkach przewidzianych prawem,"
            )
          ],
          [text("ograniczenia przetwarzania oraz przenoszenia danych,")],
          [text("sprzeciwu wobec przetwarzania, w tym wobec marketingu bezpośredniego.")]
        ]
      },
      {
        type: "paragraph",
        content: [
          text("Z praw można skorzystać, kontaktując się z nami poprzez adres "),
          link("kontakt@jkhandmade.pl", "mailto:kontakt@jkhandmade.pl"),
          text(".")
        ]
      }
    ]
  },
  {
    id: "privacy-policy-complaint",
    title: "9. Prawo do wniesienia skargi",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa), jeśli uznasz, że przetwarzanie narusza przepisy RODO. Zachęcamy do wcześniejszego kontaktu w celu polubownego wyjaśnienia sprawy."
          )
        ]
      }
    ]
  },
  {
    id: "privacy-policy-cookies",
    title: "10. Pliki cookies i technologie podobne",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Serwis korzysta z niezbędnych plików cookies zapewniających poprawne działanie strony. Narzędzia analityczne lub marketingowe uruchamiamy dopiero po uzyskaniu wyraźnej zgody użytkownika, a polityka zostanie wtedy zaktualizowana."
          )
        ]
      }
    ]
  },
  {
    id: "privacy-policy-security",
    title: "11. Środki bezpieczeństwa",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Stosujemy zabezpieczenia techniczne i organizacyjne adekwatne do ryzyka, w tym szyfrowanie transmisji (HTTPS), kontrolę dostępu oraz regularne przeglądy bezpieczeństwa systemów informatycznych."
          )
        ]
      }
    ]
  },
  {
    id: "privacy-policy-changes",
    title: "12. Zmiany polityki",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Polityka może być aktualizowana w przypadku zmian przepisów lub naszej oferty. Aktualna wersja jest publikowana na tej stronie i oznaczona datą obowiązywania."
          )
        ]
      },
      {
        type: "paragraph",
        content: [text("Data wejścia w życie: 22.10.2025 r.")]
      }
    ]
  },
  {
    id: "privacy-policy-contact",
    title: "13. Kontakt",
    blocks: [
      {
        type: "paragraph",
        content: [
          text("W sprawach dotyczących ochrony danych prosimy o kontakt e-mailowy na adres "),
          link("kontakt@jkhandmade.pl", "mailto:kontakt@jkhandmade.pl"),
          text(" lub korespondencyjny na adres siedziby administratora.")
        ]
      }
    ]
  }
] satisfies LegalSection[];
