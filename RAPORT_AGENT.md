# RAPORT_AGENT.md — propozycje ulepszeń

Zebrane pomysły na niewykorzystane ulepszenia oraz rekomendacje usprawnienia istniejących rozwiązań. Analizy opracowano metodą 5xWhy.

## 1. Ujednolicenie konfiguracji bazy danych (5xWhy)
- **Problem:** `.env.example` i `docker-compose.yml` korzystają z różnych danych logowania.
  1. **Dlaczego?** Początkowy scaffold używał `postgres/postgres`, a docker-compose zostało dodane z `devuser/devpass`.
  2. **Dlaczego utrzymano oba warianty?** Brak single source of truth w dokumentacji podczas migracji na workspace.
  3. **Dlaczego dokumentacja nie została zaktualizowana?** Priorytet przeniesiono na implementację katalogu i formularza, odkładając stabilizację środowiska.
  4. **Dlaczego backlog T0 nie został domknięty?** Brak dedykowanego ownera konfiguracji infra.
  5. **Dlaczego brak ownera?** Zadanie nie przypisane w `PLAN_MVP_SPRINTS.md` do konkretnej roli.
- **Ulepszenie:** Wybrać docelowe poświadczenia (`devuser/devpass@jkdb`), zaktualizować `.env.example`, README, dodać `drizzle.config.ts`, wygenerować migrację inicjalną i skrypt seeda. _(Status: zrealizowane lokalnie; follow-up: zintegrować API Next.js i CI z nowymi migracjami/seeds oraz zaktualizować secrets. 2025-10-27: `/api/products`, `/api/styles` i `/api/leather` korzystają już z `getNextDbClient().db`, testy resetują cache helpera.)_

## 2. Brak design tokens w kodzie (5xWhy)
- **Problem:** Kolory i spacing są hard-coded w `globals.css`.
  1. **Dlaczego?** MVP budowano bez Tailwind i bez czasu na refactor CSS.
  2. **Dlaczego zabrakło refactoru?** Zadanie T1 nie zostało zakończone (brak zasobów/UI ownera).
  3. **Dlaczego nie przypisano ownera?** Priorytet przesunął się na product/contact pages.
  4. **Dlaczego?** Zespół potrzebował klikowalnego demo dla klienta przed warsztatem brandowym.
  5. **Dlaczego demo było krytyczne?** Wymóg biznesowy – prezentacja modeli obuwia dla inwestorów.
- **Ulepszenie:** Dodać custom properties (`:root { --color-bg-body: ... }`), przenieść klasy `.button`, `.badge`, `.section` na tokens, rozważyć konfigurację Tailwind.

## 3. Niedobór testów komponentów krytycznych (5xWhy)
- **Problem:** Brak testów dla `ContactForm`, `ProductPage`, `OrderModalTrigger`.
  1. **Dlaczego?** Fokus testów był na kalkulatorze i layoutach.
  2. **Dlaczego te komponenty pominięto?** Implementowano je pod presją czasu przed rewizją QA.
  3. **Dlaczego QA nie zgłosiło luk?** Nie ma checklisty testów komponentowych w DoD (dopiero zaktualizowana).
  4. **Dlaczego brak checklisty?** T6 w planie MVP dopiero częściowo wdrożony.
  5. **Dlaczego T6 nie został domknięty?** Brak dedykowanego sprintu jakości.
- **Ulepszenie:** Dodać testy RTL dla formularza (walidacja), snapshot/aria dla product page, test focus trap modala; włączyć je do DoD.
  - **Status 2025-10-22:** Dodano testy komponentowe `ContactForm`, `ProductPage` oraz pokrycie katalogu (`NativeModelShowcase`). Pozostało zaplanować regresję dla modala i UI prymitywów.

## 4. Formularz kontaktowy bez backendu (5xWhy)
- **Problem:** `ContactForm` resetuje dane lokalnie i nie wysyła realnych wiadomości.
  1. **Dlaczego?** Brak decyzji o integracji (n8n/mail provider).
  2. **Dlaczego decyzji brak?** Nie ustalono wymagań prawnych RODO (patrz `OPEN_QUESTIONS.md`).
  3. **Dlaczego RODO niezamknięte?** Właściciel produktu nie dostarczył finalnej polityki prywatności.
  4. **Dlaczego polityka wciąż w przygotowaniu?** Priorytet dla materiałów marketingowych.
  5. **Dlaczego marketing > infrastruktura?** Potrzeba generowania leadów z demo — formularz jako placeholder miał wystarczyć.
- **Ulepszenie:** Zaprojektować integrację z n8n (webhook) + `POST /api/contact`, dodać walidację Zod i reCAPTCHA (opcjonalnie), przygotować copy zgody RODO.

