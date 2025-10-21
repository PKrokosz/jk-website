# Site map i mapa ekranów

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Drzewo nawigacji](#drzewo-nawigacji)
- [3. Mapy ekranów](#mapy-ekranow)
  - [3.1 Home](#31-home)
  - [3.2 Catalog](#32-catalog)
  - [3.3 Product](#33-product)
  - [3.4 Contact](#34-contact)
- [4. Stany systemowe](#stany-systemowe)
- [5. Checklisty kontrolne](#checklisty-kontrolne)
- [6. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Nawigacja obejmuje cztery główne sekcje plus pomocnicze endpointy (`/healthz`, `/api/*`).
- Każda strona ma zdefiniowane sekcje treści, CTA oraz stany (loading, empty, error).
- Site map odzwierciedla przepływ: Home → Catalog → Product → Contact.

## Drzewo nawigacji
```
/
├── Home (/)
│   ├── Sekcja hero (CTA mailto, link do API pricing)
│   ├── Proces 4 kroków
│   ├── Portfolio realizacji
│   ├── Kalkulator wyceny
│   └── CTA końcowe (Rezerwuj termin, Status aplikacji)
├── Catalog (/catalog)
│   ├── Filtry: styl, skóra
│   └── Lista produktów (linki do /catalog/[slug])
├── Product (/catalog/[slug])
│   ├── Breadcrumbs
│   ├── Hero produktu (nazwa, cena, CTA)
│   ├── Galeria zdjęć
│   ├── Detale (opis, materiały, highlight)
│   └── Sekcja wariantów (kolory, rozmiary)
├── About (/about)
│   └── Treść o pracowni (placeholder → docelowo story brand)
└── Contact (/contact)
    ├── Formularz kontaktowy / mailto
    ├── Informacje kontaktowe
    └── CTA „Zamów konsultację”
```

## Mapy ekranów
### 3.1 Home
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Hero | Eyebrow badge, H1, lead, CTA primary/ghost | `mailto`, link do `/api/pricing/quote` | Normalny, brak loading |
| Proces | Lista kroków (ol) | Link do Contact (opcjonalnie) | Stały content |
| Portfolio | Grid kart (placeholder) | Link do szczegółów (przyszłe) | Empty state: fallback copy |
| Kalkulator | Formularz select/checkbox | brak (tylko display) | Loading (skeleton) gdy quote liczone; Error (toast) |
| CTA końcowe | Tekst + 2 buttony | `mailto`, `/healthz` | Stały |

### 3.2 Catalog
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Header katalogu | H1, opis, kicker | Link do filtrów (skip link) | Stały |
| Sidebar filtrów | Fieldset styl, fieldset skóra | brak CTA, checkboxes | Empty: disable checkboxes? (nie) |
| Toolbar | Wynik count, select sort | brak | Loading skeleton na listę |
| Lista produktów | Karty z CTA „Poznaj szczegóły” | Link do `/catalog/[slug]` | Empty: tekst „Brak wyników” |

### 3.3 Product
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Breadcrumbs | Home > Catalog > Product | Linki do rodziców | Loading skeleton |
| Hero produktu | Nazwa, krótki opis, cena, CTA primary | `CTA → /contact?product=slug` | Loading, Error (404) |
| Galeria | Karuzela/siatka placeholder | brak | Placeholder images |
| Detale | Opis, highlight, materiały | Link do style/leather (opcjonalnie) | Stały |
| Warianty | Kolory skóry (badge), rozmiary (select) | CTA = dodaj do zapytania (później) | Disabled, informacja o dostępności |
| Sekcja powiązana | „Zobacz inne modele” (opcjonalne) | Linki do innych slugów | Empty fallback |

### 3.4 Contact
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Hero kontaktu | H1, lead, dane kontaktowe | `mailto`, anchor formularza | Stały |
| Formularz | Inputy: Imię, Email, Telefon, Wiadomość, Zgoda | Button „Wyślij” | Loading (spinner), Success, Error |
| Sekcja warsztatu | Adres, mapa (placeholder), social | Link do Google Maps | Placeholder content |
| FAQ mini | 2-3 pytania (opcjonalnie) | brak | Expand/collapse |

## Stany systemowe
- Loading: skeletony w katalogu i produkcie; spinner w formularzu kontaktowym.
- Empty: brak produktów po filtrach, brak wariantów (wyświetl komunikat).
- Error: 404 (produkt), błąd API (`/api/styles`/`/api/leather`) – fallback copy i CTA „Spróbuj ponownie”.
- Offline: prosta informacja w headerze (opcjonalnie) – do decyzji.

## Checklisty kontrolne
- [x] Zdefiniowano drzewo nawigacji.
- [x] Opisano sekcje każdej strony.
- [x] Uwzględniono stany loading/empty/error.
- [ ] Potwierdzono potrzebę dodatkowych sekcji (FAQ, powiązane produkty).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak strony produktu w kodzie → wymaga nowego routingu i danych.
  - Stany błędów API niezaimplementowane mogą pogorszyć UX.
- **Decyzje do podjęcia**
  - Czy potrzebna jest sekcja FAQ / powiązane produkty w pierwszym wydaniu?
  - Czy implementujemy offline fallback czy odkładamy?
- **Następne kroki**
  - Zdefiniować kontrakty danych dla stron (patrz `DANE_I_API_MVP.md`).
  - Przygotować plan implementacyjny (patrz `PLAN_MVP_SPRINTS.md`).
