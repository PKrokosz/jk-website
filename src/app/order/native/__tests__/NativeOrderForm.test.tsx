import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NativeOrderForm } from "../NativeOrderForm";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

describe("NativeOrderForm", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("wyświetla komunikat o błędzie, gdy pole jest puste", () => {
    render(<NativeOrderForm />);

    const submitButton = screen.getByRole("button", { name: /przejdź do koszyka/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/wpisz imię i nazwisko/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("czyści błąd po ponownej edycji pola", () => {
    render(<NativeOrderForm />);

    const submitButton = screen.getByRole("button", { name: /przejdź do koszyka/i });
    fireEvent.click(submitButton);

    const input = screen.getByLabelText(/imię i nazwisko/i);
    fireEvent.change(input, { target: { value: "Jan" } });

    expect(screen.queryByText(/wpisz imię i nazwisko/i)).not.toBeInTheDocument();
  });

  it("przekierowuje do podstrony koszyka z przekazanym imieniem", () => {
    render(<NativeOrderForm />);

    const input = screen.getByLabelText(/imię i nazwisko/i);
    fireEvent.change(input, { target: { value: "  Jan Kowalski  " } });

    fireEvent.click(screen.getByRole("button", { name: /przejdź do koszyka/i }));

    expect(pushMock).toHaveBeenCalledWith("/order/cart?name=Jan+Kowalski");
  });
});
