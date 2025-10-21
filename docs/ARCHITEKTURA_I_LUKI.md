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
- Routing App Routera obejmuje Home, Catalog (statyczny), Product (dynamiczny slug), Order (iframe + natywny landing), Contact (formularz) i About.
- Globalny layout (`src/app/layout.tsx`) dostarcza metadata SEO, skip link, sticky header oraz wrapper `main-content` dla dostępności.
- Mocki katalogowe (`src/lib/catalog`) generują produkty z kategoriami, funnel stage, wariantami oraz referencjami do formularza zamówień; integracja z Drizzle pozostaje do wykonania.
- Krytyczne luki: brak migracji `drizzle-kit`, niespójny `DATABASE_URL`, brak konfiguracji design tokens w CSS (obecne wartości hard-coded) i brak backendu dla formularza kontaktowego.

## Routing App Routera
```
src/app
├── layout.tsx (RootLayout + metadata, skip link, header)
├── globals.css
├── page.tsx (Home)
├── about/
│   └── page.tsx
├── catalog/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx (dynamic product detail + metadata)
├── contact/
│   └── page.tsx
├── order/
│   ├── page.tsx (iframe embed)
│   └── native/
│       └── page.tsx (lista modeli + CTA)
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
- Dynamiczna strona produktu korzysta z `generateStaticParams` i `generateMetadata` opartych na mockach.
- Order posiada dwa warianty: `/order` (iframe) oraz `/order/native` (fallback + CTA), co wymaga spójnych linków w CTA i modalu.

## Layouty i metadata
- `RootLayout` ustawia `metadataBase`, `title` z template, OpenGraph, Twitter Card, `lang="pl"` i `body.site-body`.
- Skip link prowadzi do `#main-content`, wrapper `div` w `layout.tsx` ma `id="main-content"` (testowane w `layout.test.tsx`).
- Strony deklarują własne metadata:
  - `catalog/page.tsx` – `title`, `description`, `alternates`.
  - `catalog/[slug]/page.tsx` – `generateMetadata` z fallbackiem na "Model niedostępny".
  - `order/page.tsx` – `alternates.canonical` i `openGraph`.
  - `contact/page.tsx` – `title`, `description` dopasowane do formularza.
- Brak dynamicznego `robots.txt` / `sitemap.ts` – do rozważenia przy wdrożeniu SEO.

## Warstwa danych i Drizzle ORM
- Pakiet `@jk/db`:
  - `src/lib/db.ts` – inicjalizacja `drizzle(pool)` na podstawie `DATABASE_URL` (wymagana zmienna środowiskowa).
  - `src/schema.ts` – definicje tabel: `style`, `leather`, `sole`, `option`, `customer`, `measurements`, `order` (brak migracji).
  - Brak konfiguracji `drizzle.config.ts` i CLI migracji.
- Frontend (Next.js) korzysta z mocków w `src/lib/catalog`:
  - `data.ts` – `catalogStyles`, `catalogLeathers` (rozszerzone o `slug`, `description`, `priceModGrosz`).
  - `products.ts` – `listProductSlugs`, `getProductBySlug`, generacja `CatalogProductSummary`/`Detail` z kategoriami, funnel stage, orderReference.
  - `types.ts` – definicje `CatalogProductDetail` (gallery, craftProcess, variants, `orderReference`).
- Formularz kontaktowy działa client-side (`ContactForm`), brak backendu – na MVP symuluje wysyłkę `setTimeout`.
- Kalkulator wycen (`src/lib/pricing`) operuje na mockowanych cennikach (`ORDER_MODELS`, `ORDER_ACCESSORIES`).

## Black-boxy i warianty rozwiązania
| Luka / pytanie | Opis | Wariant A | Plusy | Minusy | Wariant B | Plusy | Minusy |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Migracje Drizzle | Brak `drizzle-kit` i migracji | Dodać `drizzle-kit`, `drizzle.config.ts`, workflow seeda | Standaryzowane migracje, gotowość pod prod | Wymaga czasu na konfigurację, pipeline Docker | Pozostać na mockach do czasu integracji | Zero kosztu teraz | Dług techniczny, brak pewności danych |
| Konfiguracja DB | `.env.example` ≠ `docker-compose.yml` | Ujednolicić do `devuser/devpass@jkdb` + dokumentacja | Koniec niespójności, łatwiejszy onboarding | Wymaga zmian w dotychczasowych envach | Pozostawić jak jest + komentarz | Brak zmian | Ryzyko błędów przy startach |
| Formularz kontaktowy | Brak backendu / wysyłki maili | Integracja z API (server action, n8n) | Realna obsługa leadów, brak manuali | Potrzebna infrastruktura i bezpieczeństwo | Pozostawić mock i CTA mailto | Zero kosztu teraz | Brak automatyzacji, UX ograniczony |
| UI tokens vs. CSS | Globals mają hard-coded wartości | Dodać design tokens do CSS custom properties / Tailwind | Spójność, łatwiejsze zmiany | Refactor styli globalnych | Pozostawić obecny styl | Szybkie MVP | Ryzyko rozjazdów kolorów i kontrastu |
| Modale zamówień | `OrderModalTrigger` otwiera modal w Home/Product | Zastąpić modala dedykowaną stroną `/order/native` | Mniej kodu klientowego, prostsze testy | Potencjalnie gorsza konwersja | Utrzymać modal + Ulepszyć A11y | Większa kontrola flow | Więcej pracy przy testach |

## Checklisty kontrolne
- [x] Zmapowano istniejące route'y App Routera.
- [x] Zidentyfikowano obecne metadane i layout.
- [x] Opisano aktualne wykorzystanie mocków katalogu i CTA zamówień.
- [ ] Dodano proces migracji (`drizzle-kit`).
- [ ] Zrefaktoryzowano style globalne na bazie tokens.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak migracji utrudni integrację zamówień i przyszłe endpointy.
  - Hard-coded kolory w `globals.css` mogą rozjechać się z design tokens (kontrast, brand).
  - Formularz kontaktowy bez backendu = ryzyko utraty leadów.
- **Decyzje do podjęcia**
  - Priorytet dla migracji Drizzle vs. dalsze rozszerzenia katalogu.
  - Czy zachowujemy modal zamówienia, czy promujemy `/order/native` jako główne CTA.
  - Kiedy przenieść styling na system tokens (Tailwind/shadcn).
- **Następne kroki**
  - Przygotować `drizzle.config.ts` i pierwszą migrację inicjalną.
  - Wprowadzić zmienne CSS odpowiadające tokens z `docs/UI_TOKENS.md`.
  - Zaprojektować integrację formularza kontaktowego (n8n / email service).
