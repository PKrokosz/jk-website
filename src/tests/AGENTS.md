# AGENTS.md — `src/tests`

## Wytyczne dla testów E2E
- Korzystaj z Playwrighta (`@playwright/test`) oraz `test.describe`, aby grupować scenariusze wg. kontekstu użytkownika.
- Weryfikuj zarówno rendering UI (nagłówki, dostępność linków), jak i odpowiedzi API (`page.request`) – testy powinny odzwierciedlać realne ścieżki MVP.
- Staraj się używać selektorów semantycznych (`getByRole`, `getByLabel`) zamiast klas.
- Każdy scenariusz powinien asercjami potwierdzać kod statusu odpowiedzi (`response?.status()` albo `request.get`).
- Dodawaj komentarze tylko, jeśli asercja wymaga kontekstu biznesowego; unikaj snapshotów w Playwright.
