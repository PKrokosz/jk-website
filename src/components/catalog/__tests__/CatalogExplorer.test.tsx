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

    expect(screen.getAllByRole("listitem")).toHaveLength(15);
    expect(screen.getByRole("heading", { name: "Szpic" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Poznaj szczegóły modelu Szpic" })).toHaveAttribute(
      "href",
      "/catalog/szpic"
    );
  });

  it("filters products by selected style and leather", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    fireEvent.click(screen.getByLabelText("Guild Monk Shoe"));
    fireEvent.click(screen.getByLabelText(/Amber Pull-Up/));

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 3, name: "Klamry" })).toBeVisible();
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

    expect(headings[0]).toBe("Wysokie Szpice");
  });

  it("filters products by category", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Akcesoria" }));

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Dedykowany wosk pielęgnacyjny" })).toBeInTheDocument();
  });
});
