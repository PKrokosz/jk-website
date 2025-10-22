# Pętla zadań transformacyjnych

> Ostatnia aktualizacja: 2025-10-29
>
> Celem dokumentu jest pilnowanie cyklicznych zadań wynikających z obserwacji `x` oraz ich transformacji (`-x`, `1/x`, `x²`, `xˣ`). Po domknięciu pętli usuń zrealizowane wpisy i dopisz nową iterację.

## Meta audytu 2025-10-29
- **Status zagadnień**: Iteracja 2025-10-22 została częściowo domknięta (`1/x₁`, `1/x₂`). Pozostałe transformacje wymagają kontynuacji i rozszerzenia o nowe obszary (`/group-orders`, `/cart`, SEO). Dokument nadal odzwierciedla backlog, ale potrzebuje nowej iteracji.
- **Nowe ścieżki rozwoju**:
  - Dodać zadanie bazowe `x₇`: utrzymanie sitemap/robots i structured data (powiązanie z `SEO_CHECKLIST.md`).
  - Rozszerzyć `x₄` o konkretne działania dla `prefers-reduced-motion` oraz wizualnych testów UI.
  - Zaplanować `x₈`: automatyczny audyt statusów dokumentów (porównanie meta vs. tabela w `README_DOCS.md`).
- **Rekomendacja archiwizacji**: Nie — dokument jest aktywnym backlogiem pętli transformacyjnej.
- **Sens dokumentu**: Zapewnia mechanizm ciągłego doskonalenia (transformacje `x`) i łączy obserwacje z planem pracy.
- **Aktualizacje wykonane**:
  - Uaktualniono datę iteracji i dodano meta audyt.
  - Zaznaczono konieczność nowych zadań (`x₇`, `x₈`).
  - Naprawiono zduplikowaną sekcję `x₅` (katalog fallback → `x₆`).

## Jak korzystać z pętli
1. Zidentyfikuj obserwację lub potrzebę (`x`).
2. Wygeneruj cztery zadania transformacyjne:
   - `-x` — działanie odwrotne lub sprzątające.
   - `1/x` — minimalny krok, który odblokuje dalszy postęp.
   - `x²` — rozszerzenie funkcjonalne tego samego obszaru.
   - `xˣ` — eksperyment/automatyzacja multiplikująca wartość zadania.
3. Przypisz zadania do właścicieli lub backlogu sprintu.
4. Po realizacji odnotuj wynik w odpowiednim dokumencie discovery i zaktualizuj tę listę.

## Iteracja 2025-10-22

### Zadanie bazowe `x₁`: Wdrożyć design tokens z `docs/UI_TOKENS.md` do kodu (T1)
- `-x₁`: Usunąć duplikujące się style w `src/app/globals.css` po migracji tokens.
- `1/x₁`: Zdefiniować minimalny zestaw `:root` custom properties odpowiadających tabeli w `UI_TOKENS.md` i opisać je w README. ✅ 2025-10-24 — Dodano bazowe custom properties w `globals.css` oraz uzupełniono dokumentację.
- ⏭️ 2025-10-24 — Rozszerzyć użycie zmiennych na sekcje hero/catalog (gradienty, CTA) i przygotować checklistę adopcji.
- `x₁²`: Rozbudować tokens o wariant motywu ciemnego oraz responsywne typografie sterowane zmiennymi.
- `x₁ˣ`: Przygotować skrypt eksportujący tokens z pliku źródłowego (np. Figma) do JSON i synchronizujący je z projektem.

### Zadanie bazowe `x₂`: Domknąć brakujące testy jakościowe (T6)
- `-x₂`: Zidentyfikować i usunąć przestarzałe snapshoty/testy blokujące pokrycie po dopisaniu nowych przypadków.
- `1/x₂`: Napisać test jednostkowy dla `ContactForm` (render, walidacja, komunikaty statusu). ✅ 2025-10-22 — zrealizowane wraz z pokryciem prefill i CTA katalogu.
- ✅ 2025-10-23 — Dodano testy prymitywów UI (`OrderButton`, `button`, `badge`) z pokryciem aria i focus state zgodnie z `docs/JAKOSC_TESTY_CI.md`.
- ✅ 2025-10-24 — Dopisano testy API (`/api/styles`, `/api/leather`), rozszerzono scenariusze CLI i Playwright (nawigacja + API katalogu).
- `x₂²`: Przygotować zestaw testów integracyjnych dla `/catalog/[slug]` i `/account` sprawdzających dostępność kluczowych CTA.
- ✅ 2025-10-24 — Zaimplementowano e2e flow zamówienia (Order modal → `/order/native`) z walidacją pól (`src/tests/e2e/order-native-flow.spec.ts`).
- ⏭️ 2025-10-24 — Rozszerzyć e2e flow o prefill modelu z `/catalog/[slug]` i walidację pól koszyka (`/order/cart`).
- `x₂ˣ`: Skonfigurować automatyczny raport pokrycia z wysyłką do Slacka/emailem po każdej gałęzi PR.

