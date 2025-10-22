# Pętla zadań transformacyjnych

> Ostatnia aktualizacja: 2025-10-22
>
> Celem dokumentu jest pilnowanie cyklicznych zadań wynikających z obserwacji `x` oraz ich transformacji (`-x`, `1/x`, `x²`, `xˣ`). Po domknięciu pętli usuń zrealizowane wpisy i dopisz nową iterację.

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
- `1/x₁`: Zdefiniować minimalny zestaw `:root` custom properties odpowiadających tabeli w `UI_TOKENS.md` i opisać je w README.
- `x₁²`: Rozbudować tokens o wariant motywu ciemnego oraz responsywne typografie sterowane zmiennymi.
- `x₁ˣ`: Przygotować skrypt eksportujący tokens z pliku źródłowego (np. Figma) do JSON i synchronizujący je z projektem.

### Zadanie bazowe `x₂`: Domknąć brakujące testy jakościowe (T6)
- `-x₂`: Zidentyfikować i usunąć przestarzałe snapshoty/testy blokujące pokrycie po dopisaniu nowych przypadków.
- `1/x₂`: Napisać test jednostkowy dla `ContactForm` (render, walidacja, komunikaty statusu). ✅ 2025-10-22 — zrealizowane wraz z pokryciem prefill i CTA katalogu.
- `x₂²`: Przygotować zestaw testów integracyjnych dla `/catalog/[slug]` i `/account` sprawdzających dostępność kluczowych CTA.
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

> Po zrealizowaniu dowolnego zadania z listy pamiętaj o aktualizacji dokumentów źródłowych (`UI_TOKENS.md`, `JAKOSC_TESTY_CI.md`, `DANE_I_API_MVP.md`) oraz sekcji statusów w `docs/README_DOCS.md`.
