# AGENTS.md

## Scope
Instrukcje w tym pliku obowiązują dla katalogu `.github/`.

## Konwencje
- Zachowuj spójność sekcji i nazewnictwa z dokumentem `docs/JAKOSC_TESTY_CI.md`.
- Przy aktualizacji templatek pamiętaj o komentarzach pomagających wypełnić PR (po polsku).
- Zmiany w workflow lub template zawsze synchronizuj z dokumentacją jakości w `docs/JAKOSC_TESTY_CI.md`.
- W workflow `ci.yml` stosuj `pnpm/action-setup` w trybie `standalone`, aby wspierać macierz Node 22.x bez zainstalowanego `npm`.
- Przy aktualizacji `ci.yml` utrzymuj krok przygotowujący bazę (`docker compose up -d jkdb` + `pnpm db:migrate` + `pnpm db:seed`) oraz końcowy etap `pnpm test:integration` – zapewniają one działanie helpera `ensureIntegrationTestMigrations`.
