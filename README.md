# JK Handmade Footwear

Repozytorium sklepu MTO „JK Handmade Footwear” zbudowanego na Next.js 14 (App Router) i TypeScript. Monorepo pnpm obejmuje frontend, API App Routera, pakiet Drizzle ORM (`@jk/db`), narzędzia CLI oraz dokumentację discovery – wszystkie elementy korzystają z jednego procesu jakościowego.

> **CI/CD**: workflow [`CI`](.github/workflows/ci.yml) działa na Node.js 20.x i 22.x z `pnpm@10.18.3`. Pipeline instaluje zależności, uruchamia lint, typecheck, build, testy Vitest (wraz z raportem pokrycia), scenariusze Playwright, depcheck oraz – na macierzy 20.x – migracje i seed bazy Postgres.

## Stos technologiczny

- **Framework**: Next.js (App Router) + React 18
- **Język**: TypeScript (`strict`)
- **Pakietowanie**: pnpm workspaces + `pnpm@10.18.x`
- **Styling**: Custom CSS i design tokens w `src/app/globals.css` (docelowo eksportowane z `docs/UI_TOKENS.md`, planowana integracja z Tailwind/shadcn/ui)
- **Baza danych**: PostgreSQL 16 (Docker Compose) + Drizzle ORM (`packages/db`)
- **Warstwa backendowa**: API routes App Routera (runtime Node.js 20) + helper `getNextDbClient`
- **Testy**: Vitest + React Testing Library (`@vitest/coverage-v8`), Playwright, testy integracyjne Drizzle
- **Jakość kodu**: ESLint (`eslint-config-next`), `depcheck`, autorski CLI jakości (`pnpm qa`, `pnpm qa:ci`)

## Status modułów (2025-11)

| Moduł | Co zawiera | Stan |
| --- | --- | --- |
| `src/app` | Landing (`/`), katalog (`/catalog`, `/catalog/[slug]`), koszyk (`/cart`), flow zamówień (`/order`, `/order/native`, `/order/cart`, `/order/thanks`), kontakt (`/contact`), B2B (`/group-orders`), konto (`/account`), health-check (`/healthz`), materiały prawne (`/privacy-policy`, `/terms`), sitemap/robots. | Test `src/app/__tests__/pages.compile.test.ts` pilnuje importowalności stron; Playwright smoke przechodzi najważniejsze widoki i endpointy. |
| `src/components` | Współdzielone komponenty (nagłówek, stopka, katalog, formularze, CTA, prymitywy UI). | Kluczowe moduły (`ContactForm`, `OrderButton`, `CatalogExplorer`) mają testy RTL i są objęte bramką pokrycia 85%. |
| `src/app/components` | Sekcje layoutu App Routera (hero, proces MTO, sekcje CTA, listingi). | Importowane w stronach landingowych, pokryte snapshotami/aria. |
| `src/lib/catalog` | Repozytorium Drizzle, fallback danych, schematy Zod oraz helper `resolveCatalogCache`. | Endpointy katalogu degradują się do fallbacku przy braku `DATABASE_URL`; testy jednostkowe, kontraktowe i integracyjne (z realnym Drizzle) weryfikują flow. |
| `src/lib/pricing` | Schematy zapytań/odpowiedzi, repozytorium logów wycen i helpery integracji. | Testy API `/api/pricing/quote` obejmują poprawne odpowiedzi i scenariusze błędnej konfiguracji środowiska. |
| `src/lib/navigation` & `scripts/` | Symulator ścieżek użytkowników oraz CLI do agregacji wyników (`simulate:*`). | Vitest pokrywa brak cykli i walidację wag; snapshoty agregacji aktualizują się wraz z konfiguracją. |
| `src/lib/legal` | Helpery do generowania treści prawnych i raportowania telemetryjnego. | Jednostkowe testy sprawdzają routingi oraz fallback linków. |
| `packages/db` | Pakiet `@jk/db` z konfiguracją Drizzle, migracjami i seedem danych referencyjnych. | Migracja inicjalna i seed są zsynchronizowane; CI weryfikuje metadane Drizzle (`pnpm db:generate`). |
| `tools/cli` | CLI (`quality`, `quality:ci`) spinające lint, typecheck, testy, build, Playwright, depcheck i sprzątanie bazy. | Testy mockują logi/`process.exit`, CLI ładuje `.env.local`/`.env`/`.env.example` przed walidacją środowiska. |
| `docs/` | Artefakty discovery (audyt repo, roadmapa, tokeny UI, pętla zadań, checklisty QA/SEO). | Indeks `docs/README_DOCS.md` aktualny na 2025-10-29; każda aktualizacja dokumentu wymaga dopisku sekcji meta. |

