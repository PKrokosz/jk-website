import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { catalogLeathers } from "@/lib/catalog/data";

const findActiveLeathersMock = vi.fn();

vi.mock("@/lib/catalog/repository", () => ({
  findActiveLeathers: findActiveLeathersMock,
}));

const { GET } = await import("./route");

describe("GET /api/leather", () => {
  beforeEach(() => {
    findActiveLeathersMock.mockResolvedValue(catalogLeathers);
  });

  afterEach(() => {
    findActiveLeathersMock.mockReset();
  });

  it("zwraca listę skór dostępnych w katalogu", async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toHaveProperty("id");
  });

  it("zwraca 500 gdy repozytorium zwróci błąd", async () => {
    findActiveLeathersMock.mockRejectedValueOnce(new Error("db down"));

    const response = await GET();

    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        error: expect.stringContaining("Nie udało się pobrać listy skór"),
      }),
    );
  });
});
