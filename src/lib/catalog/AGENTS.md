# AGENTS.md — katalog

## Wskazówki implementacyjne
- Utrzymuj degradację katalogu: repository oraz fetchery muszą zawsze przełączać się na dane referencyjne (`resolveCatalogCache`) przy braku bazy lub błędach `fetch`.
- Fetchery korzystają z mocka build-time (`process.env.NEXT_PHASE=phase-production-build` lub `MOCK_CATALOG_FETCH=1`). Nowe ścieżki muszą zostać dopisane w mocku, aby build nie logował `fetch failed`.
- Aktualizując logikę `fetchCatalog*`, dodawaj/aktualizuj testy w `__tests__/api.fetch.test.ts` potwierdzające mock i obsługę błędów.
- Zachowaj logowanie ostrzeżeń po polsku (styl istniejących komunikatów) i unikaj tłumaczeń mieszanych.
