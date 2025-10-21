import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CatalogExplorer } from "../CatalogExplorer";
import { createMockProducts } from "@/lib/catalog/products";
import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";

const products = createMockProducts(catalogStyles, catalogLeathers);

describe("CatalogExplorer", () => {
  it("renders the full product list", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(8);
    expect(screen.getByRole("heading", { name: "Regal Huntsman Boots" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Poznaj szczegóły modelu Regal Huntsman Boots" })).toHaveAttribute(
      "href",
      "/catalog/regal-huntsman-boots"
    );
  });

  it("filters products by selected style and leather", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    fireEvent.click(screen.getByLabelText("Artisan Oxford"));
    fireEvent.click(screen.getByLabelText(/Amber Pull-Up/));

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 3, name: "Amber Guild Oxfords" })).toBeVisible();
  });

  it("sorts products by name in descending order", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    fireEvent.change(screen.getByLabelText("Sortuj listę produktów"), {
      target: { value: "name-desc" }
    });

    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent ?? "");

    expect(headings[0]).toBe("Regal Huntsman Boots");
  });
});
