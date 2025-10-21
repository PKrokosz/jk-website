# JK Handmade Footwear

Monorepo sklepu MTO budowanego w Next.js 14 z TypeScriptem, PostgresQL, Stripe oraz automatyzacjami n8n.

## Stos technologiczny

- **Framework**: Next.js (App Router) + React 18
- **Język**: TypeScript
- **Pakietowanie**: pnpm workspaces
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
2. Utwórz plik `.env` na podstawie `.env.example` i uzupełnij wymagane wartości.

### Zmienne środowiskowe

- `DATABASE_URL` – connection string do instancji Postgresa, np. `postgres://postgres:postgres@localhost:5432/jk`.

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
| `pnpm test` | Uruchamia testy jednostkowe Vitest. |
| `pnpm test -- --coverage` | Generuje raport pokrycia testami w formacie V8. |

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

## Roadmapa / kolejne kroki

- Podłączenie kalkulatora cen do rzeczywistych danych z Drizzle ORM.
- Implementacja interfejsu formularza zamówień.
- Integracja z Stripe i automatyzacjami n8n.
