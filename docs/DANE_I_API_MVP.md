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
- MVP operuje na mockowanych danych w pamięci (bez modyfikacji schematu DB).
- Model produktu łączy `style`, `leather`, warianty (kolor/rozmiar) i galerię placeholderów.
- Endpointy `/api/styles` i `/api/leather` pozostają bez zmian; dodajemy `/api/products` (lista) oraz `/api/products/[slug]` (szczegóły) po stronie mocków.
- Walidacja: Zod na warstwie API + typy TypeScript (`CatalogProductDetail`).

## Model danych produktu
| Pole | Typ | Opis |
| --- | --- | --- |
| `id` | `string` | Identyfikator produktu (np. `prod-1`). |
| `slug` | `string` | Używany w routingu `/catalog/[slug]`. |
| `name` | `string` | Nazwa modelu. |
| `styleId` | `number` | Odniesienie do `CatalogStyle`. |
| `leatherId` | `number` | Odniesienie do `CatalogLeather`. |
| `description` | `string` | Opis główny. |
| `highlight` | `string` | Krótki wyróżnik. |
| `priceGrosz` | `number` | Cena brutto w groszach. |
| `gallery` | `Array<{ src: string; alt: string }>` | Placeholder obrazów (lokalne `/public/placeholders/...`). |
| `variants` | `{ colors: Array<{ id: string; name: string; leatherId: number }>; sizes: number[]; }` | Listy wariantów. |
| `breadcrumbs` | `string[]` | Do generowania nawigacji (opcjonalne). |
| `seo` | `{ title: string; description: string; keywords: string[] }` | Custom metadata per produkt. |

## Mapowanie stylów i skór
- Styl (`CatalogStyle`) → cechy:
  - `name`, `era`, `basePriceGrosz`.
  - `slug` może być użyty do generowania kategorii (np. `courtly-riding-boot`).
- Skóra (`CatalogLeather`): `name`, `color`, `finish`, `priceModGrosz`.
- Produkt dziedziczy część informacji:
  - `priceGrosz = style.basePriceGrosz + leather.priceModGrosz` (już w `createMockProducts`).
  - `variants.colors` może bazować na innych `leather` o tym samym stylu.
- Mock: utworzyć dodatkowe pliki `src/lib/catalog/mock-products.ts` z rozszerzonym modelem (slug + galeria + warianty).

## Zasilanie katalogu i produktu
- **Katalog (`/catalog`)**
  - Importuje `styles`, `leathers`, `products` z mocków (`data.ts`, `products.ts` rozszerzony o slug/galerię).
  - `CatalogExplorer` otrzymuje `products` i generuje karty; CTA `Poznaj szczegóły` linkuje do `/catalog/${slug}`.
- **Produkt (`/catalog/[slug]`)**
  - Server Component pobiera dane z `getProductBySlug(slug)` (mock in-memory).
  - W przypadku braku sluga rzuca `notFound()` (Next).
  - Używa tych samych mocków `styles` i `leathers` do renderowania specyfikacji.
- **Bez zmian schematu**
  - Wszystkie dane trzymane w plikach TS/JSON (np. `src/lib/catalog/mock-product-details.ts`).
  - Umożliwia budowę MVP bez Postgresa; w przyszłości wymiana na Drizzle.

## Kontrakty endpointów API
| Endpoint | Metoda | Input | Output | Notatki |
| --- | --- | --- | --- | --- |
| `/api/styles` | GET | brak | `{ data: CatalogStyle[] }` | Już istnieje; dodaj cache `revalidate: 3600`. |
| `/api/leather` | GET | brak | `{ data: CatalogLeather[] }` | Już istnieje. |
| `/api/products` | GET | Query: `styleIds?`, `leatherIds?`, `sort?` | `{ data: CatalogProductSummary[] }` | Opcjonalne, może pozostać po stronie clienta; w MVP filtry lokalne. |
| `/api/products/[slug]` | GET | Param slug | `{ data: CatalogProductDetail }` | Alternatywa: generować SSG na podstawie mocków (bez fetchu). |
| `/api/pricing/quote` | POST | `PricingRequest` (z `options`) | `{ ok: true; quote: PricingQuote; payload; requestedAt }` | Istniejący endpoint; ewentualnie walidacja wejścia. |

`CatalogProductSummary` = subset (`id`, `slug`, `name`, `priceGrosz`, `styleId`, `leatherId`, `highlight`).
`CatalogProductDetail` = summary + `description`, `gallery`, `variants`, `seo`.

## Walidacja i obsługa błędów
- Walidacja requestów (MVP):
  - Użyć Zod do definicji schematów: `PricingRequestSchema`, `ProductFiltersSchema`.
  - W przypadku błędu zwrócić `400` z `{ error: "Invalid payload" }`.
- Obsługa błędów fetch w komponentach:
  - `CatalogPage` powinien mieć try/catch i fallback (np. `redirect('/contact?issue=data')` lub UI „Brak danych”).
  - `ProductPage` – `notFound()` dla braku sluga, `error.tsx` fallback dla wyjątków.
- Logging: w MVP wystarczy `console.error` w server action (z planem przeniesienia do observability).

## Checklisty kontrolne
- [x] Zdefiniowano model danych produktu z wariantami i galerią.
- [x] Opisano jak zasilać katalog i produkt bez zmian w DB.
- [x] Spisano kontrakty endpointów oraz typy odpowiedzi.
- [ ] Dodano schematy Zod w kodzie (do implementacji).
- [ ] Stworzono mock pliki `mock-product-details.ts`.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Mocki mogą rozjechać się z przyszłą bazą (konieczne mapowanie danych przy migracji).
  - Brak walidacji może doprowadzić do nieprzewidzianych błędów w API.
- **Decyzje do podjęcia**
  - Czy tworzymy endpoint `/api/products` w MVP, czy filtrujemy po stronie klienta z mocków?
  - Jakie zdjęcia/grafiki wykorzystujemy w galerii (placeholder vs real assets)?
- **Następne kroki**
  - Zaimplementować helpery `getProductBySlug` i `listProducts` w `src/lib/catalog`.
  - Dodać walidację Zod i fallback UI w komponentach stron.
