# AGENTS.md

## Projekt
Next.js (App Router) + TypeScript + pnpm workspaces + Drizzle ORM + Postgres (Docker). UI: Tailwind + (docelowo) shadcn/ui.

## Setup commands
- `pnpm install`                     # instalacja deps
- `cp .env.example .env.local`       # lokalny env (nie commitować)
- `docker compose up -d`             # Postgres 16 (serwis: jkdb)
- `pnpm dev`                         # dev server
- `pnpm lint && pnpm test`           # jako smoke test
- `pnpm lint --fix`                  # auto-fix formatowanie lintem
- `pnpm test -- --watch`             # tryb obserwacji dla testów komponentów

## Konwencje
- TypeScript strict, ESLint bez ostrzeżeń.
- Testy: Vitest (unit) + [opcjonalnie] Playwright e2e.
- Commity: Conventional Commits.
- Strony w App Router pod `app/`: katalog, produkt, koszyk/checkout (puste stuby: OK).

## Zasady PR
- Każdy task = osobny branch + PR.
- Do PR dołącz: opis, lista zmian, screen lub GIF, wynik `pnpm test` + `pnpm lint`.
- Zakres PR: mały (<= 400 LOC), jeden feature.

## Priorytety UX
- Nawigacja globalna: Home, Catalog, About, Contact (sticky header).
- Katalog: siatka produktów z filtrami (styl, skóra, kolor).
- Produkt: warianty, galeria, CTA “Zamów/Skontaktuj”.
- Styl: "medieval artisan minimalism": duże zdjęcia, dużo oddechu, ciemne tło, złote akcenty.

## API/DB
- endpointy: /api/styles, /api/leather (już są).
- Jeżeli potrzebne mocki: zbuduj `__mocks__/` i seed dane testowe w pamięci.
- Drizzle: nie zmieniaj schematu bez migracji.

## Co robić w taskach
- Dodawaj komponenty w `src/components/`.
- Dla stron: `app/<route>/page.tsx` + minimalny test.
- Responsywność: mobile-first, 3 breakpoints.

## Czego NIE robić
- Nie wprowadzaj zewnętrznych UI kitów bez uzasadnienia.
- Nie zmieniaj CI bez osobnego PR.