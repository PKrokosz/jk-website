# AGENTS.md

## Projekt
Next.js (App Router) + TypeScript + pnpm workspaces + Drizzle ORM + Postgres (Docker). UI: custom CSS (docelowo tokens z `docs/UI_TOKENS.md`), planowana integracja z Tailwind + shadcn/ui.

## Setup commands
- `pnpm install`                     # instalacja deps
- `pnpm approve-builds`              # zatwierdzenie natywnych binariów
- `cp .env.example .env.local`       # lokalny env (nie commitować)
- `docker compose up -d jkdb`        # Postgres 16 (serwis: jkdb)
- `pnpm dev`                         # dev server
- `pnpm lint && pnpm test`           # smoke test
- `pnpm typecheck`                   # TS strict
- `pnpm test:coverage`               # raport pokrycia (opcjonalnie na PR)
- `pnpm test:e2e`                    # scenariusze Playwright (najpierw `pnpm exec playwright install --with-deps`)
- `pnpm depcheck`                    # higiena zależności
- `pnpm qa`                          # lokalna bramka jakości (lint, typecheck, test, dry-run `pnpm db:generate` blokujący brudny katalog `drizzle/`)
- `pnpm qa:ci`                       # pełny zestaw CI (lint, typecheck, build, test, coverage, e2e, depcheck, dry-run `pnpm db:generate`)
- `pnpm exec tsx scripts/prepare-integration-db.ts`  # startuje jkdb, stosuje migracje i seed na `.env.test`
- `pnpm test:integration`            # testy Vitest z realną bazą (wymaga `.env.test`, migracji i seeda)
- `pnpm db:generate`                 # generuje migracje (Drizzle Kit >= 0.31 korzysta z komendy `generate`)

### Konfiguracja środowiska
- `.env.example` zawiera komplet wymaganych przez walidator zmiennych z bezpiecznymi placeholderami (`NEXT_PUBLIC_ORDER_FORM_URL`, `SMTP_*`, identyfikatory marketingowe). Skopiuj plik bez zmian, aby odpalić środowisko lokalne.
- Narzędzia Drizzle automatycznie wczytają `.env.example`, gdy brakuje `.env.local`/`.env`, więc pierwszy start nie wymaga ręcznej konfiguracji zmiennych (pamiętaj jednak o nadpisaniu wartości przy realnych integracjach).
- Nadpisuj wartości tylko, gdy integrujesz prawdziwe usługi (np. SMTP produkcyjne, realne piksle marketingowe). Dodając nowe zmienne, pamiętaj o aktualizacji `.env.example`, README i sekcji dokumentacyjnej opisującej walidację.
- `tools/verify-drizzle-env.ts` oprócz listy brakujących zmiennych ostrzega, jeśli `DATABASE_URL` w `.env.example` nie zgadza się z `docker-compose.yml` (serwis `jkdb`). Traktuj ostrzeżenie jako obowiązkowe do naprawienia.

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
- Specyfikacja UI i frontendu: `docs/FRONTEND_INTERFACE_SPEC.md` (paleta, animacje, responsywność, integracja z `task_loop`).
- Aktualizuj dokumenty, gdy zmienia się zakres funkcjonalny lub decyzje produktowe.
- Raport z pomysłami na usprawnienia znajdziesz w `RAPORT_AGENT.md`.

### Konwencja audytu dokumentów
- Pliki `.md` w katalogu `docs/` muszą na początku zawierać sekcję `## Meta audytu <RRRR-MM-DD>` opisującą:
  1. Status zagadnień z dokumentu (czy zostały zrealizowane, porzucone czy zastąpione).
  2. Nowe ścieżki rozwoju (konkretne zadania do backlogu).
  3. Rekomendację archiwizacji (tak/nie + uzasadnienie).
  4. Sens dokumentu (po co istnieje).
  5. Aktualizacje wykonane w bieżącej iteracji.
- Sekcja meta powinna linkować do zaktualizowanych fragmentów dokumentu lub wskazywać na powiązane pliki.
- Przy aktualizacji dokumentu dopisz datę audytu oraz zsynchronizuj status w `docs/README_DOCS.md`.

