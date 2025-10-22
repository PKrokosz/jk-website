## Opis
<!-- Krótki kontekst biznesowy/techniczny + link do dokumentacji lub ticketa. -->

## Lista zmian
<!-- Punktowo wypisz kluczowe modyfikacje kodu/dokumentacji. -->
- ...

## Testy
<!-- Zastąp symbolem ✅/⚠️/❌ i dołącz logi w blokach <details>. -->
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm test:coverage`
- [ ] `pnpm test:e2e`
- [ ] `pnpm depcheck`
- [ ] `pnpm db:seed`

<details>
<summary>Logi poleceń</summary>

```
# Wklej tutaj logi z komend (np. pnpm lint)
```

</details>

## Zrzuty ekranu
<!-- Dodaj screeny/gify (desktop + mobile), jeżeli zmiana dotyczy UI. -->

## Checklist
<!-- Odhacz Definition of Done z `docs/JAKOSC_TESTY_CI.md`. Dodaj komentarz, jeżeli coś nie dotyczy PR. -->
- [ ] `pnpm install` (jeśli zmieniono zależności)
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:coverage` (dla zmian w logice/komponentach)
- [ ] `pnpm test:e2e` (dla zmian wpływających na kluczowe flow)
- [ ] `pnpm build` (dla zmian w konfiguracji/routingu)
- [ ] `pnpm depcheck` (min. raz na sprint)
- [ ] `pnpm db:seed` (jeśli potrzebne do weryfikacji bazy)
- [ ] Dokumentacja zaktualizowana (jeśli dotyczy)
- [ ] Screen/gif dla zmian UI (jeśli dotyczy)
