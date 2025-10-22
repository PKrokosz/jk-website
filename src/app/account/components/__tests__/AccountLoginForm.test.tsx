import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AccountLoginForm } from "../AccountLoginForm";

describe("AccountLoginForm", () => {
  it("logs the user in after providing valid credentials", async () => {
    render(<AccountLoginForm />);

    fireEvent.change(screen.getByLabelText("Adres e-mail"), { target: { value: "klient@example.com" } });
    fireEvent.change(screen.getByLabelText("Hasło"), { target: { value: "tajnehaslo" } });

    fireEvent.click(screen.getByRole("button", { name: "Zaloguj się" }));

    expect(
      await screen.findByText(/Jesteś zalogowany! Panel klienta otworzy zakładkę z aktualnym zamówieniem/i)
    ).toBeInTheDocument();
  });

  it("shows an error when e-mail is invalid", async () => {
    render(<AccountLoginForm />);

    fireEvent.change(screen.getByLabelText("Adres e-mail"), { target: { value: "niepoprawny" } });
    fireEvent.change(screen.getByLabelText("Hasło"), { target: { value: "tajnehaslo" } });

    fireEvent.click(screen.getByRole("button", { name: "Zaloguj się" }));

    expect(
      await screen.findByText("Sprawdź adres e-mail — potrzebujemy go do znalezienia konta.")
    ).toBeInTheDocument();
  });
});
