# Dokumentacja discovery MVP

## Spis treści
- [1. Wprowadzenie](#wprowadzenie)
- [2. Indeks dokumentów](#indeks-dokumentow)
- [3. Checklisty kontrolne](#checklisty-kontrolne)
- [4. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Wprowadzenie
Ten katalog zawiera komplet artefaktów discovery & gap assessment dla MVP sklepu „Jacek Karelus Handmade Shoes”. Dokumenty stanowią podstawę do dalszego planowania i implementacji.

## Indeks dokumentów
| Plik | Opis |
| --- | --- |
| [`AUDYT_REPO.md`](./AUDYT_REPO.md) | Audyt repozytorium, logi środowiska, struktura monorepo.
| [`ARCHITEKTURA_I_LUKI.md`](./ARCHITEKTURA_I_LUKI.md) | Mapowanie architektury App Routera, warstwy danych i kluczowe luki.
| [`WYMAGANIA_MVP.md`](./WYMAGANIA_MVP.md) | Specyfikacja funkcjonalna MVP (nawigacja, katalog, produkt, kontakt, SEO/a11y).
| [`UI_TOKENS.md`](./UI_TOKENS.md) | Design tokens, mapowanie na Tailwind i prymitywy UI.
| [`SITE_MAP.md`](./SITE_MAP.md) | Site map i mapa ekranów ze stanami UX.
| [`DANE_I_API_MVP.md`](./DANE_I_API_MVP.md) | Model danych, mocki, kontrakty API i walidacja.
| [`JAKOSC_TESTY_CI.md`](./JAKOSC_TESTY_CI.md) | Definition of Done, plan testów, szkic GitHub Actions, konwencje PR.
| [`PLAN_MVP_SPRINTS.md`](./PLAN_MVP_SPRINTS.md) | Sekwencja zadań (T0–T6) z branchami, DoD, ryzykami i estymatami.
| [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md) | Lista otwartych pytań do właściciela produktu.

## Checklisty kontrolne
- [x] Utworzono i opisano wszystkie dokumenty discovery.
- [x] Zapisano indeks w `README_DOCS.md`.
- [ ] Zaktualizowano dokumenty po uzyskaniu odpowiedzi na otwarte pytania.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Dokumenty mogą się zdezaktualizować wraz z postępem implementacji – należy utrzymywać je na bieżąco.
- **Decyzje do podjęcia**
  - Kto odpowiada za utrzymanie dokumentacji (PM vs. dev lead)?
- **Następne kroki**
  - Udostępnić dokumentację zespołowi, zebrać feedback.
  - Aktualizować po każdej iteracji (np. na koniec sprintu).