## Wymagania wstępne

- Node.js `>=20`
- pnpm `>=10`
- Docker + Docker Compose (instancja Postgres `jkdb`)

## Struktura repozytorium

```
.
├── apps/                   # (rezerwacja) dodatkowe aplikacje pnpm workspace
├── config/                 # Konfiguracje narzędzi (np. wagi symulacji nawigacji)
├── docs/                   # Dokumentacja discovery i checklisty
├── packages/
│   └── db/                # Pakiet @jk/db z Drizzle ORM, migracjami i seedem
├── public/                # Statyczne zasoby (wideo, fotografie modeli, ikonografia)
├── scripts/               # Skrypty CLI/automation (`simulate-navigation`, helpery QA)
├── src/
│   ├── app/               # Routing, strony i komponenty layoutu App Routera
│   ├── components/        # Współdzielone komponenty UI
│   ├── lib/               # Logika domenowa (katalog, pricing, contact, legal, telemetry)
│   └── tests/             # Helpery integracyjne (m.in. obsługa Drizzle w testach)
├── tools/                 # CLI jakości (`tools/cli`) i skrypty środowiskowe
├── docker-compose.yml     # Lokalny Postgres 16 (serwis `jkdb`)
└── vitest.config.ts       # Konfiguracja testów jednostkowych
```

## Konfiguracja środowiska

1. Zainstaluj zależności:
   ```bash
   pnpm install
   ```
   > **Uwaga:** Katalog główny workspace'u musi utrzymywać devDependency `drizzle-orm`. To zależność wymagana przez `drizzle-kit`, aby `pnpm db:generate` mogło zaciągnąć wersję ORM i przejść weryfikację kompatybilności.
2. Zatwierdź instalację natywnych binariów:
   ```bash
   pnpm approve-builds
   ```
3. (Opcjonalnie) Skopiuj konfiguracje środowiska, jeśli chcesz od razu nadpisać wartości domyślne:
   ```bash
   cp .env.example .env.local
   cp .env.test.example .env.test   # opcjonalnie, jeśli uruchamiasz testy integracyjne
   ```
   > Skrypt weryfikujący środowisko samodzielnie wczytuje `.env.local`, `.env` oraz `.env.example`, dlatego pierwszy start projektu nie wymaga ręcznego kopiowania zmiennych.
4. (Opcjonalnie) Uruchom walidację środowiska:
   ```bash
   pnpm exec tsx tools/verify-drizzle-env.ts
   ```

### Zmienne środowiskowe

- `DATABASE_URL` – connection string do Postgresa (`postgres://devuser:devpass@localhost:5432/jkdb`).
- `NEXT_PUBLIC_ORDER_FORM_URL` – adres natywnego formularza zamówień (`/order`, modal produktu).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – konfiguracja wysyłki maili w `/api/contact/submit`.
- `MAIL_FROM`, `MAIL_TO` – adresy nadawcy i odbiorcy formularza kontaktowego.
- `APP_BASE_URL` – adres aplikacji używany do walidacji `Origin`/`Referer` i generowania absolutnych URL (sitemap, e-maile).
- `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` – identyfikatory skryptów marketingowych.
- `NAVIGATION_WEIGHTS_PATH` / `NAVIGATION_WEIGHTS_JSON` – opcjonalne źródło wag dla symulatora nawigacji (`pnpm simulate:navigation`).

