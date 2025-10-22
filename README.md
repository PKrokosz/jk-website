# JK Handmade Footwear

Monorepo sklepu MTO budowanego w Next.js 14 z TypeScriptem, PostgresQL, Stripe oraz automatyzacjami n8n. Kod aplikacji znajduje się w katalogu głównym (App Router w `src/`), a pakiet Drizzle ORM w `packages/db`.

> CI/CD: workflow [`CI`](.github/workflows/ci.yml) uruchamiany na Node.js 20.x i 22.x z pnpm 10.18.x. Pipeline wykonuje lint, typecheck, testy jednostkowe, raport pokrycia i analizę zależności.

## Stos technologiczny

- **Framework**: Next.js (App Router) + React 18
- **Język**: TypeScript (tryb `strict`)
- **Pakietowanie**: pnpm workspaces + `pnpm@10.18.x`
- **Styling**: CSS Modules/SCSS-free custom styles + planowana integracja z Tailwind/shadcn/ui
- **Baza danych**: PostgreSQL 16 + Drizzle ORM (`packages/db`)
- **Warstwa backendowa**: API routes (Node.js 20 runtime)
- **Testy**: Vitest + React Testing Library (`@vitest/coverage-v8` do raportów pokrycia)
- **Jakość kodu**: ESLint (`eslint-config-next`) + `depcheck`

## Status modułów (2025-10)

| Moduł | Co zawiera | Stan |
| --- | --- | --- |
| `src/app` | App Router ze stronami `/`, `/catalog`, `/catalog/[slug]`, `/order`, `/order/native`, `/contact`, `/about`, `/account` oraz `/healthz`. | Strony produkcyjne są kompletne, a smoke test `pages.compile.test.ts` pilnuje możliwości importu każdej z nich. |
| `src/components` | Współdzielone komponenty (`Header`, `CatalogExplorer`, formularze kontaktowe i zamówień, prymitywy UI). | Kluczowe komponenty mają testy RTL (np. `ContactForm`) obejmujące walidację, stany błędów oraz telemetrię. |
| `src/lib/catalog` | Mocki katalogu (produkty, style, skóry) oraz repozytorium z fallbackiem do danych referencyjnych. | Dane referencyjne są gotowe na MVP; przełączenie na Drizzle zaplanowane po wdrożeniu migracji. |
| `src/lib/pricing` | Schematy Zod dla kalkulatora wyceny i repozytorium zapisu zapytań. | Kontrakty request/response są pokryte testami API (`/api/pricing/quote`). |
| `src/lib/navigation` & `scripts/` | Symulacje ścieżek użytkowników + skrypty CLI do agregacji wyników. | Moduły posiadają testy Vitest oraz skrypty `simulate:user-journeys`/`simulate:navigation`. |
| `packages/db` | Pakiet `@jk/db` z konfiguracją Drizzle, schematem tabel i seedem danych. | Migracja inicjalna i seed referencyjny dostępne; kolejne migracje wymagają osobnych tasków. |
| `tools/cli` | Warstwa CLI spinająca kroki jakości (`quality`, `quality:ci`). | Entrypoint testowany unitowo (list/help/dry-run, obsługa błędów) z mockiem `process.exit` i logów. |
| `docs/` | Artefakty discovery (audyt repo, roadmapa, UI tokens, plan sprintów, pętla zadań). | Dokumentacja utrzymywana w pętli – ostatni przegląd 2025-10-22. |

## Wymagania wstępne

- Node.js `>=20`
- pnpm `>=10`
- Docker + Docker Compose (dla lokalnej bazy danych)

## Struktura repozytorium

```
.
├── apps/                 # (placeholder) dodatkowe aplikacje workspace
├── docs/                 # dokumentacja discovery (strategie, roadmapy, tokeny UI)
├── packages/
│   └── db/              # współdzielony pakiet z klientem Drizzle ORM i schematem bazy
├── public/              # pliki statyczne Next.js (video, fotografie modeli)
├── src/
│   ├── app/             # routing i strony (Home, Catalog, Product, Order, Contact...)
│   ├── components/      # komponenty współdzielone (ContactForm, Order modal, Header)
│   └── lib/             # logika domenowa (katalog produktów, kalkulator wycen)
├── docker-compose.yml   # lokalny Postgres 16
└── vitest.config.ts     # konfiguracja testów jednostkowych
```

## Konfiguracja środowiska

1. Zainstaluj zależności:
   ```bash
   pnpm install
   ```
2. Zatwierdź instalację natywnych binariów wymaganych przez pnpm (lista w [`.pnpm-builds.json`](./.pnpm-builds.json)):
   ```bash
   pnpm approve-builds
   ```
3. Utwórz plik `.env.local` na podstawie `.env.example` i uzupełnij wymagane wartości.

### Zmienne środowiskowe

