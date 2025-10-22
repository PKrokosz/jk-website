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

vi.mock("@/lib/telemetry", () => ({
  reportClientError: vi.fn()
}));

import { reportClientError } from "@/lib/telemetry";

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
    vi.clearAllMocks();
    vi.unstubAllGlobals();
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
    expect(screen.getByLabelText(consentLabel)).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Wyślij wiadomość" })).toBeDisabled();
  });

  it("pokazuje komunikat walidacji API", async () => {
    const fetchMock = fetch as unknown as vi.Mock;
    fetchMock.mockResolvedValueOnce(
      new Response(null, {
        status: 422,
        statusText: "Unprocessable Entity"
      })
    );

    render(<ContactForm />);

    fillField(/imię/i, "Jan");
    fillField(/adres e-mail/i, "jan@example.com");
    fillField(/wiadomość/i, "Proszę o wycenę projektu.");
    toggleConsent();

    const submitButton = screen.getByRole("button", { name: "Wyślij wiadomość" });
    fireEvent.click(submitButton);

    await act(async () => {
      vi.runAllTimers();
    });

    expect(
      screen.getByText(/Sprawdź poprawność pól. Niektóre wymagają uzupełnienia./i)
    ).toBeInTheDocument();
    expect(reportClientError).toHaveBeenCalledWith(
      "contact-form:response",
      expect.any(Error),
      expect.objectContaining({ status: 422 })
    );
  });

  it("informuje o limicie zapytań", async () => {
    const fetchMock = fetch as unknown as vi.Mock;
    fetchMock.mockResolvedValueOnce(
      new Response(null, {
        status: 429,
        statusText: "Too Many Requests"
      })
    );

    render(<ContactForm />);

    fillField(/imię/i, "Jan");
    fillField(/adres e-mail/i, "jan@example.com");
    fillField(/wiadomość/i, "Proszę o wycenę projektu.");
    toggleConsent();

    fireEvent.click(screen.getByRole("button", { name: "Wyślij wiadomość" }));

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByText(/Za dużo prób. Spróbuj ponownie za minutę./i)).toBeInTheDocument();
    expect(reportClientError).toHaveBeenCalledWith(
      "contact-form:response",
      expect.any(Error),
      expect.objectContaining({ status: 429 })
    );
  });

  it("informuje o niedostępnej usłudze pocztowej", async () => {
    const fetchMock = fetch as unknown as vi.Mock;
    fetchMock.mockResolvedValueOnce(
      new Response(null, {
        status: 502,
        statusText: "Bad Gateway"
      })
    );

    render(<ContactForm />);

    fillField(/imię/i, "Jan");
    fillField(/adres e-mail/i, "jan@example.com");
    fillField(/wiadomość/i, "Proszę o wycenę projektu.");
    toggleConsent();

    fireEvent.click(screen.getByRole("button", { name: "Wyślij wiadomość" }));

    await act(async () => {
      vi.runAllTimers();
    });

    expect(
      screen.getByText(
        /Usługa poczty chwilowo niedostępna. Wyślij maila bezpośrednio: kontakt@jkhandmade.pl./i
      )
    ).toBeInTheDocument();
    expect(reportClientError).toHaveBeenCalledWith(
      "contact-form:response",
      expect.any(Error),
      expect.objectContaining({ status: 502 })
    );
  });

  it("raportuje błąd transportu", async () => {
    const fetchMock = fetch as unknown as vi.Mock;
    const error = new Error("Network Error");
    fetchMock.mockRejectedValueOnce(error);

    render(<ContactForm />);

    fillField(/imię/i, "Jan");
    fillField(/adres e-mail/i, "jan@example.com");
    fillField(/wiadomość/i, "Proszę o wycenę projektu.");
    toggleConsent();

    fireEvent.click(screen.getByRole("button", { name: "Wyślij wiadomość" }));

    await act(async () => {
      vi.runAllTimers();
    });

    expect(
      screen.getByText(/Nie udało się wysłać formularza. Sprawdź połączenie i spróbuj ponownie./i)
    ).toBeInTheDocument();
    expect(reportClientError).toHaveBeenCalledWith("contact-form:transport", error);
  });
});
