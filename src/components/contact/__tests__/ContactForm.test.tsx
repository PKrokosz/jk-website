import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction
} from "vitest";

import { ContactForm } from "../ContactForm";

describe("ContactForm", () => {
  const consentLabel = /wyrażam zgodę/i;
  let submitRequest: MockedFunction<typeof fetch>;

  beforeEach(() => {
    vi.useFakeTimers();
    submitRequest = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 200 }));
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
    const checkbox = screen.getByLabelText(consentLabel);
    fireEvent.click(checkbox);
  };

  it("blokuje wysyłkę dopóki wymagane pola nie są uzupełnione", () => {
    render(<ContactForm submitRequest={submitRequest} />);

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
    render(<ContactForm submitRequest={submitRequest} />);

    fillField(/imię/i, "Anna");
    fillField(/adres e-mail/i, "niepoprawny");
    fillField(/wiadomość/i, "Potrzebuję butów do wydarzenia.");
    toggleConsent();

    const submitButton = screen.getByRole("button", { name: "Wyślij wiadomość" });
    fireEvent.click(submitButton);

    expect(screen.getByText(/adres e-mail wygląda niepoprawnie/i)).toBeInTheDocument();
  });

  it("resetuje formularz po udanej wysyłce", async () => {
    render(<ContactForm submitRequest={submitRequest} />);

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
    expect(screen.getByLabelText(consentLabel)).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Wyślij wiadomość" })).toBeDisabled();
  });
});
