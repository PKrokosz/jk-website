# Architektura i luki

## Meta audytu 2025-10-31
- **Status zagadnień**: Migracje Drizzle i seed referencyjny są wdrożone (`drizzle/0000`–`0003`, `pnpm db:seed`), a cache katalogu zasila teraz zarówno API, jak i strony `/catalog` oraz `/catalog/[slug]`. Otwarte pozostają: diagram przepływu danych, adopcja tokens oraz integracja `/cart` i `/group-orders` z backendem leadów.
- **Nowe ścieżki rozwoju**:
  - Przygotować diagram przepływu danych katalogu (API → cache → Drizzle → UI) i umieścić go w sekcji 4 wraz z planem obserwowalności.
  - Zaplanować zadanie na obsługę `prefers-reduced-motion` i modularyzację animacji (powiązane z `FRONTEND_INTERFACE_SPEC.md`).
  - Dostarczyć testy integracyjne UI/API (SSR katalogu, healthcheck) i monitorować degradację cache w `/api/catalog/health`.
- **Rekomendacja archiwizacji**: Nie — dokument nadal identyfikuje kluczowe ryzyka architektoniczne.
- **Sens dokumentu**: Prezentuje strukturę App Routera, layouty, warstwę danych i najważniejsze black-boxy. Stanowi podstawę do planowania refaktoryzacji i priorytetyzacji długu technicznego.
- **Aktualizacje wykonane**:
  - Uzupełniono sekcję warstwy danych o cache katalogu i podłączenie stron App Routera do API.
  - Zsynchronizowano opis repozytorium katalogu z dokumentacją `DANE_I_API_MVP.md`.
  - Dodano rekomendacje dotyczące obserwowalności i testów integracyjnych katalogu.

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
- Warstwa katalogowa (`src/lib/catalog`) korzysta z Drizzle (seed `product_template`), lokalnego cache oraz endpointów `/api/products` i `/api/products/[slug]`, które są teraz źródłem danych dla stron `/catalog` i `/catalog/[slug]`.
- Krytyczne luki: brak podpięcia App Routera pod Drizzle (mimo dostępnych migracji i seeda), brak konfiguracji design tokens w CSS (obecne wartości hard-coded) i brak backendu dla formularza kontaktowego.

