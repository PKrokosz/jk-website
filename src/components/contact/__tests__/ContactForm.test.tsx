import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/telemetry", () => ({
  reportClientError: vi.fn()
}));

import { reportClientError } from "@/lib/telemetry";

import { ContactForm } from "../ContactForm";

function createResponse(status: number, statusText?: string) {
  return new Response(null, { status, statusText });
}

describe("ContactForm", () => {
  const consentLabel = /wyrażam zgodę/i;
  let submitRequest: MockedFunction<typeof fetch>;

  beforeEach(() => {
    vi.useFakeTimers();
    submitRequest = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", submitRequest);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  const submitLabel = /wyślij wiadomość/i;
  let submitRequest: ReturnType<typeof vi.fn<typeof fetch>>;

  const fillField = async (label: RegExp, value: string) => {
    const field = screen.getByLabelText(label);
    await userEvent.clear(field);
    await userEvent.type(field, value);
  };

  const toggleConsent = async () => {
    await userEvent.click(screen.getByLabelText(consentLabel));
  };

  beforeEach(() => {
    submitRequest = vi.fn<typeof fetch>();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("blokuje wysyłkę dopóki wymagane pola nie są uzupełnione", async () => {
    render(<ContactForm submitRequest={submitRequest} />);

    const submitButton = screen.getByRole("button", { name: submitLabel });
    expect(submitButton).toBeDisabled();

    await fillField(/imię/i, "Jan");
    await fillField(/adres e-mail/i, "jan@example.com");
    await fillField(/wiadomość/i, "Szukam butów do nowej postaci.");

    expect(submitButton).toBeDisabled();

    await toggleConsent();

    expect(submitButton).toBeEnabled();
  });

  it("pokazuje komunikat o błędzie dla niepoprawnego e-maila", async () => {
    render(<ContactForm submitRequest={submitRequest} />);

    await fillField(/imię/i, "Anna");
    await fillField(/adres e-mail/i, "niepoprawny");
    await fillField(/wiadomość/i, "Potrzebuję butów do wydarzenia.");
    await toggleConsent();

    await userEvent.click(screen.getByRole("button", { name: submitLabel }));

    expect(
      screen.getByText(/adres e-mail wygląda niepoprawnie/i)
    ).toBeInTheDocument();
  });

  it("resetuje formularz po udanej wysyłce", async () => {
    submitRequest.mockResolvedValue(createResponse(200));

    render(<ContactForm submitRequest={submitRequest} />);

    await fillField(/imię/i, "Katarzyna");
    await fillField(/adres e-mail/i, "katarzyna@example.com");
    await fillField(/wiadomość/i, "Proszę o konsultację w przyszłym tygodniu.");
    await toggleConsent();

    await userEvent.click(screen.getByRole("button", { name: submitLabel }));

    expect(submitRequest).toHaveBeenCalledWith(
      "/api/contact/submit",
      expect.objectContaining({ method: "POST" })
    );

    await waitFor(() =>
      expect(
        screen.getByText(/dziękujemy za wiadomość/i)
      ).toBeInTheDocument()
    );

    expect(screen.getByLabelText(/imię/i)).toHaveValue("");
    expect(screen.getByLabelText(/adres e-mail/i)).toHaveValue("");
    expect(screen.getByLabelText(/wiadomość/i)).toHaveValue("");
    expect(screen.getByLabelText(consentLabel)).not.toBeChecked();
    expect(screen.getByRole("button", { name: submitLabel })).toBeDisabled();
  });

  it("pokazuje komunikat walidacji API", async () => {
    submitRequest.mockResolvedValue(createResponse(422, "Unprocessable Entity"));

    render(<ContactForm submitRequest={submitRequest} />);

    await fillField(/imię/i, "Jan");
    await fillField(/adres e-mail/i, "jan@example.com");
    await fillField(/wiadomość/i, "Proszę o wycenę projektu.");
    await toggleConsent();

    await userEvent.click(screen.getByRole("button", { name: submitLabel }));

    await waitFor(() =>
      expect(
        screen.getByText(/Sprawdź poprawność pól. Niektóre wymagają uzupełnienia./i)
      ).toBeInTheDocument()
    );

    expect(reportClientError).toHaveBeenCalledWith(
      "contact-form:response",
      expect.any(Error),
      expect.objectContaining({ status: 422, statusText: "Unprocessable Entity" })
    );
  });

  it("informuje o limicie zapytań", async () => {
    submitRequest.mockResolvedValue(createResponse(429, "Too Many Requests"));

    render(<ContactForm submitRequest={submitRequest} />);

    await fillField(/imię/i, "Jan");
    await fillField(/adres e-mail/i, "jan@example.com");
    await fillField(/wiadomość/i, "Proszę o wycenę projektu.");
    await toggleConsent();

    await userEvent.click(screen.getByRole("button", { name: submitLabel }));

    await waitFor(() =>
      expect(
        screen.getByText(/Za dużo prób. Spróbuj ponownie za minutę./i)
      ).toBeInTheDocument()
    );

    expect(reportClientError).toHaveBeenCalledWith(
      "contact-form:response",
      expect.any(Error),
      expect.objectContaining({ status: 429, statusText: "Too Many Requests" })
    );
  });

  it("informuje o niedostępnej usłudze pocztowej", async () => {
    submitRequest.mockResolvedValue(createResponse(502, "Bad Gateway"));

    render(<ContactForm submitRequest={submitRequest} />);

    await fillField(/imię/i, "Jan");
    await fillField(/adres e-mail/i, "jan@example.com");
    await fillField(/wiadomość/i, "Proszę o wycenę projektu.");
    await toggleConsent();

    await userEvent.click(screen.getByRole("button", { name: submitLabel }));

    await waitFor(() =>
      expect(
        screen.getByText(
          /Usługa poczty chwilowo niedostępna. Wyślij maila bezpośrednio: kontakt@jkhandmade.pl./i
        )
      ).toBeInTheDocument()
    );

    expect(reportClientError).toHaveBeenCalledWith(
      "contact-form:response",
      expect.any(Error),
      expect.objectContaining({ status: 502, statusText: "Bad Gateway" })
    );
  });

  it("raportuje błąd transportu", async () => {
    const networkError = new Error("Network Error");
    submitRequest.mockRejectedValue(networkError);

    render(<ContactForm submitRequest={submitRequest} />);

    await fillField(/imię/i, "Jan");
    await fillField(/adres e-mail/i, "jan@example.com");
    await fillField(/wiadomość/i, "Proszę o wycenę projektu.");
    await toggleConsent();

    await userEvent.click(screen.getByRole("button", { name: submitLabel }));

    await waitFor(() =>
      expect(
        screen.getByText(/Nie udało się wysłać formularza. Sprawdź połączenie i spróbuj ponownie./i)
      ).toBeInTheDocument()
    );

    expect(reportClientError).toHaveBeenCalledWith("contact-form:transport", networkError);
  });

  it("prefilluje i sanituje parametr produktu oraz reaguje na zmianę propsów", async () => {
    const { rerender } = render(
      <ContactForm submitRequest={submitRequest} initialProduct={"  \u0000Szpic   "} />
    );

    const productField = screen.getByLabelText(/Model lub referencja/i);
    expect(productField).toHaveValue("Szpic");

    await userEvent.clear(productField);
    await userEvent.type(productField, "Własny projekt");
    expect(productField).toHaveValue("Własny projekt");

    rerender(
      <ContactForm submitRequest={submitRequest} initialProduct={"   Dragonki   "} />
    );

    expect(productField).toHaveValue("Dragonki");
  });

  it("wysyła odsanitowany payload z trimowaniem pól opcjonalnych", async () => {
    submitRequest.mockResolvedValue(createResponse(200));

    render(<ContactForm submitRequest={submitRequest} initialProduct={"  Szpic  "} />);

    await fillField(/imię/i, "  Jan ");
    await fillField(/adres e-mail/i, " jan@example.com ");
    await fillField(/telefon/i, " 123-456-789 ");
    await fillField(/Model lub referencja/i, "  Szpic  \u0000  ");
    await fillField(/wiadomość/i, "  Potrzebuję dopasowania.  ");
    await toggleConsent();

    await userEvent.click(screen.getByRole("button", { name: submitLabel }));

    await waitFor(() => expect(submitRequest).toHaveBeenCalled());

    const payload = JSON.parse(submitRequest.mock.calls[0][1]?.body as string);

    expect(payload).toMatchObject({
      name: "Jan",
      email: "jan@example.com",
      phone: "123-456-789",
      message: "Potrzebuję dopasowania.",
      product: "Szpic",
      website: ""
    });
  });
});
