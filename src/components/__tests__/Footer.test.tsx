import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "../Footer";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, prefetch: _prefetch, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  )
}));

describe("Footer", () => {
  it("renders legal copy and links", () => {
    render(<Footer />);

    expect(screen.getByText(/© 2025 JK Handmade Footwear/)).toBeInTheDocument();
    expect(screen.getByText(/Pracownia Butów Na Miarę/)).toBeInTheDocument();

    const privacyLink = screen.getByRole("link", { name: "Polityka prywatności" });
    const termsLink = screen.getByRole("link", { name: "Regulamin" });
    const [termsLink] = screen.getAllByRole("link", { name: /Regulamin/ });

    expect(privacyLink).toHaveAttribute("href", "/privacy-policy");
    expect(termsLink).toHaveAttribute("href", "/terms");
  });
});
