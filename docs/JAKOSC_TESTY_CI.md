# Jakość, testy i CI/CD

## Meta audytu 2025-10-30
- **Status zagadnień**: Workflow CI działa i pokrywa wszystkie opisane kroki (`pnpm qa`, `pnpm qa:ci`). Pozostają otwarte działania opcjonalne (`pnpm test:e2e` dla kolejnych flow, monitorowanie coverage threshold). DoD wymaga konsekwentnego odhaczania pól.
- **Nowe ścieżki rozwoju**:
  - Ustalić minimalny próg coverage i opisać go w dokumencie (np. 85% pokrycia statements) oraz dodać w pipeline.
  - Automatyzować weryfikację checklisty PR (np. skrypt CLI, który sprawdza wypełnienie sekcji w szablonie PR).
  - Dopisać do `docs/LOOP_TASKS.md` zadanie na cykliczne przeglądy Playwright (utrzymanie scenariuszy w zgodzie z UI).
- **Rekomendacja archiwizacji**: Nie — dokument jest aktywnie używany jako DoD i referencja dla CI.
- **Sens dokumentu**: Określa Definition of Done, plan testów, konfigurację CI i konwencje pracy. Zapewnia, że każda zmiana przechodzi spójny zestaw kontroli jakości.
- **Aktualizacje wykonane**:
  - Podbito meta audyt (2025-10-30) oraz utrzymano aktualność statusu dokumentu.
  - Uzupełniono opis pipeline o krok przygotowujący bazę oraz uruchomienie `pnpm test:integration`.
  - Doprecyzowano etap sprzątania kontenerów (`docker compose down --volumes jkdb`) po testach integracyjnych.
  - Rozszerzono CLI `quality:ci` o automatyczne sprzątanie bazy `jkdb` po scenariuszu Node 20 oraz udokumentowano flagę `--skip=cleanup-node20-db`.
  - Dodano krok dry-run `pnpm db:generate` w `pnpm qa`/`pnpm qa:ci`, który blokuje bramkę przy niezatwierdzonych zmianach w `drizzle/`.

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Definition of Done](#definition-of-done)
- [3. Plan testów](#plan-testow)
- [4. Konfiguracja GitHub Actions](#konfiguracja-github-actions)
- [5. Konwencje commitów i PR](#konwencje-commitow-i-pr)
- [6. Checklisty kontrolne](#checklisty-kontrolne)
- [7. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- DoD obejmuje `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:coverage` (jeśli zmiana dotyka logiki) oraz `pnpm depcheck` na koniec sprintu; wszystkie kroki można uruchomić przez `pnpm qa` / `pnpm qa:ci`, które dodatkowo pilnują braku zmian w `drizzle/` po `pnpm db:generate -- --dry-run`.
- Testy: Vitest + React Testing Library (layout, katalog, kalkulator, formularz kontaktowy, product page, NativeModelShowcase).
- CI: GitHub Actions (job `quality`) z matrycą Node 20.x/22.x, pnpm 10.18.3, kroki lint → typecheck → test → coverage → depcheck oraz dedykowane przygotowanie bazy + weryfikacja `pnpm db:generate` + testy integracyjne na Node 20.x; orkiestracją zarządza CLI (`pnpm qa`, `pnpm qa:ci`).
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
- [x] `pnpm db:generate -- --dry-run` – wykonywane automatycznie w `pnpm qa` / `pnpm qa:ci`, aby zatrzymać PR z niezatwierdzonymi migracjami.
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
        run: |
          docker compose up -d jkdb
          ready=0
          for attempt in {1..30}; do
            if docker compose exec -T jkdb pg_isready -U postgres > /dev/null 2>&1; then
              echo "Database is ready"
              ready=1
              break
            fi
            echo "Waiting for database... (${attempt}/30)"
            sleep 2
          done
          if [ "$ready" -ne 1 ]; then
            echo "::error::Database did not become ready in time"
            docker compose logs jkdb
            exit 1
          fi
          pnpm db:migrate
          pnpm db:seed
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
        run: pnpm test:integration
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
  - `pnpm qa:ci` odtwarza pełen pipeline CI (lint, typecheck, build, test, coverage, e2e, depcheck) – uruchamiane na Node 20.x.
  - Obie komendy rozpoczynają się od dry-run `pnpm db:generate`, który kończy job błędem, jeżeli `drizzle/` zawiera niezatwierdzone zmiany.
  - Kroki `pnpm db:migrate`, `pnpm db:seed` przygotowują kontener Postgresa (`jkdb`) i synchronizują schemat przed testami integracyjnymi.
  - `Verify Drizzle schema metadata` wymusza czysty diff po `pnpm db:generate`, dzięki czemu wychwycimy brakujące aktualizacje migracji/metadanych.
  - `pnpm test:integration` korzysta z helpera `ensureIntegrationTestMigrations`, aby upewnić się, że migracje zostały zastosowane i dane referencyjne są dostępne.
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
