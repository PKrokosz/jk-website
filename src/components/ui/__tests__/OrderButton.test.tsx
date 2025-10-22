import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { OrderButton } from "../OrderButton";
import { ORDER_FORM_EMBED_URL } from "@/lib/order-form";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  )
}));

beforeAll(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(0), 0) as unknown as number;
  });
});

const matchMediaListeners: Array<(event: MediaQueryListEvent) => void> = [];

beforeEach(() => {
  matchMediaListeners.length = 0;
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => {
    const mql: MediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (_event, listener) => {
        matchMediaListeners.push(listener as (event: MediaQueryListEvent) => void);
      },
      removeEventListener: (_event, listener) => {
        const index = matchMediaListeners.indexOf(listener as (event: MediaQueryListEvent) => void);
        if (index >= 0) {
          matchMediaListeners.splice(index, 1);
        }
      },
      addListener: (listener) => {
        matchMediaListeners.push(listener as (event: MediaQueryListEvent) => void);
      },
      removeListener: (listener) => {
        const index = matchMediaListeners.indexOf(listener as (event: MediaQueryListEvent) => void);
        if (index >= 0) {
          matchMediaListeners.splice(index, 1);
        }
      },
      dispatchEvent: () => false
    };

    return mql;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OrderButton", () => {
  it("renders a direct link when forced to link mode", () => {
    render(<OrderButton mode="link">Zamów</OrderButton>);

    const link = screen.getByRole("link", { name: "Zamów" });

    expect(link).toHaveAttribute("href", "/order");
    expect(link).toHaveClass("order-button");
  });

  it("exposes ARIA attributes while controlling the modal lifecycle", async () => {
    const user = userEvent.setup();
    render(<OrderButton mode="modal">Zamów teraz</OrderButton>);

    const trigger = screen.getByRole("button", { name: "Zamów teraz" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: /formularz zamówienia/i });
    const closeButton = screen.getByRole("button", { name: /zamknij formularz zamówienia/i });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("traps focus within the modal content", async () => {
    const user = userEvent.setup();
    render(<OrderButton mode="modal">Zamów teraz</OrderButton>);

    const trigger = screen.getByRole("button", { name: "Zamów teraz" });
    await user.click(trigger);

    const closeButton = await screen.findByRole("button", { name: /zamknij formularz zamówienia/i });
    const fallbackLink = screen.getByRole("link", { name: /Formularz zamówienia JK Handmade Footwear/ });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    await user.tab({ shift: true });
    expect(fallbackLink).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it("merges custom class names and toggles active state with the modal lifecycle", async () => {
    const user = userEvent.setup();
    render(
      <OrderButton className="extra-class" mode="modal">
        Zamów teraz
      </OrderButton>
    );

    const trigger = screen.getByRole("button", { name: "Zamów teraz" });
    expect(trigger).toHaveClass("order-button", "extra-class");
    expect(trigger).not.toHaveClass("order-button--active");

    await user.click(trigger);

    expect(trigger).toHaveClass("order-button", "order-button--active", "extra-class");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(trigger).not.toHaveClass("order-button--active");
    });
  });

  it("forwards additional button props while managing body scroll locking", async () => {
    const user = userEvent.setup();
    render(
      <OrderButton
        mode="modal"
        buttonProps={{
          "data-testid": "order-trigger",
          "data-variant": "primary",
          "aria-label": "Uruchom modal zamówienia"
        }}
      >
        Zamów teraz
      </OrderButton>
    );

    const trigger = screen.getByTestId("order-trigger");
    expect(trigger).toHaveAttribute("aria-label", "Uruchom modal zamówienia");
    expect(trigger).toHaveAttribute("data-variant", "primary");

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: /formularz zamówienia/i });
    expect(dialog).toBeInTheDocument();

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("supports switching between link and modal modes responsywnie", async () => {
    const user = userEvent.setup();
    render(<OrderButton mode="auto">Zamów teraz</OrderButton>);

    expect(screen.getByRole("link", { name: "Zamów teraz" })).toBeInTheDocument();

    await waitFor(() => {
      matchMediaListeners.forEach((listener) => {
        listener({ matches: true, media: "(min-width: 768px)" } as MediaQueryListEvent);
      });
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Zamów teraz" })).toBeInTheDocument();
    });

    const trigger = screen.getByRole("button", { name: "Zamów teraz" });
    await user.click(trigger);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("renders the embedded order form within the modal body", async () => {
    const user = userEvent.setup();
    render(<OrderButton mode="modal">Zamów teraz</OrderButton>);

    await user.click(screen.getByRole("button", { name: "Zamów teraz" }));

    const iframe = await screen.findByTitle("Formularz zamówienia JK Handmade Footwear");
    expect(iframe).toHaveAttribute("src", ORDER_FORM_EMBED_URL);
  });
});
