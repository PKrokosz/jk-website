# Architektura i luki

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Routing App Routera](#routing-app-routera)
- [3. Layouty i metadata](#layouty-i-metadata)
- [4. Warstwa danych i Drizzle ORM](#warstwa-danych-i-drizzle-orm)
- [5. Black-boxy i warianty rozwiązania](#black-boxy-i-warianty-rozwiazania)
- [6. Checklisty kontrolne](#checklisty-kontrolne)
- [7. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Routing App Routera pokrywa podstawowe sekcje (Home, Catalog, About, Contact) oraz endpointy API i `healthz`.
- Globalny layout (`src/app/layout.tsx`) dostarcza spójną metadata SEO (OpenGraph, Twitter) i sticky header.
- Drizzle ORM jest przygotowane w pakiecie `@jk/db`, lecz brak integracji z frontem (mockowane dane w `src/lib/catalog`).
- Krytyczne luki: brak szczegółów modelu produktu/wariantów, brak migracji (`drizzle-kit`), nieustalona strategia źródła danych dla katalogu/produktów.

## Routing App Routera
```
src/app
├── layout.tsx (RootLayout + metadata, lang="pl")
├── globals.css
├── page.tsx (Home)
├── about/
│   └── page.tsx
├── contact/
│   └── page.tsx
├── catalog/
│   └── page.tsx
├── components/
│   └── PricingCalculator.tsx
├── healthz/
│   └── route.ts (GET)
└── api/
    ├── styles/
    │   └── route.ts (GET)
    ├── leather/
    │   └── route.ts (GET)
    └── pricing/
        └── quote/
            └── route.ts (POST)
```
- Brak jeszcze ścieżek `catalog/[slug]` (produkt) oraz dodatkowych layoutów per-sekcja.
- Brak dedykowanego layoutu dla katalogu (wykorzystywana struktura globalna).

## Layouty i metadata
- `RootLayout` ustawia `metadataBase`, `title` z template, opisy, słowa kluczowe, OpenGraph, Twitter Card i favicon.
- `lang="pl"`, body `site-body` z globalną klasą; header wstawiany globalnie (sticky, w `Header`).
- Strony `about` i `contact` definiują własne `metadata.title`; `catalog` posiada `Metadata` z tytułem `"Catalog"` (do lokalizacji/SEO).
- Brak dynamicznych `generateMetadata` dla przyszłych produktów (`/catalog/[slug]`).

## Warstwa danych i Drizzle ORM
- Pakiet `@jk/db`:
  - `src/lib/db.ts` – inicjalizacja `drizzle(pool)` na podstawie `DATABASE_URL` (wymagana zmienna środowiskowa).
  - `src/schema.ts` – definicje tabel: `style`, `leather`, `sole`, `option`, `customer`, `measurements`, `order`.
  - Brak folderu `migrations/` i narzędzia `drizzle-kit` do generowania migracji.
  - Własny `docker-compose.yml` (Postgres 16, user `devuser`, pass `devpass`, db `jkdb`).
- Frontend (Next.js) korzysta z mocków:
  - `src/lib/catalog/data.ts` – tablice `catalogStyles`, `catalogLeathers`.
  - `src/lib/catalog/products.ts` – generator `createMockProducts` tworzący listę produktów na podstawie stylów i skór.
  - `src/lib/pricing/calc.ts` – logika kalkulatora (NIE korzysta z DB).
- Brak powiązania z Drizzle w route'ach API – aktualnie zwracają statyczne dane z `lib/catalog`.

## Black-boxy i warianty rozwiązania
| Luka / pytanie | Opis | Wariant A | Plusy | Minusy | Wariant B | Plusy | Minusy |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Źródło danych katalogu | Czy katalog/produkt w MVP ma korzystać z DB, czy mocków? | Mock w pliku (status quo) | Szybka implementacja, brak zależności od DB | Brak skalowania, konieczny refactor później | Połączenie z Drizzle (`style`, `leather`, `order`) | Realne dane, test migracji | Wymaga migracji, czasu na seed, Docker |
| Produkt `/catalog/[slug]` | Brak strony produktu i danych szczegółowych | Generacja z mocków + dynamic routes (file-based) | Brak zależności od backendu, szybki MVP | Mocki muszą obejmować galerię/variants | API server component korzystający z Drizzle | Realne dane, przygotowuje pod MTO | Wymaga wprowadzenia Drizzle do runtime (server actions) |
| Zamówienia / formularz | Brak decyzji co do procesu | Prosty formularz kontaktowy (mailto + stub) | Minimalny nakład, zgodny z wymaganiami MVP | Brak automatyzacji, manual handling | Integracja z DB (`order` table) | Przygotowuje do automatyzacji, strumień danych | Wysoki koszt implementacji, walidacje |
| Migracje Drizzle | Brak `drizzle-kit` i migracji | Dodanie `drizzle-kit` + pliku `drizzle.config.ts` | Standaryzowane migracje, CI-friendly | Wymaga czasu na konfigurację i pipeline | Pozostanie przy mockach, migracje po MVP | Szybsze MVP | Ryzyko długu technicznego i niespójności |
| Dane o wariantach | Model nie opisuje wariantów (rozmiar, kolor) | Hardkodowane warianty per produkt (mock) | Szybkie do wdrożenia, spełnia wymagania display | Brak skalowalności | Wydzielenie tabel (product_variant) w DB | Elastyczne, gotowe na MTO | Wymaga zmian schematu i migracji |

## Checklisty kontrolne
- [x] Zmapowano istniejące route'y App Routera.
- [x] Zidentyfikowano obecne metadane i layout.
- [x] Opisano aktualne wykorzystanie Drizzle ORM i mocków.
- [ ] Wybrano docelowy wariant dla źródła danych katalogu.
- [ ] Dodano proces migracji (`drizzle-kit`).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak migracji może utrudnić wdrożenie kolejnych funkcji (np. zamówień).
  - Mockowane dane mogą rozjechać się z docelowym schematem DB → refactor przy integracji.
- **Decyzje do podjęcia**
  - Który wariant z tabeli black-boxów wybieramy dla MVP (mock vs DB)?
  - Czy implementujemy `drizzle-kit` już teraz czy odkładamy do momentu integracji backendu?
- **Następne kroki**
  - Zaprojektować wymagania MVP (patrz `WYMAGANIA_MVP.md`).
  - Zdefiniować modele danych i kontrakty API (patrz `DANE_I_API_MVP.md`).
