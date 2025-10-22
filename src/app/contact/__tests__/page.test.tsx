import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContactPage from "../page";

const sanitizeProductQueryMock = vi.fn((value: string | null) => (value ?? "").trim());

vi.mock("@/lib/contact/sanitizeProduct", () => ({
  sanitizeProductQuery: (value: string | null) => sanitizeProductQueryMock(value)
}));

vi.mock("@/components/contact/ContactForm", () => ({
  ContactForm: ({ initialProduct }: { initialProduct?: string }) => (
    <form aria-label="Formularz kontaktowy" data-initial-product={initialProduct}>
      <label htmlFor="product-field">Wybrany produkt</label>
      <input id="product-field" aria-describedby="product-hint" defaultValue={initialProduct} />
      <span id="product-hint">Prefill produktu</span>
      <button type="submit">Wyślij</button>
    </form>
  )
}));

describe("ContactPage", () => {
  beforeEach(() => {
    sanitizeProductQueryMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders hero content, contact links and the form", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Umów konsultację w JK Handmade Footwear" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "kontakt@jkhandmade.pl" })).toHaveAttribute(
      "href",
      "mailto:kontakt@jkhandmade.pl"
    );
    expect(screen.getByRole("link", { name: "+48 555 123 456" })).toHaveAttribute("href", "tel:+48555123456");
    expect(screen.getByRole("form", { name: "Formularz kontaktowy" })).toBeInTheDocument();
    expect(screen.getByLabelText("Wybrany produkt")).toHaveAttribute("aria-describedby", "product-hint");
  });

  it("prefills product from search params using sanitizer", () => {
    const page = <ContactPage searchParams={{ product: "  obiezy   " }} />;

    render(page);

    expect(sanitizeProductQueryMock).toHaveBeenCalledWith("  obiezy   ");
    expect(screen.getByRole("form", { name: "Formularz kontaktowy" })).toHaveAttribute("data-initial-product", "obiezy");
  });
});
