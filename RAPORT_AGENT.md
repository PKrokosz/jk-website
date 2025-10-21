# RAPORT_AGENT.md — propozycje ulepszeń

Zebrane pomysły na niewykorzystane ulepszenia oraz rekomendacje usprawnienia istniejących rozwiązań. Analizy opracowano metodą 5xWhy.

## 1. Ujednolicenie konfiguracji bazy danych (5xWhy)
- **Problem:** `.env.example` i `docker-compose.yml` korzystają z różnych danych logowania.
  1. **Dlaczego?** Początkowy scaffold używał `postgres/postgres`, a docker-compose zostało dodane z `devuser/devpass`.
  2. **Dlaczego utrzymano oba warianty?** Brak single source of truth w dokumentacji podczas migracji na workspace.
  3. **Dlaczego dokumentacja nie została zaktualizowana?** Priorytet przeniesiono na implementację katalogu i formularza, odkładając stabilizację środowiska.
  4. **Dlaczego backlog T0 nie został domknięty?** Brak dedykowanego ownera konfiguracji infra.
  5. **Dlaczego brak ownera?** Zadanie nie przypisane w `PLAN_MVP_SPRINTS.md` do konkretnej roli.
- **Ulepszenie:** Wybrać docelowe poświadczenia (`devuser/devpass@jkdb`), zaktualizować `.env.example`, README, dodać `drizzle.config.ts` oraz job seeda w CI.

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

---
**Priorytety rekomendowane:**
1. Ujednolicić konfigurację DB + przygotować migracje (`drizzle-kit`).
2. Wprowadzić design tokens (custom properties) i testy brakujących komponentów.
3. Zaprojektować backend formularza kontaktowego wraz z materiałami legal.
4. Zdecydować o docelowym flow zamówień (modal vs `/order/native`) po zebraniu metryk.
