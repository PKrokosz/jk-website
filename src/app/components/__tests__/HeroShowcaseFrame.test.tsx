import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HeroShowcaseFrame } from "../HeroShowcaseFrame";

const showcaseItems = [
  {
    src: "/image/model-1.jpg",
    alt: "Model Obieżyświat na stojaku ekspozycyjnym",
    label: "Obieżyświat",
    accent: "amber" as const
  },
  {
    src: "/image/model-2.jpg",
    alt: "Model Tamer na drewnianym tle",
    label: "Tamer",
    accent: "copper" as const
  },
  {
    src: "/image/model-3.jpg",
    alt: "Model Wysokie Krowie Pyski na tle scenograficznym",
    label: "Wysokie Krowie Pyski",
    accent: "gold" as const
  }
];

describe("HeroShowcaseFrame", () => {
  it("renders images with controls and accessible labels", () => {
    render(<HeroShowcaseFrame items={showcaseItems} />);

    expect(screen.getByAltText(showcaseItems[0].alt)).toBeInTheDocument();
    const controlButtons = screen.getAllByRole("button", { name: /Pokaż model/i });
    expect(controlButtons).toHaveLength(showcaseItems.length);
    expect(controlButtons[0]).toHaveAttribute("aria-pressed", "true");
    expect(controlButtons.slice(1).every((button) => button.getAttribute("aria-pressed") === "false")).toBe(true);
  });

  it("advances automatically after the configured interval", () => {
    vi.useFakeTimers();
    render(<HeroShowcaseFrame items={showcaseItems} interval={2000} />);

    const controls = screen.getAllByRole("button", { name: /Pokaż model/ });

    expect(controls[0]).toHaveAttribute("aria-pressed", "true");
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(controls[1]).toHaveAttribute("aria-pressed", "true");
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(controls[2]).toHaveAttribute("aria-pressed", "true");

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("switches active image when a control button is activated", async () => {
    const user = userEvent.setup();
    render(<HeroShowcaseFrame items={showcaseItems} />);

    const controls = screen.getAllByRole("button", { name: /Pokaż model/ });

    await user.click(controls[2]);

    await waitFor(() => {
      expect(controls[2]).toHaveAttribute("aria-pressed", "true");
    });

    const images = screen.getAllByRole("img", { hidden: true });
    expect(images[2]).not.toHaveAttribute("aria-hidden", "true");
    expect(images[0]).toHaveAttribute("aria-hidden", "true");
  });
});
