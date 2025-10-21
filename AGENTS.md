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

## Runbook (MVP workflow)
1. Przeczytaj `docs/README_DOCS.md`, aby zrozumieć artefakty discovery.
2. Dla nowego zadania określ zakres względem planu `docs/PLAN_MVP_SPRINTS.md`.
3. Zaktualizuj lub utwórz odpowiednie dokumenty (np. UI, API) zanim zmienisz kod.
4. Implementuj zmiany w małych commitach (Conventional Commits) na branchu `codex/<kontekst>`.
5. Uruchom `pnpm lint`, `pnpm test` i (jeśli dotyczy) `pnpm build` przed PR.
6. Uzupełnij opis PR wraz z logami testów i linkiem do zaktualizowanej dokumentacji.

## Dokumentacja discovery
- Indeks: `docs/README_DOCS.md`.
- Główne specyfikacje: `AUDYT_REPO.md`, `ARCHITEKTURA_I_LUKI.md`, `WYMAGANIA_MVP.md`, `UI_TOKENS.md`, `SITE_MAP.md`, `DANE_I_API_MVP.md`, `JAKOSC_TESTY_CI.md`, `PLAN_MVP_SPRINTS.md`, `OPEN_QUESTIONS.md`.
- Aktualizuj dokumenty, gdy zmienia się zakres funkcjonalny lub decyzje produktowe.

## Konwencje
- TypeScript strict, ESLint bez ostrzeżeń.
- Testy: Vitest (unit) + [opcjonalnie] Playwright e2e.
- Commity: Conventional Commits.
- Strony w App Router pod `app/`: katalog, produkt, koszyk/checkout (puste stuby: OK).
- Stosuj design tokens z `docs/UI_TOKENS.md` oraz mapę ekranów z `docs/SITE_MAP.md`.

## Zasady PR
- Każdy task = osobny branch + PR.
- Do PR dołącz: opis, lista zmian, screen lub GIF, wynik `pnpm test` + `pnpm lint`.
- Zakres PR: mały (<= 400 LOC), jeden feature.
- Używaj szablonu z sekcjami `Opis`, `Testy`, `Zrzuty ekranu`, `Checklist`.

## Priorytety UX
- Nawigacja globalna: Home, Catalog, About, Contact (sticky header, focus states, skip link).
- Katalog: siatka produktów z filtrami (styl, skóra, kolor), empty state „Brak wyników”.
- Produkt: warianty, galeria, CTA „Zamów/Skontaktuj”, breadcrumbs.
- Styl: "medieval artisan minimalism" – ciemne tło, złote akcenty, duże zdjęcia, spacing zgodny z tokens.
- Kontakt: formularz z walidacją i jasnym komunikatem sukcesu/błędu.
- Assets: folder `img/` zawiera zdjęcia produktów; traktuj nazwy plików jako źródło prawdy dla nazw modeli w mockach (`src/lib/catalog`) i komponentach UI.
- Przy dodawaniu komponentów katalogu uwzględnij odwzorowanie każdego zdjęcia na kartę produktu oraz podpis zdjęcia zgodny z nazwą pliku (bez rozszerzenia).

## API/DB
- Endpointy: `/api/styles`, `/api/leather`, `/api/pricing/quote` (istniejące) + planowane `/api/products` (mock).
- Korzystaj z mocków (`src/lib/catalog`) do czasu podłączenia Drizzle.
- Drizzle: nie zmieniaj schematu bez migracji (`drizzle-kit`) i bez osobnego tasku.

## Co robić w taskach
- Dodawaj komponenty w `src/components/` lub `src/components/ui/` dla prymitywów.
- Dla stron: `app/<route>/page.tsx` + minimalny test + metadata.
- Responsywność: mobile-first, 3 breakpoints.
- Uzupełniaj dokumentację w `docs/` przy każdej zmianie funkcjonalności.

## Czego NIE robić
- Nie wprowadzaj zewnętrznych UI kitów bez uzasadnienia.
- Nie zmieniaj CI bez osobnego PR.
- Nie podłączaj aplikacji do zewnętrznej bazy bez zatwierdzenia (pozostań przy mockach dla MVP).
- Nie usuwaj ani nie ignoruj checklist w dokumentach discovery.
