# JK Handmade Footwear

Sklep MTO budowany na Next.js z TypeScript, Postgres, Stripe i automacjami n8n.

## Wymagania
- Node.js 20+
- pnpm 10+
- Docker (jeśli chcesz uruchomić lokalną bazę Postgres)

## Instalacja
```bash
pnpm install
```

## Dostępne komendy
- `pnpm dev` – lokalny serwer deweloperski Next.js
- `pnpm build` – produkcyjny build aplikacji
- `pnpm start` – uruchomienie buildu produkcyjnego
- `pnpm lint` – linting z użyciem `eslint-config-next`
- `pnpm test` – testy jednostkowe w Vitest

## Środowisko
Skopiuj plik `.env.example` do `.env` i ustaw zmienne środowiskowe. Kluczowe:
- `DATABASE_URL` – connection string do instancji Postgresa (np. `postgres://postgres:postgres@localhost:5432/jk`)

### Docker Compose
Repo zawiera plik `docker-compose.yml` z definicją Postgresa 16.
```bash
docker compose up -d
```

## Struktura projektu
- `src/app` – routing w Next.js (App Router)
- `src/lib` – logika domenowa (np. kalkulator wycen)
- `packages/db` – pakiet Drizzle ORM ze schematem i klientem bazy

## Kolejne kroki
- Podłączenie kalkulatora cen do rzeczywistych danych z Drizzle ORM
- Implementacja UI formularza zamówień
- Integracja ze Stripe i automatyzacjami n8n
