import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CatalogExplorer } from "../CatalogExplorer";
import { createMockProducts } from "@/lib/catalog/products";
import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";

const products = createMockProducts(catalogStyles, catalogLeathers);

describe("CatalogExplorer", () => {
  it("renders segmented catalog with native data", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    expect(screen.getByRole("heading", { level: 2, name: "Buty" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: "Akcesoria" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: "Dodatki" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Poznaj szczegóły modelu Szpic" })).toHaveAttribute(
      "href",
      "/catalog/szpic"
    );
  });

  it("sorts footwear by price in descending order", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    fireEvent.click(screen.getByLabelText("Od najwyższej"));

    const highTierHeading = screen.getByRole("heading", { name: "Dragonki" });
    const lowTierHeading = screen.getByRole("heading", { name: "Szpic" });

    expect(highTierHeading.compareDocumentPosition(lowTierHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("filters products by price tier", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    fireEvent.click(screen.getByLabelText("Wysoki"));

    expect(screen.getByRole("heading", { name: "Dragonki" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Szpic" })).not.toBeInTheDocument();
  });

  it("filters products by leather color", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    fireEvent.click(screen.getByLabelText("Heban"));

    expect(screen.getByRole("heading", { name: "Wysokie Szpice" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Szpic" })).not.toBeInTheDocument();
  });

  it("buduje link do formularza natywnego z referencją zamówienia", () => {
    render(
      <CatalogExplorer styles={catalogStyles} leathers={catalogLeathers} products={products} />
    );

    const referenceProduct = products.find((product) => product.slug === "szpic");
    expect(referenceProduct?.orderReference).toBeTruthy();

    const funnelCta = screen.getByRole("link", {
      name: `Skonfiguruj w formularzu dla produktu ${referenceProduct?.name} w formularzu zamówienia`
    });

    expect(funnelCta).toHaveAttribute("href", "/order/native?model=szpic");
  });
});
