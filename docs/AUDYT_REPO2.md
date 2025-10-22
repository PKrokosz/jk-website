# AUDYT_REPO2 — syntetyczny raport discovery

> **Status audytu**: 2025-10-29 — scalono wyniki przeglądu wszystkich dokumentów w `docs/` i zsynchronizowano pętlę `LOOP_TASKS.md`.

## Meta audytu 2025-10-29
- **Status zagadnień**: Wszystkie dokumenty otrzymały sekcję meta i aktualny status. Główne luki techniczne (migracja Drizzle, adopcja tokens, structured data, automatyzacja audytu dokumentacji) pozostają otwarte i zostały powiązane z nowymi zadaniami `x₆`–`x₈`.
- **Nowe ścieżki rozwoju**:
  - Uruchomić zadania `x₆`–`x₈` w `docs/LOOP_TASKS.md` (Drizzle fallback, SEO artefakty, automatyzacja audytu dokumentów).
  - Zaplanować T8/T9 w `PLAN_MVP_SPRINTS.md` (obsługa `/group-orders` i `/cart`) oraz odpowiadające im testy e2e.
  - Przygotować eksport tokens (JSON) i snippet `JSON-LD`, aby spiąć design, SEO i automatyzację.
- **Rekomendacja archiwizacji**: Nie archiwizować — raport stanowi bieżący snapshot discovery.
- **Sens dokumentu**: Gromadzi w jednym miejscu statusy dokumentacji, rekomendowane follow-upy i wpływ na pętlę zadań. Ułatwia decyzję, co robić w kolejnej iteracji.
- **Aktualizacje wykonane**:
  - Zebrano statusy meta i zadania dla każdego dokumentu.
  - Uporządkowano backlog follow-upów (Drizzle, tokens, SEO, audyt dokumentacji).
  - Wskazano kolejny krok „kontynuacja” (sekcja 5).

## 1. Statusy dokumentów
| Dokument | Status po audycie | Kluczowe otwarte kwestie |
| --- | --- | --- |
| `AUDYT_REPO.md` | Aktualny (2025-10-29) | Migracja Drizzle, decyzja ws. `apps/web`, monitorowanie nowych stron prawnych. |
| `ARCHITEKTURA_I_LUKI.md` | W toku | Brak diagramu przepływu danych, integracja `/cart` i `/group-orders`, preferencje ruchu. |
| `WYMAGANIA_MVP.md` | Aktualny | Backend zamówień i rozszerzenie SEO (robots/sitemap). |
| `UI_TOKENS.md` | W toku | Adopcja tokens w komponentach i eksport JSON. |
| `SITE_MAP.md` | Aktualny | Dodać mapy ekranów dla `/cart` i `/group-orders`. |
| `DANE_I_API_MVP.md` | W toku | Endpoint `/api/products/[slug]`, opis migracji `quote_requests`. |
| `JAKOSC_TESTY_CI.md` | Aktualny | Zdefiniować próg coverage, automatyzować checklistę PR. |
| `PLAN_MVP_SPRINTS.md` | W toku | Rozszerzyć plan o T8/T9 (B2B + cart). |
| `OPEN_QUESTIONS.md` | W toku | Czeka na odpowiedzi dot. rozmiarówki, assetów, analityki. |
| `SEO_CHECKLIST.md` | W toku | Przygotować `JSON-LD`, audyt Lighthouse, testy SEO. |
| `FRONTEND_INTERFACE_SPEC.md` | W toku | Dopisać sekcje dla `/group-orders`, `/cart`, checklistę ruchu. |
| `LOOP_TASKS.md` | W toku | Uruchomić nowe zadania `x₆`–`x₈`. |

## 2. Najważniejsze luki i 5xWhy
1. **Dlaczego** blokujemy migrację Drizzle? → Brak migracji utrzymuje dublowanie danych i utrudnia testy integracyjne.
2. **Dlaczego** to problem? → Mocki i DB rozjeżdżają się, przez co UI i API wymagają ręcznej synchronizacji.
3. **Dlaczego** synchronizacja manualna jest zła? → Zwiększa ryzyko regresji i wydłuża QA.
4. **Dlaczego** QA jest krytyczny? → Pipeline (`pnpm qa:ci`) musi pozostać stabilny, by móc często releasować MVP.
5. **Dlaczego** release musi być częsty? → MVP ma dowieźć wartość biznesową przed dostępnością produkcyjnej infrastruktury.

> **Wniosek**: priorytetem jest domknięcie migracji Drizzle + fallbacku katalogu (`x₆`) oraz automatyzacja audytu dokumentacji (`x₈`), aby decyzje produktowe nie wyprzedzały implementacji.

## 3. Follow-upy operacyjne (powiązania z `LOOP_TASKS.md`)
- `x₁` → rozszerzyć adopcję tokens w nowych widokach (grupa B2B, cart) i przygotować eksport JSON (`UI_TOKENS.md`).
- `x₂` → dodać e2e dla ścieżki B2B (`Home → Group Orders → Contact`) oraz walidację `/cart`.
- `x₃` → połączyć `/api/order/submit` z realnym storage leadów i zsynchronizować z `DANE_I_API_MVP.md`.
- `x₄` → wdrożyć `prefers-reduced-motion` oraz checklistę wizualną (spec frontendowa).
- `x₅` → sfinalizować komponenty prymitywów i storybook/preview.
- `x₆` → migracja Drizzle + healthcheck katalogu.
- `x₇` → structured data i Lighthouse.
- `x₈` → automatyzacja audytu dokumentacji.

## 4. Rekomendacje dla kolejnego sprintu
1. Wystartować zadanie `codex/drizzle-migration` (zamykające `x₆` i aktualizujące `DANE_I_API_MVP.md`).
2. Utworzyć `codex/ui-primitives` (domknięcie `x₅`, adopcja tokens i wstępne storybooki).
3. Przygotować `codex/seo-foundation` (realizacja `x₇`: JSON-LD, rozszerzenie sitemap/robots, test Lighthouse).

## 5. Kontynuacja (zadanie do odpalania z czatu)
- **Proponowane kolejne zadanie**: `codex/drizzle-migration` — przygotować migrację inicjalną Drizzle (tabela `quote_requests`, styles, leathers), zsynchronizować endpointy i uzupełnić dokumenty (`DANE_I_API_MVP.md`, `ARCHITEKTURA_I_LUKI.md`).
