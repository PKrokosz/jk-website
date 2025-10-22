# AGENTS.md — `src/tests`

## Wytyczne dla testów E2E
- Korzystaj z Playwrighta (`@playwright/test`) oraz `test.describe`, aby grupować scenariusze wg. kontekstu użytkownika.
- Weryfikuj zarówno rendering UI (nagłówki, dostępność linków), jak i odpowiedzi API (`page.request`) – testy powinny odzwierciedlać realne ścieżki MVP.
- Staraj się używać selektorów semantycznych (`getByRole`, `getByLabel`) zamiast klas.
- Każdy scenariusz powinien asercjami potwierdzać kod statusu odpowiedzi (`response?.status()` albo `request.get`).
- Dodawaj komentarze tylko, jeśli asercja wymaga kontekstu biznesowego; unikaj snapshotów w Playwright.
- Scenariusze zamówień muszą potwierdzać walidację pól (`Imię i nazwisko`) i prefill danych na `/order/cart`, aby utrzymać spójność z lejem sprzedażowym.

## Integracje z bazą danych
- Przed wykonaniem testów integracyjnych korzystaj z helpera `ensureIntegrationTestMigrations`, który zastosuje migracje z katalogu `drizzle` do lokalnej bazy testowej.
- Jeśli dodajesz nowe migracje, upewnij się, że testy integracyjne ładują środowisko `.env.test` i nie polegają na ręcznym uruchamianiu `pnpm db:migrate`.
- Importuj migrator Drizzle dynamicznie (`await import("drizzle-orm/node-postgres/migrator")`) i cache'uj rezultat w helperach, aby ominąć ograniczenia bundlera Vite dotyczące eksportów pakietu.