- `DATABASE_URL` – connection string do instancji Postgresa; domyślna wartość w repo korzysta z `devuser/devpass@jkdb` zgodnie z Docker Compose.
- Możesz zweryfikować konfigurację uruchamiając `pnpm exec tsx tools/verify-drizzle-env.ts`, który poinformuje o brakującej zmiennej `DATABASE_URL`.
- `NEXT_PUBLIC_ORDER_FORM_URL` – adres osadzanego formularza zamówień (wykorzystywany w `/order`).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – konfiguracja serwera SMTP używanego do wysyłki wiadomości z formularza kontaktowego.
- `MAIL_FROM`, `MAIL_TO` – adres nadawcy i odbiorcy wiadomości wysyłanych przez `/api/contact/submit`.
- `APP_BASE_URL` – adres aplikacji wykorzystywany do walidacji nagłówków `Origin`/`Referer` w API kontaktowym.

> **Tip:** Skopiowane z `.env.example` poświadczenia są już zgrane z `docker-compose.yml`, więc możesz bez zmian uruchomić `docker compose up -d` i korzystać z `devuser/devpass@jkdb`.

### Uruchomienie Postgresa lokalnie

Repozytorium zawiera konfigurację Docker Compose uruchamiającą Postgresa 16:

```bash
docker compose up -d
```

Po uruchomieniu serwera baza danych jest dostępna na `localhost:5432` z danymi `devuser/devpass` i bazą `jkdb`.

## Codzienna praca deweloperska

| Komenda | Opis |
| --- | --- |
| `pnpm approve-builds` | Zatwierdza instalację natywnych binariów wymaganych przez pnpm. |
| `pnpm dev` | Start lokalnego serwera deweloperskiego Next.js. |
| `pnpm build` | Buduje aplikację w trybie produkcyjnym. |
| `pnpm start` | Uruchamia wcześniej zbudowaną aplikację. |
| `pnpm lint` | Sprawdza jakość kodu przy użyciu `eslint-config-next`. |
| `pnpm typecheck` | Weryfikuje typy TypeScript bez emitowania plików. |
| `pnpm test` | Uruchamia testy jednostkowe Vitest. |
| `pnpm test:coverage` | Generuje raport pokrycia testami (`coverage/`). |
| `pnpm test:e2e` | Uruchamia scenariusze Playwright (wymaga wcześniejszego `pnpm exec playwright install --with-deps`). |
| `pnpm depcheck` | Analizuje zależności i zgłasza nieużywane pakiety. |
| `pnpm exec tsx tools/verify-drizzle-env.ts` | Szybka walidacja obecności `DATABASE_URL` w aktualnym środowisku. |
| `pnpm qa` | Skrót do `pnpm run cli -- quality` (lint + typecheck + test). |
| `pnpm qa:ci` | Skrót do `pnpm run cli -- quality:ci` (pełne bramki CI z Playwright i depcheck). |
| `pnpm simulate:user-journeys` | Uruchamia symulacje ścieżek użytkowników na podstawie modułu `src/lib/navigation`. |
| `pnpm simulate:navigation` | Agreguje dane przejść na grafie nawigacji (obsługuje flagi `--config`, `--user-count`, `--summary`). |
| `pnpm db:generate` | Generuje migrację Drizzle na podstawie zmian w schemacie. |
| `pnpm db:migrate` | Stosuje migracje Drizzle na wskazanej bazie danych. |
| `pnpm db:seed` | Uruchamia seed danych z pakietu `@jk/db`. |

### CLI jakości

Repozytorium udostępnia warstwę CLI (`pnpm run cli`), która orkiestruje kroki jakościowe i udostępnia flagi ułatwiające automatyzację:

- `pnpm run cli -- --list` – lista dostępnych komend wraz z opisem.
- `pnpm run cli -- quality` – pełny przebieg lint + typecheck + test (skrót dostępny jako `pnpm qa`).
- `pnpm run cli -- quality:ci` – pipeline CI (lint, typecheck, build, test, coverage, e2e, depcheck; skrót `pnpm qa:ci`).
- `--dry-run` wypisuje kolejność kroków bez ich uruchamiania, `--skip=build,e2e` pozwala pominąć wskazane kroki.

Obie komendy jakości rozpoczynają się od kroku `Verify Drizzle env`, który uruchamia `tools/verify-drizzle-env.ts` i sprawdza, czy w środowisku znajduje się `DATABASE_URL`. Dzięki temu brak konfiguracji bazy jest raportowany zanim wystartuje lint czy testy.

Testy CLI mockują `process.exit` i logi, dzięki czemu zachowania są weryfikowane bez kończenia procesu Node.js.

> Przed wysłaniem PR uruchom lokalnie `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` i (opcjonalnie) `pnpm test:coverage`, aby odtworzyć pipeline CI.

### Symulacje nawigacji

- W katalogu `config/` znajdziesz przykład `navigation-weights.example.json` z komentarzami `_comment` opisującymi format (klucz źródłowy → klucz docelowy → waga dodatnia).
- Sklonuj plik do własnej konfiguracji, np. `cp config/navigation-weights.example.json config/navigation-weights.local.json`, a następnie dodaj do `.env.local` wpis `NAVIGATION_WEIGHTS_PATH=config/navigation-weights.local.json`.
- Aby zweryfikować konfigurację bez modyfikowania `.env.local`, uruchom `pnpm simulate:navigation --config <ścieżka> [--user-count <liczba>] [--summary]`, który ładuje wskazany plik przez `buildNavigationGraph` i wypisuje wynik symulacji (opcja `--summary` dodaje zestawienie liczby przejść na każdej krawędzi).

