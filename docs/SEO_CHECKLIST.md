# SEO Checklist — JK Handmade Footwear

## Priorytety krytyczne
1. **Strategiczne metadane i strukturacja tytułów**  
   - Zdefiniuj unikatowy `title` oraz `description` dla każdej kluczowej podstrony (home, katalog, produkt, kontakt).  
   - Pilnuj, by słowa kluczowe „buty miarowe”, „obuwie na wymiar”, „Warszawa” i brand pojawiały się w pierwszych 50–60 znakach tytułu oraz pierwszym zdaniu opisu.
2. **Kanoniczne adresy i indeksacja**  
   - Ustal `metadataBase` i `alternates.canonical` w App Router.  
   - Dodaj plik `sitemap.xml` i `robots.txt` (Next.js generuje je automatycznie po implementacji w `app/`).
3. **Strukturalne dane schema.org**  
   - Na stronie głównej i produktach umieść `JSON-LD` (`Organization`/`LocalBusiness`, `Product`, `BreadcrumbList`, `FAQPage`).  
   - Utrzymuj aktualne dane kontaktowe (adres, e-mail, telefon) w schemacie oraz w widocznej treści.
4. **Hierarchia nagłówków i copy**  
   - Jedno `h1` na stronę z główną frazą.  
   - Sekcje opisuj `h2`/`h3` zawierającymi long-tail (np. „Proces szycia butów na miarę”, „Indywidualne dopasowanie”).  
   - Dodaj fragmenty FAQ odpowiadające na najczęstsze pytania.
5. **Optymalizacja multimediów**  
   - Każde zdjęcie musi mieć opisowy `alt`.  
   - Wideo w tle z atrybutami `title`, `aria-hidden`, `poster`, oraz wyłączone `prefetch` dla ciężkich assetów.  
   - Lazy loading przez `next/image` i responsywne `sizes`.
6. **Linkowanie wewnętrzne i CTA**  
   - W treści osadź linki do katalogu, formularza zamówień, strony kontaktowej i artykułów eksperckich.  
   - Upewnij się, że linki w stopce i nagłówku mają opisowe `aria-label`.
7. **Wydajność i Core Web Vitals**  
   - Audytuj `Largest Contentful Paint` (<= 2,5 s) i `Cumulative Layout Shift` (< 0,1).  
   - Minimalizuj bundle przez lazy loading komponentów (np. kalkulator wyceny) i selektywne `prefetch`.
8. **Dowody zaufania i E-E-A-T**  
   - Eksponuj liczbę lat doświadczenia, referencje, certyfikaty, wzmianki medialne.  
   - Dodaj sekcję FAQ/recenzji z danymi kontaktowymi właściciela pracowni.

## Checklist operacyjny przed wdrożeniem
- [ ] Sprawdź poprawność meta danych w `app/layout.tsx` oraz plikach stron.
- [ ] Wygeneruj i zarejestruj `sitemap.xml`, `robots.txt` oraz feed `schema.org`.
- [ ] Zweryfikuj poprawność `JSON-LD` w [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Uruchom audyt Lighthouse (Performance + Accessibility + SEO > 90 pkt).
- [ ] Dodaj testy sprawdzające obecność kluczowych elementów SEO (nagłówki, linki, structured data) w krytycznych komponentach.

