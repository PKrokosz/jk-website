# Otwarte pytania do właściciela produktu

## Spis treści
- [1. Podsumowanie](#podsumowanie)
- [2. Pytania produktowe](#pytania-produktowe)
- [3. Pytania dotyczące treści i brandu](#pytania-dotyczace-tresci-i-brandu)
- [4. Pytania techniczne i operacyjne](#pytania-techniczne-i-operacyjne)
- [5. Checklisty kontrolne](#checklisty-kontrolne)
- [6. Ryzyka, Decyzje do podjęcia, Następne kroki](#ryzyka-decyzje-do-podjecia-nastepne-kroki)

## Podsumowanie
- Lista pytań konieczna do domknięcia przed publikacją MVP. Po ostatnich iteracjach kluczowe placeholdery (copy About, zgoda RODO) zostały zastąpione finalnymi tekstami, jednak część decyzji biznesowych nadal wymaga potwierdzenia.
- Kolumna „Status” wskazuje bieżące ustalenia (✅=rozwiązane w kodzie, 🔄=w toku, ⏳=czeka na decyzję właściciela).

## Pytania produktowe
| # | Pytanie | Status | Notatka |
| --- | --- | --- | --- |
| 1 | Jakie dokładne warianty rozmiarów (EU) i szerokości mają być dostępne na stronie produktu? | 🔄 | Obecnie zakres 36–47 (STANDARD_SIZES); potwierdzić docelowy zakres i ewentualne szerokości. |
| 2 | Czy każdy produkt powinien mieć unikalną galerię zdjęć, czy możemy użyć wspólnych placeholderów? | ⏳ | W kodzie wykorzystujemy placeholdery (`catalogProducts.gallery`). Potrzebna decyzja dot. realnych assetów. |
| 3 | Czy CTA „Zamów teraz” ma kierować do formularza kontaktowego, czy planowany jest inny proces (np. rezerwacja kalendarza)? | 🔄 | Obecnie CTA prowadzi do modala + `/order/native` + `/contact`. Potwierdzić docelowy funnel. |
| 4 | Jakie dodatkowe informacje produktowe są wymagane (materiały, czas realizacji, cena orientacyjna vs. finalna)? | ⏳ | W kodzie pokazujemy highlight + craft process. Brak informacji o czasie realizacji. |
| 5 | Czy katalog ma prezentować wszystkie style/skóry, czy jedynie wybraną kolekcję startową (ile pozycji)? | ⏳ | Mock przedstawia 5 styli, 5 skór. Potrzebne potwierdzenie docelowej listy. |

## Pytania dotyczące treści i brandu
| # | Pytanie | Status | Notatka |
| --- | --- | --- | --- |
| 1 | Czy mamy zaakceptowane copy dla sekcji About/Contact? Kto dostarcza finalne teksty? | ✅ | Finalne copy wdrożone na About i Contact zgodnie z przekazanym materiałem. |
| 2 | Czy dostępne są logotypy, zdjęcia warsztatu, grafiki brandowe? W jakim formacie? | ⏳ | Aktualnie wykorzystujemy zdjęcia modeli z katalogu + wideo w hero. Potrzebne materiały finalne. |
| 3 | Czy preferowane fonty (np. EB Garamond) są zatwierdzone/licencjonowane? | ⏳ | W projekcie działa fallback `Inter`; brak decyzji dot. serif. |
| 4 | Jakie kanały social (Instagram, Facebook, LinkedIn) mają być linkowane w stopce? | ✅ | Kontakt posiada linki do Instagram + Facebook (placeholders). Potwierdzić czy dodać inne kanały. |
| 5 | Czy istnieje polityka prywatności/regulamin do podlinkowania (nawet w formie placeholdera PDF)? | 🔄 | Strony placeholder `/privacy-policy` i `/terms` dodane; czekamy na finalne dokumenty prawne. |

## Pytania techniczne i operacyjne
| # | Pytanie | Status | Notatka |
| --- | --- | --- | --- |
| 1 | Gdzie będzie hostowana aplikacja (Vercel, Netlify, własny serwer)? Czy są wymagania dotyczące CI/CD? | 🔄 | Workflow CI na GitHub Actions istnieje; hosting nieokreślony (zakładamy Vercel). |
| 2 | Czy wymagane jest podpięcie analityki (np. GA, Plausible) w MVP? | ⏳ | Brak implementacji; decyzja zależna od właściciela. |
| 3 | Czy endpointy API (styles, leather) mają docelowo korzystać z bazy, czy pozostajemy przy mockach na MVP? | 🔄 | Obecnie mocki. Potrzebny harmonogram migracji do Drizzle. |
| 4 | Czy planowane są integracje (np. Stripe, n8n) już w pierwszej wersji, czy później? | 🔄 | W roadmapie (README) przewidziano integracje po stabilizacji MVP; brak terminu. |
| 5 | Jakie są wymogi prawne dot. zgód RODO w formularzu (checkbox, treść zgody, polityka)? | ✅ | Wdrożono zaakceptowany tekst zgody RODO wraz z linkiem do polityki prywatności. |

## Checklisty kontrolne
- [x] Zebrano pytania w trzech obszarach (produkt, treści, technologia).
- [ ] Uzyskano odpowiedzi od właściciela produktu (czeka na decyzje).

## Ryzyka, Decyzje do podjęcia, Następne kroki
- **Ryzyka**
  - Brak odpowiedzi opóźni finalizację dokumentów prawnych (polityka, regulamin) i integracji (backend formularza, Drizzle).
  - Termin dostarczenia finalnych materiałów brandowych (zdjęcia, fonty) pozostaje niepewny.
- **Decyzje do podjęcia**
  - Priorytetyzacja pytań (które potrzebujemy najpierw?).
  - Czy organizujemy warsztat discovery, czy asynchronicznie zbieramy odpowiedzi?
- **Następne kroki**
  - Przesłać listę pytań właścicielowi wraz z aktualnym statusem.
  - Uzupełnić dokumenty `WYMAGANIA_MVP.md`, `PLAN_MVP_SPRINTS.md`, `JAKOSC_TESTY_CI.md` po uzyskaniu odpowiedzi.
