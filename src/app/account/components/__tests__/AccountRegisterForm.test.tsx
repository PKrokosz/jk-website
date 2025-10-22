import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AccountRegisterForm } from "../AccountRegisterForm";

describe("AccountRegisterForm", () => {
  it("submits the form and displays a success message", async () => {
    render(<AccountRegisterForm />);

    fireEvent.change(screen.getByLabelText("Imię i nazwisko"), { target: { value: "Jan Kowalski" } });
    fireEvent.change(screen.getByLabelText("Adres e-mail"), { target: { value: "jan@example.com" } });
    fireEvent.change(screen.getByLabelText("Hasło"), { target: { value: "silnehaslo" } });
    fireEvent.change(screen.getByLabelText("Powtórz hasło"), { target: { value: "silnehaslo" } });
    fireEvent.click(screen.getByLabelText(/Akceptuję regulamin konta/i));

    fireEvent.click(screen.getByRole("button", { name: "Załóż konto" }));

    expect(
      await screen.findByText(
        /Konto zostało utworzone! Sprawdź skrzynkę e-mail, aby potwierdzić rejestrację/i
      )
    ).toBeInTheDocument();
  });

  it("prevents submission when passwords differ", async () => {
    render(<AccountRegisterForm />);

    fireEvent.change(screen.getByLabelText("Imię i nazwisko"), { target: { value: "Jan Kowalski" } });
    fireEvent.change(screen.getByLabelText("Adres e-mail"), { target: { value: "jan@example.com" } });
    fireEvent.change(screen.getByLabelText("Hasło"), { target: { value: "silnehaslo" } });
    fireEvent.change(screen.getByLabelText("Powtórz hasło"), { target: { value: "innehaslo" } });
    fireEvent.click(screen.getByLabelText(/Akceptuję regulamin konta/i));

    fireEvent.click(screen.getByRole("button", { name: "Załóż konto" }));

    expect(
      await screen.findByText("Powtórzone hasło nie zgadza się z pierwszym. Spróbuj ponownie.")
    ).toBeInTheDocument();
  });
});
