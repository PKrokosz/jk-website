import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OrderPage from "../page";
import { ORDER_FORM_URL } from "@/config/order";

const getDirectOrderFormUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("embedded");
    return parsed.toString().replace(/\?$/, "");
  } catch {
    return url.replace("?embedded=true", "");
  }
};

describe("/order page", () => {
  it("renders the embedded form with fallback link", () => {
    render(<OrderPage />);

    const heading = screen.getByRole("heading", { level: 1, name: /zamówienie/i });
    expect(heading).toBeInTheDocument();

    const iframe = screen.getByTitle("Formularz zamówienia JK Handmade Footwear");
    expect(iframe).toHaveAttribute("src", ORDER_FORM_URL);
    expect(iframe).toHaveAttribute(
      "sandbox",
      "allow-forms allow-scripts allow-same-origin allow-popups"
    );
    expect(iframe).toHaveAttribute("referrerpolicy", "strict-origin-when-cross-origin");

    const fallbackLink = screen.getByRole("link", { name: /pełnej wersji formularza/i });
    expect(fallbackLink).toHaveAttribute("href", getDirectOrderFormUrl(ORDER_FORM_URL));
    expect(fallbackLink).toHaveAttribute("target", "_blank");
    expect(fallbackLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
