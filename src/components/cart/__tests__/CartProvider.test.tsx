import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CartProvider, type CartItemInput, useCart } from "../CartProvider";

function CartHarness() {
  const { items, addItem, clear } = useCart();

  const handleAdd = () => {
    const payload: CartItemInput = {
      modelId: "model-1",
      modelLabel: "Model Szpic",
      basePriceGrosz: 120_000,
      accessories: [
        {
          id: "acc-1",
          label: "Skórzane rzemienie",
          priceGrosz: 25_000
        }
      ],
      extras: [],
      totalNetGrosz: 145_000,
      totalVatGrosz: 33_350,
      totalGrossGrosz: 178_350,
      breakdown: [
        { label: "Model Model Szpic", amountGrosz: 120_000 },
        { label: "Skórzane rzemienie", amountGrosz: 25_000 },
        { label: "VAT (23%)", amountGrosz: 33_350 }
      ],
      contact: {
        fullName: "Jan Kowalski",
        email: "jan@example.com",
        preferredDelivery: "Koniec czerwca",
        notes: "Proszę o dodatkowe zdjęcia skóry."
      }
    };

    addItem(payload);
  };

  return (
    <div>
      <button type="button" onClick={handleAdd}>
        dodaj
      </button>
      <button type="button" onClick={clear}>
        wyczyść
      </button>
      <span data-testid="cart-count">{items.length}</span>
      <span data-testid="last-item">{items.at(-1)?.contact.fullName ?? "brak"}</span>
    </div>
  );
}

describe("CartProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(window.localStorage, "getItem").mockReturnValue(null);
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dodaje konfigurację do koszyka i udostępnia ją w kontekście", () => {
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>
    );

    expect(screen.getByTestId("cart-count").textContent).toBe("0");

    fireEvent.click(screen.getByText("dodaj"));

    expect(screen.getByTestId("cart-count").textContent).toBe("1");
    expect(screen.getByTestId("last-item").textContent).toBe("Jan Kowalski");
  });

  it("czyści koszyk", () => {
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>
    );

    expect(screen.getByTestId("cart-count").textContent).toBe("0");

    fireEvent.click(screen.getByText("dodaj"));
    const countAfterAdd = Number(screen.getByTestId("cart-count").textContent);
    expect(countAfterAdd).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByText("wyczyść"));
    expect(screen.getByTestId("cart-count").textContent).toBe("0");
    expect(screen.getByTestId("last-item").textContent).toBe("brak");
  });
});
