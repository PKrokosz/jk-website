# Plan wdrożenia MVP (ticketing)

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Zadania T0–T6](#zadania-t0t6)
  - [T0 — Stabilizacja środowiska](#t0--stabilizacja-srodowiska)
  - [T1 — Design tokens i prymitywy UI](#t1--design-tokens-i-prymitywy-ui)
  - [T2 — Mocki katalogu i helpery danych](#t2--mocki-katalogu-i-helpery-danych)
  - [T3 — Strona katalogu z nawigacją do produktów](#t3--strona-katalogu-z-nawigacja-do-produktow)
  - [T4 — Strona produktu `/catalog/[slug]`](#t4--strona-produktu-catalogslug)
  - [T5 — Strona kontaktu i formularz](#t5--strona-kontaktu-i-formularz)
  - [T6 — Jakość, testy i CI](#t6--jakosc-testy-i-ci)
- [3. Checklisty kontrolne](#checklisty-kontrolne)
- [4. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Sekwencja zadań prowadzi od stabilizacji środowiska, przez UI foundation, dane mock, strony katalogu/produktów, po kontakt i CI.
- Każde zadanie ma dedykowany branch `codex/<kontekst>` i Definition of Done.
- W planie uwzględniono ryzyka, rollback oraz estymaty w skali S/M/L.

## Zadania T0–T6
### T0 — Stabilizacja środowiska
- **Branch**: `codex/env-hardening`
- **Zakres**: Ujednolicenie `DATABASE_URL` z `docker-compose.yml`, dodanie instrukcji `.env`, opcjonalnie `drizzle.config.ts` (bez migracji).
- **DoD**:
  - [ ] Aktualizacja dokumentacji `.env`.
  - [ ] Dodane testy smoke `pnpm lint`, `pnpm test`.
  - [ ] Potwierdzony start `pnpm dev`.
- **Ryzyka**: rozbieżne dane dostępowe w środowiskach; brak Dockera w CI.
- **Rollback**: przywrócenie poprzedniego `.env.example` i compose.
- **Estymata**: S.

### T1 — Design tokens i prymitywy UI
- **Branch**: `codex/ui-tokens`
- **Zakres**: Implementacja tokens w Tailwind/CSS, stworzenie komponentów `Button`, `Card`, `Badge`, `Input`, `Checkbox`.
- **DoD**:
  - [ ] Tokens z `UI_TOKENS.md` odzwierciedlone w kodzie.
  - [ ] Storybook lub Vitest snapshoty (opcjonalnie) dla prymitywów.
  - [ ] `pnpm lint`, `pnpm test`.
- **Ryzyka**: brak zatwierdzonych fontów, konieczność fallbacku.
- **Rollback**: wycofanie zmian w Tailwind i komponentach.
- **Estymata**: M.

### T2 — Mocki katalogu i helpery danych
- **Branch**: `codex/catalog-mocks`
- **Zakres**: Rozszerzenie `src/lib/catalog` o slug, galerię, warianty; helpery `listProducts`, `getProductBySlug`.
- **DoD**:
  - [ ] Nowe mock pliki `mock-product-details.ts` lub aktualizacja istniejących.
  - [ ] Testy jednostkowe helperów (zwrot danych, obsługa braku sluga).
  - [ ] Zaktualizowane API `/api/products?` (jeśli wymagane) lub notatka dlaczego nie.
  - [ ] `pnpm lint`, `pnpm test`.
- **Ryzyka**: niespójność z przyszłym schematem DB.
- **Rollback**: przywrócenie poprzednich mocków.
- **Estymata**: M.

### T3 — Strona katalogu z nawigacją do produktów
- **Branch**: `codex/catalog-page`
- **Zakres**: Aktualizacja `/catalog` by korzystała z helperów, linki do `/catalog/[slug]`, UX (loading/empty states, skip link).
- **DoD**:
  - [ ] `CatalogExplorer` z linkami i poprawionym CTA.
  - [ ] Dodane testy komponentu (filtry + link slug).
  - [ ] SEO metadata (`title`, `description`).
  - [ ] `pnpm lint`, `pnpm test`.
- **Ryzyka**: regresje w filtrach po zmianie danych.
- **Rollback**: revert do poprzedniego `CatalogExplorer`.
- **Estymata**: M.

### T4 — Strona produktu `/catalog/[slug]`
- **Branch**: `codex/product-page`
- **Zakres**: Nowy routing dynamiczny, UI sekcji (galeria, detale, warianty), breadcrumbs, CTA do kontaktu.
- **DoD**:
  - [ ] `app/catalog/[slug]/page.tsx` + `generateStaticParams` (jeśli SSG) + `not-found.tsx`.
  - [ ] Testy (render, 404, metadata).
  - [ ] Placeholder gallery assets w `public/`.
  - [ ] `pnpm lint`, `pnpm test`.
- **Ryzyka**: brak realnych zdjęć, potrzeba placeholderów.
- **Rollback**: usunięcie nowego route'u.
- **Estymata**: L.

### T5 — Strona kontaktu i formularz
- **Branch**: `codex/contact-form`
- **Zakres**: Formularz z walidacją client-side (Zod/React Hook Form?), CTA `mailto`, potwierdzenie wysyłki.
- **DoD**:
  - [ ] Formularz z polami wymaganymi i walidacją.
  - [ ] Testy komponentu (required, success state).
  - [ ] Aktualizacja metadata + copy.
  - [ ] `pnpm lint`, `pnpm test`.
- **Ryzyka**: brak zgody na przechowywanie danych → placeholder RODO.
- **Rollback**: powrót do wersji z prostym tekstem + `mailto`.
- **Estymata**: M.

### T6 — Jakość, testy i CI
- **Branch**: `codex/ci-hardening`
- **Zakres**: Dodanie workflow GitHub Actions, testów brakujących, template PR, coverage badge (opcjonalnie).
- **DoD**:
  - [ ] `.github/workflows/ci.yml` jak w `JAKOSC_TESTY_CI.md`.
  - [ ] Zaktualizowany `README.md` z instrukcjami lint/test.
  - [ ] Minimum testów uzupełnionych (product page, prymitywy).
  - [ ] `pnpm lint`, `pnpm test`.
- **Ryzyka**: dłuższy pipeline, konieczność dopracowania caching.
- **Rollback**: wyłączenie workflow, revert commitów.
- **Estymata**: M.

## Checklisty kontrolne
- [x] Zdefiniowano zadania T0–T6 z branchami.
- [x] Ujęto DoD, ryzyka, rollback, estymaty.
- [ ] Zatwierdzono plan przez właściciela produktu.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak zasobów (grafiki, copy) może opóźnić T4/T5.
  - Niewdrożona CI opóźni feedback – T6 powinno nastąpić przed rozszerzonym developmentem.
- **Decyzje do podjęcia**
  - Kolejność T5 vs. T6 (czy zapewnić formularz zanim włączymy CI?).
  - Czy T0 ma obejmować `drizzle-kit`, czy zostawiamy na później.
- **Następne kroki**
  - Uzyskać akceptację planu od właściciela.
  - Rozpisać szczegółowe podzadania (np. dla T4: galeria, breadcrumbs, metadata).
