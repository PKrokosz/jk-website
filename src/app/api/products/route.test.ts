import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";
import {
  catalogProductDetailResponseSchema,
  catalogProductListResponseSchema
} from "@/lib/catalog/schemas";

const findActiveStylesMock = vi.fn();
const findActiveLeathersMock = vi.fn();

vi.mock("@/lib/catalog/repository", () => ({
  findActiveStyles: findActiveStylesMock,
  findActiveLeathers: findActiveLeathersMock
}));

const { GET } = await import("./route");

function makeRequest(path = "") {
  return new NextRequest(`https://jkhandmade.pl/api/products${path}`);
}

describe("GET /api/products", () => {
  beforeEach(() => {
    findActiveStylesMock.mockResolvedValue(catalogStyles);
    findActiveLeathersMock.mockResolvedValue(catalogLeathers);
  });

  afterEach(() => {
    findActiveStylesMock.mockReset();
    findActiveLeathersMock.mockReset();
  });

  it("zwraca listę produktów katalogu", async () => {
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);

    const body = await response.json();
    const parsed = catalogProductListResponseSchema.parse(body);

    expect(parsed.data.length).toBeGreaterThan(0);
    expect(parsed.data[0]).toHaveProperty("slug");
  });

  it("zwraca szczegóły produktu gdy podano slug", async () => {
    const response = await GET(makeRequest("?slug=szpic"));

    expect(response.status).toBe(200);

    const body = await response.json();
    const parsed = catalogProductDetailResponseSchema.parse(body);

    expect(parsed.data.slug).toBe("szpic");
    expect(parsed.data.gallery.length).toBeGreaterThan(0);
  });

  it("zwraca 404 dla nieistniejącego produktu", async () => {
    const response = await GET(makeRequest("?slug=nie-istnieje"));

    expect(response.status).toBe(404);
  });

  it("odrzuca niepoprawne query parametry", async () => {
    const response = await GET(makeRequest("?slug="));

    expect(response.status).toBe(422);
    expect(findActiveStylesMock).not.toHaveBeenCalled();
  });

  it("zwraca 500 w przypadku błędu bazy", async () => {
    findActiveStylesMock.mockRejectedValueOnce(new Error("db down"));

    const response = await GET(makeRequest());

    expect(response.status).toBe(500);
  });
});
