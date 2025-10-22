# AGENTS.md — `src/lib/telemetry`

## Testy modułu telemetry
- Stubuj `console.error` przez `vi.spyOn(console, "error").mockImplementation(() => {})`, aby utrzymać czyste logi podczas testów Vitest.
- Weryfikując gałąź serwerową, wymuszaj `NODE_ENV` różny od `test` (`vi.stubEnv("NODE_ENV", "development")`), aby upewnić się, że logowanie pozostaje aktywne.
- Dla zdarzeń klienta sprawdzaj zarówno dispatch `CustomEvent`, jak i strukturę `detail` (scope, event, error, details).
- Dodając nowe helpery telemetryjne, rozszerzaj testy o przypadki błędów stringowych i obiektowych, aby utrzymać normalizację w `toError`.
