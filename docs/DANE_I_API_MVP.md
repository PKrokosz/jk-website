# Dane i API dla MVP

- **Status zagadnień**: Template produktów przeniesiono do seeda/migracji Drizzle, `/api/products` i `/api/products/[slug]` korzystają z cache `resolveCatalogCache`, a strony `/catalog` i `/catalog/[slug]` pobierają dane z API. Testy repozytorium pokrywają style, skóry i template produktów zarówno w trybie Drizzle, jak i fallback.
- **Nowe ścieżki rozwoju**:
  - Dopisać testy integracyjne/SSR sprawdzające render `/catalog` i `/catalog/[slug]` na realnej bazie (z użyciem `pnpm test:integration`).
  - Rozszerzyć `JAKOSC_TESTY_CI.md` o checklistę uruchamiania `pnpm db:seed`, `pnpm test:integration` oraz logów healthchecku katalogu.
  - Zaplanować mechanizm obserwowalności (alert przy `status: degraded/error` z `/api/catalog/health`).
- **Rekomendacja archiwizacji**: Nie — dokument pozostaje źródłem prawdy dla modelu danych i kontraktów API.
- **Sens dokumentu**: Definiuje schemat produktu, mapowanie stylów/skór oraz opisuje kontrakty API wykorzystywane przez UI i testy.
- **Aktualizacje wykonane**:
  - Uzupełniono seeda Drizzle o template produktów (`product_template`) wraz z migracją SQL i scenariuszami testowymi.
  - Udokumentowano lokalny cache katalogu oraz healthcheck `/api/catalog/health` raportujący źródła danych i statystyki cache.
  - Zaktualizowano kontrakty API o dynamiczny endpoint `/api/products/[slug]` i nowy mechanizm fallbacku; strony katalogu wykorzystują teraz `fetchCatalogProducts`/`fetchCatalogProductDetail`.
  - 2025-11-04 — Ujednolicono degradację katalogu: wszystkie endpointy (`/api/products`, `/api/products/[slug]`, `/api/styles`, `/api/leather`) przełączają się na dane referencyjne `resolveCatalogCache` przy braku `DATABASE_URL`, co zostało pokryte testami jednostkowymi.
  - 2025-11-09 — Dodano mockowanie `fetch` podczas `next build`, aby build-time korzystał z cache katalogu bez hałasu logów `fetch failed`.

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
- Referencyjne dane katalogu (style, skóry, template produktów, podeszwy, opcje) żyją w pakiecie `@jk/db` i są seedowane do Postgresa (`packages/db/src/seed.ts`, `pnpm db:seed`).
- Endpointy `/api/styles`, `/api/leather`, `/api/products`, `/api/products/[slug]`, `/api/pricing/quote`, `/api/contact/submit`, `/api/order/submit`, `/api/legal/[document]`, `/api/catalog/health` są dostępne; cała rodzina katalogowa (`/api/products`, `/api/products/[slug]`, `/api/styles`, `/api/leather`) korzysta z cache `resolveCatalogCache` i w razie braku `DATABASE_URL` zwraca dane fallbackowe wraz z ostrzeżeniem w logach.
- Front (`/catalog`, `/catalog/[slug]`, `/cart`, `/group-orders`) konsumuje dane przez API Next.js; katalog korzysta z cache `/api/products`/`[slug]`, a fallback mocków pozostaje jedynie na potrzeby testów i build-time.
- Walidacja: statyczne typy TypeScript (`CatalogProductDetail`, `PricingRequest`) uzupełnione o schematy Zod w backendzie produktów, formularza kontaktowego i zamówień.

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

### Tabela `quote_requests` (logi wycen)
| Kolumna | Typ | Opis |
| --- | --- | --- |
| `id` | `number` | Klucz główny rekordu logu. |
| `ip_address` | `string` | Adres IP klienta wykonującego zapytanie o wycenę. |
| `user_agent` | `string?` | User-agent przeglądarki (opcjonalny, służy do analizy nadużyć). |
| `payload` | `Record<string, unknown>` | Zweryfikowany request `PricingRequest` zapisany jako JSONB. |
| `quote` | `Record<string, unknown>` | Wygenerowana odpowiedź wyceny (JSONB) zwracana klientowi. |
| `requested_at` | `Date` | Timestamp z momentu utworzenia logu (domyślnie `now()`). |

## Mapowanie stylów i skór
- Styl (`CatalogStyle`) → `id`, `slug`, `name`, `era`, `description` (Drizzle: `description_md`), `basePriceGrosz`.
- Skóra (`CatalogLeather`) → `id`, `name`, `color`, `finish`, `priceModGrosz`, `description` (Drizzle: `description`).
- Produkt korzysta z map:
  - `priceGrosz` obliczany z `basePriceGrosz + priceModGrosz` (nadpisywany `priceOverrideGrosz` jeśli podany w template).
  - `variantLeatherIds` mapują się na `CatalogLeather` i generują badge kolorów.
  - `orderReference` tworzony przez helper `mapOrderReference` na podstawie `ORDER_MODELS` i `ORDER_ACCESSORIES`.

## Zasilanie katalogu i produktu
- **Katalog (`/catalog`)**
  - Wczytuje dane przez `fetchCatalogStyles()`, `fetchCatalogLeathers()` oraz `fetchCatalogProducts()` (Next.js route handlers + Drizzle + cache).
  - `CatalogExplorer` filtruje lokalnie – sortowanie, filtry, aria-live.
  - CTA kart kieruje do `/catalog/[slug]`.
  - Test `src/lib/catalog/__tests__/repository.drizzle.test.ts` potwierdza zgodność danych Drizzle z fallbackiem katalogu.
