import { describe, expect, it, vi } from "vitest";

import { run } from "../simulate-navigation";

const createSeededRandom = (seed: number): (() => number) => {
  let current = seed;
  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296;
    return current / 4294967296;
  };
};

describe("simulate-navigation CLI", () => {
  it("prints journeys and aggregated summary when requested", () => {
    const logMessages: string[] = [];
    const errorMessages: string[] = [];

    const randomSpy = vi
      .spyOn(Math, "random")
      .mockImplementation(createSeededRandom(21));

    const exitCode = run({
      argv: [
        "--config",
        "config/navigation-weights.example.json",
        "--user-count",
        "4",
        "--summary",
      ],
      console: {
        log: (message) => {
          logMessages.push(String(message));
        },
        error: (message) => {
          errorMessages.push(String(message));
        },
      },
    });

    randomSpy.mockRestore();

    expect(exitCode).toBe(0);
    expect(errorMessages).toEqual([]);
    expect(logMessages).toMatchInlineSnapshot(`
      [
        "User 1: home -[Przejdź do katalogu (certain)]-> catalog → catalog -[Wybierz model produktu (certain)]-> product → product -[Przejdź do zamówienia natywnego (certain)]-> orderNative → orderNative -[Otwórz pełny formularz zamówienia (certain)]-> order → order -[Powrót na stronę główną (certain)]-> home | loop at home",
        "User 2: home -[Przejdź do katalogu (certain)]-> catalog → catalog -[Wróć na stronę główną (uncertain)]-> home | loop at home",
        "User 3: home -[Nawiąż kontakt (uncertain)]-> contact → contact -[Wróć na stronę główną (certain)]-> home | loop at home",
        "User 4: home -[Nawiąż kontakt (uncertain)]-> contact → contact -[Wróć na stronę główną (certain)]-> home | loop at home",
        "",
        "Summary (transitions per edge):",
        "catalog -> home: 1",
        "catalog -> product: 1",
        "contact -> home: 2",
        "home -> catalog: 2",
        "home -> contact: 2",
        "order -> home: 1",
        "orderNative -> order: 1",
        "product -> orderNative: 1",
      ]
    `);
  });
});
