import { render, screen, within } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "../page";

vi.mock("../components/HeroShowcaseFrame", () => ({
  HeroShowcaseFrame: ({ items }: { items: Array<{ label: string }> }) => (
    <div role="img" aria-label={`Prezentacja ${items.length} modeli`}>Mock showcase</div>
  )
}));

vi.mock("../components/SellingPointsCarousel", () => ({
  SellingPointsCarousel: ({ points }: { points: Array<{ title: string; description: string }> }) => (
    <ul aria-label="Najważniejsze cechy butów">
      {points.map((point) => (
        <li key={point.title}>
          <strong>{point.title}</strong>
          <span>{point.description}</span>
        </li>
      ))}
    </ul>
  )
}));

vi.mock("@/components/ui/order/OrderModalTrigger", () => ({
  OrderModalTrigger: ({
    triggerLabel = "Zamów buty",
    ctaLabel = "Przejdź do formularza"
  }: {
    triggerLabel?: string;
    ctaLabel?: string;
    className?: string;
  }) => (
    <div>
      <button type="button">{triggerLabel}</button>
      <a href="/order/native">{ctaLabel}</a>
    </div>
  )
}));

vi.mock("../components/PricingCalculator", () => ({
  PricingCalculator: () => (
    <section className="section" aria-labelledby="calculator-heading" data-testid="pricing-calculator">
      <div className="container">
        <div className="section-header">
          <h2 id="calculator-heading">Kalkulator wyceny</h2>
          <p>Mocked calculator content.</p>
        </div>
      </div>
    </section>
  )
}));

describe("Home page", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders hero, selling points and pricing calculator without console errors", async () => {
    render(
      <React.Suspense fallback={<div role="status">Ładujemy…</div>}>
        <Home />
      </React.Suspense>
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /Rzemieślnicze buty LARP, które wybierzesz w naszym katalogu/i
      })
    ).toBeInTheDocument();

    const sellingPointsSection = screen.getByRole("heading", { name: "Co wyróżnia nasze buty" }).closest("section");
    expect(sellingPointsSection).toBeInTheDocument();
    expect(within(sellingPointsSection as HTMLElement).getByRole("list")).toBeInTheDocument();

    expect(await screen.findByTestId("pricing-calculator")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kalkulator wyceny" })).toBeInTheDocument();

    const catalogLinks = screen.getAllByRole("link", { name: "katalog modeli" });
    expect(catalogLinks.length).toBeGreaterThan(0);
    catalogLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/catalog");
    });
    expect(screen.getByRole("link", { name: "Przejdź do formularza" })).toHaveAttribute("href", "/order/native");

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
