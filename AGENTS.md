# AGENTS.md

## Projekt
Next.js (App Router) + TypeScript + pnpm workspaces + Drizzle ORM + Postgres (Docker). UI: custom CSS (docelowo tokens z `docs/UI_TOKENS.md`), planowana integracja z Tailwind + shadcn/ui.

## Setup commands
- `pnpm install`                     # instalacja deps
- `pnpm approve-builds`              # zatwierdzenie natywnych binariów
- `cp .env.example .env.local`       # lokalny env (nie commitować)
- `docker compose up -d`             # Postgres 16 (serwis: jkdb)
- `pnpm dev`                         # dev server
- `pnpm lint && pnpm test`           # smoke test
- `pnpm typecheck`                   # TS strict
- `pnpm test:coverage`               # raport pokrycia (opcjonalnie na PR)
- `pnpm depcheck`                    # higiena zależności

## Runbook (MVP workflow)
1. Przeczytaj `docs/README_DOCS.md`, aby zrozumieć artefakty discovery.
2. Dla nowego zadania określ zakres względem planu `docs/PLAN_MVP_SPRINTS.md`.
3. Zaktualizuj lub utwórz odpowiednie dokumenty (np. UI, API) zanim zmienisz kod.
4. Implementuj zmiany w małych commitach (Conventional Commits) na branchu `codex/<kontekst>`.
5. Uruchom `pnpm lint`, `pnpm typecheck`, `pnpm test` oraz (jeśli dotyczy) `pnpm build` i `pnpm test:coverage` przed PR.
6. Uzupełnij opis PR wraz z logami testów, linkiem do zaktualizowanej dokumentacji i screenami.

## Dokumentacja discovery
- Indeks: `docs/README_DOCS.md`.
- Główne specyfikacje: `AUDYT_REPO.md`, `ARCHITEKTURA_I_LUKI.md`, `WYMAGANIA_MVP.md`, `UI_TOKENS.md`, `SITE_MAP.md`, `DANE_I_API_MVP.md`, `JAKOSC_TESTY_CI.md`, `PLAN_MVP_SPRINTS.md`, `OPEN_QUESTIONS.md`.
- Aktualizuj dokumenty, gdy zmienia się zakres funkcjonalny lub decyzje produktowe.
- Raport z pomysłami na usprawnienia znajdziesz w `RAPORT_AGENT.md`.

## Konwencje
- TypeScript strict, ESLint bez ostrzeżeń.
- Testy: Vitest (unit/component) + [opcjonalnie] Playwright e2e.
- Commity: Conventional Commits.
- Strony w App Router pod `app/`: home, catalog, product, order/native, contact, about.
- Stosuj design tokens z `docs/UI_TOKENS.md`; obecnie wartości zakodowane w `globals.css` – kolejne zadania powinny je przenieść do CSS variables.

## Zasady PR
- Każdy task = osobny branch + PR.
- Do PR dołącz: opis, lista zmian, screen/GIF, wynik `pnpm lint`, `pnpm typecheck`, `pnpm test`, (jeśli dotyczy) `pnpm build` i `pnpm test:coverage`.
- Zakres PR: mały (<= 400 LOC), jeden feature.
- Używaj szablonu z sekcjami `Opis`, `Lista zmian`, `Testy`, `Zrzuty ekranu`, `Checklist` (po utworzeniu template).

## Priorytety UX
- Nawigacja globalna: Home, Catalog, About, Contact, Order (sticky header, focus states, skip link).
- Katalog: siatka produktów z filtrami (styl, skóra), empty state „Brak wyników”.
- Produkt: breadcrumbs, galeria, CTA do formularza zamówień i kontaktu, badge lejka sprzedażowego.
- Styl: jasne tło, złote akcenty, duże zdjęcia, spacing zgodny z tokens.
- Kontakt: formularz z walidacją i komunikatami statusu.
- Assets: folder `public/image/` zawiera zdjęcia produktów i background hero; traktuj nazwy plików jako źródło prawdy dla nazw modeli w mockach (`src/lib/catalog`).

## API/DB
- Endpointy: `/api/styles`, `/api/leather`, `/api/pricing/quote` (mock). Brak `/api/products` – filtracja po stronie klienta.
- Mocki (`src/lib/catalog`) z rozszerzonym modelem (slug, warianty, order reference) do czasu podłączenia Drizzle.
- Drizzle: nie zmieniaj schematu bez migracji (`drizzle-kit`) i bez osobnego tasku. Ujednolicenie `DATABASE_URL` (`.env.example` vs `docker-compose.yml`) w toku.

## Co robić w taskach
- Dodawaj komponenty w `src/components/` lub `src/components/ui/` dla prymitywów.
- Dla stron: `app/<route>/page.tsx` + test + metadata.
- Responsywność: mobile-first, 3 breakpoints.
- Uzupełniaj dokumentację w `docs/` przy każdej zmianie funkcjonalności.
- Symulacje ścieżek użytkownika umieszczaj w `src/lib/navigation/`. Każda nowa symulacja musi posiadać testy Vitest i skrypt uruchomieniowy (np. `pnpm simulate:user-journeys`). Graf nawigacji nie może mieć martwych węzłów, a moduł powinien eksportować helper do formatowania wyników dla raportów.

## Czego NIE robić
- Nie wprowadzaj zewnętrznych UI kitów bez uzasadnienia.
- Nie zmieniaj CI bez osobnego PR.
- Nie podłączaj aplikacji do zewnętrznej bazy bez zatwierdzenia (pozostań przy mockach dla MVP).
