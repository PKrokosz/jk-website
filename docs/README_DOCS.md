# Dokumentacja discovery MVP

> **Status przeglądu**: 2025-10-22 — kompletny przegląd treści i powiązań dokumentów, odświeżone wpisy backlogowe.

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
| [`AUDYT_REPO.md`](./AUDYT_REPO.md) | 2025-10-22 | Aktualne (uwzględnia `/account`) | Zweryfikować po zmianach w strukturze monorepo lub dodaniu nowych aplikacji. |
| [`ARCHITEKTURA_I_LUKI.md`](./ARCHITEKTURA_I_LUKI.md) | 2025-09-18 | Wymaga rewizji przy wdrożeniu backendu leadów | Dopisać flow backendu formularza, gdy powstanie integracja. |
| [`WYMAGANIA_MVP.md`](./WYMAGANIA_MVP.md) | 2025-10-22 | Aktualne (dodany panel klienta) | Po wdrożeniu backendu formularza zaktualizować sekcję „Kontakt / Zamówienie”. |
| [`UI_TOKENS.md`](./UI_TOKENS.md) | 2025-08-30 | W toku (tokens niezaimportowane do CSS) | Dodać postępy migracji tokens → CSS custom properties. |
| [`SITE_MAP.md`](./SITE_MAP.md) | 2025-07-15 | Aktualne | Uaktualnić po dodaniu nowych route'ów (np. blog, FAQ). |
| [`DANE_I_API_MVP.md`](./DANE_I_API_MVP.md) | 2025-09-18 | Częściowo aktualne | Dodać tabelę `quote_requests` po wdrożeniu migracji. |
| [`JAKOSC_TESTY_CI.md`](./JAKOSC_TESTY_CI.md) | 2025-10-22 | Aktualne (uzupełnione testy ContactForm/ProductPage/NativeModelShowcase) | Monitorować pokrycie UI prymitywów i E2E. |
| [`PLAN_MVP_SPRINTS.md`](./PLAN_MVP_SPRINTS.md) | 2025-10-22 | Aktualne (T0–T7 opisane) | Uzupełnić status po każdym zamkniętym sprincie. |
| [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md) | 2025-09-18 | Wymaga odpowiedzi właściciela | Usunąć zamknięte pytania i dopisać nowe decyzje. |
| [`SEO_CHECKLIST.md`](./SEO_CHECKLIST.md) | 2025-06-05 | W toku (brak `robots.txt`/`sitemap`) | Potwierdzić implementację generowanych plików i structured data. |
| [`FRONTEND_INTERFACE_SPEC.md`](./FRONTEND_INTERFACE_SPEC.md) | 2025-10-22 | Nowy dokument | Synchronizować z aktualizacjami UI i zadaniami pętli `task_loop`. |
| [`LOOP_TASKS.md`](./LOOP_TASKS.md) | 2025-10-22 | Nowy dokument | Aktualizować po każdej iteracji backlogu pętli. |

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
