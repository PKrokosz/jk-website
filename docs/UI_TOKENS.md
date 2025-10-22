# Design tokens i prymitywy UI

## Meta audytu 2025-10-29
- **Status zagadnień**: Bazowe custom properties istnieją (`globals.css`). Tokens nie zostały jeszcze w pełni zaadoptowane w komponentach i gradientach; brak komponentu `Card`.
- **Nowe ścieżki rozwoju**:
  - Rozszerzyć tabelę o zmienne używane w `/group-orders`, `/cart` i legal pages (np. panel CTA, layout list sekcji).
  - Przygotować JSON eksportowany do integracji (początek zadania `x₁ˣ` w `LOOP_TASKS.md`).
  - Dodać checklistę kontrastu i referencję do narzędzia (np. `pnpm lint:tokens`).
- **Rekomendacja archiwizacji**: Nie — dokument pozostaje źródłem prawdy dla stylu.
- **Sens dokumentu**: Mapuje paletę, typografię, spacing i prymitywy UI, dzięki czemu projekt zachowuje spójność wizualną.
- **Aktualizacje wykonane**:
  - Dodano meta audyt i wskazówki dla nowych widoków.
  - Zaznaczono konieczność eksportu tokens i checklisty kontrastu.

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Paleta kolorów](#paleta-kolorow)
- [3. Typografia i spacing](#typografia-i-spacing)
- [4. Promienie, cienie i efekty](#promienie-cienie-i-efekty)
- [5. Mapowanie na klasy CSS](#mapowanie-na-klasy-css)
- [6. Prymitywy UI i API komponentów](#prymitywy-ui-i-api-komponentow)
- [7. Checklisty kontrolne](#checklisty-kontrolne)
- [8. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Motyw produkcyjny wykorzystuje jasne tło pergaminu (`#f8f5f2`) z ciemnymi akcentami (`#1b1b1b`) oraz złotą poświatą (`rgba(255, 226, 166, ...)`).
- Style są zdefiniowane w `src/app/globals.css` jako klasy utility (brak Tailwind). Design tokens opisane niżej służą do dalszej standaryzacji i przeniesienia do CSS custom properties/Tailwind.
- Prymitywy UI w kodzie to: `button` (`--primary`, `--ghost`), `badge` (`--category`, `--funnel`), formularz kontaktowy (`ContactForm`), checkbox z label i hint, karty portfolio/katalogu.
- Od iteracji 2025-10-24 w `src/app/globals.css` dostępne są bazowe custom properties (`--color-*`, `--space-*`, `--radius-*`) odzwierciedlające tabelę tokens.

## Paleta kolorów
| Token | Wartość | Opis | Zastosowanie |
| --- | --- | --- | --- |
| `color-bg-body` | `#f8f5f2` | Jasne tło pergaminu | Body, sekcje jasne |
| `color-bg-dark` | `#090808` | Tło stron ciemnych (Home, Catalog) | Sekcje hero, katalog |
| `color-bg-muted` | `#efe9e1` | Delikatne tło paneli | Sekcje "muted", formularze |
| `color-text-primary` | `#1b1b1b` | Tekst główny | Body copy, button ghost |
| `color-text-invert` | `#f8f5f2` | Tekst na ciemnym tle | Hero, dark CTA |
| `color-text-muted` | `#3d3d3d` / `rgba(248,245,242,0.68)` | Opisy, lead w zależności od tła | Sekcje opisowe |
| `color-accent-gold` | `#c6a46e` (gradient) | Główne CTA i akcenty | Buttons, hero glow |
| `color-border-dark` | `#1b1b1b` | Obramowania CTA, formularzy | Button ghost, field borders |
| `color-border-light` | `rgba(255,226,166,0.35)` | Obramowania na ciemnym tle | Hero ghost button |
| `color-focus` | `#1b4dff` (na jasnym tle), `rgba(255,226,166,0.7)` (na home) | Outline focus | Focus ring |
| `color-badge-category` | `rgba(198, 164, 110, 0.22)` tło + `#3a2a1f` tekst | Badge kategorii | Catalog/Product |
| `color-badge-funnel` | `#111111` tło + `rgba(255,226,166,0.85)` tekst | Badge funnel stage | Product |

> Docelowo kolory należy przenieść do CSS custom properties (np. `:root { --color-bg-body: #f8f5f2; }`).

## Typografia i spacing
- Font bazowy: `"Inter", system-ui` dla całego projektu. (Docelowo można wprowadzić `EB Garamond` dla nagłówków.)
- Skala nagłówków (wg `globals.css`):
  - H1 (hero/product): `clamp(2rem, 4vw, 3rem)`.
  - H2: `clamp(1.75rem, 4vw, 2.5rem)`.
  - H3: `clamp(1.5rem, 1.2vw + 1.25rem, 1.9rem)`.
  - Lead paragraph: `clamp(1.05rem, 2.5vw, 1.25rem)`.
  - Body: `1rem` (domyślne).
- Line-height: `1.6` dla body, `1.2`–`1.3` dla nagłówków.
- Spacing: sekcje korzystają z `padding-block: clamp(4rem, 6vw, 6rem)`, gapy `1.5rem`–`3rem`, container `padding-inline: 1.5rem`.

## Promienie, cienie i efekty
- Promienie: 
  - Button/badge: `999px` (pill).
  - Karty (portfolio, contact): `24px`–`32px` (zdefiniowane per komponent).
- Cienie:
  - Button primary (home): `0 18px 44px rgba(198, 164, 110, 0.35)`.
  - Cards: `0 24px 56px rgba(17, 17, 17, 0.22)` (portfolio) lub `0 20px 45px rgba(18, 18, 18, 0.3)` (contact panel).
- Efekty tła: liczne radial gradients (`hero`, `catalog`, `portfolio`) z wykorzystaniem złotych tonów i brązów.
- Focus ring: `outline: 3px solid #1b4dff` na jasnym tle, custom outline w `home-page` (`outline-color: rgba(255,226,166,0.7)`).

## Mapowanie na klasy CSS
| Token | Klasa w `globals.css` | Notatka |
| --- | --- | --- |
| `color-bg-body` | `body`, `.page` | Tło główne jasne |
| `color-bg-dark` | `.home-page`, `.catalog-page` | Gradieny radialne |
| `color-accent-gold` | `.home-page .button--primary`, `.hero__glow`, `.portfolio-card__image` overlay | Gradient CTA |
| `focus-ring` | globalne `:focus-visible`, `.home-page :focus-visible` | Zmienne w zależności od tła |
| `container` | `.container` | `width: min(960px, 100%)`, padding `1.5rem` |
| `section-muted` | `.section--muted` | Jasne panele `#efe9e1` |
| `badge` | `.badge`, `.badge--category`, `.badge--funnel` | Kapsułowe badge w katalogu/produkcie |
| `button` | `.button`, `--primary`, `--ghost` | Primary czarny, ghost outline + warianty home |
| `checkbox` | `.checkbox` | Styl zgody RODO z custom label/hint |

### Implementacja w kodzie
- Plik `src/app/globals.css` definiuje `:root` z custom properties (`--color-bg-body`, `--color-text-primary`, `--color-focus-light`, itp.) oraz wykorzystuje je w globalnych selektorach (`body`, focus states, `.container`).
- W kolejnych iteracjach należy rozszerzyć zastosowanie zmiennych na komponenty/sekcje wykorzystujące gradienty i specyficzne warianty CTA.

## Prymitywy UI i API komponentów
| Komponent/Klasa | API | Opis |
| --- | --- | --- |
| `button` (`.button`, `.button--primary`, `.button--ghost`) | `children`, `href`/`type`, `className` | Podstawowe CTA. Primary = ciemne tło (na home gradient złoty), Ghost = transparent z obramowaniem. |
| `OrderModalTrigger` | `{ className?: string; triggerLabel: string; ctaLabel: string; }` | Otwiera modal z CTA do `/order/native`. Korzysta z klas `.button`. |
| `badge` (`.badge`, `.badge--category`, `.badge--funnel`) | tekst + modyfikatory | Kapsułowe etykiety kategorii i etapu lejka sprzedażowego. |
| `ContactForm` | Brak props (samodzielny komponent) | Formularz ze stanami, wykorzystuje `.field`, `.checkbox`, `.contact-status` do komunikatów. |
| `CatalogExplorer` | `{ products, styles, leathers }` | Renderuje filtry i karty katalogu, używa `.catalog-filters`, `.catalog-grid`. |
| `Portfolio-card` | generowany w Home (brak osobnego komponentu) | Warto rozważyć wydzielenie jako `Card` w przyszłości. |

## Checklisty kontrolne
- [x] Zdefiniowano aktualne kolory używane w `globals.css`.
- [x] Opisano typografię i spacing na podstawie implementacji.
- [x] Wypisano dostępne prymitywy UI.
- [x] Wprowadzono bazowe design tokens do CSS (custom properties w `globals.css`).
- [ ] Zastąpiono powtarzalne karty dedykowanym komponentem (`Card`).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Hard-coded wartości kolorów utrudniają skalowanie motywu i wdrożenie dark mode.
  - Brak centralnego miejsca na spacingi może skutkować niespójnością komponentów.
- **Decyzje do podjęcia**
  - Czy wprowadzamy Tailwind / CSS custom properties w najbliższym sprincie?
  - Czy hero gradient pozostaje implementowany ręcznie czy przenosimy go do design tokens?
- **Następne kroki**
  - Rozszerzyć użycie custom properties na komponenty sekcyjne i CTA (gradienty, overlaye katalogu).
  - Rozważyć utworzenie komponentu `Card` i `Typography` bazujących na tokens.
  - Przygotować checklistę kontrastu (WCAG) po wdrożeniu tokens.
