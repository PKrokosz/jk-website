# Plan wdrożenia MVP (ticketing)

> **Status aktualizacji**: 2025-10-22 — rozszerzono harmonogram o zadanie T7 (panel klienta) i wpięto pętlę dokumentacyjną.

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
- Sekwencja zadań prowadzi od stabilizacji środowiska, przez UI foundation, dane mock, strony katalogu/produktów, kontakt, CI oraz panel klienta.
- Status (2025-10-22): T0, T2–T5, T7 zakończone, T6 częściowo wdrożone (workflow CI, testy podstawowe), T1 wymaga dopięcia (design tokens w CSS).
- Każde zadanie ma dedykowany branch `codex/<kontekst>` i Definition of Done.

## Zadania T0–T7
### T0 — Stabilizacja środowiska
- **Branch**: `codex/env-hardening`
- **Status**: ✅ zakończone (ujednolicone poświadczenia DB + dodany `drizzle.config.ts`).
- **Zakres**: Ujednolicenie `DATABASE_URL` z `docker-compose.yml`, dodanie instrukcji `.env`, opcjonalnie `drizzle.config.ts` (bez migracji).
- **DoD**:
  - [x] Aktualizacja dokumentacji `.env` (README z nowym źródłem prawdy) – dane logowania `devuser/devpass@jkdb` spójne.
  - [x] Dodane testy smoke `pnpm lint`, `pnpm test` (w CI).
  - [x] Potwierdzony start `pnpm dev`.
  - [x] Dodany `drizzle.config.ts` wskazujący na `packages/db/src/schema.ts`.
- **Ryzyka**: konieczność zaktualizowania lokalnych envów i secrets CI pod nowe dane; brak Dockera w CI.
- **Rollback**: przywrócenie poprzedniego `.env.example` i compose.
- **Estymata**: S.

### T1 — Design tokens i prymitywy UI
- **Branch**: `codex/ui-tokens`
- **Status**: 🔄 częściowo (klasy w `globals.css` istnieją, tokens nieprzeniesione do CSS variables).
- **Zakres**: Implementacja tokens w Tailwind/CSS, stworzenie komponentów `Button`, `Card`, `Badge`, `Input`, `Checkbox`.
- **DoD**:
  - [ ] Tokens z `UI_TOKENS.md` odzwierciedlone w kodzie (custom properties / Tailwind) – do zrobienia.
  - [ ] Storybook lub testy wizualne – brak.
  - [x] `pnpm lint`, `pnpm test`.
- **Ryzyka**: brak zatwierdzonych fontów, konieczność fallbacku.
- **Rollback**: wycofanie zmian w Tailwind i komponentach.
- **Estymata**: M.

### T2 — Mocki katalogu i helpery danych
- **Branch**: `codex/catalog-mocks`
- **Status**: ✅ zakończone (mocki z slug, wariantami, order reference, helpery `listProductSlugs`/`getProductBySlug`).
- **Zakres**: Rozszerzenie `src/lib/catalog` o slug, galerię, warianty; helpery `listProducts`, `getProductBySlug`.
- **DoD**:
  - [x] Nowe mock pliki/dane (`products.ts`, `types.ts`).
  - [x] Testy jednostkowe helperów (`src/lib/catalog/__tests__`).
  - [x] Decyzja dot. `/api/products` (pozostaje client-side filtering).
  - [x] `pnpm lint`, `pnpm test`.
- **Ryzyka**: niespójność z przyszłym schematem DB.
- **Rollback**: przywrócenie poprzednich mocków.
- **Estymata**: M.

### T3 — Strona katalogu z nawigacją do produktów
- **Branch**: `codex/catalog-page`
- **Status**: ✅ zakończone.
- **Zakres**: Aktualizacja `/catalog` by korzystała z helperów, linki do `/catalog/[slug]`, UX (loading/empty states, skip link).
- **DoD**:
  - [x] `CatalogExplorer` z linkami i poprawionym CTA.
  - [x] Testy komponentu (filtry + link slug).
  - [x] SEO metadata (`title`, `description`).
  - [x] `pnpm lint`, `pnpm test`.
- **Ryzyka**: regresje w filtrach po zmianie danych.
- **Rollback**: revert do poprzedniego `CatalogExplorer`.
- **Estymata**: M.