`tools/verify-drizzle-env.ts` raportuje brakujące wartości, podpowiada przykładowe wpisy, automatycznie ładuje `.env.local`, `.env` i `.env.example`, a także porównuje `DATABASE_URL` z konfiguracją Dockera. Dzięki temu pierwsze uruchomienie projektu nie wymaga wcześniejszego kopiowania zmiennych — wystarczy w razie potrzeby nadpisać je lokalnie. Skrypt działa jako pierwszy krok komend `pnpm qa` i `pnpm qa:ci`.

### Uruchomienie Postgresa lokalnie

```bash
docker compose up -d jkdb
```

Po uruchomieniu baza jest dostępna na `localhost:5432` (`devuser/devpass`, baza `jkdb`). Po zakończeniu pracy zatrzymaj kontener i usuń wolumeny:

```bash
docker compose down --volumes jkdb
```

> **Tip:** Testy integracyjne oraz pipeline CI zakładają, że wykonano `pnpm db:migrate` i `pnpm db:seed` na działającym serwisie `jkdb`.

## Codzienna praca deweloperska

| Komenda | Opis |
| --- | --- |
| `pnpm approve-builds` | Zatwierdza instalację natywnych binariów wymaganych przez pnpm. |
| `pnpm dev` | Start lokalnego serwera deweloperskiego Next.js. |
| `pnpm build` | Buduje aplikację w trybie produkcyjnym. |
| `pnpm start` | Uruchamia wcześniej zbudowaną aplikację. |
| `pnpm lint` | Uruchamia ESLint (`eslint-config-next`). |
| `pnpm typecheck` | Sprawdza typy TypeScript bez emisji plików. |
| `pnpm test` | Uruchamia testy Vitest (tryb jednorazowy). |
| `pnpm test:watch` | Uruchamia Vitest w trybie watch dla szybkiego feedbacku. |
| `pnpm test:coverage` | Generuje raport pokrycia (`coverage/`). |
| `pnpm test:ci` | Vitest w trybie CI (reporter `dot`, próg pokrycia 85%). |
| `pnpm test:integration` | Testy Drizzle na realnej bazie (`jkdb`, `.env.test`). |
| `pnpm test:e2e` | Scenariusze Playwright (najpierw `pnpm exec playwright install --with-deps`). |
| `pnpm depcheck` | Analiza nieużywanych zależności. |
| `pnpm exec tsx tools/verify-drizzle-env.ts` | Walidacja konfiguracji środowiskowej i spójności z Docker Compose. |
| `pnpm qa` | `pnpm run cli -- quality` – lint + typecheck + test. |
| `pnpm qa:ci` | `pnpm run cli -- quality:ci` – pełen pipeline (lint, typecheck, build, test, coverage, Playwright, depcheck, sprzątanie DB). |
| `pnpm run cli -- --list` | Lista dostępnych komend CLI i opis kroków. |
| `pnpm simulate:user-journeys` | Symulacje ścieżek użytkowników (`src/lib/navigation`). |
| `pnpm simulate:navigation` | Agregacja przejść na grafie nawigacji (obsługa `--config`, `--user-count`, `--summary`). |
| `pnpm db:generate` | Generuje migrację Drizzle na podstawie zmian w schema. |
| `pnpm db:migrate` | Stosuje migracje na bazie wskazanej przez `DATABASE_URL`. |
| `pnpm db:seed` | Uruchamia seed danych z pakietu `@jk/db`. |

### CLI jakości

- `pnpm run cli -- quality` – lint + typecheck + test (skrót `pnpm qa`).
- `pnpm run cli -- quality:ci` – pełny pipeline (lint, typecheck, build, test, coverage, Playwright, depcheck; skrót `pnpm qa:ci`).
- CLI ładuje kolejno `.env.local`, `.env`, a następnie `.env.example` zanim wystartuje krok „Verify Drizzle env”.
- `--dry-run` wypisuje kolejność kroków bez ich uruchamiania, a `--skip=<id>` pozwala pominąć wskazane kroki (np. `--skip=build,e2e`).
- Po scenariuszu Node 20 CLI wywołuje `docker compose down --volumes jkdb`; krok można pominąć flagą `--skip=cleanup-node20-db`.

