# AGENTS.md

## Zakres
Instrukcje dotyczą plików w katalogu `src/lib/legal/`.

## Wytyczne
- Treści prawne przechowuj jako struktury danych bez logiki biznesowej; korzystaj z helperów `text`, `link`, `strong`, aby zachować spójność formatowania.
- Zachowuj stabilne identyfikatory sekcji – są używane w testach oraz jako kotwice na stronie.
- Aktualizując sekcje, uzupełnij odpowiadające testy w `src/lib/legal/legal.test.ts`, aby potwierdzić kompletność treści.
