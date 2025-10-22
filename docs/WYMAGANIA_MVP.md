# Wymagania MVP sklepu

> **Status aktualizacji**: 2025-10-29 — poszerzono o `/group-orders`, `/cart`, strony prawne oraz aktualny stan formularzy.

## Meta audytu 2025-10-29
- **Status zagadnień**: Większość wymagań MVP została wdrożona (w tym legal, panel klienta). Otwarte pozostają: migracja tokens, backend zamówień, sitemap/robots, ewentualne skeletony i analityka.
- **Nowe ścieżki rozwoju**:
  - Dodać szczegółowe wymagania dla `/group-orders` (sekcje hero, CTA, lead capture, e2e testy).
  - Opisać wymagania `/cart` (prefill, walidacja, integracja z `/api/order/submit`).
  - Dopisać w sekcji SEO warunki dla `robots.ts`/`sitemap.ts` oraz structured data.
- **Rekomendacja archiwizacji**: Nie — dokument to fundament zakresu MVP.
- **Sens dokumentu**: Definiuje ścieżki użytkownika i wymagania funkcjonalne/SEO/dostępnościowe dla całego MVP.
- **Aktualizacje wykonane**:
  - Uzupełniono sekcje nawigacji i dodatkowych stron o `/group-orders`, `/cart`, legal.
  - Doprecyzowano status modalu zamówień oraz generacji SEO.
  - Dodano meta audyt i powiązano follow-upy z backlogiem.

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Nawigacja globalna](#nawigacja-globalna)
- [3. Katalog produktów](#katalog-produktow)
- [4. Strona produktu](#strona-produktu)
- [5. Kontakt / Zamówienie](#kontakt--zamowienie)
- [6. SEO i dostępność](#seo-i-dostepnosc)
- [7. Język i treści](#jezyk-i-tresci)
- [8. Wymogi legalne i operacyjne](#wymogi-legalne-i-operacyjne)
- [9. Elementy dodatkowe dla klikowalnego MVP](#elementy-dodatkowe-dla-klikowalnego-mvp)
- [10. Checklisty kontrolne](#checklisty-kontrolne)
- [11. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- MVP obejmuje ścieżkę: Home → Catalog (z filtrami) → Product (dynamiczny slug) → Order (modal / `/order`) → Contact (formularz) → Account (mock panel klienta z onboardingiem).
- Globalna nawigacja jest sticky, posiada skip link, aktywny stan i działa na wszystkich podstronach.
- Katalog działa na mockowanych danych (styles/leathers/products) z możliwością sortowania, filtrów i stanu pustego.
- Strona produktu renderuje galerię, warianty, CTA do zamówień, breadcrumbs i personalizowane metadata.
- Kontakt zawiera hero z danymi pracowni oraz formularz z walidacją i komunikatami statusu; `/order` osadza formularz natywny.
- Panel klienta `/account` pozwala rejestrować konto, logować się, przeglądać mockowaną historię zamówień i zapisać się na newsletter.

## Nawigacja globalna
- Sticky header (top 0, backdrop blur) dostępny na każdej stronie – ✅ zaimplementowane.
- Linki: `Home`, `Catalog`, `About`, `Contact`, `Order` (CTA w modalu), `Group Orders` – ✓.
- Aktywny stan: `aria-current="page"`, wyróżnione style – ✓.
- Responsywność: mobile-first, nav wrap – ✓, brak dedykowanego burgera (do rozważenia przy większej liczbie linków).
- Skip link `Przejdź do głównej treści` prowadzi do `#main-content` – ✓ (testowany).

## Katalog produktów
- Źródło danych: mocki w `src/lib/catalog` (styles, leathers, product templates) – ✓.
- Layout: grid kart produktu, filtry w panelu bocznym, toolbar z wynikami – ✓.
- Filtry (multi-select) i sortowanie – ✓.
- Paginacja: brak (lista ok. 8 kart) – ✓.
- Stan pusty: tekst „Brak wyników” – ✓.
- CTA „Poznaj szczegóły” kieruje do `/catalog/[slug]` – ✓.
- Do rozważenia: paginacja/ładowanie lazy przy większej liczbie modeli.

## Strona produktu
- Routing: `app/catalog/[slug]/page.tsx` z `generateStaticParams` – ✓.
- Treści:
  - Breadcrumb: `Home > Catalog > {Product}` – ✓.
  - Hero: nazwa, opis, cena, badge funnel stage – ✓.
  - Galeria: lista `figure` z altami i caption – ✓.
  - Sekcja detali i procesu rzemieślniczego – ✓.
  - Warianty: lista kolorów (leathers) i rozmiarów – ✓.
  - CTA: modal zamówień (`OrderModalTrigger`), link do `/order/native`, link do `/contact?product=slug` – ✓.
- Stany dodatkowe:
  - `notFound()` dla braku sluga – ✓.
  - Fallback metadata – ✓.
  - Loading skeleton – brak (do dodania jeśli potrzeba suspense).

## Kontakt / Zamówienie
- `/contact` posiada hero, dane kontaktowe, social, CTA, formularz (`ContactForm`) z walidacją – ✓.
- Formularz: pola Imię, Email, Telefon, Wiadomość, zgoda RODO (finalny wording) – ✓.
- Statusy: `idle`, `submitting`, `success`, `error`, fallback link mailto – ✓.
- `/order` osadza `NEXT_PUBLIC_ORDER_FORM_URL` w iframe z `sandbox`, `referrerPolicy`, fallback linkiem – ✓.
- `/order/native` prezentuje listę modeli i CTA do formularza – ✓.
- `/cart` prezentuje podsumowanie konfiguracji zamówienia, pozwala edytować parametry i kieruje do kontaktu – ✓ (prefill query, brak płatności online).
- Do ustalenia: backend (n8n / email); treść zgody RODO wdrożona, czeka ewentualne potwierdzenie prawne.

## Zamówienia grupowe (B2B)
- `/group-orders` zawiera hero z CTA `mailto` i anchor do sekcji formularza – ✓.
- Sekcja korzyści i proces 3 kroków prezentują wartość współpracy – ✓.
- Brak dedykowanego formularza B2B – TODO (rozszerzyć `/api/order/submit` lub osobne API).
- Do dopracowania: case studies/referencje oraz e2e test ścieżki `Home → Group Orders → Contact`.

## Panel klienta / Konto
- `/account` jest mockową implementacją panelu klienta z czterema sekcjami: onboarding (hero), rejestracja, logowanie, historia zamówień, newsletter – ✓.
- Formularze rejestracji/logowania wykorzystują lokalny state (mock), walidują pola podstawowe i raportują sukces – ✓.
- Historia zamówień prezentuje listę przykładowych zamówień z datami i statusami – ✓.
- Newsletter ma oddzielną walidację i komunikaty statusów – ✓.
- TODO: podłączenie prawdziwego backendu auth + synchronizacja z Drizzle.
- TODO: dodać łączniki nawigacyjne z headera/footeru do panelu po potwierdzeniu zakresu MVP.

## SEO i dostępność
- Metadata:
  - Strony: `Home`, `Catalog`, `Product`, `Order`, `Contact`, `About` mają ustawione `title`/`description` – ✓.
  - `generateMetadata` dla produktów w oparciu o mock SEO – ✓.
  - `robots.ts` i `sitemap.ts` istnieją – do rozszerzenia o `/cart`, strony prawne i B2B przed publikacją.
- A11y:
  - Hierarchia nagłówków logiczna – ✓.
  - Alt-texty w galerii i portfolio – ✓ (opisowe, zgodne z brand voice).
  - Focus styles dedykowane (`outline` + `box-shadow`) – ✓.
  - Formularze i filtry mają label/aria-live – ✓.
  - Modal zamówień wymaga dodatkowego przetestowania focus trap (do zaplanowania) – TODO.

## Język i treści
- Domyślny język: polski (`lang="pl"`) – ✓.
- Copy: hero, proces, portfolio, kontakt i About posiadają zaakceptowane teksty – ✓.
- Styl: "średniowieczny minimalizm" – wizualnie jasny motyw, docelowo do ujednolicenia z tokens – w toku.
- Nazwy modeli zgodne z `ORDER_MODELS` i mockami – ✓.

## Wymogi legalne i operacyjne
- `robots.txt`, `sitemap.ts` – wdrożone, wymagają weryfikacji zakresu tras (dodać `/cart`, strony prawne, B2B). – w toku.
- Linki do polityki prywatności/regulaminu – dodane we footerze i prowadzą do stron informacyjnych – ✓.
- Informacja o prawach autorskich – wdrożona we footerze – ✓.

## Elementy dodatkowe dla klikowalnego MVP
- Sticky header + skip link – ✓.
- Panel klienta: rejestracja, logowanie, historia zamówień i newsletter (mock) – ✓.
- Footer – zawiera legal copy, linki do polityk i adres warsztatu – ✓.
- Loading states: katalog ma skeleton, produkt/iframe rely on native fallback – dodać w razie potrzeby.
- Testowe dane (mock JSON/TS) – ✓.

## Checklisty kontrolne
- [x] Określono ścieżkę użytkownika Home → Catalog → Product → Contact/Order.
- [x] Zdefiniowano funkcjonalności katalogu (filtry, sortowanie, empty state).
- [x] Opisano elementy strony produktu (galeria, warianty, CTA) i wdrożono w kodzie.
- [x] Zebrano wymagania SEO/a11y (zaktualizowane o status modalów i sitemap).
- [x] Zatwierdzono treści About + RODO przez właściciela.
- [x] Dodano legal footer (sitemap/robots pozostają do wdrożenia).
- [x] Określono zakres mockowego panelu klienta wraz z checklistą TODO.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak finalnych dokumentów prawnych (pełna polityka/regulamin) może opóźnić publikację stron informacyjnych.
  - Brak finalnego regulaminu może opóźnić publikację kompletnego zestawu dokumentów prawnych.
  - Brak backendu formularza = potencjalna utrata leadów.
  - Brak `robots.txt`/`sitemap` może obniżyć SEO.
- **Decyzje do podjęcia**
  - Czy formularz kontaktowy integrujemy z n8n / e-mail service w MVP?
  - Jakie minimalne informacje prawne muszą znaleźć się w footerze na starcie?
  - Czy modal zamówienia pozostaje w MVP, czy promujemy `/order/native` jako primary CTA?
- **Następne kroki**
  - Dostarczyć finalną treść polityki prywatności i regulaminu do podmiany placeholderów.
  - Dostarczyć finalną treść regulaminu i zaktualizować stronę `/terms`.
  - Zaplanować backend wysyłki formularza kontaktowego (n8n / e-mail service).
  - Przygotować generację `robots.txt` i `sitemap.ts` w App Routerze.
