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
| Strona produktu | Component/server | Render breadcrumb, galeria, CTA, 404 fallback | Vitest + RTL | 🔄 (do dopisania) |
| SEO/Metadata | Unit | `generateMetadata` zwraca właściwe tytuły/opisy | Vitest | 🔄 (niezaimplementowane) |
| UI prymitywy (`button`, `badge`) | Snapshot/accessibility | Style/role, focus ring | Vitest + `@testing-library/react` | 🔄 |
| Formularz kontaktowy | Component | Walidacja required fields, stany success/error | Vitest | 🔄 |
| Pricing calculator | Unit | `calculateQuote`, integracja z UI | Vitest | ✅ (istniejące testy w `src/app/components/__tests__`) |
| Order modal | Component | Otwarcie, focus trap, CTA linki | Vitest/e2e | 🔄 |
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
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"
      - uses: pnpm/action-setup@v4
        with:
          version: 10.18.3
          run_install: false
      - name: Approve pnpm builds
        if: hashFiles('.pnpm-builds.json') != ''
        run: pnpm run approve-builds
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm test:coverage
      - run: pnpm depcheck
```
- `pnpm build` wykonywać manualnie przed PR; można dodać krok warunkowy (np. na gałęzi `main` lub gdy zmieniono `src/app`).
- Warto dodać artefakt z raportem coverage (`actions/upload-artifact`).

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
- [ ] Dodano brakujące testy (product page, contact form, modal, metadata).
- [ ] Dodano template PR oraz upload coverage.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak testów dla kluczowych komponentów (product page, contact form) może ukryć regresje.
  - Brak template PR utrudnia spójne raportowanie wyników.
- **Decyzje do podjęcia**
  - Czy wymagamy raportu coverage (np. próg %) w CI?
  - Czy rozszerzamy pipeline o `pnpm build` / preview build na gałęziach feature?
- **Następne kroki**
  - Dodać testy dla `ProductPage`, `ContactForm`, `OrderModalTrigger`.
  - Przygotować template PR i ewentualnie włączyć upload coverage.
  - Rozważyć włączenie Playwright smoke testów po stabilizacji flow zamówień.
