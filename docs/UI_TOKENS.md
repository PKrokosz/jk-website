# Design tokens i prymitywy UI

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Paleta kolorów](#paleta-kolorow)
- [3. Typografia i spacing](#typografia-i-spacing)
- [4. Promienie, cienie i efekty](#promienie-cienie-i-efekty)
- [5. Mapowanie na klasy Tailwind](#mapowanie-na-klasy-tailwind)
- [6. Prymitywy UI i API komponentów](#prymitywy-ui-i-api-komponentow)
- [7. Checklisty kontrolne](#checklisty-kontrolne)
- [8. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Motyw „medieval artisan minimalism” opiera się na ciemnych tłach, złotych akcentach i teksturach pergaminu.
- Tokens pokrywają kolory bazowe, typografię, spacingi, promienie i cienie — gotowe do implementacji w Tailwind config.
- Prymitywy UI (`Button`, `Card`, `Badge`, `Input`) mają określone API i użycie w sekcjach MVP.

## Paleta kolorów
| Token | Hex | Opis | Użycie |
| --- | --- | --- | --- |
| `--color-bg-body` | `#12100E` | Ciemne tło pergaminu nocą | Tło strony, sekcje hero/contact (dark mode feel) |
| `--color-bg-panel` | `#1F1C19` | Panele/karty na tle głównym | Karty katalogu, modale |
| `--color-bg-muted` | `#2A2621` | Sekcje wyróżnione | Sekcja katalogu, stopka |
| `--color-surface-light` | `#F5E6D3` | Jasne akcenty pergaminu | Teksty na CTA, badge |
| `--color-primary` | `#C6A46E` | Złoty akcent | CTA, linki aktywne |
| `--color-primary-dark` | `#8F6F3D` | Hover/pressed CTA | Stany aktywne buttonów |
| `--color-secondary` | `#7A5D3C` | Drugorzędne CTA | Obrysy, badge |
| `--color-text-base` | `#F4F0EA` | Tekst główny na ciemnym tle | Body copy |
| `--color-text-muted` | `#C5B8A5` | Tekst pomocniczy | Opisy, hinty formularzy |
| `--color-border` | `#3C3227` | Krawędzie subtelne | Ramki kart, inputy |
| `--color-focus` | `#9BB1FF` | Kolor focus outline | A11y focus states |

## Typografia i spacing
- Font bazowy: "EB Garamond" (nagłówki), "Inter" (body) – do włączenia w `@import`.
- Rozmiary:
  - Display (`--font-size-display`): `clamp(2.5rem, 5vw, 3.5rem)`.
  - H1: `clamp(2rem, 4vw, 2.75rem)`.
  - H2: `clamp(1.5rem, 3vw, 2.25rem)`.
  - H3: `1.5rem`.
  - Body: `1rem`.
  - Small: `0.875rem`.
- Spacing scale (rem): `0`, `0.5`, `0.75`, `1`, `1.5`, `2`, `3`, `4`, `6`, `8`.
- Line heights: `1.2` (nagłówki), `1.6` (body).

## Promienie, cienie i efekty
- Promienie: `--radius-sm: 0.375rem`, `--radius-md: 0.75rem`, `--radius-lg: 1.5rem`, `--radius-full: 999px`.
- Cienie:
  - `--shadow-soft`: `0 10px 25px rgba(0,0,0,0.3)`.
  - `--shadow-hard`: `0 18px 35px rgba(0,0,0,0.45)`.
  - `--shadow-glow`: `0 0 0 1px rgba(198,164,110,0.6)`.
- Gradacje/tekstury: `--gradient-gold`: `linear-gradient(135deg, #C6A46E, #E6C889)`.

## Mapowanie na klasy Tailwind
| Token | Tailwind wartość | Notatka |
| --- | --- | --- |
| `bg-body` | `bg-[#12100E]` | dodaj w `tailwind.config` jako `colors.body` |
| `text-base` | `text-[#F4F0EA]` | ustaw jako `text-primary` |
| `text-muted` | `text-[#C5B8A5]` | klasa `text-muted` |
| `border-default` | `border-[#3C3227]` | `border` dla kart/inputów |
| `shadow-soft` | `shadow-[0_10px_25px_rgba(0,0,0,0.3)]` | niestandardowe shadow |
| `shadow-hard` | `shadow-[0_18px_35px_rgba(0,0,0,0.45)]` | hero cards |
| `rounded-md` | `rounded-[0.75rem]` | spójne z `--radius-md` |
| `rounded-full` | `rounded-full` | dla badge/button pill |
| `focus-ring` | `outline outline-2 outline-offset-2 outline-[#9BB1FF]` | focus states |
| `spacing-6` | `gap-6` / `p-6` | layout sekcji |

## Prymitywy UI i API komponentów
| Komponent | API (props) | Opis i użycie |
| --- | --- | --- |
| `Button` | `{ variant: "primary" \| "ghost" \| "secondary"; size?: "sm" \| "md"; icon?: ReactNode; asChild?: boolean; }` | CTA globalne (hero, katalog karty, formularz). Primary = gradient gold; ghost = transparent z obrysem; secondary = muted. |
| `Card` | `{ title?: string; as?: ElementType; variant?: "solid" \| "outlined"; }` + `children` | Karty katalogu, sekcje w Home (process steps). Wariant `solid` z `bg-panel`, `shadow-soft`; `outlined` z `border-default`. |
| `Badge` | `{ tone?: "gold" \| "muted"; icon?: ReactNode; }` | Eyebrow/akcenty (hero badge, highlight w katalogu). `tone="gold"` z gradientem, `muted` z `bg-[#2A2621]`. |
| `Input` | `{ label: string; id?: string; hint?: string; error?: string; prefix?: ReactNode; type?: string; }` | Pola formularzy (contact). Wewnątrz: label, input, hint/error w `text-muted`/`text-primary`. |
| `Checkbox` (pomocniczo) | `{ label: string; description?: string; checked: boolean; onChange: () => void; }` | Filtry katalogu, extras w kalkulatorze. |

## Checklisty kontrolne
- [x] Zdefiniowano tokens kolorystyczne, typografię, spacing.
- [x] Zmapowano tokens na klasy Tailwind.
- [x] Określono API prymitywów UI.
- [ ] Uzgodniono finalne fonty z właścicielem (np. licencja EB Garamond).
- [ ] Dodano tokens do `tailwind.config.js` (do implementacji).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak dostępności fontów (licencja) może opóźnić wdrożenie stylów.
  - Nadmiernie ciemna paleta może wymagać dodatkowych testów kontrastu.
- **Decyzje do podjęcia**
  - Czy stosujemy `EB Garamond` (wymaga importu) czy alternatywę z Google Fonts?
  - Czy gradient złoty ma być globalny (brand) czy tylko w CTA?
- **Następne kroki**
  - Dodać tokens do konfiguracji Tailwind i CSS zmiennych.
  - Zaimplementować prymitywy UI w `src/components/ui/` (propozycja lokacji).
