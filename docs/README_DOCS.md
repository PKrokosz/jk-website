# Dokumentacja discovery MVP

> **Status przeglądu**: 2025-10-29 — audyt meta wszystkich dokumentów, zsynchronizowany indeks i odświeżone zależności z pętlą backlogową.

## Meta audytu 2025-10-29
- **Status zagadnień**: Indeks nadal spełnia swoją rolę i uwzględnia wszystkie aktywne dokumenty. Po aktualizacji poszczególnych plików statusy zostały zsynchronizowane z nowymi sekcjami meta. Pozostało monitorować, czy kolejne iteracje dopisują się do tabeli (brak automatyzacji).
- **Nowe ścieżki rozwoju**:
  - Dodać automatyczną checklistę w `docs/README_DOCS.md`, która wymusza aktualizację wpisu po każdej zmianie dokumentu (np. pre-commit script lub manualny `TODO`).
  - Uzupełnić `docs/LOOP_TASKS.md` o zadanie monitorujące zgodność statusów (np. `x₆`: automatyczne diffowanie statusów meta vs. tabela).
- **Rekomendacja archiwizacji**: Nie archiwizować — dokument pozostaje punktem wejścia do discovery i meta danych.
- **Sens dokumentu**: Służy jako centralny indeks i dashboard stanu dokumentacji discovery (informuje gdzie rozpocząć pracę, jakie są następne kroki, jakie dokumenty wymagają rewizji).
- **Aktualizacje wykonane**:
  - Ujednolicono statusy dat z sekcjami meta poszczególnych dokumentów.
  - Dodano sekcję meta audytu oraz wskazano kolejne działania porządkujące pętlę backlogową.
  - Przygotowano miejsce na integrację z `docs/AUDYT_REPO2.md` (sekcja wyników globalnego audytu).

