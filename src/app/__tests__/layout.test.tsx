import React from "react";
import { JSDOM } from "jsdom";
import { renderToStaticMarkup } from "react-dom/server";

import RootLayout from "../layout";

describe("RootLayout", () => {
  it("provides a skip link to the main content region", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main data-testid="page-main">Hello world</main>
      </RootLayout>
    );

    const {
      window: { document }
    } = new JSDOM(markup);

    const skipLink = document.querySelector<HTMLAnchorElement>("a.skip-link");
    expect(skipLink).not.toBeNull();
    expect(skipLink?.textContent?.trim()).toBe("Przejdź do głównej treści");
    expect(skipLink?.getAttribute("href")).toBe("#main-content");

    const mainWrapper = document.querySelector<HTMLElement>("#main-content");
    expect(mainWrapper).not.toBeNull();

    const main = mainWrapper?.querySelector<HTMLElement>("[data-testid='page-main']");
    expect(main).not.toBeNull();
  });
});
