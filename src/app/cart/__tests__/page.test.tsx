import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CartPage from "../page";

type MockCartItem = {
  id: string;
  modelId: string;
  modelLabel: string;
  basePriceGrosz: number;
  accessories: Array<{ id: string; label: string; priceGrosz: number }>;
  extras: Array<{ id: string; label: string; priceGrosz: number }>;
  totalNetGrosz: number;
  totalVatGrosz: number;
  totalGrossGrosz: number;
  breakdown: unknown[];
  createdAt: string;
  contact: {
    fullName: string;
    email: string;
    preferredDelivery?: string;
    notes?: string;
  };
};

type CartContextValue = {
  items: MockCartItem[];
  removeItem: (id: string) => void;
  clear: () => void;
};

const useCartMock = vi.fn<() => CartContextValue>();

vi.mock("@/components/cart/CartProvider", () => ({
  useCart: () => useCartMock()
}));

describe("CartPage", () => {
  beforeEach(() => {
    useCartMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty cart message with navigation links", () => {
    const emptyCart = {
      items: [],
      removeItem: vi.fn(),
      clear: vi.fn()
    } satisfies CartContextValue;

    useCartMock.mockReturnValue(emptyCart);

    render(<CartPage />);

    expect(
      screen.getByRole("heading", { name: "Twój koszyk czeka na pierwszą konfigurację" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Wróć na stronę główną" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Przeglądaj katalog" })).toHaveAttribute("href", "/catalog");
  });

  it("renders cart items with totals and allows removal", async () => {
    const removeItem = vi.fn();
    const clearCart = vi.fn();
    const cartItem = {
      id: "item-1",
      modelId: "model-1",
      modelLabel: "Obieżyświat",
      basePriceGrosz: 120_00,
      accessories: [
        { id: "acc-1", label: "Pas do szabli", priceGrosz: 40_00 }
      ],
      extras: [
        { id: "ext-1", label: "Dodatkowe sznurowanie", priceGrosz: 30_00 }
      ],
      totalNetGrosz: 150_00,
      totalVatGrosz: 34_50,
      totalGrossGrosz: 184_50,
      breakdown: [],
      createdAt: "2023-10-12T18:30:00.000Z",
      contact: {
        fullName: "Jan Kowalski",
        email: "jan@example.com",
        preferredDelivery: "Listopad",
        notes: "Proszę o kontakt telefoniczny"
      }
    };

    useCartMock.mockReturnValue({
      items: [cartItem],
      removeItem,
      clear: clearCart
    });

    const user = userEvent.setup();
    render(<CartPage />);

    expect(screen.getByRole("heading", { name: "Twoje konfiguracje do zamówienia" })).toBeInTheDocument();
    expect(screen.getByText("Model Obieżyświat")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Wyślij konfigurację do pracowni" })).toHaveAttribute(
      "href",
      "mailto:kontakt@jkhandmade.pl"
    );

    const removeButton = screen.getByRole("button", { name: "Usuń konfigurację" });
    await user.click(removeButton);
    expect(removeItem).toHaveBeenCalledWith("item-1");

    const clearButton = screen.getByRole("button", { name: "Wyczyść koszyk" });
    await user.click(clearButton);
    expect(clearCart).toHaveBeenCalled();

    const totalLabel = screen.getByText("Łącznie brutto");
    expect(totalLabel.nextElementSibling).toHaveTextContent(/184,50\s*zł/);
  });
});
