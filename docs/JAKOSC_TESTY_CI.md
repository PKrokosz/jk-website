# Jakość, testy i CI/CD

## Meta audytu 2025-10-31
- **Status zagadnień**: Workflow CI działa i pokrywa wszystkie opisane kroki (`pnpm qa`, `pnpm qa:ci`). Pozostają otwarte działania opcjonalne (`pnpm test:e2e` dla kolejnych flow, monitorowanie coverage threshold). DoD wymaga konsekwentnego odhaczania pól.
- **Nowe ścieżki rozwoju**:
  - Ustalić minimalny próg coverage i opisać go w dokumencie (np. 85% pokrycia statements) oraz dodać w pipeline.
  - Automatyzować weryfikację checklisty PR (np. skrypt CLI, który sprawdza wypełnienie sekcji w szablonie PR).
  - Dopisać do `docs/LOOP_TASKS.md` zadanie na cykliczne przeglądy Playwright (utrzymanie scenariuszy w zgodzie z UI).
- **Rekomendacja archiwizacji**: Nie — dokument jest aktywnie używany jako DoD i referencja dla CI.
- **Sens dokumentu**: Określa Definition of Done, plan testów, konfigurację CI i konwencje pracy. Zapewnia, że każda zmiana przechodzi spójny zestaw kontroli jakości.
- **Aktualizacje wykonane**:
  - Podbito meta audyt (2025-10-31) oraz zsynchronizowano opis pipeline z aktualnym workflow.
  - Dodano skrypt `scripts/prepare-integration-db.ts`, który startuje `jkdb`, czeka na połączenie i odpala migracje oraz seed z `.env.test`.
  - Rozszerzono `pnpm qa:ci` o kroki przygotowania bazy i uruchomienie `pnpm test src/app/api/products/route.integration.test.ts`.
  - Ujednolicono workflow CI z CLI – job `quality` korzysta z nowego skryptu i uruchamia docelowy plik testów integracyjnych.
  - Zaktualizowano wymagania dotyczące sprzątania kontenera (`docker compose down --volumes jkdb`) po testach integracyjnych.
  - Dodano flagę `--with-integration-db` do komendy `quality`, aby lokalnie uruchamiać krok `scripts/prepare-integration-db.ts`.
  - Zmieniono krok kontroli migracji: CLI odpala `pnpm db:generate` bez nadpisywania `DRIZZLE_OUT` i waliduje `git status` przed oraz po komendzie.

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Definition of Done](#definition-of-done)
- [3. Plan testów](#plan-testow)
- [4. Konfiguracja GitHub Actions](#konfiguracja-github-actions)
- [5. Konwencje commitów i PR](#konwencje-commitow-i-pr)
- [6. Checklisty kontrolne](#checklisty-kontrolne)
- [7. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- DoD obejmuje `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:coverage` (jeśli zmiana dotyka logiki) oraz `pnpm depcheck` na koniec sprintu; wszystkie kroki można uruchomić przez `pnpm qa` / `pnpm qa:ci`, które dodatkowo pilnują braku zmian w `drizzle/` po `pnpm db:generate` (wykonywanym z kontrolą czystości gita) i – w trybie CI – przygotowują bazę (`scripts/prepare-integration-db.ts`) przed integracjami. Lokalnie rozszerzoną bramkę aktywuje `pnpm qa -- --with-integration-db`.
- Testy: Vitest + React Testing Library (layout, katalog, kalkulator, formularz kontaktowy, product page, NativeModelShowcase).
- CI: GitHub Actions (job `quality`) z matrycą Node 20.x/22.x, pnpm 10.18.3, kroki lint → typecheck → test → coverage → depcheck oraz dedykowane przygotowanie bazy (`pnpm exec tsx scripts/prepare-integration-db.ts`) + weryfikacja `pnpm db:generate` + testy integracyjne na Node 20.x (uruchamiane zarówno w `pnpm qa:ci`, jak i osobnym kroku); orkiestracją zarządza CLI (`pnpm qa`, `pnpm qa:ci`).
- Commity: Conventional Commits, PR zawiera opis, listę zmian, wyniki komend, screeny dla UI.

## Definition of Done
Checklist dla każdego PR:
- [ ] `pnpm install` (gdy zmieniono zależności).
- [x] `pnpm lint` – brak ostrzeżeń/błędów.
- [x] `pnpm typecheck` – brak błędów TS.
- [x] `pnpm test` – wszystkie testy przechodzą (lokalnie dostępne w pakiecie `pnpm qa`).
- [ ] `pnpm test:coverage` – wymagane dla zmian w logice domenowej/komponentach (raport w `coverage/`).
- [ ] `pnpm test:e2e` – scenariusze Playwright dla kluczowych flow (pobieranie PDF + smoke test nawigacji i API katalogu).
- [x] `pnpm build` – uruchamiane przy zmianach w konfiguracji/routingu.
- [ ] `pnpm depcheck` – min. raz na sprint (monitoring zależności).
- [ ] `pnpm db:seed` – opcjonalnie przed testami, aby odświeżyć referencyjne dane w lokalnej bazie (CI korzysta z tej samej komendy).
- [x] `pnpm db:generate` – wykonywane automatycznie w `pnpm qa` / `pnpm qa:ci`; skrypt CLI pilnuje czystego stanu `drizzle/` przed i po komendzie, aby zatrzymać PR z niezatwierdzonymi migracjami.
- [x] Zaktualizowana dokumentacja (jeśli zmiana dotyczy feature'a).
- [x] Screen/gif dla zmian UI (desktop + mobile, jeśli istotne).

## Plan testów
| Obszar | Rodzaj testu | Zakres | Narzędzie | Status |
| --- | --- | --- | --- | --- |
| Nawigacja (`Header`, `NavLink`, skip link) | Unit | Render linków, stan aktywny, aria-current | Vitest + RTL | ✅ `layout.test.tsx` |
| Katalog (`CatalogExplorer`) | Component | Filtry (style/leather), sortowanie, empty state | Vitest + RTL | ✅ (testy w `src/components/catalog/__tests__`) |
| Repozytorium katalogu (cache modułu DB) | Unit | Cache importu `@jk/db`, fallback ostrzeżeń | Vitest | ✅ (`src/lib/catalog/__tests__/repository.loadDbModule.test.ts`) |
| Strona produktu | Component/server | Render breadcrumb, galeria, CTA, 404 fallback | Vitest + RTL | ✅ (testy w `src/app/catalog/__tests__`) |
| SEO/Metadata | Unit | `generateMetadata` zwraca właściwe tytuły/opisy | Vitest | ✅ (pokryte w `product-page.test.tsx`) |
| UI prymitywy (`button`, `badge`) | Accessibility | Style/role, focus ring, warianty kolorystyczne | Vitest + `@testing-library/react` | ✅ (`src/components/ui/__tests__/button.primitive.test.tsx`, `src/components/ui/__tests__/badge.primitive.test.tsx`) |
| Formularz kontaktowy | Component | Walidacja required fields, stany success/error, prefill produktu, obsługa limitów | Vitest | ✅ (testy w `src/components/contact/__tests__`) |
| NativeModelShowcase | Component | Lista modeli, formatowanie cen, CTA do `/order/native` | Vitest + RTL | ✅ (test w `src/components/catalog/__tests__/NativeModelShowcase.test.tsx`) |
| Pricing calculator | Unit | `calculateQuote`, integracja z UI | Vitest | ✅ (istniejące testy w `src/app/components/__tests__`) |
| Order modal | Component | Otwarcie, focus trap, CTA linki | Vitest | ✅ (testy w `src/components/ui/order/__tests__`) |
| Strony prawne | E2E | Pobranie PDF + nagłówki odpowiedzi | Playwright | ✅ (`src/tests/e2e/legal-download.spec.ts`) |
| Nawigacja głównych stron + API katalogu | E2E | Smoke test nawigacji H1 + GET `/api/products`, `/api/styles`, `/api/leather` | Playwright | ✅ (`src/tests/e2e/site-navigation.spec.ts`) |
| Zamówienie natywne | E2E | Modal Home → `/order/native` → `/order/cart`, walidacja imienia i prefill koszyka | Playwright | ✅ (`src/tests/e2e/order-native-flow.spec.ts`) |
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
      - name: Prepare integration database
        if: matrix.node-version == '20.x'
        run: pnpm exec tsx scripts/prepare-integration-db.ts
      - name: Verify Drizzle schema metadata
        if: matrix.node-version == '20.x'
        run: |
          pnpm db:generate
          if [ -n "$(git status --short drizzle)" ]; then
            echo "::error::Drizzle schema metadata is out of sync. Run 'pnpm db:generate' locally and commit the changes."
            git status --short drizzle
            exit 1
          fi
      - name: Quality gate
        if: matrix.node-version == '22.x'
        run: pnpm qa
      - name: Full CI gate
        if: matrix.node-version == '20.x'
        run: pnpm qa:ci
      - name: Run integration tests
        if: matrix.node-version == '20.x'
        run: pnpm test src/app/api/products/route.integration.test.ts
      - name: Upload coverage report
        if: always() && matrix.node-version == '20.x'
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
      - name: Tear down integration database
        if: always() && matrix.node-version == '20.x'
        run: docker compose down --volumes jkdb
  ```
  - `pnpm qa` uruchamia lokalną bramkę jakościową (lint, typecheck, test) – wykorzystywane na macierzy Node 22.x.
  - `pnpm qa:ci` odtwarza pełen pipeline CI (lint, typecheck, build, test, coverage, e2e, depcheck, przygotowanie bazy i test integracyjny) – uruchamiane na Node 20.x.
  - Obie komendy rozpoczynają się od `pnpm db:generate`; skrypt CLI pilnuje czystego `git status --short drizzle` przed i po komendzie i przerywa job, gdy pojawią się nowe artefakty.
  - Skrypt `pnpm exec tsx scripts/prepare-integration-db.ts` uruchamia `docker compose up -d jkdb`, czeka na dostępność bazy i wywołuje `pnpm db:migrate` + `pnpm db:seed` z `.env.test` przed integracjami.
  - Po przygotowaniu bazy CLI i workflow odpalają `pnpm test src/app/api/products/route.integration.test.ts`, aby upewnić się, że brak połączenia nie pomija scenariuszy degradacji katalogu.
  - `Verify Drizzle schema metadata` wymusza czysty diff po `pnpm db:generate`, dzięki czemu wychwycimy brakujące aktualizacje migracji/metadanych.
  - `pnpm test src/app/api/products/route.integration.test.ts` korzysta z helpera `ensureIntegrationTestMigrations`, aby upewnić się, że migracje zostały zastosowane i dane referencyjne są dostępne.
  - `docker compose down --volumes jkdb` gwarantuje zwolnienie wolumenów i kontenera `jkdb` po zakończeniu testów na Node 20.x.
  - Komenda `pnpm qa:ci` wywołuje ten sam krok sprzątający lokalnie; w razie potrzeby debugowania można użyć `pnpm qa:ci -- --skip=cleanup-node20-db`.
  - Raport coverage dołączany jest jako artefakt `coverage-report` dla gałęzi PR/push.
  - Scenariusze Playwright uruchamiane są na Node 20.x, raport HTML dołączany jako artefakt `playwright-report`.

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