- **Produkt (`/catalog/[slug]`)**
  - `fetchCatalogProductDetail(slug)` zasila SSR i metadane; 404 kończy się `notFound()`, a błędy zwracają fallback.
  - `generateStaticParams` próbuje zbudować listę slugów z `/api/products`, a w razie degradacji wraca do `listProductSlugs()`.
  - Metadane generowane są na podstawie danych z API z fallbackiem przy błędach.

### Symulacja katalogu bez bazy
- `next build` automatycznie ustawia `process.env.NEXT_PHASE=phase-production-build`, co przełącza fetchery katalogu w tryb mocka i każe im korzystać z `resolveCatalogCache()`.
- W środowiskach bez bazy ustaw zmienną `MOCK_CATALOG_FETCH=1`, aby wymusić mock zarówno dla SSR, jak i podczas lokalnych testów/preview (`pnpm build`, `pnpm start`).
- Mockowana odpowiedź odtwarza payload API: `/api/styles` i `/api/leather` zwracają listy referencyjne, `/api/products` zwraca `CatalogProductSummary[]`, a `/api/products/[slug]` korzysta z `cache.detailsBySlug` i sygnalizuje `CatalogApiError` 404 przy nieznanym slug.
- Mechanizm loguje jednokrotne info (`Mockujemy fetch katalogu…`), dzięki czemu w logach builda łatwo rozpoznać, że działamy w trybie referencyjnym.
- **Order/Contact**
  - `OrderModalTrigger` wykorzystuje `orderReference` do preselektowania parametrów (URL query) w `/order/native`.
  - Formularz kontaktowy przyjmuje `product` w query (`/contact?product=slug`) i automatycznie uzupełnia pole formularza, jeśli parametr jest obecny.

## Kontrakty endpointów API
| Endpoint | Metoda | Input | Output | Notatki |
| --- | --- | --- | --- | --- |
| `/api/styles` | GET | brak | `{ data: CatalogStyle[] }` | Dane z tabeli `style` (Drizzle ORM, revalidate 3600 s). Brak `DATABASE_URL` → fallback cache + ostrzeżenie w logach. |
| `/api/leather` | GET | brak | `{ data: CatalogLeather[] }` | Dane z tabeli `leather` (Drizzle ORM, revalidate 3600 s). Brak `DATABASE_URL` → fallback cache + ostrzeżenie w logach. |
| `/api/pricing/quote` | POST | `PricingRequest` (`modelId`, `leatherId`, `accessories`, `rushOrder`) | `{ ok: true; quote: PricingQuote; payload; requestedAt }` | Zwraca orientacyjną cenę; walidacja request/response w Zod. |
| `/api/contact/submit` | POST | `{ name, email, phone?, message, product?, website? }` | `{ ok: true }` lub `{ error }` | Walidacja Zod, rate-limit per IP, honeypot `website`, wysyłka maila przez SMTP. |
| `/api/products` | GET | brak | `{ data: CatalogProductSummary[] }` | Lista produktów generowana na podstawie cache `resolveCatalogCache` (Drizzle + fallback). Brak `DATABASE_URL` → fallback cache + ostrzeżenie. |
| `/api/products/[slug]` | GET | Param `slug` | `{ data: CatalogProductDetail }` | Szczegóły produktu pobrane z cache katalogu, 404 dla braku wpisu. Brak `DATABASE_URL` → fallback cache + ostrzeżenie. |
| `/api/catalog/health` | GET | brak | `{ ok, status, counts, sources, cache }` | Healthcheck katalogu odświeżający cache (status `healthy/degraded/error`). |

## Walidacja i obsługa błędów
- Walidacja requestów API: `/api/products` (query i payload) oraz `/api/pricing/quote` (request + response) korzystają z Zod.
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
- [x] Dodano schematy Zod dla `PricingRequest` i potencjalnych API produktów.
- [x] Utworzono backend dla formularza kontaktowego (`/api/contact/submit`).
- [x] Autopodpowiedź pola `product` w formularzu na podstawie query paramu.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Błędy połączenia z bazą (np. brak `DATABASE_URL`) przełączają wszystkie endpointy katalogu na dane fallbackowe – konieczny monitoring ostrzeżeń i alerting healthchecku, by wychwycić długotrwałe działanie w trybie zdegradowanym.
  - Walidacja `/api/pricing/quote` zabezpieczona schematami Zod i testami kontraktowymi (monitorować pokrycie przypadków edge).
  - Brak endpointu `/api/products` ogranicza re-use danych w przyszłych integracjach (np. SSR/CSR fetch).
- **Decyzje do podjęcia**
  - Czy potrzebujemy `/api/products` przed integracją z Drizzle?
  - Jak mapować `orderReference` przy przejściu na realne dane (np. ID z bazy)?
  - Autopodpowiedź pola `product` w `ContactForm` na podstawie query paramu – ✅ wdrożona (prefill po stronie klienta).
- **Następne kroki**
  - ✅ Zaimplementowano persystencję danych wycen (`quote_requests`) wraz z rate-limitami per IP i logowaniem user-agentów.
  - Przygotować konwersję mocków do seeda Drizzle (JSON/SQL).
  - Zaplanować API `/api/products` oparte na Drizzle lub co najmniej `GET /api/products/[slug]` z mocków.