## Dokumentacja operacyjna `/docs`
- Statusy dokumentacji są prowadzone w `docs/README_DOCS.md` → sekcja „Status aktualizacji dokumentów”. Zanim rozpoczniesz zadanie, sprawdź kolumnę „Kolejny krok w pętli” i po zakończeniu prac zaktualizuj wpis.
- Pętlę backlogową prowadź w `docs/LOOP_TASKS.md`. Dla każdej obserwacji `x` twórz zadania `-x`, `1/x`, `x²`, `xˣ`. Po domknięciu pętli usuń wykonane pozycje i dopisz kolejną iterację.
- Upewnij się, że zmiany w kodzie mają odzwierciedlenie w dedykowanych dokumentach tematycznych (`UI_TOKENS.md`, `JAKOSC_TESTY_CI.md`, `DANE_I_API_MVP.md`, `SEO_CHECKLIST.md`).
- Kończąc zadanie, dopisz follow-up w `docs/LOOP_TASKS.md` oraz uzupełnij checklisty w dokumentach, których dotyczyła praca.

## Konwencje
- TypeScript strict, ESLint bez ostrzeżeń.
- Przy użyciu TypeScriptowego operatora `satisfies` trzymaj go w tej samej linii, co domykający literał (`] satisfies Type`), aby uniknąć wstrzyknięcia średnika przez ASI. Przy wieloliniowych wyrażeniach (np. `.map(…)`) w razie potrzeby owiń całość w dodatkowe nawiasy, aby parser TS nie zgłaszał błędów składniowych.
- Testy: Vitest (unit/component) + [opcjonalnie] Playwright e2e.
- Testy repozytorium katalogu mockujące `@jk/db` muszą przed każdym scenariuszem wywołać `__catalogRepositoryInternals.resetDbModuleCache()` (lub `vi.resetModules()`), aby korzystać z świeżego mocka modułu.
- Mockując `@jk/db` zwracaj jednocześnie eksporty `style`, `leather` oraz `productTemplate`, aby testy repozytorium katalogu odwzorowywały strukturę modułu.
- W testach modułu pricing korzystaj z helpera `createMockPricingDatabase` (`src/lib/pricing/__tests__/mock-db.ts`),
  aby odtworzyć metody Drizzle (`select`, `insert`, `values`) i móc destrukturyzować mocki.
- Utrzymuj próg pokrycia 85% (Statements/Lines). `pnpm test:ci` uruchamia Vitest z reporterem `dot` i zakończy się błędem przy spadku poniżej limitu.
- Prymitywy UI (`OrderButton`, `.button`, `.badge`) posiadają testy RTL w `src/components/ui/__tests__`. Przy zmianach klas/tokens aktualizuj zarówno komponent jak i asercje aria/focus.
- Testy `ContactForm` obejmują walidację, sanetyzację prefill produktu i obsługę limitów API — przy zmianach utrzymuj pokrycie w `src/components/contact/__tests__/ContactForm.test.tsx`.
- Testy komponentów interaktywnych korzystają z `@testing-library/user-event`; gdy Vitest zgłasza brak modułu, uruchom `pnpm install`, aby pnpm 10 ponownie zlinkował pakiet w workspace.
- Testy API kontaktu: w `src/app/api/contact/submit/route.test.ts` mockuj `nodemailer` przez `vi.hoisted`, aby uniknąć importu natywnego transportu.
- Dodano smoke test kompilacji modułów stron (`src/app/__tests__/pages.compile.test.ts`) korzystający z `import.meta.glob` – przy dodawaniu nowych stron upewnij się, że przechodzą import bez błędów runtime.
- Commity: Conventional Commits.
- Strony w App Router pod `app/`: home, catalog, product, order/native, contact, about.
- Stosuj design tokens z `docs/UI_TOKENS.md`; obecnie wartości zakodowane w `globals.css` – kolejne zadania powinny je przenieść do CSS variables.
- `src/app/globals.css` definiuje `:root` custom properties (`--color-*`, `--space-*`, `--radius-*`). Nowe style dopisuj przy użyciu istniejących zmiennych lub rozszerzaj listę po aktualizacji `docs/UI_TOKENS.md`.
- Zależności: pnpm override wymusza `parse5@7.1.2`, aby utrzymać kompatybilność z `jsdom@27` w środowisku Vitest — nie usuwaj, dopóki `jsdom` nie przejdzie w pełni na ESM.
- Telemetria błędów: korzystaj z helperów `reportClientError` i `reportServerError` z `src/lib/telemetry`. W testach mockuj moduł `@/lib/telemetry` i potwierdzaj wywołania.
- Przy testowaniu formularza kontaktowego wstrzykuj zależność `submitRequest` (mock `fetch`) lub korzystaj z helperów ustawionych globalnie.