Testy CLI mockują `process.exit` i logi, dzięki czemu zachowania są weryfikowane bez kończenia procesu Node.js.

### Symulacje nawigacji

- W katalogu `config/` znajduje się `navigation-weights.example.json` z komentarzami `_comment` opisującymi format (źródło → cel → waga dodatnia).
- Aby przygotować własną konfigurację, skopiuj przykład i ustaw `NAVIGATION_WEIGHTS_PATH` w `.env.local`.
- `pnpm simulate:navigation --config <ścieżka> [--user-count <liczba>] [--summary]` pozwala testować konfiguracje bez modyfikacji `.env.local`.

## Pakiet `@jk/db`

Pakiet `packages/db` dostarcza instancję Drizzle, pulę `pg` i definicje schematów. Wykorzystuje `dotenv`, więc brak `DATABASE_URL` powoduje błąd uruchomienia.

Migracje obsługiwane są przez `drizzle-kit` skonfigurowany w [`drizzle.config.ts`](./drizzle.config.ts):

```bash
pnpm db:generate   # generuje migrację na podstawie zmian w schema
pnpm db:migrate    # uruchamia wygenerowane migracje na bazie wskazanej przez DATABASE_URL
pnpm db:seed       # zasila bazę danymi referencyjnymi
```

> **Log `pnpm db:generate` (2025-10-22):**
>
> ```text
> $ pnpm db:generate
> No config path provided, using default 'drizzle.config.ts'
> Reading config file '/workspace/jk-website/drizzle.config.ts'
> This version of drizzle-kit is outdated
> Please update drizzle-kit package to the latest version 👍
>  ELIFECYCLE  Command failed with exit code 1.
> ```
>
> Log potwierdza, że skrypt przechodzi walidację kompatybilności z `drizzle-orm`, a ewentualne błędy wynikają z wymogu aktualizacji `drizzle-kit` do wersji zgodnej z `compatibilityVersion` ORM.

## Funkcjonalności aplikacji

- **Strona główna (`/`)** – hero z wideo, proces MTO, carousel selling points, portfolio modeli, kalkulator wyceny, CTA do zamówień i kontaktu.
- **Katalog (`/catalog`)** – lista produktów z filtrami stylów/skór, sortowaniem, stanami loading/empty oraz fallbackiem danych.
- **Strona produktu (`/catalog/[slug]`)** – breadcrumbs, galeria, warianty personalizacji, CTA do modala zamówień i linków do `/order/native` i `/contact`.
- **Koszyk (`/cart`)** – podsumowanie zamówienia bespoke, CTA do formularza i sekcja FAQ.
- **Zamówienia (`/order`, `/order/native`, `/order/cart`, `/order/thanks`)** – natywny formularz (`NEXT_PUBLIC_ORDER_FORM_URL`), fallbacki i potwierdzenia flow.
- **Zamówienia grupowe (`/group-orders`)** – landing B2B z opisem procesu i CTA do kontaktu.
- **Kontakt (`/contact`)** – sekcja hero, formularz kontaktowy z walidacją i statusami sukces/błąd, linki do social media.
- **Konto (`/account`)** – placeholder panelu użytkownika z komponentami logowania i roadmapą funkcji.
- **Materiały prawne (`/privacy-policy`, `/terms`)** – treści compliance dostępne z poziomu stopki i e-maili.
- **API** – `/api/products`, `/api/products/[slug]`, `/api/styles`, `/api/leather`, `/api/pricing/quote`, `/api/contact/submit`, `/healthz`. Endpointy katalogu korzystają z `getNextDbClient` i degradują się do fallbacku, jeśli brak `DATABASE_URL`.

## Testy i jakość kodu

