import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OrderPage from "../page";
import { ORDER_FORM_EMBED_URL } from "@/lib/order-form";

describe("/order page", () => {
  it("renders the Google Form embed", () => {
    render(<OrderPage />);

    const heading = screen.getByRole("heading", { level: 1, name: /zamów buty na miarę/i });
    expect(heading).toBeInTheDocument();

    const iframe = screen.getByTitle("Formularz zamówienia JK Handmade Footwear");
    expect(iframe).toHaveAttribute("src", ORDER_FORM_EMBED_URL);
  });
});