### Zadanie bazowe `x₃`: Urealnić obsługę leadów z formularza kontaktowego
- `-x₃`: Usunąć placeholderowe adresy e-mail i nazwy pól po wdrożeniu realnego backendu.
- `1/x₃`: Zaprojektować minimalne API (`POST /api/contact`) zapisujące lead do bazy `quote_requests`.
- `x₃²`: Zbudować flow automatycznych potwierdzeń mailowych dla klienta i rzemieślnika.
- `x₃ˣ`: Zintegrować webhook z narzędziem CRM (np. HubSpot/n8n) z monitorowaniem skuteczności.

### Zadanie bazowe `x₄`: Zsynchronizować UI z `FRONTEND_INTERFACE_SPEC.md`
- `-x₄`: Ujednolicić istniejące style w `src/app/globals.css` z wartościami opisanymi w rozdziale 3 specyfikacji.
- `1/x₄`: Dodać fallbacki `prefers-reduced-motion` do hero i karuzeli zgodnie z rozdziałem 4.
- `x₄²`: Wyprowadzić layout formularzy do komponentów wielokrotnego użytku i udokumentować je w specyfikacji.
- `x₄ˣ`: Automatycznie generować checklistę z rozdziału 10 i integrować ją z CI (`pnpm qa`).

### Zadanie bazowe `x₅`: Wydzielić i ustandaryzować prymitywy UI jako komponenty
- `-x₅`: Usunąć duplikacje klas `.button`/`.badge` po migracji do komponentów.
- `1/x₅`: Zaprojektować komponenty `Button` i `Badge` eksportowane z `src/components/ui/primitives` wraz z mapowaniem wariantów na tokens.
- `x₅²`: Zintegrować nowe komponenty w kluczowych widokach (`Home`, `Catalog`, `Order`) i zapewnić storybook/preview.
- `x₅ˣ`: Dodać generator dokumentacji komponentów (MDX) synchronizowany z design tokens.

### Zadanie bazowe `x₆`: Uspójnić fallback katalogu z docelową bazą danych
- `-x₆`: Monitorować logi ostrzeżeń o fallbacku i dodać alert w telemetrii, aby łatwiej wykrywać brak połączenia z DB.
- `1/x₆`: Napisać test integracyjny dla `/api/styles` i `/api/leather`, który potwierdzi zwracanie danych referencyjnych przy braku DB. ✅ 2025-10-30 — `repository.drizzle.test.ts` pokrywa ścieżkę DB→fallback, pozostaje scenariusz API bez połączenia w Playwright.
- ✅ 2025-11-02 — `x₆²`: Zaimplementowano cache warstwy katalogu (ISR + lokalny cache) i zsynchronizowano go z Drizzle (`resolveCatalogCache`, `/api/products/[slug]`).
- ✅ 2025-11-02 — `x₆ˣ`: Dodano healthcheck katalogu (`/api/catalog/health`) raportujący metryki cache i źródła danych.
- ⏭️ 2025-11-02 — Dopisać testy integracyjne SSR `/catalog` i monitoring `/api/catalog/health` (alerting `status: degraded/error`).

### Zadanie bazowe `x₇`: Utrzymać SEO artefakty i structured data
- `-x₇`: Dodać brakujące ścieżki (`/cart`, strony prawne, B2B) do `sitemap.ts` i `robots.ts`.
- `1/x₇`: Przygotować snippet `JSON-LD` dla strony głównej i produktu oraz opisać go w `SEO_CHECKLIST.md`.
- `x₇²`: Wprowadzić test automatyczny (np. `pnpm test:seo`) weryfikujący obecność structured data i meta tagów.
- `x₇ˣ`: Zautomatyzować audyt Lighthouse (CI) i publikować raporty do Slacka/README.

### Zadanie bazowe `x₈`: Automatyzować audyt dokumentacji discovery
- `-x₈`: Stworzyć skrypt porównujący daty/ statusy w sekcjach meta dokumentów z tabelą `docs/README_DOCS.md` i raportujący rozbieżności.
- `1/x₈`: Dodać checklistę manualną do PR (potwierdzenie aktualizacji statusów po zmianie dokumentacji).
- `x₈²`: Włączyć skrypt do `pnpm qa` jako krok ostrzegający o niespójnościach.
- `x₈ˣ`: Generować raport `docs/AUDYT_REPO2.md` automatycznie na podstawie metadanych i commitów.

> Po zrealizowaniu dowolnego zadania z listy pamiętaj o aktualizacji dokumentów źródłowych (`UI_TOKENS.md`, `JAKOSC_TESTY_CI.md`, `DANE_I_API_MVP.md`) oraz sekcji statusów w `docs/README_DOCS.md`.
