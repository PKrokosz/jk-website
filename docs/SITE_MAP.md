# Site map i mapa ekranów

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Drzewo nawigacji](#drzewo-nawigacji)
- [3. Mapy ekranów](#mapy-ekranow)
  - [3.1 Home](#31-home)
  - [3.2 Catalog](#32-catalog)
  - [3.3 Product](#33-product)
  - [3.4 Contact](#34-contact)
  - [3.5 Order](#35-order)
  - [3.6 Group Orders](#36-group-orders)
- [4. Stany systemowe](#stany-systemowe)
- [5. Checklisty kontrolne](#checklisty-kontrolne)
- [6. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Nawigacja obejmuje Home, Catalog, Product (dynamiczne slug), About, Group Orders, Contact oraz Order (iframe + natywny fallback).
- Każda strona ma zdefiniowane sekcje treści, CTA oraz stany (loading, empty, error).
- Site map odzwierciedla przepływ: Home → Catalog → Product → Order/Contact → formularz natywny.

## Drzewo nawigacji
```
/
├── Home (/)
│   ├── Hero (video, CTA modal/order)
│   ├── Proces 4 kroków
│   ├── Portfolio realizacji
│   ├── Kalkulator wyceny
│   └── CTA końcowe (Order, API quote)
├── Catalog (/catalog)
│   ├── Filtry: styl, skóra
│   └── Lista produktów (linki do /catalog/[slug])
├── Product (/catalog/[slug])
│   ├── Breadcrumbs
│   ├── Hero produktu (nazwa, cena, CTA)
│   ├── Galeria zdjęć
│   ├── Detale (opis, proces)
│   └── Warianty personalizacji
├── About (/about)
│   └── Treść o pracowni (finalne copy + CTA)
├── Group Orders (/group-orders)
│   ├── Hero (CTA mailto + link do kontaktu)
│   ├── Lista benefitów współpracy
│   └── Sekcja procesu 3 kroków + CTA konsultacji
├── Contact (/contact)
│   ├── Hero kontaktu (dane, CTA)
│   ├── Sekcja warsztatu (adres, godziny, powody wizyty)
│   └── Formularz
└── Order (/order)
    ├── Osadzony formularz (iframe)
    └── Order native (/order/native) – lista modeli + CTA do pełnego formularza
```

### Konfiguracja wag tokenów nawigacji
- Symulacja ścieżek użytkownika (`src/lib/navigation/journey-simulation.ts`) domyślnie ustawia wagi przejść na podstawie poziomu pewności tokenu (`certain` = 3, `uncertain` = 1).
- Aby nadpisać wagi, ustaw zmienną środowiskową `NAVIGATION_WEIGHTS_JSON` z JSON-em w formacie:
  ```json
  {
    "home": {
      "catalog": 5,
      "contact": 2
    },
    "catalog": {
      "home": 1
    }
  }
  ```
  Każdy klucz pierwszego poziomu odpowiada węzłowi źródłowemu, a klucz wewnętrzny – docelowemu węzłowi.
- Repozytorium dostarcza przykład `config/navigation-weights.example.json` (z komentarzami `_comment` opisującymi strukturę). Sklonuj go do własnego pliku, np.:
  ```bash
  cp config/navigation-weights.example.json config/navigation-weights.local.json
  ```
  Następnie dodaj do `.env.local` wpis `NAVIGATION_WEIGHTS_PATH=config/navigation-weights.local.json`.
- Alternatywnie wskaż ścieżkę do pliku JSON jednorazowo w poleceniu (ścieżka względna względem katalogu projektu lub absolutna).
- Nowy skrypt `pnpm simulate:navigation --config <ścieżka>` uruchamia symulację z podanym plikiem i wypisuje wynik w konsoli (pozwala szybko zweryfikować wpływ wag bez modyfikacji `.env.local`).
- Wagi muszą być liczbami dodatnimi; konfiguracje odwołujące się do nieistniejących węzłów lub przejść spowodują błąd ładowania (testowane w `src/lib/navigation/__tests__/journey-simulation.test.ts`).
- Po zmianie wag uruchom `pnpm test src/lib/navigation/__tests__/journey-simulation.test.ts` aby zweryfikować poprawność konfiguracji.

## Mapy ekranów
### 3.1 Home
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Hero | Eyebrow, H1, lead, CTA primary/ghost, modal trigger | `OrderModalTrigger`, `mailto`, `/api/pricing/quote` | Normalny, brak loading |
| Proces | Lista kroków (ol) | Link do Contact (opcjonalnie) | Stały content |
| Portfolio | Grid kart (obrazy z altami) | CTA informacyjne (brak linku) | Empty: fallback copy jeśli brak modeli |
| Kalkulator | Formularz select/checkbox | brak (tylko display wyniku) | Loading (podczas kalkulacji), Error (toast) |
| CTA końcowe | Tekst + 2 buttony | `/order/native`, `/healthz` | Stały |

### 3.2 Catalog
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Hero katalogu | H1, opis, kicker | Link do filtrów (skip link) | Stały |
| Sidebar filtrów | Fieldset styl, fieldset skóra | brak CTA, checkboxes | Empty: disable? – pozostawiono aktywne |
| Toolbar | Wynik count, select sort | brak | Loading skeleton na listę |
| Lista produktów | Karty z CTA „Poznaj szczegóły” | Link do `/catalog/[slug]` | Empty: tekst „Brak wyników” |

### 3.3 Product
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Breadcrumbs | Home > Catalog > Product | Linki do rodziców | Loading skeleton (TODO) |
| Hero produktu | Nazwa, opis, cena, badge, CTA primary/ghost | `OrderModalTrigger`, `/order/native`, `/contact?product=` | Loading, 404 dla brak slug |
| Galeria | Karuzela/siatka `figure` | brak | Placeholder images, brak slidera |
| Detale | Opis, highlight, proces rzemieślniczy | Linki do style/leather (przyszłość) | Stały |
| Warianty | Kolory skóry (badge), rozmiary (lista) | CTA = link do `/order/native` (pośrednio) | Empty copy gdy brak wariantów |
| Sekcja powiązana | (Niezaimplementowane) | — | Możliwy future enhancement |

### 3.4 Contact
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Hero kontaktu | H1, lead, dane kontaktowe, social | `mailto`, `tel`, anchor do formularza | Stały |
| Formularz | Inputy, textarea, checkbox zgody | Submit (walidacja, status), `mailto` fallback | Status `idle/submitting/success/error` |
| Sekcja warsztatu | Adres, godziny, lista benefitów wizyty | Link anchor do formularza | Stały content |

### 3.5 Order
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Order (iframe) | Hero copy, fallback link, iframe z `NEXT_PUBLIC_ORDER_FORM_URL` | Link do pełnej wersji formularza | Loading natywny (iframe), fallback link |
| Order native | Lista modeli (`ORDER_MODELS`), CTA do formularza, FAQ (jeśli dodane) | Link `href=ORDER_FORM_URL` | Empty: fallback copy gdy brak modeli |

### 3.6 Group Orders
| Sekcja | Elementy | CTA | Stany |
| --- | --- | --- | --- |
| Hero współpracy | Eyebrow, H1, lead, opis, CTA `mailto` i anchor do `/contact#contact-form` | `mailto:kontakt@jkhandmade.pl`, `/contact#contact-form` | Stały |
| Korzyści partnerstwa | Karta benefitów (lista 3 pozycji) | Linki w tekście (brak dodatkowych CTA) | Stały |
| Proces w 3 krokach | Lista numerowana (counter), lead | Brak – informacyjna | Stały |
| CTA konsultacji | Panel CTA z przyciskami kontaktu | `mailto`, `tel` | Stały |

## Stany systemowe
- Loading: katalog (skeleton), order (iframe loading), planowane skeletony dla product/contact.
- Empty: brak produktów po filtrach, brak wariantów (kopie informacyjne).
- Error: 404 (produkt), błąd API (`/api/styles`/`/api/leather`) – fallback copy i CTA „Spróbuj ponownie” (do dopracowania).
- Offline: brak dedykowanego UI – do decyzji.

## Checklisty kontrolne
- [x] Zdefiniowano drzewo nawigacji (z `/order`).
- [x] Opisano sekcje każdej strony.
- [x] Uwzględniono stany loading/empty/error.
- [ ] Potwierdzono potrzebę dodatkowych sekcji (FAQ, powiązane produkty).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak skeletonów na stronie produktu może skutkować migotaniem przy wczytywaniu (zwł. w ISR/SSR).
  - Backend formularza kontaktowego (SMTP) wymaga konfiguracji środowiskowej i monitoringu błędów.
- **Decyzje do podjęcia**
  - Czy dodajemy sekcję powiązanych modeli lub FAQ w `/catalog/[slug]` i `/order/native`?
  - Czy `/order/native` ma zastąpić modal w przyszłości (spójność flow)?
- **Następne kroki**
  - Dopracować skeleton `ProductPage` / `ContactForm`.
  - Zaprojektować sekcję powiązanych produktów lub FAQ.
  - Uzgodnić docelowy flow zamówienia (modal vs `/order/native`).
