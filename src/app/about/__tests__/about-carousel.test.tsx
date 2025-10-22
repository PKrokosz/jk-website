import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AboutCarousel, type AboutSlide } from "../about-carousel";

const slides: AboutSlide[] = [
  {
    id: "craft",
    kicker: "Rzemiosło",
    title: "Każdy detal szyty ręcznie",
    description: "Zespół projektuje i szyje w warszawskiej pracowni.",
    detail: "Każda para przechodzi przez ręce jednego mistrza.",
    video: "/video/craft.mp4"
  },
  {
    id: "comfort",
    kicker: "Komfort",
    title: "Chodź po scenie bez zmęczenia",
    description: "Skórzane podszewki i miękka wkładka amortyzują każdy krok.",
    detail: "Podwójna skóra licowa oraz usztywnione pięty chronią stopę.",
    video: "/video/comfort.mp4"
  },
  {
    id: "durability",
    kicker: "Trwałość",
    title: "Buty, które wytrzymają sezon",
    description: "Materiał odporny na wilgoć i intensywne użytkowanie.",
    detail: "Wzmocnione szwy i podeszwy klejone oraz szyte.",
    video: "/video/durability.mp4"
  }
];

declare global {
  // eslint-disable-next-line no-unused-vars
  interface IntersectionObserver {
    trigger(entries: IntersectionObserverEntry[]): void;
  }
}

const scrollIntoViewMock = vi.fn();

class IntersectionObserverMock {
  private readonly callback: IntersectionObserverCallback;
  public readonly elements = new Set<Element>();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = (element: Element) => {
    this.elements.add(element);
  };

  unobserve = (element: Element) => {
    this.elements.delete(element);
  };

  disconnect = () => {
    this.elements.clear();
  };

  trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

describe("AboutCarousel", () => {
  let intersectionObserver: IntersectionObserverMock;

  beforeEach(() => {
    intersectionObserver = new IntersectionObserverMock(() => undefined);
    scrollIntoViewMock.mockReset();
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = vi
      .fn<IntersectionObserverConstructor>((callback) => {
        intersectionObserver = new IntersectionObserverMock(callback);
        return intersectionObserver as unknown as IntersectionObserver;
      });
    Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
      value: scrollIntoViewMock,
      configurable: true,
      writable: true
    });
    (window as unknown as { matchMedia: unknown }).matchMedia = vi.fn(() => ({
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders all slides as landmark regions with accessible titles", () => {
    render(<AboutCarousel slides={slides} />);

    const regions = screen.getAllByRole("region");

    expect(regions).toHaveLength(slides.length);
    slides.forEach((slide) => {
      expect(screen.getByRole("region", { name: slide.title })).toBeInTheDocument();
    });
  });

  it("advances carousel using navigation buttons and syncs progress label", async () => {
    const user = userEvent.setup();
    render(<AboutCarousel slides={slides} />);

    const nextButton = screen.getByRole("button", { name: "Następny slajd" });
    const prevButton = screen.getByRole("button", { name: "Poprzedni slajd" });
    const progress = screen.getByText(/01 \/ 03/);

    expect(prevButton).toBeDisabled();

    await user.click(nextButton);

    expect(progress).toHaveTextContent("02 / 03");
    expect(prevButton).not.toBeDisabled();
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

    await user.click(nextButton);

    expect(progress).toHaveTextContent("03 / 03");
    expect(nextButton).toBeDisabled();
  });

  it("updates active slide when intersection observer highlights a new section", () => {
    render(<AboutCarousel slides={slides} />);

    const thirdSlide = screen.getByRole("region", { name: slides[2].title });

    act(() => {
      intersectionObserver.trigger([
        {
          target: thirdSlide,
          isIntersecting: true,
          intersectionRatio: 0.7,
          boundingClientRect: thirdSlide.getBoundingClientRect(),
          intersectionRect: thirdSlide.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
          root: null
        } as IntersectionObserverEntry
      ]);
    });

    expect(screen.getByText(/03 \/ 03/)).toBeInTheDocument();
  });
});
