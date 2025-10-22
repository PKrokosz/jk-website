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
- Referencyjne dane katalogu (style, skóry, podeszwy, opcje) żyją w pakiecie `@jk/db` i są seedowane do Postgresa (`packages/db/src/seed.ts`).
- Endpointy `/api/styles`, `/api/leather`, `/api/products`, `/api/pricing/quote` są dostępne; `/api/styles`, `/api/leather` i `/api/products` korzystają z Drizzle ORM (styl/skóra) oraz templatek katalogowych.
- Front (`/catalog`, `/catalog/[slug]`) konsumuje dane przez API Next.js, wykorzystując `fetchCatalogStyles`/`fetchCatalogLeathers` z revalidacją ISR.
- Walidacja: statyczne typy TypeScript (`CatalogProductDetail`, `PricingRequest`) uzupełnione o schematy Zod w backendzie produktów i formularza kontaktowego.
- MVP operuje na mockowanych danych w pamięci (`src/lib/catalog`) z rozszerzonym modelem (slug, kategorie, funnel stage, warianty, referencje do formularza zamówień).
- Endpointy `/api/styles`, `/api/leather`, `/api/products`, `/api/pricing/quote` są dostępne; `/api/products` obsługuje listę produktów i szczegóły na podstawie templatek katalogowych i danych z bazy.
- Walidacja: statyczne typy TypeScript (`CatalogProductDetail`, `PricingRequest`) uzupełnione o schematy Zod w backendzie produktów i formularza kontaktowego.

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
  - Wczytuje dane przez `fetchCatalogStyles()` i `fetchCatalogLeathers()` (Next.js route handlers + Drizzle).
  - `CatalogExplorer` filtruje lokalnie – sortowanie, filtry, aria-live.
  - CTA kart kieruje do `/catalog/[slug]`.
- **Produkt (`/catalog/[slug]`)**
  - `getProductBySlug(slug, styles, leathers)` otrzymuje dane z API; w razie błędu strona zwraca fallback z komunikatem.
  - `generateStaticParams` wykorzystuje `listProductSlugs()` do pre-renderu (wciąż z templatek).
  - Metadane generowane są na podstawie danych z API; w razie błędu zwracany jest fallback.
- **Order/Contact**
  - `OrderModalTrigger` wykorzystuje `orderReference` do preselektowania parametrów (URL query) w `/order/native`.
  - Formularz kontaktowy przyjmuje `product` w query (`/contact?product=slug`) i automatycznie uzupełnia pole formularza, jeśli parametr jest obecny.

## Kontrakty endpointów API
| Endpoint | Metoda | Input | Output | Notatki |
| --- | --- | --- | --- | --- |
| `/api/styles` | GET | brak | `{ data: CatalogStyle[] }` | Dane z tabeli `style` (Drizzle ORM, revalidate 3600 s). |
| `/api/leather` | GET | brak | `{ data: CatalogLeather[] }` | Dane z tabeli `leather` (Drizzle ORM, revalidate 3600 s). |
| `/api/pricing/quote` | POST | `PricingRequest` (`modelId`, `leatherId`, `accessories`, `rushOrder`) | `{ ok: true; quote: PricingQuote; payload; requestedAt }` | Zwraca orientacyjną cenę; brak walidacji Zod. |
| `/api/contact/submit` | POST | `{ name, email, phone?, message, product?, website? }` | `{ ok: true }` lub `{ error }` | Walidacja Zod, rate-limit per IP, honeypot `website`, wysyłka maila przez SMTP. |
| `/api/products` | GET | `?slug?` | `{ data: CatalogProductSummary[] }` lub `{ data: CatalogProductDetail }` | Lista produktów katalogu lub szczegóły pojedynczego produktu. Walidacja query i payloadu w Zod. |
| `/api/products/[slug]` | — | brak | — | Niezaimplementowane – strona produktu korzysta z funkcji bibliotecznych. |

## Walidacja i obsługa błędów
- Walidacja requestów API: dodano schematy Zod dla `/api/products` (query i payload), nadal brak dla `PricingRequest`/`QuoteResponse`.
- Komponenty UI:
  - `CatalogExplorer` obsługuje brak wyników tekstem.
  - `ProductPage` wywołuje `notFound()` dla nieistniejącego sluga; brak fallbacku `error.tsx` (opcjonalny future work).
- `ContactForm` waliduje pola klientowo (regex email, min 10 znaków, zgoda) i korzysta z API `/api/contact/submit` z walidacją Zod oraz kodami błędów 422/429/502.
- Logging: `console.error` w `ContactForm` do rozważenia przy integracji backendu.

## Checklisty kontrolne
- [x] Zdefiniowano model danych produktu z kategoriami i wariantami.
- [x] Opisano, jak zasilać katalog i produkt bez back-endu.
- [x] Zaktualizowano opis połączenia z Drizzle (API + seedy współdzielone z `@jk/db`).
- [x] Spisano aktualne endpointy i ich status.
- [ ] Dodano schematy Zod dla `PricingRequest` i potencjalnych API produktów.
- [x] Utworzono backend dla formularza kontaktowego (`/api/contact/submit`).
- [x] Autopodpowiedź pola `product` w formularzu na podstawie query paramu.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Błędy połączenia z bazą zwracają fallback UI na stronach katalogu/produktu – brak jeszcze mechanizmu retry/alertingu.
  - Brak walidacji w API (`/api/pricing/quote`) może dopuścić niepoprawne payloady.
  - Brak endpointu `/api/products` ogranicza re-use danych w przyszłych integracjach (np. SSR/CSR fetch).
- **Decyzje do podjęcia**
  - Czy potrzebujemy `/api/products` przed integracją z Drizzle?
  - Jak mapować `orderReference` przy przejściu na realne dane (np. ID z bazy)?
  - Autopodpowiedź pola `product` w `ContactForm` na podstawie query paramu – ✅ wdrożona (prefill po stronie klienta).
- **Następne kroki**
  - Dodać walidację Zod i testy dla `calculateQuote` + endpointu.
  - Przygotować konwersję mocków do seeda Drizzle (JSON/SQL).
  - Zaplanować API `/api/products` oparte na Drizzle lub co najmniej `GET /api/products/[slug]` z mocków.
