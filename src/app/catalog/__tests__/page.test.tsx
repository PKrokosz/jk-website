import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CatalogPage from "../page";

const fetchCatalogStylesMock = vi.fn();
const fetchCatalogLeathersMock = vi.fn();
const createMockProductsMock = vi.fn();

const catalogExplorerProps: Array<{ styles: unknown; leathers: unknown; products: unknown }> = [];

vi.mock("@/lib/catalog/api", () => ({
  fetchCatalogStyles: () => fetchCatalogStylesMock(),
  fetchCatalogLeathers: () => fetchCatalogLeathersMock()
}));

vi.mock("@/lib/catalog/products", () => ({
  createMockProducts: (...args: unknown[]) => createMockProductsMock(...args)
}));

vi.mock("@/components/catalog/CatalogExplorer", () => ({
  CatalogExplorer: (props: { styles: unknown; leathers: unknown; products: unknown }) => {
    catalogExplorerProps.push(props);
    return (
      <div data-testid="catalog-explorer" role="region" aria-label="Wyniki katalogu">
        Rendered {Array.isArray(props.products) ? props.products.length : 0} produktów
      </div>
    );
  }
}));

vi.mock("@/components/catalog/NativeModelShowcase", () => ({
  NativeModelShowcase: () => <section aria-label="Natywny katalog" data-testid="native-showcase" />
}));

describe("CatalogPage", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    catalogExplorerProps.length = 0;
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchCatalogStylesMock.mockReset();
    fetchCatalogLeathersMock.mockReset();
    createMockProductsMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders filters and passes catalog data to explorer", async () => {
    const styles = [{ id: "style-1", name: "Szermierz" }];
    const leathers = [{ id: "leather-1", name: "Ciemny brąz" }];
    const products = [
      { id: "product-1", name: "Obieżyświat", slug: "obiezy" }
    ];

    fetchCatalogStylesMock.mockResolvedValue(styles);
    fetchCatalogLeathersMock.mockResolvedValue(leathers);
    createMockProductsMock.mockReturnValue(products);

    const page = await CatalogPage();
    render(page);

    expect(screen.getByRole("heading", { level: 1, name: "Katalog" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Przejdź do sekcji/ })).toHaveLength(3);
    expect(screen.getByTestId("catalog-explorer")).toHaveTextContent("Rendered 1 produktów");
    expect(catalogExplorerProps[0].styles).toEqual(styles);
    expect(catalogExplorerProps[0].leathers).toEqual(leathers);
    expect(catalogExplorerProps[0].products).toEqual(products);
    expect(screen.getByTestId("native-showcase")).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("renders fallback section when catalog fetching fails", async () => {
    fetchCatalogStylesMock.mockRejectedValue(new Error("Failed"));
    fetchCatalogLeathersMock.mockResolvedValue([]);

    const page = await CatalogPage();
    render(page);

    expect(
      screen.getByText(
        "Aktualnie nie możemy wyświetlić katalogu. Odśwież stronę lub przejdź do sekcji kontakt, aby zamówić konsultację."
      )
    ).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
