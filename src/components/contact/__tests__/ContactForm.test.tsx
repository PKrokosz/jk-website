import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "../ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const fillField = (label: RegExp, value: string) => {
    const field = screen.getByLabelText(label);
    fireEvent.change(field, { target: { value } });
  };

  const toggleConsent = () => {
    const checkbox = screen.getByLabelText(/wyrażam zgodę/i);
    fireEvent.click(checkbox);
  };

  it("blokuje wysyłkę dopóki wymagane pola nie są uzupełnione", () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole("button", { name: "Wyślij wiadomość" });
    expect(submitButton).toBeDisabled();

    fillField(/imię/i, "Jan");
    fillField(/adres e-mail/i, "jan@example.com");
    fillField(/wiadomość/i, "Szukam butów do nowej postaci.");

    expect(submitButton).toBeDisabled();

    toggleConsent();

    expect(submitButton).toBeEnabled();
  });

  it("pokazuje komunikat o błędzie dla niepoprawnego e-maila", async () => {
    render(<ContactForm />);

    fillField(/imię/i, "Anna");
    fillField(/adres e-mail/i, "niepoprawny");
    fillField(/wiadomość/i, "Potrzebuję butów do wydarzenia.");
    toggleConsent();

    const submitButton = screen.getByRole("button", { name: "Wyślij wiadomość" });
    fireEvent.click(submitButton);

    expect(screen.getByText(/adres e-mail wygląda niepoprawnie/i)).toBeInTheDocument();
  });

  it("resetuje formularz po udanej wysyłce", async () => {
    render(<ContactForm />);

    fillField(/imię/i, "Katarzyna");
    fillField(/adres e-mail/i, "katarzyna@example.com");
    fillField(/wiadomość/i, "Proszę o konsultację w przyszłym tygodniu.");
    toggleConsent();

    const submitButton = screen.getByRole("button", { name: "Wyślij wiadomość" });
    fireEvent.click(submitButton);

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByText(/dziękujemy za wiadomość/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/imię/i)).toHaveValue("");
    expect(screen.getByLabelText(/adres e-mail/i)).toHaveValue("");
    expect(screen.getByLabelText(/wiadomość/i)).toHaveValue("");
    expect(screen.getByLabelText(/wyrażam zgodę/i)).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Wyślij wiadomość" })).toBeDisabled();
  });
});
