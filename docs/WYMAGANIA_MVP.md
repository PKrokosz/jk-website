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
- MVP obejmuje ścieżkę: Home → Catalog (z filtrami) → Product → Contact/Order stub.
- Globalna nawigacja musi być sticky, zawierać cztery główne linki i wskazywać aktywny stan.
- Katalog działa na mockowanych danych (styles/leathers) z możliwością sortowania i wielokrotnego filtrowania.
- Strona produktu zawiera galerię, opis, warianty oraz CTA „Zamów teraz” prowadzące do sekcji kontaktowej.
- SEO/a11y wymagają kompletnej metadata, semantyki nagłówków, altów, focus states i breadcrumbów.

## Nawigacja globalna
- Sticky header (top 0, backdrop blur) dostępny na każdej stronie.
- Linki: `Home`, `Catalog`, `About`, `Contact`.
- Aktywny stan: `aria-current="page"`, styl wizualny.
- Responsywność: mobile-first, zwijanie listy przy małej szerokości.
- CTA w brandzie prowadzące do `/`.

## Katalog produktów
- Źródło danych: mock z `src/lib/catalog` (styles, leathers, product templates) – bez zależności od bazy.
- Layout: grid kart produktu (min. 2 kolumny desktop, 1 mobile).
- Filtry (multi-select):
  - Styl (`styles.id`) – checkboxes.
  - Skóra (`leathers.id`) – checkboxes.
- Sortowanie: select `Nazwa A–Z` / `Nazwa Z–A` (domyślnie A–Z).
- Paginacja: brak (lista maks. ~8 kart w mocku).
- Stan pusty: informacja tekstowa przy braku wyników (już obecna w `CatalogExplorer`).
- Każda karta zawiera: nazwę, styl, skórę, highlight, cenę, CTA „Poznaj szczegóły” (docelowo link do produktu).

## Strona produktu
- Routing: `app/catalog/[slug]/page.tsx`.
- Treści minimalne:
  - Breadcrumb: `Home > Catalog > {Product}`.
  - Hero: nazwa, krótki opis, cena.
  - Galeria: placeholdery (3–4 zdjęcia, alt-y opisowe „Placeholder zdjęcia modelu {name}”).
  - Sekcja „Detale” (style/leather, highlight, proces).
  - Sekcja wariantów: lista dostępnych kolorów skóry (na start z mocku) + rozmiary (np. EU 39–46) – dane statyczne.
  - CTA „Zamów teraz” → link do `/contact` z anchor/parametrem (np. `?product=slug`).
- Stany dodatkowe:
  - Loading (suspense fallback, skeleton).
  - 404 – wyświetlana gdy slug nie istnieje w mockach.

## Kontakt / Zamówienie
- Strona `/contact` rozbudowana do prostego formularza (MVP):
  - Pola: Imię, Email (required), Telefon (optional), Wiadomość (textarea), checkbox zgody RODO placeholder.
  - CTA wysyła do `mailto:pracownia@jk-footwear.pl` (na start) lub wyświetla komunikat potwierdzenia (bez back-endu).
  - Sekcja informacyjna: adres pracowni, godziny kontaktu (placeholder), link do social (opcjonalnie).
- Alternatywnie: CTA „Wyślij e-mail” (jeśli formularz ma blokować MVP) – do potwierdzenia z właścicielem.

## SEO i dostępność
- Metadata:
  - Strony: `Home` (już), `Catalog`, `Product` (dynamiczne), `Contact`, `About` – w języku PL.
  - `robots.txt`, `sitemap.xml` generowane przez App Router (Next built-in).
- A11y:
  - Hierarchia nagłówków H1/H2/H3 logiczna per strona.
  - Alt-texty w galerii (nawet jeśli placeholder – opisy kontekstowe).
  - Focus styles zgodne z design tokens (kontrast >= 3:1).
  - Filtry i formularze opisane etykietami, `aria-live` dla wyników katalogu (już obecne).

## Język i treści
- Domyślny język: polski (lang="pl" w `RootLayout`).
- Bez i18n na MVP (brak `next-intl`).
- Copy docelowe do potwierdzenia (sekcje About, Contact, CTA). Placeholdery w PL.
- Stosować styl „średniowieczny minimalizm”: ton rzemieślniczy, ale zrozumiały.

## Wymogi legalne i operacyjne
- `robots.txt` – generowany automatycznie lub plik statyczny z allow all.
- `sitemap.xml` – generowany przez Next (`app/sitemap.ts`).
- Link w stopce (do dodania) do polityki prywatności i regulaminu (placeholdery).
- Informacja o prawach autorskich (footer) + ewentualny NIP/reg. firmy (do potwierdzenia).

## Elementy dodatkowe dla klikowalnego MVP
- Sticky header + skip link (`Przejdź do treści`).
- Footer z linkami: polityka, sociale, kontakt.
- Loading states dla katalogu (skeleton), product (fallback), contact (spinner/disabled state).
- Testowe dane (mock JSON) umożliwiające bezproblemową nawigację bez backendu.

## Checklisty kontrolne
- [x] Określono ścieżkę użytkownika Home → Catalog → Product → Contact.
- [x] Zdefiniowano funkcjonalności katalogu (filtry, sortowanie, empty state).
- [x] Opisano elementy strony produktu (galeria, warianty, CTA).
- [x] Zebrano wymagania SEO/a11y.
- [ ] Zatwierdzono treści i copy przez właściciela.
- [ ] Potwierdzono, czy formularz kontaktowy czy mailto w MVP.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak zaakceptowanych treści może opóźnić finalne copy na About/Contact.
  - Brak formularza (tylko mailto) może obniżyć konwersję MVP.
- **Decyzje do podjęcia**
  - Czy formularz kontaktowy ma być interaktywny (walidacja client-side) czy zastępujemy go linkiem mailto?
  - Jakie są minimalne informacje kontaktowe (adres, NIP) wymagane prawnie?
- **Następne kroki**
  - Przygotować design tokens i site mapę → `UI_TOKENS.md`, `SITE_MAP.md`.
  - Zdefiniować dane i kontrakty API → `DANE_I_API_MVP.md`.
