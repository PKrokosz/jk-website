# Otwarte pytania do właściciela produktu

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Pytania produktowe](#pytania-produktowe)
- [3. Pytania dotyczące treści i brandu](#pytania-dotyczace-tresci-i-brandu)
- [4. Pytania techniczne i operacyjne](#pytania-techniczne-i-operacyjne)
- [5. Checklisty kontrolne](#checklisty-kontrolne)
- [6. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Lista pytań konieczna do domknięcia przed implementacją MVP (dane produktowe, copy, proces kontaktu, zasoby graficzne, hosting).
- Odpowiedzi determinują zakres prac w zadaniach T1–T6.

## Pytania produktowe
1. Jakie dokładne warianty rozmiarów (EU) i szerokości mają być dostępne na stronie produktu?
2. Czy każdy produkt powinien mieć unikalną galerię zdjęć, czy możemy użyć wspólnych placeholderów?
3. Czy CTA „Zamów teraz” ma kierować do formularza kontaktowego, czy planowany jest inny proces (np. rezerwacja kalendarza)?
4. Jakie dodatkowe informacje produktowe są wymagane (materiały, czas realizacji, cena orientacyjna vs. finalna)?
5. Czy katalog ma prezentować wszystkie style/skóry, czy jedynie wybraną kolekcję startową (ile pozycji)?

## Pytania dotyczące treści i brandu
1. Czy mamy zaakceptowane copy dla sekcji About/Contact? Kto dostarcza finalne teksty?
2. Czy dostępne są logotypy, zdjęcia warsztatu, grafiki brandowe? W jakim formacie?
3. Czy preferowane fonty (np. EB Garamond) są zatwierdzone/licencjonowane?
4. Jakie kanały social (Instagram, Facebook, LinkedIn) mają być linkowane w stopce?
5. Czy istnieje polityka prywatności/regulamin do podlinkowania (nawet w formie placeholdera PDF)?

## Pytania techniczne i operacyjne
1. Gdzie będzie hostowana aplikacja (Vercel, Netlify, własny serwer)? Czy są wymagania dotyczące CI/CD?
2. Czy wymagane jest podpięcie analityki (np. Google Analytics, Plausible) w MVP?
3. Czy endpointy API (styles, leather) mają docelowo korzystać z bazy, czy pozostajemy przy mockach na MVP?
4. Czy planowane są integracje (np. Stripe, n8n) już w pierwszej wersji, czy później?
5. Jakie są wymogi prawne dot. zgód RODO w formularzu (checkbox, treść zgody, polityka)?

## Checklisty kontrolne
- [x] Zebrano pytania w trzech obszarach (produkt, treści, technologia).
- [ ] Uzyskano odpowiedzi od właściciela produktu.

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak odpowiedzi opóźni implementację kluczowych sekcji (T4/T5).
  - Niejasne wymagania RODO mogą zablokować publikację formularza.
- **Decyzje do podjęcia**
  - Priorytetyzacja pytań (które potrzebujemy najpierw?).
  - Czy organizujemy warsztat discovery, czy asynchronicznie zbieramy odpowiedzi?
- **Następne kroki**
  - Przesłać listę pytań właścicielowi.
  - Uzupełnić dokumenty `WYMAGANIA_MVP.md` i `PLAN_MVP_SPRINTS.md` po uzyskaniu odpowiedzi.
