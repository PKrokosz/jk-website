# Jakość, testy i CI/CD

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Definition of Done](#definition-of-done)
- [3. Plan testów](#plan-testow)
- [4. Konfiguracja GitHub Actions](#konfiguracja-github-actions)
- [5. Konwencje commitów i PR](#konwencje-commitow-i-pr)
- [6. Checklisty kontrolne](#checklisty-kontrolne)
- [7. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- DoD obejmuje `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:coverage` (jeśli zmiana dotyka logiki) oraz `pnpm depcheck` na koniec sprintu; wszystkie kroki można uruchomić przez `pnpm qa` / `pnpm qa:ci`.
- Testy: Vitest + React Testing Library (layout, katalog, kalkulator, formularz kontaktowy, product page, NativeModelShowcase).
- CI: GitHub Actions (job `quality`) z matrycą Node 20.x/22.x, pnpm 10.18.3, kroki lint → typecheck → test → coverage → depcheck, orkiestracją zarządza CLI (`pnpm qa`, `pnpm qa:ci`).
- Commity: Conventional Commits, PR zawiera opis, listę zmian, wyniki komend, screeny dla UI.

## Definition of Done
Checklist dla każdego PR:
- [ ] `pnpm install` (gdy zmieniono zależności).
- [x] `pnpm lint` – brak ostrzeżeń/błędów.
- [x] `pnpm typecheck` – brak błędów TS.
- [x] `pnpm test` – wszystkie testy przechodzą (lokalnie dostępne w pakiecie `pnpm qa`).
- [ ] `pnpm test:coverage` – wymagane dla zmian w logice domenowej/komponentach (raport w `coverage/`).
- [ ] `pnpm test:e2e` – scenariusze Playwright dla kluczowych flow (obecnie: pobieranie PDF na stronach prawnych).
- [x] `pnpm build` – uruchamiane przy zmianach w konfiguracji/routingu.
- [ ] `pnpm depcheck` – min. raz na sprint (monitoring zależności).
- [ ] `pnpm db:seed` – opcjonalnie przed testami, aby odświeżyć referencyjne dane w lokalnej bazie (CI korzysta z tej samej komendy).
- [x] Zaktualizowana dokumentacja (jeśli zmiana dotyczy feature'a).
- [x] Screen/gif dla zmian UI (desktop + mobile, jeśli istotne).

## Plan testów
| Obszar | Rodzaj testu | Zakres | Narzędzie | Status |
| --- | --- | --- | --- | --- |
| Nawigacja (`Header`, `NavLink`, skip link) | Unit | Render linków, stan aktywny, aria-current | Vitest + RTL | ✅ `layout.test.tsx` |
| Katalog (`CatalogExplorer`) | Component | Filtry (style/leather), sortowanie, empty state | Vitest + RTL | ✅ (testy w `src/components/catalog/__tests__`) |
| Strona produktu | Component/server | Render breadcrumb, galeria, CTA, 404 fallback | Vitest + RTL | ✅ (testy w `src/app/catalog/__tests__`) |
| SEO/Metadata | Unit | `generateMetadata` zwraca właściwe tytuły/opisy | Vitest | ✅ (pokryte w `product-page.test.tsx`) |
| UI prymitywy (`button`, `badge`) | Accessibility | Style/role, focus ring, warianty kolorystyczne | Vitest + `@testing-library/react` | ✅ (`src/components/ui/__tests__/button.primitive.test.tsx`, `src/components/ui/__tests__/badge.primitive.test.tsx`) |
| Formularz kontaktowy | Component | Walidacja required fields, stany success/error, prefill produktu, obsługa limitów | Vitest | ✅ (testy w `src/components/contact/__tests__`) |
| NativeModelShowcase | Component | Lista modeli, formatowanie cen, CTA do `/order/native` | Vitest + RTL | ✅ (test w `src/components/catalog/__tests__/NativeModelShowcase.test.tsx`) |
| Pricing calculator | Unit | `calculateQuote`, integracja z UI | Vitest | ✅ (istniejące testy w `src/app/components/__tests__`) |
| Order modal | Component | Otwarcie, focus trap, CTA linki | Vitest | ✅ (testy w `src/components/ui/order/__tests__`) |
| Strony prawne | E2E | Pobranie PDF + nagłówki odpowiedzi | Playwright | ✅ (`src/tests/e2e/legal-download.spec.ts`) |
| E2E smoke | Flow | Home → Catalog → Product → Contact | Playwright (opcjonalnie) | ⏳ (future) |

## Konfiguracja GitHub Actions
Aktualny plik `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  quality:
    name: Quality checks
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]
    env:
      CI: true
      NEXT_TELEMETRY_DISABLED: 1
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Set up Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"
      - name: Set up pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.18.3
          run_install: false
          standalone: true
      - name: Approve pnpm builds
        if: hashFiles('.pnpm-builds.json') != ''
        run: pnpm run approve-builds
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Quality gate
        if: matrix.node-version == '22.x'
        run: pnpm qa
      - name: Full CI gate
        if: matrix.node-version == '20.x'
        run: pnpm qa:ci
      - name: Upload coverage report
        if: always() && matrix.node-version == '20.x'
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
  ```
  - `pnpm qa` uruchamia lokalną bramkę jakościową (lint, typecheck, test) – wykorzystywane na macierzy Node 22.x.
  - `pnpm qa:ci` odtwarza pełen pipeline CI (lint, typecheck, build, test, coverage, e2e, depcheck) – uruchamiane na Node 20.x.
  - Raport coverage dołączany jest jako artefakt `coverage-report` dla gałęzi PR/push.
  - Scenariusze Playwright uruchamiane są na Node 20.x, raport HTML dołączany jako artefakt `playwright-report`.
  - Seedy katalogu uruchamiane są skryptem `pnpm db:seed` (wykorzystuje pakiet `@jk/db`); CI może go wywołać w jobie przygotowującym bazę.

## Konwencje commitów i PR
- Commity: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`).
- PR zawiera sekcje:
  - `## Opis` – kontekst biznesowy i techniczny.
  - `## Lista zmian` – wypunktowanie plików/obszarów.
  - `## Testy` – logi z `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:coverage` (jeśli dotyczy).
  - `## Zrzuty ekranu` – screeny/gify dla zmian UI.
  - `## Checklist` – DoD z odhaczeniem.
- Szablon PR – do utworzenia w `.github/pull_request_template.md`.

## Checklisty kontrolne
- [x] Zdefiniowano DoD.
- [x] Opisano minimalny zakres testów (z aktualnym statusem).
- [x] Przedstawiono aktualny workflow GitHub Actions.
- [x] Określono konwencje commitów/PR.
- [x] Dodano brakujące testy (product page, contact form, modal, metadata).
- [x] Dodano template PR (`.github/pull_request_template.md`).
- [x] Włączono upload coverage w CI.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Pokrycie UI prymitywów nadal brakujące – potencjalne regresje wizualne.
  - Utrzymanie checklisty PR wymaga dyscypliny zespołu (ryzyko pomijania logów testów).
- **Decyzje do podjęcia**
  - Czy wymagamy raportu coverage (np. próg %) w CI?
  - Czy rozszerzamy pipeline o `pnpm build` / preview build na gałęziach feature?
- **Następne kroki**
  - Utrzymać testy UI prymitywów w parze z migracją tokens do CSS custom properties.
  - Przeglądać losowe PR-y pod kątem kompletności checklisty i logów.
  - Rozważyć włączenie Playwright smoke testów po stabilizacji flow zamówień.
