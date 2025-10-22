import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("UI primitive – button", () => {
  it("renders the primary variant as a navigable link", () => {
    render(
      <a className="button button--primary" href="/order">
        Zamów
      </a>
    );

    const link = screen.getByRole("link", { name: "Zamów" });
    expect(link).toHaveAttribute("href", "/order");
    expect(link).toHaveClass("button", "button--primary");
  });

  it("keeps the ghost variant keyboard focus-visible", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button type="button">Inne CTA</button>
        <button className="button button--ghost" type="button">
          Dowiedz się więcej
        </button>
      </div>
    );

    await user.tab();
    await user.tab();

    const ghost = screen.getByRole("button", { name: "Dowiedz się więcej" });
    expect(ghost).toHaveFocus();
    expect(ghost).toHaveClass("button", "button--ghost");
  });
});
