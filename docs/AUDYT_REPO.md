# Audyt repozytorium

> **Status aktualizacji**: 2025-10-29 — uzupełniono o strony `group-orders`, `cart`, dokumenty prawne oraz nowy audyt meta dokumentów.

## Meta audytu 2025-10-29
- **Status zagadnień**: Najważniejsze luki z poprzedniej iteracji pozostają otwarte (migracje Drizzle, adopcja tokens, backend leadów). Dodano potwierdzenie, że nowe strony (`group-orders`, `cart`, `privacy-policy`, `terms`) i pliki SEO (`sitemap.ts`, `robots.ts`) są w repo i wymagają utrzymania. Audyt środowiska i komend jest aktualny.
- **Nowe ścieżki rozwoju**:
  - Przygotować zadanie na migrację inicjalną Drizzle + seed (`docs/LOOP_TASKS.md` → `x₃` follow-up) oraz zsynchronizować z `DANE_I_API_MVP.md`.
  - Uprawomocnić istnienie katalogu `apps/web` (usunąć lub wypełnić) i opisać decyzję w README/planie.
  - Dopisać do pętli zadanie monitorujące spójność nowych stron prawnych/marketingowych z sitemapą.
- **Rekomendacja archiwizacji**: Nie — dokument to główna mapa repozytorium.
- **Sens dokumentu**: Dostarcza snapshot struktury monorepo, listy stron/API oraz środowiska uruchomieniowego. Służy jako punkt startowy dla nowych agentów i podczas audytów.
- **Aktualizacje wykonane**:
  - Zaktualizowano listę stron, komponentów i endpointów o `group-orders`, `cart`, `privacy-policy`, `terms`, `robots.ts`, `sitemap.ts`, `/api/contact/submit`, `/api/order/submit`, `/api/legal/[document]`.
  - Wskazano otwarte decyzje (Drizzle, workspace) jako follow-upy w `docs/LOOP_TASKS.md`.
  - Zsynchronizowano status z dokumentem zbiorczym `docs/README_DOCS.md`.

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Struktura monorepo](#struktura-monorepo)
- [3. Istniejące strony, komponenty i endpointy](#istniejace-strony-komponenty-i-endpointy)
- [4. Środowisko i komendy diagnostyczne](#srodowisko-i-komendy-diagnostyczne)
- [5. Rozjazdy wersji i obserwacje](#rozjazdy-wersji-i-obserwacje)
- [6. Checklisty kontrolne](#checklisty-kontrolne)
- [7. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Monorepo oparte o pnpm workspaces, z główną aplikacją Next.js 14 w katalogu głównym (`src/app`) i pakietem współdzielonym `@jk/db`.
- Routing App Routera obejmuje Home, Catalog (z filtrami), Product (dynamiczny slug), About, Contact (formularz), Order (iframe + fallback), Group Orders, Cart (prefill koszyka), Account (mock panel klienta), strony prawne (`/privacy-policy`, `/terms`) oraz healthcheck `/healthz`.
- Mockowane dane katalogowe (`src/lib/catalog`) rozszerzono o slug, warianty, funnel stage i referencje do formularza natywnego; nadal czekają na migrację do Drizzle.
- Konfiguracja środowiska ujednolicono: `.env.example` i `docker-compose.yml` korzystają z tych samych poświadczeń, dostępne są migracje startowe w `drizzle/` oraz skrypt seeda `pnpm db:seed`.

## Struktura monorepo
- **Apps**
  - `apps/web/` – placeholder (aktualnie nieużywany, tylko `next-env.d.ts`).
- **Packages**
  - `packages/db/` – pakiet Drizzle ORM (schemat bazy, klient PG, własny `docker-compose.yml`).
- **Kluczowe katalogi**
  - `src/app/` – App Router, globalne style, komponenty page-level (`about`, `account`, `catalog`, `contact`, `order`, `api/*`).
  - `src/app/catalog/[slug]/` – dynamiczna strona produktu z generowaniem metadata i breadcrumbs.
  - `src/components/` – komponenty współdzielone (`Header`, `NavLink`, `contact/ContactForm`, `ui/order/*`).
  - `src/lib/` – logika domenowa (`catalog`, `pricing`, konfiguracje order models/accessories).
  - `public/` – zasoby statyczne (wideo hero, zdjęcia modeli, grafiki portfolio).
  - `vitest.setup.ts`, `vitest.config.ts` – konfiguracja testów.

## Istniejące strony, komponenty i endpointy
- **Strony (App Router)**
  - `/` – strona główna z hero video, procesem MTO, portfolio, kalkulatorem i CTA do zamówień.
  - `/catalog` – katalog z filtrami styl/skóra, sortowaniem, stanem pustym i skeletonem.
  - `/catalog/[slug]` – strona produktu (galeria, warianty personalizacji, CTA do modala zamówienia i linków `/order/native` `/contact`).
-  - `/order` – osadzony formularz natywny (iframe) z fallbackiem do pełnej wersji oraz metadata canonical.
-  - `/order/native` – landing z listą modeli i CTA do zewnętrznego formularza.
-  - `/cart` – wizualizacja zamówienia z możliwością edycji parametrów i CTA do kontaktu.
-  - `/contact` – rozbudowana strona kontaktowa z hero, danymi pracowni, formularzem i statusami.
-  - `/group-orders` – landing B2B dla zamówień grupowych.
-  - `/account` – mock panel klienta z rejestracją, logowaniem, historią zamówień i newsletterem.
- `/about` – sekcja o pracowni z finalnym copy i CTA do kontaktu/zamówienia.
- `/privacy-policy`, `/terms` – strony prawne z finalnymi tekstami.
- `/healthz` – endpoint statusowy (API route `route.ts`).
- **Endpointy API**
  - `GET /api/styles` – zwraca mockowane style (`catalogStyles`).
  - `GET /api/leather` – zwraca mockowane skóry (`catalogLeathers`).
  - `GET /api/products` – lista produktów katalogu (mock + Drizzle fallback).
  - `POST /api/pricing/quote` – kalkulator wyceny wykorzystujący `calculateQuote` i zapisujący logi do `quote_requests`.
  - `POST /api/contact/submit` – obsługa leadów z formularza kontaktowego (walidacja Zod, rate-limit, SMTP mock).
  - `POST /api/order/submit` – obsługa leadów ze strony zamówienia natywnego.
  - `GET /api/legal/[document]` – serwuje dokumenty prawne w formacie PDF/HTML.
- **Komponenty kluczowe**
  - `Header` + `NavLink` – globalna nawigacja sticky ze skip linkiem (`layout.tsx`).
  - `CatalogExplorer` – klientowy komponent katalogu (filtry, sortowanie, aria-live, skeletony).
  - `ContactForm` – formularz z walidacją, stanami `idle/submitting/success/error` i linkiem mailto.
  - `OrderModalTrigger` – przycisk otwierający modal z CTA do formularza natywnego.
  - `PricingCalculator` – komponent kalkulatora wyceny współdzielony na stronie głównej.

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

  ╭ Warning ─────────────────────────────────────────────────────────────────────────╮
  │                                                                                  │
  │   Ignored build scripts: esbuild, unrs-resolver.                                 │
  │   Run "pnpm approve-builds" to pick which dependencies should be allowed.       │
  │                                                                                  │
  ╰──────────────────────────────────────────────────────────────────────────────────╯

  Done in 3.2s using pnpm v10.18.3
  ```
- **Pakiet skryptów**
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `pnpm depcheck`, `pnpm build` – odzwierciedlają kroki pipeline.
- **Plik `.env`**
  - Skopiowano `.env.example` → `.env.local`.
- Dostępne zmienne: `DATABASE_URL=postgres://devuser:devpass@localhost:5432/jkdb`, `NEXT_PUBLIC_ORDER_FORM_URL=<embed url>`.
  - Pakiet `@jk/db` czyta `DATABASE_URL` (w `packages/db/src/lib/db.ts`).
- **Docker Compose**
  - Uruchomienie `docker compose config` nie powiodło się (Docker nie jest dostępny w sandboxie):
    ```bash
    docker compose config
    bash: command not found: docker
    ```
  - `docker-compose.yml` w repo głównym oraz w `packages/db` definiują usługę Postgresa nasłuchującą na `5432`, z danymi `devuser/devpass`, baza `jkdb`.
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
- Drizzle ORM (`0.34.1`) w pakiecie `@jk/db`; dostępna konfiguracja `drizzle.config.ts`, ale nadal brak wygenerowanych migracji.
- `apps/web` jest pustym szkieletem; aplikacja korzysta z katalogu głównego – do decyzji, czy utrzymujemy multi-app, czy porządkujemy workspace.
- Konfiguracja bazy została ujednolicona: `.env.example` i `docker-compose.yml` wskazują na `devuser/devpass@jkdb`.
- Globalny motyw wizualny wykorzystuje jasną paletę (#f8f5f2 tło), która różni się od pierwotnych założeń w discovery – UI tokens zaktualizowane w `docs/UI_TOKENS.md`.

## Checklisty kontrolne
- [x] Zidentyfikowano wszystkie aplikacje i pakiety w workspace.
- [x] Zweryfikowano dostępne route'y App Routera oraz endpointy API.
- [x] Uruchomiono komendy `pnpm -v`, `node -v`, `pnpm install`, `pnpm dev`.
- [x] Ustalono jednolitą konfigurację połączenia z bazą danych.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Konieczne jest zsynchronizowanie nowych danych logowania z istniejącymi środowiskami developerskimi, aby uniknąć niespójności.
  - Brak migracji Drizzle utrudni przejście z mocków na realne dane.
  - Motyw wizualny wymaga re-użycia tokens w CSS, aby uniknąć rozjazdów.
- **Decyzje do podjęcia**
  - Potwierdzenie, że `devuser/devpass@jkdb` jest akceptowalne poza lokalnym Dockerem (np. dla stagingu) oraz aktualizacja secrets CI.
  - Czy utrzymujemy katalog `apps/web`, czy konsolidujemy aplikację w jednym package?
  - Strategia migracji z mocków (`src/lib/catalog`) na Drizzle.
- **Następne kroki**
  - Przygotować dokumentację architektury i luk → patrz `ARCHITEKTURA_I_LUKI.md`.
  - Zaplanować działania MVP oraz wymagania funkcjonalne → patrz kolejne dokumenty w `docs/`.
