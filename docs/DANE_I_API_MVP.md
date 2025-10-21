# Dane i API dla MVP

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Model danych produktu](#model-danych-produktu)
- [3. Mapowanie stylów i skór](#mapowanie-stylow-i-skor)
- [4. Zasilanie katalogu i produktu](#zasilanie-katalogu-i-produktu)
- [5. Kontrakty endpointów API](#kontrakty-endpointow-api)
- [6. Walidacja i obsługa błędów](#walidacja-i-obsluga-bledow)
- [7. Checklisty kontrolne](#checklisty-kontrolne)
- [8. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- MVP operuje na mockowanych danych w pamięci (`src/lib/catalog`) z rozszerzonym modelem (slug, kategorie, funnel stage, warianty, referencje do formularza zamówień).
- Endpointy `/api/styles`, `/api/leather`, `/api/pricing/quote` są dostępne; lista produktów i szczegóły obsługiwane są lokalnie (`CatalogExplorer`, `getProductBySlug`).
- Walidacja: statyczne typy TypeScript (`CatalogProductDetail`, `PricingRequest`), brak jeszcze schematów Zod – do dodania przy wprowadzaniu backendu.

## Model danych produktu
| Pole | Typ | Opis |
| --- | --- | --- |
| `id` | `string` | Identyfikator produktu (np. `model-szpic`). |
| `slug` | `string` | Używany w routingu `/catalog/[slug]`. |
| `name` | `string` | Nazwa modelu. |
| `styleId` | `number` | Odniesienie do `CatalogStyle`. |
| `leatherId` | `number` | Odniesienie do `CatalogLeather`. |
| `description` | `string` | Opis główny. |
| `highlight` | `string` | Krótki wyróżnik. |
| `priceGrosz` | `number` | Cena brutto w groszach (wyliczana z `style.basePriceGrosz + leather.priceModGrosz` lub `priceOverride`). |
| `category` | `"footwear" \| "accessories" \| "hydration" \| "care"` | Segment katalogu. |
| `categoryLabel` | `string` | Tekst badge kategorii. |
| `funnelStage` | `"TOFU" \| "MOFU" \| "BOFU"` | Etap lejka sprzedażowego użyty na stronie produktu. |
| `funnelLabel` | `string` | Wyjaśnienie etapu lejka. |
| `orderReference` | `CatalogOrderReference?` | Powiązanie z modelem/akcesorium w formularzu natywnym. |
| `gallery` | `CatalogProductImage[]` | Lista obrazów (`src`, `alt`). |
| `variants` | `{ colors: Array<{ id: string; name: string; leatherId: number }>; sizes: number[]; }` | Warianty personalizacji. |
| `craftProcess` | `string[]` | Kroki procesu rzemieślniczego do sekcji "Detale". |
| `seo` | `{ title: string; description: string; keywords: string[] }` | Metadata produktu. |

## Mapowanie stylów i skór
- Styl (`CatalogStyle`) → `id`, `slug`, `name`, `era`, `description`, `basePriceGrosz`.
- Skóra (`CatalogLeather`) → `id`, `name`, `color`, `finish`, `priceModGrosz`, `description`.
- Produkt korzysta z map:
  - `priceGrosz` obliczany z `basePriceGrosz + priceModGrosz` (nadpisywany `priceOverrideGrosz` jeśli podany w template).
  - `variantLeatherIds` mapują się na `CatalogLeather` i generują badge kolorów.
  - `orderReference` tworzony przez helper `mapOrderReference` na podstawie `ORDER_MODELS` i `ORDER_ACCESSORIES`.

## Zasilanie katalogu i produktu
- **Katalog (`/catalog`)**
  - Importuje `catalogStyles`, `catalogLeathers`, `createProductSummaries()` z `products.ts`.
  - `CatalogExplorer` filtruje lokalnie (bez API) – sortowanie, filtry, aria-live.
  - CTA kart kieruje do `/catalog/[slug]`.
- **Produkt (`/catalog/[slug]`)**
  - `getProductBySlug(slug, styles, leathers)` zwraca `CatalogProductDetail` z galerą, wariantami i CTA.
  - `generateStaticParams` wykorzystuje `listProductSlugs()` do pre-renderu.
  - Brak SSR fetch – dane z pliku TS.
- **Order/Contact**
  - `OrderModalTrigger` wykorzystuje `orderReference` do preselektowania parametrów (URL query) w `/order/native`.
  - Formularz kontaktowy przyjmuje `product` w query (`/contact?product=slug`) – do zaimplementowania autopodpowiedzi (TODO).

## Kontrakty endpointów API
| Endpoint | Metoda | Input | Output | Notatki |
| --- | --- | --- | --- | --- |
| `/api/styles` | GET | brak | `{ data: CatalogStyle[] }` | Cache domyślny (ISR) – do rozważenia `revalidate`. |
| `/api/leather` | GET | brak | `{ data: CatalogLeather[] }` | Mockowe dane z `data.ts`. |
| `/api/pricing/quote` | POST | `PricingRequest` (`modelId`, `leatherId`, `accessories`, `rushOrder`) | `{ ok: true; quote: PricingQuote; payload; requestedAt }` | Zwraca orientacyjną cenę; brak walidacji Zod. |
| `/api/products` | — | brak | — | Brak endpointu – filtracja po stronie klienta (zostawione do czasu integracji z DB). |
| `/api/products/[slug]` | — | brak | — | Niezaimplementowane – strona produktu korzysta z funkcji bibliotecznych. |

## Walidacja i obsługa błędów
- Walidacja requestów API: brak Zod – dodać `PricingRequestSchema`, `QuoteResponseSchema`.
- Komponenty UI:
  - `CatalogExplorer` obsługuje brak wyników tekstem.
  - `ProductPage` wywołuje `notFound()` dla nieistniejącego sluga; brak fallbacku `error.tsx` (opcjonalny future work).
  - `ContactForm` waliduje pola klientowo (regex email, required, consent) i ustawia `status` + komunikaty.
- Logging: `console.error` w `ContactForm` do rozważenia przy integracji backendu.

## Checklisty kontrolne
- [x] Zdefiniowano model danych produktu z kategoriami i wariantami.
- [x] Opisano, jak zasilać katalog i produkt bez back-endu.
- [x] Spisano aktualne endpointy i ich status.
- [ ] Dodano schematy Zod dla `PricingRequest` i potencjalnych API produktów.
- [ ] Utworzono backend dla formularza kontaktowego / autopodpowiedź `product`.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Mocki mogą rozjechać się z przyszłym schematem DB – konieczne mapowanie podczas migracji.
  - Brak walidacji w API (`/api/pricing/quote`) może dopuścić niepoprawne payloady.
  - Brak endpointu `/api/products` ogranicza re-use danych w przyszłych integracjach (np. SSR/CSR fetch).
- **Decyzje do podjęcia**
  - Czy potrzebujemy `/api/products` przed integracją z Drizzle?
  - Jak mapować `orderReference` przy przejściu na realne dane (np. ID z bazy)?
  - Czy `ContactForm` powinien wypełniać pole produktu na podstawie query paramu automatycznie?
- **Następne kroki**
  - Dodać walidację Zod i testy dla `calculateQuote` + endpointu.
  - Przygotować konwersję mocków do seeda Drizzle (JSON/SQL).
  - Zaplanować API `/api/products` oparte na Drizzle lub co najmniej `GET /api/products/[slug]` z mocków.
