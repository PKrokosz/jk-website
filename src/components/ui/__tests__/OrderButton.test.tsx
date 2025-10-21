import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { OrderButton } from "../OrderButton";
import { ORDER_FORM_EMBED_URL } from "@/lib/order-form";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  )
}));

beforeAll(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(0), 0) as unknown as number;
  });
});

describe("OrderButton", () => {
  it("renders a direct link when forced to link mode", () => {
    render(<OrderButton mode="link">Zamów</OrderButton>);

    const link = screen.getByRole("link", { name: "Zamów" });

    expect(link).toHaveAttribute("href", "/order");
  });

  it("opens a modal with the order form when clicked", async () => {
    render(<OrderButton mode="modal">Zamów teraz</OrderButton>);

    const trigger = screen.getByRole("button", { name: "Zamów teraz" });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: /formularz zamówienia/i });
    expect(dialog).toBeInTheDocument();

    const iframe = screen.getByTitle("Formularz zamówienia JK Handmade Footwear");
    expect(iframe).toHaveAttribute("src", ORDER_FORM_EMBED_URL);

    const closeButton = screen.getByRole("button", { name: /zamknij formularz zamówienia/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
