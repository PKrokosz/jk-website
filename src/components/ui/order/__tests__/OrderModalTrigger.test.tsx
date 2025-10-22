import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OrderModalTrigger } from "../OrderModalTrigger";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  )
}));

describe("OrderModalTrigger", () => {
  it("renderuje przycisk otwierający modal", () => {
    render(<OrderModalTrigger />);

    const trigger = screen.getByRole("button", { name: "Zamów buty" });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("otwiera modal z CTA i ustawia fokus", () => {
    render(<OrderModalTrigger triggerLabel="Złóż zamówienie" ctaLabel="Przejdź do formularza" />);

    fireEvent.click(screen.getByRole("button", { name: "Złóż zamówienie" }));

    const dialog = screen.getByRole("dialog", { name: /złóż zamówienie online/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveFocus();
    expect(screen.getByRole("link", { name: "Przejdź do formularza" })).toHaveAttribute("href", "/order/native");
  });

  it("zamyka modal klawiszem Escape oraz kliknięciem w tło", () => {
    render(<OrderModalTrigger triggerLabel="Otwórz modal" />);

    fireEvent.click(screen.getByRole("button", { name: "Otwórz modal" }));
    const dialog = screen.getByRole("dialog");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Otwórz modal" }));
    const reopenedDialog = screen.getByRole("dialog");

    fireEvent.click(reopenedDialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
