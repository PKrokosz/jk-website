import React from "react";
import { render, screen } from "@testing-library/react";

import RootLayout from "../layout";

describe("RootLayout", () => {
  it("provides a skip link to the main content region", () => {
    render(
      <RootLayout>
        <main data-testid="page-main">Hello world</main>
      </RootLayout>
    );

    const skipLink = screen.getByRole("link", { name: "Przejdź do głównej treści" });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");

    const mainWrapper = screen.getByTestId("page-main").parentElement;
    expect(mainWrapper).toHaveAttribute("id", "main-content");
  });
});
