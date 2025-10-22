# Wymagania MVP sklepu

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
- MVP obejmuje ścieżkę: Home → Catalog (z filtrami) → Product (dynamiczny slug) → Order (modal / `/order`) → Contact (formularz).
- Globalna nawigacja jest sticky, posiada skip link, aktywny stan i działa na wszystkich podstronach.
- Katalog działa na mockowanych danych (styles/leathers/products) z możliwością sortowania, filtrów i stanu pustego.
- Strona produktu renderuje galerię, warianty, CTA do zamówień, breadcrumbs i personalizowane metadata.
- Kontakt zawiera hero z danymi pracowni oraz formularz z walidacją i komunikatami statusu; `/order` osadza formularz natywny.

## Nawigacja globalna
- Sticky header (top 0, backdrop blur) dostępny na każdej stronie – ✅ zaimplementowane.
- Linki: `Home`, `Catalog`, `About`, `Contact`, `Order` (CTA w modalu) – ✓.
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
- Formularz: pola Imię, Email, Telefon, Wiadomość, zgoda RODO (tekst placeholder) – ✓.
- Statusy: `idle`, `submitting`, `success`, `error`, fallback link mailto – ✓.
- `/order` osadza `NEXT_PUBLIC_ORDER_FORM_URL` w iframe z `sandbox`, `referrerPolicy`, fallback linkiem – ✓.
- `/order/native` prezentuje listę modeli i CTA do formularza – ✓.
- Do ustalenia: backend (n8n / email) oraz treść zgody RODO (placeholder).

## SEO i dostępność
- Metadata:
  - Strony: `Home`, `Catalog`, `Product`, `Order`, `Contact`, `About` mają ustawione `title`/`description` – ✓.
  - `generateMetadata` dla produktów w oparciu o mock SEO – ✓.
  - Brak `robots.txt`/`sitemap.ts` – TODO przed publikacją.
- A11y:
  - Hierarchia nagłówków logiczna – ✓.
  - Alt-texty w galerii i portfolio – ✓ (placeholdery opisowe).
  - Focus styles dedykowane (`outline` + `box-shadow`) – ✓.
  - Formularze i filtry mają label/aria-live – ✓.
  - Modal zamówień wymaga dodatkowego przetestowania focus trap (do zaplanowania) – TODO.

## Język i treści
- Domyślny język: polski (`lang="pl"`) – ✓.
- Copy: hero, proces, portfolio, kontakt w PL; About pozostaje placeholderem – TODO na akceptację.
- Styl: "średniowieczny minimalizm" – wizualnie jasny motyw, docelowo do ujednolicenia z tokens – w toku.
- Nazwy modeli zgodne z `ORDER_MODELS` i mockami – ✓.

## Wymogi legalne i operacyjne
- `robots.txt`, `sitemap.xml` – brak implementacji (Next generatory do uruchomienia) – TODO.
- Linki do polityki prywatności/regulaminu – brak (footer placeholder) – TODO.
- Informacja o prawach autorskich – brak w UI (do zaprojektowania we footerze) – TODO.

## Elementy dodatkowe dla klikowalnego MVP
- Sticky header + skip link – ✓.
- Panel klienta: rejestracja, logowanie, historia zamówień i newsletter (mock) – ✓.
- Footer – obecnie minimalny (copyright brak) – TODO.
- Loading states: katalog ma skeleton, produkt/iframe rely on native fallback – dodać w razie potrzeby.
- Testowe dane (mock JSON/TS) – ✓.

## Checklisty kontrolne
- [x] Określono ścieżkę użytkownika Home → Catalog → Product → Contact/Order.
- [x] Zdefiniowano funkcjonalności katalogu (filtry, sortowanie, empty state).
- [x] Opisano elementy strony produktu (galeria, warianty, CTA) i wdrożono w kodzie.
- [x] Zebrano wymagania SEO/a11y (zaktualizowane o status modalów i sitemap).
- [ ] Zatwierdzono treści About + RODO przez właściciela.
- [ ] Dodano legal footer + generację sitemap/robots.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak zaakceptowanych treści (About, zgoda RODO) może opóźnić publikację.
  - Brak backendu formularza = potencjalna utrata leadów.
  - Brak `robots.txt`/`sitemap` może obniżyć SEO.
- **Decyzje do podjęcia**
  - Czy formularz kontaktowy integrujemy z n8n / e-mail service w MVP?
  - Jakie minimalne informacje prawne muszą znaleźć się w footerze na starcie?
  - Czy modal zamówienia pozostaje w MVP, czy promujemy `/order/native` jako primary CTA?
- **Następne kroki**
  - Uzgodnić copy About i tekst zgody RODO.
  - Zaprojektować footer z linkami legal i informacją o prawach autorskich.
  - Przygotować generację `robots.txt` i `sitemap.ts` w App Routerze.
