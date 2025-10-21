"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

interface SellingPoint {
  title: string;
  description: string;
}

interface SellingPointsCarouselProps {
  points: SellingPoint[];
}

type ScrollState = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const defaultScrollState: ScrollState = {
  canScrollPrev: false,
  canScrollNext: false
};

export function SellingPointsCarousel({ points }: SellingPointsCarouselProps) {
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const [scrollState, setScrollState] = useState<ScrollState>(defaultScrollState);

  const updateScrollState = useCallback(() => {
    const node = listRef.current;

    if (!node) {
      setScrollState(defaultScrollState);
      return;
    }

    const maxScrollLeft = node.scrollWidth - node.clientWidth;
    const epsilon = 1;

    setScrollState({
      canScrollPrev: node.scrollLeft > epsilon,
      canScrollNext: node.scrollLeft < maxScrollLeft - epsilon
    });
  }, []);

  useEffect(() => {
    const node = listRef.current;

    if (!node) {
      return;
    }

    updateScrollState();

    const handleScroll = () => updateScrollState();
    node.addEventListener("scroll", handleScroll, { passive: true });

    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateScrollState());
      resizeObserver.observe(node);
    }

    return () => {
      node.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  const handleScrollBy = (direction: "prev" | "next") => {
    const node = listRef.current;

    if (!node) {
      return;
    }

    const scrollAmount = node.clientWidth * 0.9;
    const delta = direction === "next" ? scrollAmount : -scrollAmount;

    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleScrollBy("next");
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleScrollBy("prev");
    }
  };

  return (
    <div className="selling-points__carousel" role="group" aria-label="Najważniejsze cechy butów">
      <div className="selling-points__controls">
        <button
          type="button"
          className="carousel-nav carousel-nav--prev"
          aria-label="Przewiń do poprzednich cech"
          aria-controls={listId}
          onClick={() => handleScrollBy("prev")}
          disabled={!scrollState.canScrollPrev}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="carousel-nav carousel-nav--next"
          aria-label="Przewiń do kolejnych cech"
          aria-controls={listId}
          onClick={() => handleScrollBy("next")}
          disabled={!scrollState.canScrollNext}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="flying-window">
        <ul
          ref={listRef}
          id={listId}
          className="selling-points selling-points--carousel"
          role="list"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {points.map((point) => (
            <li key={point.title} className="selling-point" tabIndex={0}>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
