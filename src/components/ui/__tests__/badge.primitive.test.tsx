import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("UI primitive – badge", () => {
  it("renders a category badge with descriptive text", () => {
    render(<span className="badge badge--category">Wholecut Oxford</span>);

    const badge = screen.getByText("Wholecut Oxford");
    expect(badge).toHaveClass("badge", "badge--category");
    expect(badge).not.toHaveAttribute("tabindex");
  });

  it("exposes funnel badge abbreviations with a title for screen readers", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button type="button">Filtruj</button>
        <abbr title="Top of Funnel" className="badge badge--funnel">
          TOFU
        </abbr>
      </div>
    );

    const badge = screen.getByText("TOFU");
    expect(badge).toHaveAttribute("title", "Top of Funnel");
    expect(badge).toHaveClass("badge", "badge--funnel");

    await user.tab();
    await user.tab();

    expect(badge).not.toHaveFocus();
  });
});