## Spis treści
- [1. Wprowadzenie](#wprowadzenie)
- [2. Status aktualizacji dokumentów](#status-aktualizacji-dokumentow)
- [3. Indeks i mapa nawigacji](#indeks-i-mapa-nawigacji)
- [4. Checklisty kontrolne](#checklisty-kontrolne)
- [5. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Wprowadzenie
Ten katalog zawiera komplet artefaktów discovery & gap assessment dla MVP sklepu „Jacek Karelus Handmade Shoes”. Dokumenty są utrzymywane w pętli ciągłej aktualizacji. Każda iteracja powinna kończyć się aktualizacją backlogu w [`docs/LOOP_TASKS.md`](./LOOP_TASKS.md) oraz odnotowaniem statusu w tabeli poniżej.

## Status aktualizacji dokumentów
| Plik | Ostatni przegląd | Status | Kolejny krok w pętli |
| --- | --- | --- | --- |
| [`AUDYT_REPO.md`](./AUDYT_REPO.md) | 2025-10-29 | Aktualne (uwzględnia group-orders/cart/legal/API) | Zweryfikować po dodaniu nowych aplikacji lub migracji Drizzle. |
| [`ARCHITEKTURA_I_LUKI.md`](./ARCHITEKTURA_I_LUKI.md) | 2025-10-29 | W toku (Drizzle + preferencje ruchu) | Dopisać diagram przepływu danych i plan integracji `/cart`/`/group-orders`. |
| [`WYMAGANIA_MVP.md`](./WYMAGANIA_MVP.md) | 2025-10-29 | Aktualne (rozszerzone o B2B/cart) | Zamknąć TODO dla backendu zamówień i rozszerzenia SEO (robots/sitemap). |
| [`UI_TOKENS.md`](./UI_TOKENS.md) | 2025-10-29 | W toku (custom properties adopt + eksport) | Rozszerzyć tokens na nowe widoki i przygotować eksport JSON. |
| [`SITE_MAP.md`](./SITE_MAP.md) | 2025-10-29 | Aktualne (dodano legal/cart) | Dopisać mapy ekranów dla `/cart` i `/group-orders`. |
| [`DANE_I_API_MVP.md`](./DANE_I_API_MVP.md) | 2025-10-29 | W toku (brak `/api/products/[slug]`, migracje) | Opisać tabelę `quote_requests` i zaplanować endpoint product detail. |
| [`JAKOSC_TESTY_CI.md`](./JAKOSC_TESTY_CI.md) | 2025-10-29 | Aktualne (ustalić próg coverage) | Zdecydować o progu coverage i automatyzacji checklisty PR. |
| [`PLAN_MVP_SPRINTS.md`](./PLAN_MVP_SPRINTS.md) | 2025-10-29 | W toku (plan T8/T9 do dodania) | Dopisać zadania dla `/group-orders` i `/cart`. |
| [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md) | 2025-10-29 | W toku (rozmiarówka/asset/analityka) | Zaplanować warsztat discovery i zebrać materiały brandowe. |
| [`SEO_CHECKLIST.md`](./SEO_CHECKLIST.md) | 2025-10-29 | W toku (structured data + Lighthouse) | Przygotować snippet `JSON-LD` i checklistę testów SEO. |
| [`FRONTEND_INTERFACE_SPEC.md`](./FRONTEND_INTERFACE_SPEC.md) | 2025-10-29 | W toku (dopisać cart/group-orders, prefers-reduced-motion) | Uzupełnić sekcje nowych widoków i checklistę ruchu. |
| [`LOOP_TASKS.md`](./LOOP_TASKS.md) | 2025-10-29 | W toku (iteracja 2025-10-29, nowe `x₇`/`x₈`) | Zaplanować kolejną iterację po domknięciu zadań `x₁`–`x₆`. |
| [`AUDYT_REPO2.md`](./AUDYT_REPO2.md) | 2025-10-29 | Nowy (syntetyczny raport) | Aktualizować po każdej fali audytu dokumentów. |

> Dodatkowo w katalogu głównym repo znajdziesz [`RAPORT_AGENT.md`](../RAPORT_AGENT.md) z propozycjami kolejnych ulepszeń oraz raportami pętli retro.

## Indeks i mapa nawigacji
| Obszar | Dokument źródłowy | Po co sięgnąć |
| --- | --- | --- |
| Stan repo i konfiguracja | [`AUDYT_REPO.md`](./AUDYT_REPO.md) | Struktura monorepo, logi komend, status aplikacji. |
| Architektura i tech debt | [`ARCHITEKTURA_I_LUKI.md`](./ARCHITEKTURA_I_LUKI.md) | Diagramy App Routera, luki w danych i integracjach. |
| Wymagania funkcjonalne | [`WYMAGANIA_MVP.md`](./WYMAGANIA_MVP.md) | Zakres stron, panel klienta, checklisty SEO/a11y. |
| Design system | [`UI_TOKENS.md`](./UI_TOKENS.md) | Paleta, typografia, prymitywy UI i plan migracji tokens. |
| Nawigacja produktowa | [`SITE_MAP.md`](./SITE_MAP.md) | Sitemap + states, relacje między stronami. |
| Dane i kontrakty | [`DANE_I_API_MVP.md`](./DANE_I_API_MVP.md) | Modele danych, API, walidacja Zod. |
| Jakość i CI | [`JAKOSC_TESTY_CI.md`](./JAKOSC_TESTY_CI.md) | Definition of Done, coverage, pipeline. |
| Plan iteracji | [`PLAN_MVP_SPRINTS.md`](./PLAN_MVP_SPRINTS.md) | Harmonogram T0–T7, status DoD, ryzyka. |
| Otwarte decyzje | [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md) | Lista pytań do właściciela produktu i statusy odpowiedzi. |
| SEO | [`SEO_CHECKLIST.md`](./SEO_CHECKLIST.md) | Priorytety SEO, structured data, Lighthouse. |
| Pętla zadań transformacyjnych | [`LOOP_TASKS.md`](./LOOP_TASKS.md) | Backlog zadań `x`, `-x`, `1/x`, `x²`, `xˣ` dla kolejnych iteracji. |
| Raport audytu | [`AUDYT_REPO2.md`](./AUDYT_REPO2.md) | Syntetyczne podsumowanie statusów i rekomendowanych follow-upów. |

## Checklisty kontrolne
- [x] Utworzono i opisano wszystkie dokumenty discovery.
- [x] Zapisano indeks w `README_DOCS.md` wraz ze statusami aktualizacji (2025-10-22).
- [ ] Zaktualizowano dokumenty po uzyskaniu odpowiedzi na otwarte pytania (część pytań nadal oczekuje na decyzję).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Dokumenty mogą się zdezaktualizować wraz z postępem implementacji – stosuj pętlę z `LOOP_TASKS.md` po każdej iteracji.
- **Decyzje do podjęcia**
  - Kto odpowiada za utrzymanie dokumentacji (PM vs. dev lead)?
- **Następne kroki**
  - Uruchomić backlog pętli (`LOOP_TASKS.md`) po każdej większej zmianie w kodzie.
  - Aktualizować statusy w tabeli w momencie zamknięcia zadania.
