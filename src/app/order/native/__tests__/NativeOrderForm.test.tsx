/* eslint-disable @next/next/no-img-element */
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { ORDER_MODELS } from "@/config/orderModels";

import { NativeOrderForm } from "../NativeOrderForm";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { alt, src, ...rest } = props;
    const resolvedSrc = typeof src === "string" ? src : src?.src ?? "";
    return <img alt={alt ?? ""} src={resolvedSrc} {...rest} />;
  }
}));

describe("NativeOrderForm", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    pushMock.mockReset();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders validation errors when required fields are empty", async () => {
    render(<NativeOrderForm />);

    const submitButton = screen.getByRole("button", { name: /zamów teraz/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/wpisz imię i nazwisko/i)).toBeInTheDocument();
    expect(screen.getByText(/podaj numer telefonu/i)).toBeInTheDocument();
    expect(screen.getByText(/podaj kod paczkomatu/i)).toBeInTheDocument();
    expect(screen.getByText(/podaj poprawny adres e-mail/i)).toBeInTheDocument();
    expect(screen.getAllByText(/podaj liczbę/i)).toHaveLength(2);
  });

  it("submits valid data and calls the API route", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    global.fetch = fetchMock;

    render(<NativeOrderForm />);

    fireEvent.change(screen.getByLabelText(/imię i nazwisko/i), {
      target: { value: "Jan Kowalski" }
    });
    fireEvent.change(screen.getByLabelText(/numer telefonu/i), {
      target: { value: "+48123456789" }
    });
    fireEvent.change(screen.getByLabelText(/adres mailowy/i), {
      target: { value: "jan@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/kod paczkomatu/i), {
      target: { value: "WAW123" }
    });
    fireEvent.change(screen.getByLabelText(/długość stopy/i), {
      target: { value: "27.4" }
    });
    fireEvent.change(screen.getByLabelText(/obwód śródstopia/i), {
      target: { value: "24.1" }
    });

    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);

    fireEvent.change(screen.getByRole("combobox", { name: /kolor buta/i }), { target: { value: "brown" } });
    fireEvent.change(screen.getByRole("combobox", { name: /rozmiar/i }), { target: { value: "42" } });

    fireEvent.click(screen.getByRole("button", { name: /zamów teraz/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/order/submit", expect.any(Object));
      expect(pushMock).toHaveBeenCalled();
    });

    const body = fetchMock.mock.calls[0][1]?.body as string;
    const parsed = JSON.parse(body);
    expect(parsed.fullName).toBe("Jan Kowalski");
    expect(pushMock.mock.calls[0][0]).toContain("/order/thanks?name=");
  });

  it("renders a card for each available model", () => {
    render(<NativeOrderForm />);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(ORDER_MODELS.length);
  });
});