## 5. Flow zamówień z modalem i `/order/native`
- **Obserwacja:** Modal i strona `/order/native` duplikują CTA.
  - **Why1:** Modal powstał, aby nie opuszczać strony produktu.
  - **Why2:** `/order/native` dodano dla fallbacku (iframe embedding issues).
  - **Why3:** Brak decyzji, który wariant jest docelowy.
  - **Why4:** Nie przeprowadzono analizy konwersji (brak danych).
  - **Why5:** Aplikacja nie jest jeszcze na produkcji.
- **Ulepszenie:** Wprowadzić analytics eventy (np. PLAUSIBLE) i A/B test, rozważyć jeden spójny flow (np. dedykowana strona order + contextual anchor z product/contact).

## 6. Dokumentacja prawna i footer
- **Problem:** Brak linków do polityki prywatności/regulaminu, brak informacji o prawach autorskich.
  - **Why1:** Materiały prawne nie zostały dostarczone.
  - **Why2:** Priorytet na funkcjonalności UI.
  - **Why3:** Brak ownera odpowiedzialnego za compliance.
  - **Why4:** Niewystarczające sygnały z QA (do niedawna brak checków w DoD).
  - **Why5:** MVP ma charakter discovery — compliance przesunięto na później.
- **Ulepszenie:** Przygotować placeholdery dokumentów (PDF), dodać sekcję footer, zebrać dane firmy (NIP/REGON) i uzupełnić `robots.txt`/`sitemap.ts`.

## 7. Centralizacja assetów i naming
- **Problem:** Zdjęcia modeli znajdują się w `public/image/models`, ale nazewnictwo nie jest automatycznie synchronizowane z mockami.
  - **Why1:** Mocki tworzone ręcznie, brak automatycznego generatora.
  - **Why2:** Nie zaimplementowano pipeline importu z arkusza/CSV.
  - **Why3:** Brak narzędzia do zarządzania katalogiem produktów.
  - **Why4:** MVP miało ograniczyć zakres backendu.
  - **Why5:** Brak czasu/zasobów na automatyzację.
- **Ulepszenie:** Dodać skrypt generujący mocki z katalogu assetów lub pliku CSV (np. `pnpm generate:catalog`), co zmniejszy ryzyko literówek.

## 8. Stabilność formularza kontaktowego (5xWhy)
- **Problem:** `pnpm typecheck` i testy komponentu `ContactForm` wymagały manualnej konfiguracji środowiska (`APP_BASE_URL`, brak modułu `nodemailer`).
  1. **Dlaczego?** Formularz odwoływał się bezpośrednio do `fetch` oraz importował `nodemailer`, który nie udostępnia deklaracji zgodnych z `moduleResolution: bundler`.
  2. **Dlaczego bezpośrednio?** Implementacja była robiona „na szybko”, bez wzorca wstrzykiwania zależności.
  3. **Dlaczego brak wzorca?** Brak dokumentacji w `AGENTS.md` oraz testów korzystających z mocków.
  4. **Dlaczego testy nie mockowały fetch?** Nie istniał setup globalny, a komponent nie pozwalał wstrzyknąć zależności.
  5. **Dlaczego brak setupu?** Priorytet był na UI i copy, nie na infrastrukturę testową.
- **Ulepszenie:** Wstrzykiwać `submitRequest` w komponentach/formach, trzymać shim `types/nodemailer.d.ts` i dopisać scenariusze testowe z kontrolą odpowiedzi backendu.

## 9. Niedokładne pokrycie testami E2E i modułów pomocniczych (5xWhy)
- **Problem:** Testy Playwright obejmowały jedynie dwa endpointy legal, a moduły jak CLI czy symulator nawigacji miały luki pokrycia.
  1. **Dlaczego?** Początkowy smoke test e2e skupiał się na priorytetowych wymaganiach prawnych.
  2. **Dlaczego nie rozszerzono go od razu?** Brakowało checklisty scenariuszy w DoD oraz danych o krytycznych ścieżkach.
  3. **Dlaczego checklisty brak?** Pętla T6 była w trakcie – skupiono się na komponentach UI.
  4. **Dlaczego CLI i symulacje pominięto?** Zakładano, że testy jednostkowe wystarczą i nie zdefiniowano przypadków brzegowych.
  5. **Dlaczego przypadki brzegowe nie zostały opisane?** Brak obserwacji produkcyjnych oraz raportu z pętli QA.
