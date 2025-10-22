# Specyfikacja interfejsu i frontendu JK Handmade Footwear

> **Status**: 2025-10-22 — pierwsza wersja na podstawie stron App Routera (`/`, `/catalog`, `/contact`, `/order/native`, `/about`).
>
> **Cel**: Skoncentrowane źródło prawdy dla warstwy UI, animacji i zachowań responsywnych. Dokument wiąże decyzje projektowe z pętlą `docs/LOOP_TASKS.md` oraz wymaga, by kolejne iteracje (`Agents.md` + task loop) korzystały z tej specyfikacji przy planowaniu grafiki i implementacji.

## 1. 5xWhy — dlaczego potrzebujemy tej specyfikacji?
1. **Dlaczego** obecne UI wymaga dokumentacji? — Strony tworzone w `src/app` posiadają rozbudowane hero, karuzele i formularze bez jednego źródła prawdy opisującego styl.
2. **Dlaczego** brak źródła prawdy jest problemem? — Agentom trudno utrzymać spójność kolorystyki i animacji podczas kolejnych tasków.
3. **Dlaczego** spójność jest krytyczna? — Spójność podnosi wiarygodność marki premium (złote akcenty, jasne tło) i zmniejsza liczbę regresji UI.
4. **Dlaczego** regresje UI są kosztowne? — Każda niespójność wymaga ręcznego porównywania komponentów i assetów, co spowalnia sprinty MVP.
5. **Dlaczego** sprinty MVP muszą być szybkie? — Celem repo jest dowiezienie działającego MVP z bogatym interfejsem – brak specyfikacji wydłuża pętlę `task_loop` i oddala zespół od MVP.

**Wniosek**: Specyfikacja jest kotwicą dla planowania w `docs/LOOP_TASKS.md`, a każdy nowy asset/grafika powinien ją respektować zanim trafi do kodu.

## 2. Zakres
- Sekcje na podstawie komponentów strony głównej (`HeroShowcaseFrame`, `SellingPointsCarousel`, kalkulator wyceny) oraz podstron katalogu, kontaktu i zamówień.
- Styl i zachowanie komponentów globalnych (`.site-header`, `.site-content`, `.skip-link`) z `src/app/globals.css`.
- Minimalne wymagania responsywne dla progów 640px, 960px, 1280px.
- Wymagania animacyjne i mikrointerakcje (focus states, hover, autoplay hero, przewijanie karuzeli).
- Inspiracje dla kolejnych iteracji (`Perspektywy usprawnień`).

## 3. Styl wizualny
### 3.1 Paleta i tło
- Domyślne tło: `#f8f5f2`, kontrast tekstu `#1b1b1b`. Header i CTA operują złoto-miedzianymi gradientami (`rgba(198, 164, 110, 0.85)` → `rgba(255, 226, 166, 0.65)`).
- Kolory akcentów hero powiązane z klasami `hero-frame--amber|copper|gold`; dopóki tokens nie trafią do CSS variables, używamy istniejących wartości z `globals.css`.
- Przejścia tonalne utrzymujemy w półprzezroczystych warstwach nad ciemnym tłem (np. `background: rgba(17, 17, 17, 0.72)` dla `.site-header`).

### 3.2 Typografia i rytm
- Font główny: Inter, 1.6 line-height, letter-spacing 0.015em w globalnym body.
- Header brand: uppercase, letter-spacing 0.08em, 600 weight.
- Przyciski i badge: uppercase 600, letter-spacing 0.04–0.06em.
- Sekcje (`.section`, `.section-header`) utrzymują spacing 64px+ (zob. struktura w `src/app/page.tsx`). Kolejne iteracje powinny przenieść te wartości do tokens (`docs/UI_TOKENS.md`).

### 3.3 Karty i moduły
- Karty portfolio i CTA używają miękkich cieni (`box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18)`), promienia 16–24px, gradientowych ramek.
- Formularze (kontakt/zamówienie) zachowują jasne tło z kontrastowymi labelami i komunikatami statusu (zielony sukces, bursztynowe ostrzeżenia). Zachować przestrzeń min. 16px między polami.

