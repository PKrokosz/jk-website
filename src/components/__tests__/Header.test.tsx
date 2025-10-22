import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "../Header";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, prefetch: _prefetch, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  )
}));

const usePathnameMock = vi.hoisted(() => vi.fn<() => string | null>());
const useCartMock = vi.hoisted(() => vi.fn(() => ({ items: [] })));

vi.mock("next/navigation", () => ({
  __esModule: true,
  usePathname: usePathnameMock
}));

vi.mock("@/components/cart/CartProvider", () => ({
  __esModule: true,
  useCart: () => useCartMock()
}));

describe("Header", () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue("/");
    useCartMock.mockReturnValue({ items: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
    useCartMock.mockReset();
  });

  it("renders all navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catalog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Przejdź do koszyka" })).toBeInTheDocument();
  });

  it("marks the matching route as active", () => {
    usePathnameMock.mockReturnValue("/catalog");

    render(<Header />);

    const catalogLink = screen.getByRole("link", { name: "Catalog" });
    const homeLink = screen.getByRole("link", { name: "Home" });

    expect(catalogLink).toHaveAttribute("aria-current", "page");
    expect(catalogLink).toHaveClass("site-header__link--active");
    expect(homeLink).not.toHaveAttribute("aria-current");
  });

  it("highlights the contact route when active", () => {
    usePathnameMock.mockReturnValue("/contact");

    render(<Header />);

    const contactLink = screen.getByRole("link", { name: "Contact" });

    expect(contactLink).toHaveAttribute("aria-current", "page");
    expect(contactLink).toHaveClass("site-header__link--active");
  });
});
