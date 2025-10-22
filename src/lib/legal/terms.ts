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

const strong = (value: string) => ({
  type: "strong" as const,
  text: value
});

export const termsSections = [
  {
    id: "terms-general",
    title: "1. Postanowienia ogólne",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Regulamin określa zasady korzystania z serwisu jkhandmade.pl oraz warunki składania zamówień na obuwie wykonywane na zamówienie (MTO)."
          )
        ]
      },
      {
        type: "list",
        variant: "unordered",
        items: [
          [
            text(
              "Właścicielem serwisu jest JK Handmade Footwear – Pracownia Butów Na Miarę, ul. Miedziana 12, 01-123 Warszawa, NIP 525-000-00-00."
            )
          ],
          [
            text("Kontakt: "),
            link("kontakt@jkhandmade.pl", "mailto:kontakt@jkhandmade.pl"),
            text(" oraz telefonicznie +48 600 000 000.")
          ],
          [
            text(
              "Regulamin stanowi wzorzec umowy w rozumieniu art. 384 Kodeksu cywilnego i jest udostępniany nieodpłatnie."
            )
          ],
          [
            text("Serwis przeznaczony jest dla osób pełnoletnich posiadających pełną zdolność do czynności prawnych.")
          ]
        ]
      }
    ]
  },
  {
    id: "terms-definitions",
    title: "2. Definicje",
    blocks: [
      {
        type: "list",
        variant: "unordered",
        items: [
          [strong("Sprzedawca"), text(" – JK Handmade Footwear – Pracownia Butów Na Miarę prowadzący działalność w Warszawie.")],
          [
            strong("Klient"),
            text(" – osoba fizyczna, osoba prawna lub jednostka organizacyjna zamawiająca Produkt za pośrednictwem Serwisu.")
          ],
          [
            strong("Produkt"),
            text(" – obuwie wykonywane na miarę (made-to-order) lub inne wyroby/usługi oferowane przez Sprzedawcę.")
          ],
          [
            strong("Umowa"),
            text(" – umowa o dzieło lub sprzedaży zawarta między Sprzedawcą a Klientem na warunkach uzgodnionych indywidualnie.")
          ],
          [
            strong("Serwis"),
            text(" – strona internetowa dostępna pod adresem "),
            link("https://jk-footwear.pl", "https://jk-footwear.pl"),
            text(".")
          ]
        ]
      }
    ]
  },
  {
    id: "terms-services",
    title: "3. Zakres usług",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Za pośrednictwem Serwisu Klient może zapoznać się z ofertą Sprzedawcy, przesłać zapytanie dotyczące realizacji obuwia na miarę, umówić konsultację oraz dokonać wstępnej rezerwacji zamówienia."
          )
        ]
      },
      {
        type: "paragraph",
        content: [
          text(
            "Informacje w katalogu mają charakter zaproszenia do zawarcia umowy i nie stanowią oferty w rozumieniu Kodeksu cywilnego. Zakres personalizacji, dostępność materiałów i terminy ustalane są indywidualnie."
          )
        ]
      }
    ]
  },
  {
    id: "terms-orders",
    title: "4. Proces zamówienia",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Zamówienia można składać poprzez formularz kontaktowy, korespondencję e-mail lub podczas konsultacji w pracowni."
          )
        ]
      },
      {
        type: "list",
        variant: "unordered",
        items: [
          [
            text(
              "Po otrzymaniu zapytania Sprzedawca kontaktuje się z Klientem w celu doprecyzowania oczekiwań i przygotowania oferty."
            )
          ],
          [
            text(
              "Umowa zostaje zawarta po akceptacji potwierdzenia zamówienia przez Klienta oraz – jeśli wymagana – wpłacie zaliczki."
            )
          ],
          [
            text(
              "Modyfikacje po rozpoczęciu produkcji mogą wymagać zmiany terminu realizacji lub dodatkowych kosztów, co każdorazowo potwierdzamy pisemnie."
            )
          ]
        ]
      }
    ]
  },
  {
    id: "terms-payment",
    title: "5. Płatności",
    blocks: [
      {
        type: "paragraph",
        content: [
          text("Warunki płatności ustalane są indywidualnie w potwierdzeniu zamówienia.")
        ]
      },
      {
        type: "list",
        variant: "unordered",
        items: [
          [text("Zaliczka (jeśli wymagana) jest warunkiem rozpoczęcia prac.")],
          [
            text(
              "Płatność może być realizowana przelewem na rachunek wskazany w potwierdzeniu, gotówką w pracowni lub inną metodą zaakceptowaną przez Sprzedawcę."
            )
          ],
          [
            text(
              "Brak płatności w ustalonym terminie może skutkować wstrzymaniem lub anulowaniem zamówienia."
            )
          ]
        ]
      }
    ]
  },
  {
    id: "terms-delivery",
    title: "6. Realizacja i odbiór",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Czas realizacji zależy od złożoności projektu, dostępności materiałów oraz aktualnego obłożenia pracowni; termin potwierdzamy indywidualnie."
          )
        ]
      },
      {
        type: "list",
        variant: "unordered",
        items: [
          [text("Standardowo odbiór następuje osobiście w pracowni w Warszawie.")],
          [
            text(
              "Na życzenie Klienta możliwa jest wysyłka kurierska – koszt i ryzyko przesyłki ponosi Klient, chyba że ustalimy inaczej."
            )
          ],
          [
            text(
              "W trakcie procesu możliwe są przymiarki i korekty uzgodnione podczas konsultacji; brak współpracy może wydłużyć harmonogram."
            )
          ]
        ]
      }
    ]
  },
  {
    id: "terms-withdrawal",
    title: "7. Prawo odstąpienia",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Z uwagi na charakter produktów wykonywanych według indywidualnej specyfikacji Klienta prawo odstąpienia od umowy zawartej na odległość nie przysługuje po rozpoczęciu personalizacji lub produkcji (art. 38 pkt 3 ustawy o prawach konsumenta)."
          )
        ]
      },
      {
        type: "paragraph",
        content: [
          text(
            "Do momentu rozpoczęcia prac konstrukcyjnych Klient może zrezygnować z zamówienia, przy czym Sprzedawca może zatrzymać poniesione koszty przygotowawcze."
          )
        ]
      }
    ]
  },
  {
    id: "terms-complaints",
    title: "8. Reklamacje i rękojmia",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Sprzedawca odpowiada z tytułu rękojmi zgodnie z Kodeksem cywilnym; obuwie wykonane na zamówienie nie podlega zwrotowi, chyba że wynika to z bezwzględnie obowiązujących przepisów."
          )
        ]
      },
      {
        type: "list",
        variant: "unordered",
        items: [
          [
            text("Reklamacje należy zgłosić pisemnie w terminie 14 dni od wykrycia wady, dołączając opis i dokumentację zdjęciową.")
          ],
          [
            text("Zgłoszenia przyjmujemy mailowo na adres "),
            link("kontakt@jkhandmade.pl", "mailto:kontakt@jkhandmade.pl"),
            text("; odpowiadamy w terminie 14 dni kalendarzowych.")
          ],
          [
            text(
              "W przypadku zasadnej reklamacji oferujemy naprawę, wymianę lub inne środki przewidziane prawem."
            )
          ]
        ]
      }
    ]
  },
  {
    id: "terms-liability",
    title: "9. Odpowiedzialność i zasady korzystania z serwisu",
    blocks: [
      {
        type: "list",
        variant: "unordered",
        items: [
          [
            text(
              "Sprzedawca dokłada należytej staranności, aby informacje w Serwisie były aktualne, jednak nie ponosi odpowiedzialności za decyzje podjęte wyłącznie na ich podstawie bez konsultacji."
            )
          ],
          [text("Klient zobowiązuje się do podawania prawdziwych danych i nieprzekazywania treści bezprawnych.")],
          [
            text(
              "Wszelkie materiały publikowane w Serwisie chronione są prawem autorskim i nie mogą być wykorzystywane bez zgody."
            )
          ]
        ]
      }
    ]
  },
  {
    id: "terms-privacy",
    title: "10. Ochrona danych osobowych",
    blocks: [
      {
        type: "paragraph",
        content: [
          text("Dane osobowe przetwarzamy zgodnie z Polityką prywatności dostępną pod adresem "),
          link("/privacy-policy", "/privacy-policy"),
          text(".")
        ]
      }
    ]
  },
  {
    id: "terms-final",
    title: "11. Postanowienia końcowe",
    blocks: [
      {
        type: "list",
        variant: "unordered",
        items: [
          [
            text(
              "Sprzedawca zastrzega sobie prawo zmiany Regulaminu z ważnych przyczyn, w szczególności w przypadku zmiany przepisów lub rozszerzenia oferty."
            )
          ],
          [
            text(
              "O zmianie Regulaminu informujemy poprzez publikację nowej wersji w Serwisie; do zamówień przyjętych wcześniej stosuje się wersję obowiązującą w dniu zawarcia Umowy."
            )
          ],
          [
            text("W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego, w tym Kodeksu cywilnego oraz ustawa o prawach konsumenta.")
          ]
        ]
      },
      {
        type: "paragraph",
        content: [text("Data obowiązywania: 22.10.2025 r.")]
      }
    ]
  },
  {
    id: "terms-disclaimer",
    title: "Uwaga prawna",
    blocks: [
      {
        type: "paragraph",
        content: [
          text(
            "Teksty przygotowano zgodnie z polskim prawem konsumenckim i RODO na dzień publikacji. Rekomendujemy konsultację prawną przed finalnym wdrożeniem."
          )
        ]
      }
    ]
  }
] satisfies LegalSection[];