## README
- Utrzymuj tabelę „Status modułów” w `README.md` — dopisuj nowe moduły lub aktualizuj kolumnę „Stan” przy każdej znaczącej zmianie w kodzie lub dokumentacji.
- Aktualizuj tabelę komend i sekcję „Testy i jakość kodu” w `README.md` za każdym razem, gdy dodajesz/usuwasz skrypt npm albo nowy typ testu.

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
- Endpointy: `/api/styles`, `/api/leather`, `/api/products`, `/api/pricing/quote` (mock). `/api/products` korzysta z Drizzle (styl/skóra) + templatek, walidacja Zod.
- Wszystkie endpointy katalogu (`/api/products`, `/api/products/[slug]`, `/api/styles`, `/api/leather`) muszą degradować się do danych fallbackowych (`resolveCatalogCache`) przy braku `DATABASE_URL`, logując ostrzeżenie zamiast przerywać żądanie.
- `/catalog` i `/catalog/[slug]` pobierają dane z `/api/products` oraz `/api/products/[slug]`; w testach SSR mockuj `fetchCatalogProducts`/`fetchCatalogProductDetail` i wykorzystuj klasę `CatalogApiError` do symulacji statusów (404, 500).
- `/api/pricing/quote` korzysta z `pricingQuoteRequestSchema`/`pricingQuoteResponseSchema` (`src/lib/pricing/schemas.ts`) – przy zmianach aktualizuj testy kontraktowe w `src/app/api/pricing/quote/route.test.ts`.
- Logi `/api/pricing/quote` są zapisywane w tabeli `quote_requests` (Drizzle); korzystaj z repozytorium `src/lib/pricing/quote-requests-repository.ts`, aby łatwo mockować zapisy w testach.
- Handlery API korzystające z bazy sprawdzają `process.env.DATABASE_URL` w runtime i inicjalizują klienta DB dopiero wewnątrz funkcji `GET`/`POST` (bez top-level side-effectów); w razie braku konfiguracji zwracaj `HTTP 500` z komunikatem dla klienta, **z wyjątkiem endpointów katalogu**, które muszą przejść w tryb fallback (`resolveCatalogCache`) i zwrócić dane referencyjne.
- Korzystaj z helpera `@/lib/db/next-client` (`getNextDbClient`) do współdzielenia połączenia w środowisku Next.js – moduł sam weryfikuje `DATABASE_URL`, cache'uje klienta i wystawia `resetNextDbClient` na potrzeby testów.
- Endpointy `/api/products`, `/api/styles` oraz `/api/leather` są podłączone do `getNextDbClient().db`; w testach resetuj cache (`resetNextDbClient`) i mockuj `@jk/db#createDbClient`, aby uniknąć realnego połączenia. QA po zmianach w katalogu uruchom `pnpm test src/app/api/products/route.test.ts src/app/api/styles/route.test.ts src/app/api/leather/route.test.ts` oraz `pnpm test:integration` (po wcześniejszym `docker compose up -d jkdb`, `pnpm db:migrate`, `pnpm db:seed`).
- Helper integracyjny (`src/tests/integration/db.ts`) ładuje `.env.test`, pilnuje zamykania puli (`disposeNextDbClient`) i wystawia `resetCachedNextDbClient()` do testów pracujących na realnej bazie.
- Nowe lub modyfikowane handlery DB od razu buduj na `getNextDbClient`, aby utrzymać spójne zarządzanie połączeniami i łatwe mockowanie w testach.
- Testy kontraktowe API opieraj o schematy z `src/lib/catalog/schemas.ts`, mockuj moduł `@/lib/catalog/repository`, aby nie łączyć się z bazą.
- Mocki (`src/lib/catalog`) z rozszerzonym modelem (slug, warianty, order reference) do czasu podłączenia Drizzle.
- Repozytorium katalogu ma fallback do danych referencyjnych (`src/lib/catalog/data.ts`) w razie braku połączenia z bazą — nie usuwaj testów `repository.fallback.test.ts` i unikaj top-level importów `@jk/db` w modułach produkcyjnych.
- Test `src/lib/catalog/__tests__/repository.drizzle.test.ts` utrzymuje zgodność rekordów Drizzle ze słownikami fallback; przy zmianie seeda/migracji aktualizuj zarówno test, jak i dokumentację (`docs/DANE_I_API_MVP.md`, `docs/ARCHITEKTURA_I_LUKI.md`).
- Test integracyjny `src/app/api/products/route.integration.test.ts` sprawdza dostępność bazy — przy braku połączenia testy zostaną pominięte z ostrzeżeniem w logach; uruchom `docker compose up -d jkdb`, aby aktywować środowisko.
- Drizzle: nie zmieniaj schematu bez migracji (`drizzle-kit`) i bez osobnego tasku. Ujednolicenie `DATABASE_URL` (`.env.example` vs `docker-compose.yml`) w toku. Konfiguracja `drizzle.config.ts` ładuje zmienne z `.env.local` (fallback `.env`, a przy braku obu sięgnie po `.env.example`); pamiętaj o aktualizacji dokumentacji, jeśli zmienisz nazwy plików lub wymagane zmienne.
- `drizzle-kit` 0.31+ wymaga, aby workspace root miał zależność `drizzle-orm` (devDependency), w przeciwnym wypadku check kompatybilności przerwie generowanie migracji. Nie usuwaj wpisu z `package.json`.

