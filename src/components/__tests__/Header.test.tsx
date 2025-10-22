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

    expect(screen.getByRole("link", { name: "Strona główna" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Katalog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "O pracowni" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Zamówienia grupowe" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kontakt" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Konto" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Przejdź do koszyka" })).toBeInTheDocument();
  });

  it("marks the matching route as active", () => {
    usePathnameMock.mockReturnValue("/catalog");

    render(<Header />);

    const catalogLink = screen.getByRole("link", { name: "Katalog" });
    const homeLink = screen.getByRole("link", { name: "Strona główna" });

    expect(catalogLink).toHaveAttribute("aria-current", "page");
    expect(catalogLink).toHaveClass("site-header__link--active");
    expect(homeLink).not.toHaveAttribute("aria-current");
  });

  it("highlights the contact route when active", () => {
    usePathnameMock.mockReturnValue("/contact");

    render(<Header />);

    const contactLink = screen.getByRole("link", { name: "Kontakt" });

    expect(contactLink).toHaveAttribute("aria-current", "page");
    expect(contactLink).toHaveClass("site-header__link--active");
  });

  it("marks the group orders link as active on the matching route", () => {
    usePathnameMock.mockReturnValue("/group-orders");

    render(<Header />);

    const groupOrdersLink = screen.getByRole("link", { name: "Zamówienia grupowe" });

    expect(groupOrdersLink).toHaveAttribute("aria-current", "page");
    expect(groupOrdersLink).toHaveClass("site-header__link--active");
  });
});
