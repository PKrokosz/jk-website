import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { catalogStyles } from "@/lib/catalog/data";

const findActiveStylesMock = vi.fn();

vi.mock("@/lib/catalog/repository", () => ({
  findActiveStyles: findActiveStylesMock,
}));

const { GET } = await import("./route");

describe("GET /api/styles", () => {
  beforeEach(() => {
    findActiveStylesMock.mockResolvedValue(catalogStyles);
  });

  afterEach(() => {
    findActiveStylesMock.mockReset();
  });

  it("zwraca listę stylów do katalogu", async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data).toHaveLength(catalogStyles.length);
  });

  it("zwraca 500 gdy pobranie danych kończy się błędem", async () => {
    findActiveStylesMock.mockRejectedValueOnce(new Error("db down"));

    const response = await GET();

    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        error: expect.stringContaining("Nie udało się pobrać listy stylów"),
      }),
    );
  });
});
