import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PricingCalculator } from "../PricingCalculator";

describe("PricingCalculator", () => {
  it("toggles the accessories panel visibility", () => {
    render(<PricingCalculator />);

    const trigger = screen.getByRole("button", { name: /Akcesoria/ });
    const panel = document.getElementById("accessories-panel");

    expect(panel).toBeTruthy();
    if (!panel) {
      throw new Error("Accessories panel should exist in the DOM");
    }

    expect(panel.hasAttribute("hidden")).toBe(false);

    fireEvent.click(trigger);
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(panel.hasAttribute("hidden")).toBe(true);

    fireEvent.click(trigger);
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    expect(panel.hasAttribute("hidden")).toBe(false);
  });

  it("initially hides and toggles the extras panel", () => {
    render(<PricingCalculator />);

    const trigger = screen.getByRole("button", { name: /Dodatkowe usługi/ });
    const panel = document.getElementById("extras-panel");

    expect(panel).toBeTruthy();
    if (!panel) {
      throw new Error("Extras panel should exist in the DOM");
    }

    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(panel.hasAttribute("hidden")).toBe(true);

    fireEvent.click(trigger);
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    expect(panel.hasAttribute("hidden")).toBe(false);
  });
});
