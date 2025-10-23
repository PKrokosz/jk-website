# AGENTS.md — katalog

## Wskazówki implementacyjne
- Utrzymuj degradację katalogu: repository oraz fetchery muszą zawsze przełączać się na dane referencyjne (`resolveCatalogCache`) przy braku bazy lub błędach `fetch`.
- Fetchery korzystają z mocka build-time (`process.env.NEXT_PHASE=phase-production-build` lub `MOCK_CATALOG_FETCH=1`). Nowe ścieżki muszą zostać dopisane w mocku, aby build nie logował `fetch failed`.
- `FORCE_CATALOG_FROM_DB=true` ma absolutny priorytet — przy tej fladze fetchery **nie** mogą korzystać z mocka i muszą sięgnąć po API/DB nawet gdy `MOCK_CATALOG_FETCH=1`.
- Aktualizując logikę `fetchCatalog*`, dodawaj/aktualizuj testy w `__tests__/api.fetch.test.ts` potwierdzające mock i obsługę błędów.
- Zachowaj logowanie ostrzeżeń po polsku (styl istniejących komunikatów) i unikaj tłumaczeń mieszanych.
- W testach korzystających z dynamicznych importów aliasuj moduły prefiksem `catalog` (np. `catalogApiModule`, `catalogRepositoryModule`),
  aby uniknąć kolizji z lokalnymi helperami i ułatwić resetowanie cache w scenariuszach Vitest.