- `pnpm test` uruchamia scenariusze Vitest (strony, komponenty, katalog, CLI, helpery domenowe).
- `pnpm test:watch` wspiera szybki feedback podczas pracy nad komponentami/API.
- `pnpm test:coverage` generuje raport (`coverage/`) przy użyciu `@vitest/coverage-v8`.
- `pnpm test:ci` (uruchamiane też w CI) wykorzystuje reporter `dot` i weryfikuje próg pokrycia 85% Statements/Lines.
- `pnpm test:e2e` odpala Playwright (nawigacja po głównych stronach, health-checki API, dokumenty prawne). Przed pierwszym runem: `pnpm exec playwright install --with-deps`.
- `pnpm test:integration` korzysta z `.env.test` i helpera `src/tests/integration/db.ts`, aby wykonać zapytania na realnej bazie (`docker compose up -d jkdb`, `pnpm db:migrate`, `pnpm db:seed`).
- `pnpm depcheck`, `pnpm lint` i `pnpm typecheck` odtwarzają etapy pipeline CI.
- Dodatkowe symulacje nawigacji (`pnpm simulate:*`) mają testy snapshotowe weryfikujące konfiguracje wag i brak cykli.
- Brak devDependency `drizzle-orm` w katalogu głównym blokuje krok migracji w `pnpm db:generate` (oraz w bramce jakości `pnpm qa` opisanej w `AGENTS.md`), ponieważ CLI Drizzle wymaga lokalnego importu modułu `drizzle-orm/version`.

### Jak uruchamiać testy i utrzymać pokrycie

- Do pracy lokalnej używaj `pnpm test:watch`; przed PR uruchom `pnpm lint`, `pnpm typecheck`, `pnpm test:ci`, `pnpm build` i – opcjonalnie – `pnpm test:coverage`.
- Globalne pokrycie Statements/Lines utrzymujemy na poziomie **≥85%**. Spadek poniżej progu zatrzymuje job CI.
- Raport Playwright jest zapisywany w `playwright-report/` i publikowany jako artefakt CI.

## Dokumentacja produktu i procesu

Najważniejsze pliki w katalogu `docs/`:

- [`docs/README_DOCS.md`](./docs/README_DOCS.md) – indeks dokumentacji i statusy aktualizacji.
- [`docs/PLAN_MVP_SPRINTS.md`](./docs/PLAN_MVP_SPRINTS.md) – roadmapa iteracji.
- [`docs/WYMAGANIA_MVP.md`](./docs/WYMAGANIA_MVP.md) – wymagania funkcjonalne MVP.
- [`docs/SITE_MAP.md`](./docs/SITE_MAP.md) – mapa ekranów i ścieżek użytkowników.
- [`docs/UI_TOKENS.md`](./docs/UI_TOKENS.md) – design tokens i plan migracji do custom properties.
- [`docs/JAKOSC_TESTY_CI.md`](./docs/JAKOSC_TESTY_CI.md) – standardy jakości, próg pokrycia i checklisty PR.
- [`docs/LOOP_TASKS.md`](./docs/LOOP_TASKS.md) – pętla zadań transformacyjnych (`x`, `-x`, `1/x`, `x²`, `xˣ`).
- [`docs/DANE_I_API_MVP.md`](./docs/DANE_I_API_MVP.md) – modele danych, kontrakty API, fallback katalogu.

Aktualizując kod lub proces, zsynchronizuj odpowiednie dokumenty i uzupełnij sekcje meta audytu.

## Kierunek rozwoju

- Przenieść product templates do migracji i seedów Drizzle oraz utrzymać spójność z fallbackiem katalogu.
- Zintegrować backend formularza zamówień i kontaktu (np. n8n/SMTP), uzupełnić materiały legal (RODO, polityka, regulamin).
- Migrować design tokens do dedykowanych zmiennych i przygotować eksport do Tailwind/shadcn/ui.
- Rozszerzyć testy e2e o pełne flow zamówienia (modal → koszyk → zamówienie → potwierdzenie) i metryki konwersji.
- Zautomatyzować checklistę dokumentacyjną (`docs/README_DOCS.md`) oraz monitoring health-checków katalogu.
