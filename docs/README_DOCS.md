# Dokumentacja discovery MVP

## Spis treści
- [1. Wprowadzenie](#wprowadzenie)
- [2. Indeks dokumentów](#indeks-dokumentow)
- [3. Checklisty kontrolne](#checklisty-kontrolne)
- [4. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Wprowadzenie
Ten katalog zawiera komplet artefaktów discovery & gap assessment dla MVP sklepu „Jacek Karelus Handmade Shoes”. Dokumenty są cyklicznie aktualizowane wraz z postępem implementacji (ostatnia aktualizacja: integracja strony produktu, formularza kontaktowego i osadzonego zamówienia).

## Indeks dokumentów
| Plik | Opis |
| --- | --- |
| [`AUDYT_REPO.md`](./AUDYT_REPO.md) | Audyt repozytorium, logi środowiska, struktura monorepo i status feature'ów. |
| [`ARCHITEKTURA_I_LUKI.md`](./ARCHITEKTURA_I_LUKI.md) | Mapowanie architektury App Routera, warstwy danych i aktualne luki techniczne. |
| [`WYMAGANIA_MVP.md`](./WYMAGANIA_MVP.md) | Specyfikacja funkcjonalna MVP (status nawigacji, katalogu, produktu, kontaktu, SEO/a11y). |
| [`UI_TOKENS.md`](./UI_TOKENS.md) | Bieżąca paleta kolorów, typografia i prymitywy UI wykorzystywane w projekcie. |
| [`SITE_MAP.md`](./SITE_MAP.md) | Site map i mapa ekranów ze stanami UX, zaktualizowana o `/order`. |
| [`DANE_I_API_MVP.md`](./DANE_I_API_MVP.md) | Model danych, mocki, kontrakty API i walidacja. |
| [`JAKOSC_TESTY_CI.md`](./JAKOSC_TESTY_CI.md) | Definition of Done, plan testów, konfiguracja GitHub Actions i narzędzia jakości. |
| [`PLAN_MVP_SPRINTS.md`](./PLAN_MVP_SPRINTS.md) | Sekwencja zadań (T0–T6) z branchami, DoD, ryzykami, statusem wykonania. |
| [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md) | Lista otwartych pytań do właściciela produktu i status odpowiedzi. |

> Dodatkowo w katalogu głównym repo znajdziesz [`RAPORT_AGENT.md`](../RAPORT_AGENT.md) z propozycjami kolejnych ulepszeń.

## Checklisty kontrolne
- [x] Utworzono i opisano wszystkie dokumenty discovery.
- [x] Zapisano indeks w `README_DOCS.md`.
- [ ] Zaktualizowano dokumenty po uzyskaniu odpowiedzi na otwarte pytania (część pytań nadal oczekuje na decyzję).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Dokumenty mogą się zdezaktualizować wraz z postępem implementacji – należy utrzymywać je na bieżąco.
- **Decyzje do podjęcia**
  - Kto odpowiada za utrzymanie dokumentacji (PM vs. dev lead)?
- **Następne kroki**
  - Udostępnić dokumentację zespołowi, zebrać feedback.
  - Aktualizować po każdej iteracji (np. na koniec sprintu).
