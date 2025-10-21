# Audyt repozytorium

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Struktura monorepo](#struktura-monorepo)
- [3. Istniejące strony, komponenty i endpointy](#istniejace-strony-komponenty-i-endpointy)
- [4. Środowisko i komendy diagnostyczne](#srodowisko-i-komendy-diagnostyczne)
- [5. Rozjazdy wersji i obserwacje](#rozjazdy-wersji-i-obserwacje)
- [6. Checklisty kontrolne](#checklisty-kontrolne)
- [7. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Monorepo oparte o pnpm workspaces, z główną aplikacją Next.js 14 w katalogu `src/` i pakietem współdzielonym `@jk/db`.
- Routing App Routera jest częściowo zaimplementowany (Home, Catalog, About, Contact, API `/api/styles`, `/api/leather`, `/api/pricing/quote`, `/healthz`).
- Mockowane dane katalogowe znajdują się w `src/lib/catalog`; integracja z Drizzle/DB nie została jeszcze podłączona do stron.
- Konfiguracja środowiska wymaga doprecyzowania danych dostępowych do Postgresa (rozjazd między `.env.example` a `docker-compose.yml`).

## Struktura monorepo
- **Apps**
  - `apps/web/` – zawiera tylko `next-env.d.ts`; bieżąca aplikacja działa z katalogu głównego `src/`.
- **Packages**
  - `packages/db/` – pakiet Drizzle ORM (schemat bazy, klient PG, własny `docker-compose.yml`).
- **Kluczowe katalogi**
  - `src/app/` – App Router, globalne style, komponenty page-level (`about`, `catalog`, `contact`, `healthz`, `api/*`).
  - `src/app/components/` – komponenty specyficzne dla strony (np. `PricingCalculator`).
  - `src/components/` – komponenty współdzielone (`Header`, `NavLink`, `catalog/CatalogExplorer`).
  - `src/lib/` – logika domenowa (`catalog`, `pricing`).
  - `public/` – zasoby statyczne (obecnie favicon).
  - `vitest.setup.ts`, `vitest.config.ts` – konfiguracja testów.

## Istniejące strony, komponenty i endpointy
- **Strony (App Router)**
  - `/` – strona główna z sekcjami hero, proces, portfolio, kalkulator wyceny, CTA.
  - `/catalog` – katalog z filtrami i sortowaniem (komponent `CatalogExplorer`).
  - `/about` – placeholder sekcji „O pracowni”.
  - `/contact` – placeholder sekcji kontaktowej.
  - `/healthz` – endpoint statusowy (API route `route.ts`).
- **Endpointy API**
  - `GET /api/styles` – zwraca mockowane style (`catalogStyles`).
  - `GET /api/leather` – zwraca mockowane skóry (`catalogLeathers`).
  - `POST /api/pricing/quote` – kalkulator wyceny wykorzystujący `calculateQuote`.
- **Komponenty kluczowe**
  - `Header` + `NavLink` – globalna nawigacja sticky.
  - `CatalogExplorer` – klientowy komponent katalogu z filtrami, sortowaniem i dostępnością ARIA.
  - `PricingCalculator` – komponent kalkulatora wyceny korzystający z logiki `pricing/calc`.

## Środowisko i komendy diagnostyczne
- **Wersje narzędzi**
  ```bash
  pnpm -v
  10.18.3
  ```
  ```bash
  node -v
  v20.19.4
  ```
- **Instalacja zależności**
  ```bash
  pnpm install
  Scope: all 2 workspace projects
  Lockfile is up to date, resolution step is skipped
  Packages: +64 -2

  Progress: resolved 64, reused 2, downloaded 32, added 34

  devDependencies:
  + @testing-library/jest-dom 6.9.1
  + @testing-library/react 16.3.0
  + jsdom 27.0.1

  ╭ Warning ───────────────────────────────────────────────────────────────────────────────────╮
  │                                                                                            │
  │   Ignored build scripts: esbuild, unrs-resolver.                                           │
  │   Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.   │
  │                                                                                            │
  ╰────────────────────────────────────────────────────────────────────────────────────────────╯

  Done in 3.2s using pnpm v10.18.3
  ```
- **Plik `.env`**
  - Skopiowano `.env.example` → `.env.local`.
  - Dostępna zmienna: `DATABASE_URL=postgres://postgres:postgres@localhost:5432/jk`.
  - Pakiet `@jk/db` czyta `DATABASE_URL` (w `packages/db/src/lib/db.ts`).
- **Docker Compose**
  - Uruchomienie `docker compose config` nie powiodło się (Docker nie jest dostępny w sandboxie):
    ```bash
    docker compose config
    bash: command not found: docker
    ```
  - Zarówno `docker-compose.yml` w repo głównym, jak i w `packages/db` definiują usługę Postgresa nasłuchującą na `5432`, z danymi `devuser/devpass`, `jkdb`.
- **Start dev servera**
  ```bash
  pnpm dev

  > jk-website@0.1.0 dev /workspace/jk-website
  > next dev

    ▲ Next.js 14.2.13
    - Local:        http://localhost:3000
    - Environments: .env.local
    - Experiments (use with caution):
      · typedRoutes

   ✓ Starting...
   ✓ Ready in 2.2s
  ```
  - Komenda zatrzymana ręcznie (`Ctrl+C`), Next.js startuje poprawnie.

## Rozjazdy wersji i obserwacje
- Node 20.19.4 ≥ minimalnego wymaganego `>=20` – OK.
- `package.json` wymusza `pnpm@10.18.3`; lokalna wersja zgodna.
- Next.js `14.2.13` spójny z `eslint-config-next@14.2.13`.
- Drizzle ORM (`0.34.1`) zainstalowany tylko w pakiecie `@jk/db`; brak konfiguracji `drizzle-kit` (migracje CLI do dodania).
- `apps/web` jest pustym szkieletem; aplikacja korzysta bezpośrednio z korzenia repo (potencjalna decyzja: czy utrzymujemy multi-app, czy upraszczamy workspace?).
- Rozjazd konfiguracji bazy: `.env.example` zakłada `postgres/postgres@jk`, natomiast `docker-compose.yml` używa `devuser/devpass@jkdb` – wymaga ujednolicenia.

## Checklisty kontrolne
- [x] Zidentyfikowano wszystkie aplikacje i pakiety w workspace.
- [x] Zweryfikowano dostępne route'y App Routera oraz endpointy API.
- [x] Uruchomiono komendy `pnpm -v`, `node -v`, `pnpm install`, `pnpm dev`.
- [ ] Ustalono jednolitą konfigurację połączenia z bazą danych (do decyzji).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Rozbieżne dane logowania do Postgresa mogą blokować uruchomienie migracji lub lokalnej instancji.
  - Brak Docker w środowisku CI/preview wymaga alternatywnego dostarczenia danych (mocki, fallbacki).
- **Decyzje do podjęcia**
  - Ujednolicenie `DATABASE_URL` vs. `docker-compose.yml` (które dane są źródłem prawdy?).
  - Czy utrzymujemy katalog `apps/web`, czy konsolidujemy aplikację w jednym package?
- **Następne kroki**
  - Przygotować dokumentację architektury i luk → patrz `ARCHITEKTURA_I_LUKI.md`.
  - Zaplanować działania MVP oraz wymagania funkcjonalne → patrz kolejne dokumenty w `docs/`.