- **Ulepszenie:** Dopisać testy CLI (help/błędy), rozszerzyć przypadki symulatora (walidacja wag, brak pętli), dodać Playwright smoke dla głównych stron i API katalogu. _(Status 2025-10-24: wykonane – dodano testy jednostkowe dla `/api/styles`, `/api/leather`, rozszerzono `journey-simulation` i CLI, Playwright obejmuje nawigację + API. Kolejny krok: e2e dla flow zamówienia.)_

## Raport agenta – 2025-10-24
- **Co zrobiono:** Uzupełniono brakującą zależność `@testing-library/user-event`, dopisano testy jednostkowe dla API katalogu, rozszerzono scenariusze `OrderButton`, CLI i symulatora nawigacji, dodano smoke test e2e nawigacji/API, zaktualizowano dokumentację QA.
- **Dlaczego:** Aby domknąć wskazane przez QA luki pokrycia i zapewnić, że krytyczne ścieżki (nawigacja, API katalogu, obsługa błędów CLI) są weryfikowane automatycznie.
- **Jakie przyjęto założenia:** Backend katalogu zwraca dane referencyjne dostępne lokalnie; Playwright korzysta z uruchomionego dev servera, a testy mogą wykonywać żądania GET do endpointów mockowanych.
- **Co dalej:** Przygotować pełny flow e2e zamówienia (modal → `/order/native`), dopisać testy integracyjne `/catalog/[slug]` i `/account`, kontynuować migrację design tokens.

## Raport agenta – 2025-10-25
- **Co zrobiono:** Przeniesiono inicjalizację klienta bazy do handlera `/api/pricing/quote`, dodano runtime'ową walidację `DATABASE_URL`, przebudowano repozytorium logów na wstrzykiwany klient oraz rozszerzono testy o scenariusz braku konfiguracji.
- **Dlaczego:** Aby uniknąć błędów w czasie budowania/ładowania modułów przy braku `DATABASE_URL` i wymusić leniwą inicjalizację zgodną z App Routerem.
- **Jakie przyjęto założenia:** Pool `pg` może być współdzielony w module Next.js, a testy jednostkowe będą mockować repozytorium i klienta DB zamiast realnego połączenia.
- **Co dalej:** Dostosować pozostałe endpointy API do tego wzorca (np. `/api/products`) i rozważyć wspólny helper do zarządzania cache'owaniem klienta.

## Raport agenta – 2025-10-26
- **Co zrobiono:** Wyodrębniono helper `@/lib/db/next-client` udostępniający `getNextDbClient` i `resetNextDbClient`, zintegrowano z `/api/pricing/quote` oraz zaktualizowano testy do resetowania cache'u między scenariuszami.
- **Dlaczego:** Aby uniknąć duplikowania logiki cache'owania klienta DB w handlerach i zapewnić deterministyczne testy przy współdzieleniu połączeń.
- **Jakie przyjęto założenia:** Endpointy Next.js korzystają z jednego procesu, dzięki czemu cache modułu jest bezpieczny, a reset helpera będzie używany tylko w testach jednostkowych.
- **Co dalej:** Migrować `/api/products`, `/api/styles` oraz `/api/leather` na nowy helper i dopisać testy weryfikujące reset cache'u po mockowaniu środowiska.

## Raport agenta – 2025-10-27
- **Co zrobiono:** Podłączono `/api/products`, `/api/styles` i `/api/leather` do `getNextDbClient().db`, rozszerzono repozytorium katalogu o wstrzykiwany klient i cache schematów oraz uzupełniono testy o reset `resetNextDbClient`, mock `@jk/db#createDbClient` i scenariusze braku `DATABASE_URL`.
- **Dlaczego:** Aby unifikować inicjalizację połączeń bazodanowych, zminimalizować ryzyko przekroczenia limitu połączeń w App Routerze i osłonić się przed błędami konfiguracji środowiska.
- **Jakie przyjęto założenia:** Fallbackowe dane katalogu nadal pełnią rolę referencji, a testy jednostkowe będą izolować cache klienta przez helper; QA obejmuje uruchomienie `pnpm test src/app/api/products/route.test.ts src/app/api/styles/route.test.ts src/app/api/leather/route.test.ts`.
- **Co dalej:** Zaplanować testy integracyjne z realnym Drizzle (np. dockerized Postgres w CI) i ujednolicić repozytorium katalogu tak, by korzystało z tych samych mapowań w ścieżkach SSR.

---
**Priorytety rekomendowane:**
1. Podpiąć API Next.js oraz mocki katalogu do bazy (Drizzle) na bazie gotowych migracji i seeda.
2. Wprowadzić design tokens (custom properties) i testy brakujących komponentów.
3. Zaprojektować backend formularza kontaktowego wraz z materiałami legal.
4. Zdecydować o docelowym flow zamówień (modal vs `/order/native`) po zebraniu metryk.
