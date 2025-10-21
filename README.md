# JK Handmade Footwear

Monorepo sklepu MTO budowanego w Next.js 14 z TypeScriptem, PostgresQL, Stripe oraz automatyzacjami n8n.

> CI: patrz workflow [`CI`](.github/workflows/ci.yml) uruchamiany na Node.js 20 z pnpm 10.18.x dla buildów, lintów i kontroli zależności.

## Stos technologiczny

- **Framework**: Next.js (App Router) + React 18
- **Język**: TypeScript (tryb `strict`)
- **Pakietowanie**: pnpm workspaces + `pnpm@10.18.x`
- **Styling**: Tailwind CSS + planowana integracja z shadcn/ui
- **Baza danych**: PostgreSQL 16 + Drizzle ORM
- **Warstwa backendowa**: Node.js 20
- **Testy**: Vitest (`@vitest/coverage-v8` do raportów pokrycia)
- **Jakość kodu**: ESLint (`eslint-config-next`)

## Wymagania wstępne

- Node.js `>=20`
- pnpm `>=10`
- Docker + Docker Compose (dla lokalnej bazy danych)

## Struktura repozytorium

```
.
├── apps/
│   └── web/            # entrypoint Next.js (App Router)
├── docs/               # dokumentacja discovery (strategie, roadmapy, tokeny UI)
├── packages/
│   └── db/             # współdzielony pakiet z klientem Drizzle ORM i schematem bazy
├── public/             # pliki statyczne Next.js
├── src/
│   ├── app/            # routing i strony (Next.js App Router)
│   └── lib/            # logika domenowa (np. kalkulator wycen)
├── docker-compose.yml  # lokalny Postgres 16
└── vitest.config.ts    # konfiguracja testów jednostkowych
```

## Konfiguracja środowiska

1. Zainstaluj zależności:
   ```bash
   pnpm install
   ```
2. Zatwierdź instalację natywnych binariów wymaganych przez pnpm 10 (patrz konfiguracja w [`.pnpm-builds.json`](./.pnpm-builds.json)):
   ```bash
   pnpm approve-builds
   ```
3. Utwórz plik `.env` na podstawie `.env.example` i uzupełnij wymagane wartości.

### Zmienne środowiskowe

- `DATABASE_URL` – connection string do instancji Postgresa, np. `postgres://postgres:postgres@localhost:5432/jk`.

> **Tip:** Do pracy lokalnej możesz skopiować wartości z `docker-compose.yml`, aby szybko wystartować środowisko developerskie.

### Uruchomienie Postgresa lokalnie

Repozytorium zawiera konfigurację Docker Compose uruchamiającą Postgresa 16:

```bash
docker compose up -d
```

Po uruchomieniu serwera baza danych jest dostępna na `localhost:5432` z domyślnym użytkownikiem i hasłem `postgres`.

## Codzienna praca deweloperska

| Komenda | Opis |
| --- | --- |
| `pnpm dev` | Start lokalnego serwera deweloperskiego Next.js. |
| `pnpm build` | Buduje aplikację w trybie produkcyjnym. |
| `pnpm start` | Uruchamia wcześniej zbudowaną aplikację. |
| `pnpm lint` | Sprawdza jakość kodu przy użyciu `eslint-config-next`. |
| `pnpm typecheck` | Weryfikuje typy TypeScript bez emitowania plików. |
| `pnpm test` | Uruchamia testy jednostkowe Vitest. |
| `pnpm test -- --coverage` | Generuje raport pokrycia testami w formacie V8. |
| `pnpm depcheck` | Analizuje zależności i zgłasza nieużywane pakiety. |

> Przed wysłaniem PR uruchom lokalnie `pnpm lint`, `pnpm test` oraz `pnpm build`, aby odtworzyć minimalny pipeline CI.

## Pakiet `@jk/db`

W katalogu `packages/db` znajduje się pakiet z konfiguracją Drizzle ORM. Biblioteka eksportuje:

- `db` – instancję klienta Drizzle powiązaną z pulą połączeń `pg`,
- `pool` – pulę połączeń `pg` dla bardziej niskopoziomowych operacji,
- `schema` – definicje tabel i modeli bazy (eksportowane z `src/schema.ts`).

