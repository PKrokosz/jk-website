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
- DoD obejmuje `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:coverage` (jeśli zmiana dotyka logiki) oraz `pnpm depcheck` na koniec sprintu.
- Testy: Vitest + React Testing Library (layout, katalog, kalkulator, docelowo formularz kontaktowy i product page).
- CI: GitHub Actions (job `quality`) z matrycą Node 20.x/22.x, pnpm 10.18.3, kroki lint → typecheck → test → coverage → depcheck.
- Commity: Conventional Commits, PR zawiera opis, listę zmian, wyniki komend, screeny dla UI.

## Definition of Done
Checklist dla każdego PR:
- [ ] `pnpm install` (gdy zmieniono zależności).
- [x] `pnpm lint` – brak ostrzeżeń/błędów.
- [x] `pnpm typecheck` – brak błędów TS.
- [x] `pnpm test` – wszystkie testy przechodzą.
- [ ] `pnpm test:coverage` – wymagane dla zmian w logice domenowej/komponentach (raport w `coverage/`).
- [x] `pnpm build` – uruchamiane przy zmianach w konfiguracji/routingu.
- [ ] `pnpm depcheck` – min. raz na sprint (monitoring zależności).
- [x] Zaktualizowana dokumentacja (jeśli zmiana dotyczy feature'a).
- [x] Screen/gif dla zmian UI (desktop + mobile, jeśli istotne).

## Plan testów
| Obszar | Rodzaj testu | Zakres | Narzędzie | Status |
| --- | --- | --- | --- | --- |
| Nawigacja (`Header`, `NavLink`, skip link) | Unit | Render linków, stan aktywny, aria-current | Vitest + RTL | ✅ `layout.test.tsx` |
| Katalog (`CatalogExplorer`) | Component | Filtry (style/leather), sortowanie, empty state | Vitest + RTL | ✅ (testy w `src/components/catalog/__tests__`) |
| Strona produktu | Component/server | Render breadcrumb, galeria, CTA, 404 fallback | Vitest + RTL | ✅ (testy w `src/app/catalog/__tests__`) |
| SEO/Metadata | Unit | `generateMetadata` zwraca właściwe tytuły/opisy | Vitest | ✅ (pokryte w `product-page.test.tsx`) |
| UI prymitywy (`button`, `badge`) | Snapshot/accessibility | Style/role, focus ring | Vitest + `@testing-library/react` | 🔄 |
| Formularz kontaktowy | Component | Walidacja required fields, stany success/error | Vitest | ✅ (testy w `src/components/contact/__tests__`) |
| Pricing calculator | Unit | `calculateQuote`, integracja z UI | Vitest | ✅ (istniejące testy w `src/app/components/__tests__`) |
| Order modal | Component | Otwarcie, focus trap, CTA linki | Vitest | ✅ (testy w `src/components/ui/order/__tests__`) |
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
      - name: Approve pnpm builds
        if: hashFiles('.pnpm-builds.json') != ''
        run: pnpm run approve-builds
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Lint
        run: pnpm lint
      - name: Type check
        run: pnpm typecheck
      - name: Build
        if: matrix.node-version == '20.x'
        run: pnpm build
      - name: Run unit tests
        run: pnpm test
      - name: Coverage
        if: matrix.node-version == '20.x'
        run: pnpm test:coverage
      - name: Upload coverage report
        if: always() && matrix.node-version == '20.x'
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
      - name: Dependency check
        if: matrix.node-version == '20.x'
        run: pnpm depcheck
```
- `pnpm build` odpalany jest na Node 20.x jako głównym środowisku referencyjnym.
- Raport coverage dołączany jest jako artefakt `coverage-report` dla gałęzi PR/push.

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
- [ ] Dodano template PR.
- [x] Włączono upload coverage w CI.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Pokrycie UI prymitywów nadal brakujące – potencjalne regresje wizualne.
  - Brak template PR utrudnia spójne raportowanie wyników.
- **Decyzje do podjęcia**
  - Czy wymagamy raportu coverage (np. próg %) w CI?
  - Czy rozszerzamy pipeline o `pnpm build` / preview build na gałęziach feature?
- **Następne kroki**
  - Dodać testy dla UI prymitywów (`button`, `badge`).
  - Przygotować template PR (sekcje DoD + logi testów).
  - Rozważyć włączenie Playwright smoke testów po stabilizacji flow zamówień.