## Pakiet `@jk/db`

W katalogu `packages/db` znajduje się pakiet z konfiguracją Drizzle ORM. Biblioteka eksportuje:

- `db` – instancję klienta Drizzle powiązaną z pulą połączeń `pg`,
- `pool` – pulę połączeń `pg` dla bardziej niskopoziomowych operacji,
- `schema` – definicje tabel i modeli bazy (eksportowane z `src/schema.ts`).

Pakiet korzysta z `dotenv`, aby wczytać zmienne środowiskowe. Brak zdefiniowanej zmiennej `DATABASE_URL` spowoduje błąd uruchomienia.

Do generowania i stosowania migracji wykorzystaj `drizzle-kit` skonfigurowany w [`drizzle.config.ts`](./drizzle.config.ts):

```bash
pnpm db:generate   # generuje migrację na podstawie zmian w schema
pnpm db:migrate    # uruchamia wygenerowane migracje na bazie wskazanej przez DATABASE_URL
```

## Funkcjonalności aplikacji

- **Strona główna (`/`)** – hero z wideo, sekcja procesu MTO, carousel selling points, portfolio modeli, kalkulator wyceny oraz CTA do formularza zamówień.
- **Katalog (`/catalog`)** – lista produktów w oparciu o mocki (`src/lib/catalog`), filtry stylów/skór, sortowanie i stany pusty/loading.
- **Strona produktu (`/catalog/[slug]`)** – breadcrumbs, galeria, warianty personalizacji, CTA do modala zamówienia i linków do `/order/native` oraz `/contact`.
- **Kontakt (`/contact`)** – sekcja hero z danymi pracowni, formularz kontaktowy z walidacją oraz statusami sukces/błąd, linki do sociali.
- **Zamówienie (`/order`, `/order/native`)** – osadzony formularz natywny (`NEXT_PUBLIC_ORDER_FORM_URL`) i fallback link do pełnej wersji.
- **API** – mockowane endpointy `/api/styles`, `/api/leather`, `/api/pricing/quote`, `/api/contact/submit` oraz health-check `/healthz`.

## Testy i jakość kodu

- `pnpm test` uruchamia pakiet testów Vitest obejmujący strony App Routera, komponenty kontaktu, prymitywy UI oraz warstwę CLI.
- `pnpm test:coverage` generuje raport pokrycia (`coverage/`) na bazie `@vitest/coverage-v8`.
- `pnpm test:e2e` wykonuje scenariusze Playwright (pobranie dokumentów prawnych + smoke test nawigacji i API katalogu; przed pierwszym uruchomieniem zainstaluj przeglądarki: `pnpm exec playwright install --with-deps`).
- Linting (`pnpm lint`), statyczna analiza typów (`pnpm typecheck`) i kontrola zależności (`pnpm depcheck`) odtwarzają etapy pipeline CI.
- Dla modułu nawigacji dostępne są dodatkowe symulacje (`pnpm simulate:*`) z testami snapshotowymi agregacji przejść.

## Dokumentacja produktu i procesu

Repozytorium zawiera katalog `docs/` z najważniejszymi artefaktami discovery. Kluczowe pliki:

- [`docs/README_DOCS.md`](./docs/README_DOCS.md) – indeks dokumentacji i wskazówki dotyczące aktualizacji.
- [`docs/PLAN_MVP_SPRINTS.md`](./docs/PLAN_MVP_SPRINTS.md) – plan iteracji oraz status postępu.
- [`docs/SITE_MAP.md`](./docs/SITE_MAP.md) – mapa ekranów wraz z przepływami użytkownika.
- [`docs/UI_TOKENS.md`](./docs/UI_TOKENS.md) – aktualna paleta kolorów, typografia i komponenty UI.
- [`docs/JAKOSC_TESTY_CI.md`](./docs/JAKOSC_TESTY_CI.md) – standardy jakości i konfiguracja CI.

Aktualizuj dokumenty wraz z każdą decyzją produktową lub zmianą w implementacji, aby zespół miał jedno źródło prawdy.

## Kierunek rozwoju

- Wyrównanie konfiguracji bazy (`DATABASE_URL` vs `docker-compose.yml`) i dodanie migracji `drizzle-kit` **(zrealizowane: migracja inicjalna + seed referencyjny).**
- Poszerzenie katalogu mocków o nowe modele oraz dynamiczne assety.
- Integracja z Stripe/n8n po ustabilizowaniu formularzy zamówień.
- Podpięcie API Next.js do pakietu `@jk/db` (Style/Leather) i zastąpienie mocków zapytaniami do bazy.
- Doprecyzowanie roadmapy testów end-to-end (Playwright).

