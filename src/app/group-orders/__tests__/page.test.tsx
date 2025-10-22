import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GroupOrdersPage from "../page";

describe("GroupOrdersPage", () => {
  it("renders hero, process steps and CTA links", () => {
    render(<GroupOrdersPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Współpracujmy przy zamówieniach grupowych" })
    ).toBeInTheDocument();

    const processSection = screen.getByRole("heading", { name: "Trzy kroki do seryjnego zamówienia bespoke" }).closest("section");
    expect(processSection).not.toBeNull();
    expect(processSection?.querySelectorAll("ol li")).toHaveLength(3);

    expect(screen.getByRole("link", { name: "Napisz do nas" })).toHaveAttribute(
      "href",
      "mailto:kontakt@jkhandmade.pl?subject=Zam%C3%B3wienie%20grupowe"
    );
    expect(screen.getByRole("link", { name: "Złóż brief online" })).toHaveAttribute(
      "href",
      "/contact#contact-form"
    );

    const main = screen.getByRole("main");
    const semanticOutline = Array.from(main.querySelectorAll("section")).map((section) => ({
      labelledBy: section.getAttribute("aria-labelledby"),
      heading: section.querySelector("h1, h2, h3")?.textContent?.trim(),
      role: section.getAttribute("class")
    }));

    expect(semanticOutline).toMatchInlineSnapshot(`
      [
        {
          "heading": "Współpracujmy przy zamówieniach grupowych",
          "labelledBy": "group-orders-heading",
          "role": "section hero hero--immersive group-orders-hero",
        },
        {
          "heading": "Trzy kroki do seryjnego zamówienia bespoke",
          "labelledBy": "group-orders-process-heading",
          "role": "section group-orders-process",
        },
        {
          "heading": "Umów konsultację dla swojego oddziału",
          "labelledBy": "group-orders-cta-heading",
          "role": "section group-orders-cta",
        },
      ]
    `);
  });
});
