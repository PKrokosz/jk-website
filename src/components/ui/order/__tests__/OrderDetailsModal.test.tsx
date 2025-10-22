import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { OrderDetailsModal, type OrderDetailsFormValues } from "../OrderDetailsModal";

describe("OrderDetailsModal", () => {
  const baseConfiguration = {
    model: { id: "model-1", label: "Obieżyświat", priceGrosz: 120_00 },
    accessories: [{ id: "acc-1", label: "Dodatkowe sprzączki", priceGrosz: 20_00 }],
    extras: [{ id: "extra-1", label: "Szybsza realizacja", priceGrosz: 30_00 }],
    quote: {
      totalNetGrosz: 140_00,
      totalVatGrosz: 32_20,
      totalGrossGrosz: 172_20,
      breakdown: [
        { label: "Model bazowy", amountGrosz: 120_00 },
        { label: "Akcesoria", amountGrosz: 20_00 },
        { label: "VAT", amountGrosz: 32_20 }
      ]
    }
  } as const;

  it("focuses the first field when opened and lists configuration items", async () => {
    render(
      <OrderDetailsModal
        isOpen
        onClose={vi.fn()}
        configuration={baseConfiguration}
        onSubmit={vi.fn()}
      />
    );

    await waitFor(() => expect(screen.getByLabelText("Imię i nazwisko")).toHaveFocus());
    expect(screen.getByText("Model Obieżyświat")).toBeInTheDocument();
    expect(screen.getByText("Dodatkowe sprzączki")).toBeInTheDocument();
    expect(screen.getByText("Szybsza realizacja")).toBeInTheDocument();
    expect(screen.getByText("Suma brutto").nextElementSibling).toHaveTextContent(/172,20\s*zł/);
  });

  it("closes when clicking outside the panel or pressing escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <OrderDetailsModal
        isOpen
        onClose={onClose}
        configuration={baseConfiguration}
        onSubmit={vi.fn()}
      />
    );

    const overlay = container.firstChild as HTMLElement;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("validates required fields and displays aria-described errors", async () => {
    const onSubmit = vi.fn<Promise<void> | void, [OrderDetailsFormValues]>();
    const user = userEvent.setup();

    render(
      <OrderDetailsModal
        isOpen
        onClose={vi.fn()}
        configuration={baseConfiguration}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole("button", { name: "Dodaj do koszyka" }));

    expect(screen.getByText(/Podaj imię i nazwisko/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Imię i nazwisko")).toHaveAttribute("aria-describedby", "order-full-name-error");
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("Imię i nazwisko"), "Jan");
    await user.type(screen.getByLabelText("Adres e-mail"), "niepoprawny");
    await user.click(screen.getByRole("button", { name: "Dodaj do koszyka" }));

    expect(screen.getByText(/Podaj poprawny adres e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Adres e-mail")).toHaveAttribute("aria-describedby", "order-email-error");
  });

  it("submits trimmed form values and resets when successful", async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <OrderDetailsModal
        isOpen
        onClose={onClose}
        configuration={baseConfiguration}
        onSubmit={async (values) => {
          await onSubmit(values);
          onClose();
        }}
      />
    );

    await user.type(screen.getByLabelText("Imię i nazwisko"), " Jan  ");
    await user.type(screen.getByLabelText("Adres e-mail"), " klient@example.com ");
    await user.type(screen.getByLabelText("Preferowany termin (opcjonalnie)"), " Jesień ");
    await user.type(screen.getByLabelText("Notatki do zamówienia (opcjonalnie)"), " kontakt telefoniczny ");

    await user.click(screen.getByRole("button", { name: "Dodaj do koszyka" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        fullName: "Jan",
        email: "klient@example.com",
        preferredDelivery: "Jesień",
        notes: "kontakt telefoniczny"
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