### T4 — Strona produktu `/catalog/[slug]`
- **Branch**: `codex/product-page`
- **Status**: ✅ zakończone.
- **Zakres**: Nowy routing dynamiczny, UI sekcji (galeria, detale, warianty), breadcrumbs, CTA do kontaktu/order.
- **DoD**:
  - [x] `app/catalog/[slug]/page.tsx` + `generateStaticParams` + `not-found` fallback.
  - [x] Testy (render, metadata) – [uwaga] brak dedykowanych testów komponentu, do rozważenia.
  - [x] Placeholder gallery assets w `public/`.
  - [x] `pnpm lint`, `pnpm test`.
- **Ryzyka**: brak realnych zdjęć, potrzeba placeholderów.
- **Rollback**: usunięcie nowego route'u.
- **Estymata**: L.

### T5 — Strona kontaktu i formularz
- **Branch**: `codex/contact-form`
- **Status**: ✅ zakończone (formularz client-side, hero, social links).
- **Zakres**: Formularz z walidacją client-side, CTA `mailto`, potwierdzenie wysyłki.
- **DoD**:
  - [x] Formularz z polami wymaganymi i walidacją.
  - [ ] Testy komponentu (do dopisania – brak coverage dla `ContactForm`).
  - [x] Aktualizacja metadata + copy.
  - [x] `pnpm lint`, `pnpm test`.
- **Ryzyka**: brak backendu do obsługi leadów.
- **Rollback**: powrót do wersji z prostym tekstem + `mailto`.
- **Estymata**: M.

### T6 — Jakość, testy i CI
- **Branch**: `codex/ci-hardening`
- **Status**: 🔄 częściowo (workflow CI działa, coverage + depcheck w pipeline; brak dodatkowych testów komponentów).
- **Zakres**: Dodanie workflow GitHub Actions, testów brakujących, template PR, coverage badge (opcjonalnie).
- **DoD**:
  - [x] `.github/workflows/ci.yml` zgodny z `JAKOSC_TESTY_CI.md` (lint, typecheck, test, coverage, depcheck).
  - [x] Zaktualizowany `README.md` z instrukcjami lint/test.
  - [x] Minimum testów uzupełnionych (product page, contact form) – dopisano scenariusze walidacji, prefill produktu i CTA katalogu.
  - [x] Template PR (`.github/pull_request_template.md`).
  - [x] `pnpm lint`, `pnpm test`.
- **Ryzyka**: dłuższy pipeline; potrzeba utrzymania logów coverage.
- **Rollback**: wyłączenie workflow, revert commitów.
- **Estymata**: M.

### T7 — Panel klienta (mock onboarding)
- **Branch**: `codex/account-onboarding`
- **Status**: ✅ zakończone (mock panel `/account` z formularzami i testami komponentów).
- **Zakres**: Landing `/account` z hero, rejestracją, logowaniem, historią zamówień i newsletterem (mock logic, brak backendu).
- **DoD**:
  - [x] Strona `app/account/page.tsx` z sekcjami hero, rejestracja, logowanie, historia zamówień, newsletter.
  - [x] Komponenty formularzy w `src/app/account/components/*` z testami Vitest.
  - [x] Copy i metadata dopasowane do brand voice.
  - [ ] Integracja backendu auth/newsletter – do zaplanowania jako oddzielne zadania (`LOOP_TASKS.md`).
  - [x] `pnpm lint`, `pnpm test`.
- **Ryzyka**: brak prawdziwego backendu auth powoduje rozjazd oczekiwań użytkownika, potrzeba jasnego komunikatu o mocku.
- **Rollback**: powrót do wersji repo sprzed dodania `/account` (zachowanie poprzedniego sitemap/plan).
- **Estymata**: L.

## Checklisty kontrolne
- [x] Zdefiniowano zadania T0–T7 z branchami i statusem.
- [x] Ujęto DoD, ryzyka, rollback, estymaty.
- [ ] Zatwierdzono plan przez właściciela produktu (w toku).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak zasobów (grafiki, copy) może opóźnić T4/T5 – częściowo zaadresowane placeholderami.
  - Niewdrożone migracje i brak dodatkowych testów komponentów mogą utrudnić skalowanie zespołu.
- **Decyzje do podjęcia**
  - Priorytet: dokończyć T0/T1/T6 czy rozszerzać katalog? (wymaga akceptacji właściciela).
  - Czy T5 wymaga integracji z backendem przed startem kampanii marketingowej?
- **Następne kroki**
  - Przygotować zadania follow-up dla: integracji API z Drizzle (styles/leather), CSS tokens, testy `ContactForm`/`ProductPage`.
  - Uzyskać akceptację planu od właściciela i zaktualizować timeline.