Pakiet korzysta z `dotenv`, aby wczytać zmienne środowiskowe. Brak zdefiniowanej zmiennej `DATABASE_URL` spowoduje błąd uruchomienia, dlatego upewnij się, że `.env` jest poprawnie skonfigurowany.

## Testy i jakość kodu

- Testy jednostkowe są uruchamiane przez `pnpm test` z konfiguracją w `vitest.config.ts`.
- Raport pokrycia można wygenerować przez `pnpm test -- --coverage`; wynik pojawi się w katalogu `coverage/`.
- ESLint używa standardowej konfiguracji Next.js. Zalecane jest uruchamianie lintingu przed pushowaniem zmian.

## Dokumentacja produktu i procesu

Repozytorium zawiera katalog `docs/` z najważniejszymi artefaktami discovery. Kluczowe pliki:

- [`docs/README_DOCS.md`](./docs/README_DOCS.md) – indeks dokumentacji i wskazówki dotyczące aktualizacji.
- [`docs/PLAN_MVP_SPRINTS.md`](./docs/PLAN_MVP_SPRINTS.md) – plan iteracji oraz scope kolejnych sprintów.
- [`docs/SITE_MAP.md`](./docs/SITE_MAP.md) – mapa ekranów wraz z oczekiwanymi przepływami użytkownika.
- [`docs/UI_TOKENS.md`](./docs/UI_TOKENS.md) – design tokens i odniesienia do styli Tailwind.
- [`docs/JAKOSC_TESTY_CI.md`](./docs/JAKOSC_TESTY_CI.md) – standardy jakości i konfiguracja CI.

Aktualizuj dokumenty wraz z każdą decyzją produktową lub zmianą w implementacji, aby zespół miał jedno źródło prawdy.

## Zapotrzebowanie i kierunek rozwoju

### Zapotrzebowanie produktowe

- Utrzymuj aktualny katalog zdjęć w katalogu `img/`; nazwy plików traktujemy jako kanoniczne nazwy produktów w UI.
- Wykorzystuj zdjęcia w komponentach katalogu (`src/app/(site)/catalog`) zgodnie z opisem przepływów w [`docs/SITE_MAP.md`](./docs/SITE_MAP.md).
- Synchronizuj atrybuty produktów z mockami w `src/lib/catalog`, aby nazewnictwo odpowiadało materiałom zdjęciowym.

### Kierunek UX/UI

- Kontynuuj kierunek "medieval artisan minimalism" określony w [`docs/UI_TOKENS.md`](./docs/UI_TOKENS.md) oraz priorytetach UX w [`docs/WYMAGANIA_MVP.md`](./docs/WYMAGANIA_MVP.md).
- Zapewnij spójne nazewnictwo wariantów produktów pomiędzy komponentami UI, mockami danych i folderem `img/`.
- Przed wdrożeniem nowych ekranów odwołuj się do mapy ekranów w [`docs/SITE_MAP.md`](./docs/SITE_MAP.md) oraz planu iteracji w [`docs/PLAN_MVP_SPRINTS.md`](./docs/PLAN_MVP_SPRINTS.md).

### Oczekiwane narzędzia i proces

- `pnpm`, `Docker Compose` oraz `drizzle-kit` do pracy lokalnej z bazą i migracjami.
- `Vitest` (unit) i opcjonalnie Playwright do testów UI.
- `Storybook` planowany do dokumentowania komponentów wizualnych (sprawdź backlog w [`docs/PLAN_MVP_SPRINTS.md`](./docs/PLAN_MVP_SPRINTS.md)).
- Automatyzacje CI opisane w [`docs/JAKOSC_TESTY_CI.md`](./docs/JAKOSC_TESTY_CI.md); przed PR uruchamiaj `pnpm lint`, `pnpm test` i `pnpm build`.

## Roadmapa / kolejne kroki

- Podłączenie kalkulatora cen do rzeczywistych danych z Drizzle ORM.
- Implementacja interfejsu formularza zamówień.
- Integracja z Stripe i automatyzacjami n8n.
