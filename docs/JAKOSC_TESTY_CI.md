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
- DoD obejmuje `pnpm lint`, `pnpm test`, oraz (opcjonalnie) `pnpm build` dla krytycznych zmian.
- Testy Vitest + React Testing Library: nawigacja, katalog, produkt, prymitywy UI.
- CI: GitHub Actions z matrycą Node 20.x, cache pnpm, kroki lint/test/build.
- Commity: Conventional Commits, PR zawiera opis, listę zmian, wyniki komend.

## Definition of Done
Checklist dla każdego PR:
- [ ] `pnpm install` (gdy zmieniono zależności).
- [ ] `pnpm lint` – brak ostrzeżeń/błędów.
- [ ] `pnpm test` – wszystkie testy przechodzą; raport coverage opcjonalny.
- [ ] `pnpm build` – uruchamiamy przy zmianach w konfiguracji/routingu.
- [ ] Zaktualizowana dokumentacja (jeśli zmiana dotyczy feature'a).
- [ ] Screen/gif dla zmian UI (desktop + mobile, jeśli istotne).

## Plan testów
| Obszar | Rodzaj testu | Zakres | Narzędzie |
| --- | --- | --- | --- |
| Nawigacja (`Header`, `NavLink`) | Unit | Render linków, stan aktywny, aria-current | Vitest + RTL |
| Katalog (`CatalogExplorer`) | Component | Filtry (style/leather), sortowanie, empty state | Vitest + RTL (mock `styles/leathers/products`) |
| Strona produktu | Component (server + client) | Render breadcrumb, galeria, CTA, 404 fallback | Vitest (component tests) / e2e (opcjonalnie) |
| SEO/Metadata | Unit | `generateMetadata` zwraca właściwe tytuły/opisy | Vitest |
| UI prymitywy (`Button`, `Card`, `Input`) | Snapshot + accessibility | Vitest + `@testing-library/react` |
| Formularz kontaktowy | Component | Walidacja required fields, stany success/error | Vitest |
| Pricing calculator | Unit | `calculateQuote` (już istnieje) + interakcje formularza | Vitest |

Opcjonalnie: Playwright smoke test (nawigacja, filtry) – do dodania później.

## Konfiguracja GitHub Actions
Proponowany plik `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.11.1, 20.19.0]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 10.18.3
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test -- --coverage
      - run: pnpm build
```
- `pnpm build` można uruchamiać warunkowo (np. tylko na `main` lub gdy zmieniono `src/app`).
- Dodać upload coverage (`actions/upload-artifact`) jeśli wymagany raport.

## Konwencje commitów i PR
- Commity: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
- Każdy commit powinien być mały i logiczny (≤ 400 LOC).
- PR zawiera sekcje:
  - Opis zmiany + kontekst biznesowy.
  - Lista plików/sekcji.
  - Wynik `pnpm lint`, `pnpm test` (logi wklejone lub w komentarzu CI).
  - Screenshot/GIF dla zmian UI.
- Template PR (do dodania):
  - `## Opis`, `## Testy`, `## Zrzuty ekranu`, `## Checklist` (pnpm lint/test/build, aktualizacja docs, QA done).

## Checklisty kontrolne
- [x] Zdefiniowano DoD.
- [x] Opisano minimalny zakres testów.
- [x] Przygotowano szkic workflow GitHub Actions.
- [x] Określono konwencje commitów/PR.
- [ ] Dodano faktyczny plik workflow w repo (do implementacji).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak CI opóźni wykrywanie regresji; należy wdrożyć przed intensywną implementacją.
  - Uruchomienie `pnpm build` dla każdej gałęzi może wydłużyć pipeline – rozważyć warunek.
- **Decyzje do podjęcia**
  - Czy wymagamy pokrycia testami (np. >70%) w pipeline?
  - Czy dołączamy e2e (Playwright) w tym MVP?
- **Następne kroki**
  - Zaimplementować workflow i template PR.
  - Rozpisać zadania testowe w `PLAN_MVP_SPRINTS.md`.