## 4. Animacje i mikrointerakcje
- Hero: autoplay co 8s (`interval = 8000`), fade-in/out poprzez klasę `.hero-frame__image.is-active` (opacity 1, transform translateY(0)). Nie włączamy nieskończonych transformów 3D; animacje muszą być prefer-reduced-motion aware (TODO w `task_loop`).
- Karuzele selling points: płynne przesuwanie w osi X, bez automatycznego przewijania; strzałki i kropki muszą mieć stan focus/hover.
- Linki i przyciski: transition 0.2s ease na kolor, tło, cień. Aktywne linki w nawigacji otrzymują `box-shadow` i `background` (pigułki).
- Skip link: slide-in transform, focus-visible.

## 5. Responsywność
- **≤640px**: header układa się kolumnowo, linki w flex-wrap; CTA zajmują pełną szerokość (`flex: 1 1 auto`).
- **641–960px**: dwukolumnowe sekcje (hero media + treść) przechodzą w stacked layout. Utrzymujemy padding 24–32px.
- **≥1280px**: sekcje maksymalnie 1200px szerokości, hero media 380px (`sizes="(min-width: 1024px) 380px, 70vw"`).
- Formularze: grid 1 kolumna mobile, 2 kolumny desktop.

## 6. Perspektywy usprawnień
1. Wydzielić zmienne CSS odpowiadające `docs/UI_TOKENS.md` i podpiąć do komponentów (wspiera zadanie `x₁` w `LOOP_TASKS`).
2. Dodać preferencje `prefers-reduced-motion` i `prefers-color-scheme` (ciemny motyw).
3. Ustandaryzować animacje karuzeli (hook `useCarouselAutoplay` + testy accessibility).
4. Przygotować pliki źródłowe grafiki (Figma → eksport) i zautomatyzować synchronizację assetów (powiązać z zadaniem `x₁ˣ`).
5. Rozbudować sekcję testimonials / case studies o layout cards + modale.

## 7. Integracja z task loop
- Każde zadanie UI musi odwoływać się do tej specyfikacji w opisie PR.
- Dodając nowe obserwacje `x` w `docs/LOOP_TASKS.md`, dołącz link do sekcji specyfikacji, która definiuje oczekiwane zachowanie.
- Agents aktualizujący `AGENTS.md` powinni zamieścić skróconą checklistę: paleta, typografia, animacje, responsywność, test redukcji ruchu.
- Nowe assety graficzne muszą przejść review zgodnie z tą specyfikacją; w przypadku braku danych → dopisz TODO w sekcji 6 i pętlę `task_loop`.

## 8. Wymuszenie na Agents — generowanie grafiki
- Przed wygenerowaniem grafiki/komponentu agent powinien:
  1. Zweryfikować sekcje 3–5 i zaznaczyć spełnione wymagania w komentarzu do PR.
  2. Udokumentować w `docs/LOOP_TASKS.md` nowe obserwacje wynikające z braków (np. brak wersji dark mode) — to stanowi zadanie `1/x`.
  3. Zaktualizować lokalny `AGENTS.md` (jeśli wprowadza dodatkowe instrukcje) krótką listą kontrolną stylu.
- Renderowane grafiki (mocki) muszą opierać się o elementy: jasne tło #f8f5f2, złote akcenty, hero 380px, CTA pigułki.

## 9. Odniesienia do kodu
- `src/app/page.tsx` — hero, selling points, FAQ, CTA do `/order/native`.
- `src/app/globals.css` — nawigacja, skip link, hero frame, breakpoints.
- `src/app/catalog/page.tsx` — siatka produktów, filtry (przyszła integracja z tokens).
- `src/app/contact/page.tsx` — formularz z walidacją i statusami.
- `src/app/order/native/page.tsx` — proces zamówienia, CTA do konsultacji.

## 10. Checklist wdrożeniowa dla PR
- [ ] Sekcje UI zgodne z paletą i typografią z rozdz. 3.
- [ ] Animacje posiadają fallback dla `prefers-reduced-motion`.
- [ ] Widoki mobilne i desktopowe zgodne z rozdz. 5.
- [ ] Dodano/aktualizowano wpisy w `docs/LOOP_TASKS.md`.
- [ ] Uzupełniono `AGENTS.md` jeśli potrzebne nowe instrukcje.

> **Nota**: Dokument należy przeglądać co sprint i aktualizować status w `docs/README_DOCS.md`.
