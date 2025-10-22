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
| `pnpm dev` | Start lokalnego serwera deweloperskiego Next.js. |
| `pnpm build` | Buduje aplikację w trybie produkcyjnym. |
| `pnpm start` | Uruchamia wcześniej zbudowaną aplikację. |
| `pnpm lint` | Sprawdza jakość kodu przy użyciu `eslint-config-next`. |
| `pnpm typecheck` | Weryfikuje typy TypeScript bez emitowania plików. |
| `pnpm test` | Uruchamia testy jednostkowe Vitest. |
| `pnpm test:coverage` | Generuje raport pokrycia testami (`coverage/`). |
| `pnpm depcheck` | Analizuje zależności i zgłasza nieużywane pakiety. |
| `pnpm qa` | Uruchamia lokalny zestaw jakościowy (`lint`, `typecheck`, `test`). |
| `pnpm qa:ci` | Uruchamia pełny zestaw CI (`lint`, `typecheck`, `build`, `test`, `test:coverage`, `test:e2e`, `depcheck`). |

### CLI jakości

Repozytorium udostępnia prostą warstwę CLI (`pnpm run cli`), która orkiestruje kroki jakościowe:

- `pnpm run cli -- --list` – lista dostępnych komend wraz z opisem.
- `pnpm qa` – skrót do `pnpm run cli -- quality` (lint + typecheck + test).
- `pnpm qa:ci` – skrót do `pnpm run cli -- quality:ci` (pełne bramki CI z Playwright).
- Flaga `--dry-run` wypisuje kolejność kroków bez ich uruchamiania, `--skip=build,e2e` pozwala pominąć wskazane kroki.

Warstwa CLI zapewnia spójność między lokalnymi kontrolami jakości a pipeline GitHub Actions.

> Przed wysłaniem PR uruchom lokalnie `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` i (opcjonalnie) `pnpm test:coverage`, aby odtworzyć pipeline CI.

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

- Testy jednostkowe uruchamiane przez `pnpm test` (`vitest.config.ts`).
- Raport pokrycia generowany przez `pnpm test:coverage` (`coverage/`).
- ESLint i TypeScript (`pnpm lint`, `pnpm typecheck`) pilnują jakości kodu.
- `pnpm depcheck` pomaga utrzymać porządek w zależnościach.

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