## Routing App Routera
```
src/app
├── layout.tsx (RootLayout + metadata, skip link, header)
├── globals.css
├── page.tsx (Home)
├── about/
│   └── page.tsx
├── group-orders/
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
├── cart/
│   └── page.tsx (prefill zamówienia)
├── components/
│   └── PricingCalculator.tsx
├── healthz/
│   └── route.ts (GET)
├── privacy-policy/
│   └── page.tsx
├── terms/
│   └── page.tsx
├── robots.ts
├── sitemap.ts
└── api/
    ├── styles/
    │   └── route.ts (GET)
    ├── leather/
    │   └── route.ts (GET)
    ├── products/
    │   └── route.ts (GET)
    ├── pricing/
    │   └── quote/
    │       └── route.ts (POST)
    ├── contact/
    │   └── submit/
    │       └── route.ts (POST)
    ├── order/
    │   └── submit/
    │       └── route.ts (POST)
    └── legal/
        └── [document]/
            └── route.ts (GET)
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
  - `src/schema.ts` – definicje tabel: `style`, `leather`, `sole`, `option`, `customer`, `measurements`, `order`, `quote_requests`.
  - Migracje `drizzle/0000_breezy_cannonball.sql`–`0002_add_quote_requests.sql` tworzą słowniki katalogu i logi wycen; `pnpm db:migrate` stosuje je na dowolnym środowisku.
  - `packages/db/src/seed.ts` resetuje słowniki i odtwarza referencyjne rekordy z `seed-data.ts` (`pnpm db:seed`).
- Frontend (Next.js) korzysta z cache katalogu i Drizzle przez helpery w `src/lib/catalog`:
  - `api.ts` – `fetchCatalogStyles`, `fetchCatalogLeathers`, `fetchCatalogProducts`, `fetchCatalogProductDetail` z błędami `CatalogApiError` i cache Next.js.
  - `products.ts` – mapowanie templatek (`mapProductTemplateRow`, `createProductsFromTemplates`) oraz fallbackowe slug-i (`listProductSlugs`) używane przy degradacji.
  - `data.ts` – `catalogStyles`, `catalogLeathers` jako referencja i fallback testowy.
  - `types.ts` – definicje `CatalogProductDetail` (gallery, craftProcess, variants, `orderReference`).
- Formularz kontaktowy posiada backend (`/api/contact/submit`) z walidacją Zod, rate-limitami i integracją SMTP (transport konfigurowany przez env).
- Kalkulator wycen (`src/lib/pricing`) operuje na mockowanych cennikach (`ORDER_MODELS`, `ORDER_ACCESSORIES`) z możliwością zapisu logów wycen w tabeli `quote_requests`.
- Test `src/lib/catalog/__tests__/repository.drizzle.test.ts` weryfikuje, że `findActiveStyles`/`findActiveLeathers` zwracają dane Drizzle zgodne z fallbackiem katalogu (zamknięcie luki `x₆` w zakresie słowników).

## Black-boxy i warianty rozwiązania
| Luka / pytanie | Opis | Wariant A | Plusy | Minusy | Wariant B | Plusy | Minusy |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Cache katalogu | SSR `/catalog` i `/catalog/[slug]` bazuje na `resolveCatalogCache`, ale brak obserwowalności i testów integracyjnych | Wpiąć `/api/catalog/health` do monitoringu + dopisać testy SSR/API z realnym Drizzle | Wczesne ostrzeganie o degradacji cache, pewność danych w UI | Wymaga środowiska testowego i alertów | Pozostawić ręczne QA cache'u | Brak kosztu teraz | Ryzyko ukrytych degradacji i opóźnione reakcje |
| Konfiguracja DB | `.env.example` i `docker-compose.yml` używają `devuser/devpass@jkdb` | Zweryfikować secrets w CI/staging | Spójne środowiska, brak rozjazdów | Wymaga komunikacji z zespołem infra | Brak dodatkowych działań | Brak kosztu teraz | Ryzyko pominięcia aktualizacji secrets |
| Formularz kontaktowy | Brak backendu / wysyłki maili | Integracja z API (server action, n8n) | Realna obsługa leadów, brak manuali | Potrzebna infrastruktura i bezpieczeństwo | Pozostawić mock i CTA mailto | Zero kosztu teraz | Brak automatyzacji, UX ograniczony |
| UI tokens vs. CSS | Globals mają hard-coded wartości | Dodać design tokens do CSS custom properties / Tailwind | Spójność, łatwiejsze zmiany | Refactor styli globalnych | Pozostawić obecny styl | Szybkie MVP | Ryzyko rozjazdów kolorów i kontrastu |
| Modale zamówień | `OrderModalTrigger` otwiera modal w Home/Product | Zastąpić modala dedykowaną stroną `/order/native` | Mniej kodu klientowego, prostsze testy | Potencjalnie gorsza konwersja | Utrzymać modal + Ulepszyć A11y | Większa kontrola flow | Więcej pracy przy testach |

## Checklisty kontrolne
- [x] Zmapowano istniejące route'y App Routera.
- [x] Zidentyfikowano obecne metadane i layout.
- [x] Opisano aktualne wykorzystanie mocków katalogu i CTA zamówień.
- [x] Dodano proces migracji (`drizzle-kit`).
- [ ] Zrefaktoryzowano style globalne na bazie tokens.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak monitoringu cache katalogu utrudnia wykrycie degradacji `/api/products` i SSR katalogu w produkcji.
  - Hard-coded kolory w `globals.css` mogą rozjechać się z design tokens (kontrast, brand).
  - Formularz kontaktowy bez backendu = ryzyko utraty leadów.
- **Decyzje do podjęcia**
  - Priorytet dla migracji Drizzle vs. dalsze rozszerzenia katalogu.
  - Czy zachowujemy modal zamówienia, czy promujemy `/order/native` jako główne CTA.
  - Kiedy przenieść styling na system tokens (Tailwind/shadcn).
- **Następne kroki**
  - Przygotować diagram przepływu danych katalogu (UI ↔ cache ↔ Drizzle) i wpiąć `/api/catalog/health` do monitoringu.
  - Wprowadzić zmienne CSS odpowiadające tokens z `docs/UI_TOKENS.md`.
  - Zaprojektować integrację formularza kontaktowego (n8n / email service).