## Co robić w taskach
- Dodawaj komponenty w `src/components/` lub `src/components/ui/` dla prymitywów.
- Dla stron: `app/<route>/page.tsx` + test + metadata.
- Responsywność: mobile-first, 3 breakpoints.
- Uzupełniaj dokumentację w `docs/` przy każdej zmianie funkcjonalności.
- Symulacje ścieżek użytkownika umieszczaj w `src/lib/navigation/`. Każda nowa symulacja musi posiadać testy Vitest i skrypt uruchomieniowy (np. `pnpm simulate:user-journeys`). Graf nawigacji nie może mieć martwych węzłów, a moduł powinien eksportować helper do formatowania wyników dla raportów.
- Skrypt `scripts/simulate-navigation.ts` wspiera flagi `--config`, `--user-count` oraz `--summary`; ostatnia z nich korzysta z agregatora przejść (`aggregateJourneyTransitions`) i ma dedykowany snapshot w `scripts/__tests__/simulate-navigation.test.ts`.
- Wagi tokenów dla symulacji nawigacji ładuj przez `NAVIGATION_WEIGHTS_JSON` (inline JSON) lub `NAVIGATION_WEIGHTS_PATH` (ścieżka do pliku). Konfiguracje muszą przechodzić testy `src/lib/navigation/__tests__/journey-simulation.test.ts`. Pliki konfiguracji mogą zawierać wpisy `_comment`/`//` z opisem – parser je pomija.

## Warstwa CLI
- Skrypt CLI (`pnpm run cli`) znajduje się w `tools/cli` i udostępnia komendy `quality`, `quality:ci`.
- Używaj `pnpm qa` do lokalnych kontroli jakości oraz `pnpm qa:ci` do pełnego przebiegu przed PR.
- Flagi CLI: `--dry-run` (podgląd kroków) oraz `--skip=<id>` (pomijanie konkretnych kroków, np. `--skip=e2e`).
- Pierwszy krok po weryfikacji środowiska uruchamia `pnpm db:generate` z tymczasowym katalogiem (`DRIZZLE_OUT`) i przerywa proces, jeśli polecenie wygeneruje artefakty lub `git status --short drizzle` zwróci zmiany – traktuj to jak obowiązkową bramkę.
- `quality:ci` zawiera krok `cleanup-node20-db`, który po scenariuszu Node 20 uruchamia `docker compose down --volumes jkdb`; można go pominąć flagą `--skip=cleanup-node20-db`.
- CLI przed parsowaniem argumentów ładuje zmienne środowiskowe z `.env.local`, następnie `.env`, a na końcu `.env.example` (tylko gdy plik istnieje i nie nadpisuje ustawionych wartości).
- Pierwszy krok `quality`/`quality:ci` odpala `tools/verify-drizzle-env.ts`, aby upewnić się, że komplet zmiennych (`DATABASE_URL`, `NEXT_PUBLIC_ORDER_FORM_URL`, `SMTP_*`, `MAIL_*`) jest skonfigurowany. Skrypt wypisuje brakujące wpisy, przykładowe wartości i zgłasza ostrzeżenie, gdy `DATABASE_URL` odbiega od konfiguracji Dockera – popraw `.env.local` oraz `.env.example` zanim ruszysz dalej.
- Entry point `tools/cli/index.ts` musi mieć odzwierciedlenie w testach (`tools/cli/__tests__/index.test.ts`) – w testach stubuj `process.exit` i logi (`console.log`, `console.error`), aby weryfikować komunikaty i kody wyjścia bez kończenia procesu.

## Czego NIE robić
- Nie wprowadzaj zewnętrznych UI kitów bez uzasadnienia.
- Nie zmieniaj CI bez osobnego PR.
- Nie podłączaj aplikacji do zewnętrznej bazy bez zatwierdzenia (pozostań przy mockach dla MVP).
