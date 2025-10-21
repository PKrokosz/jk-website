"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroShowcaseItem = {
  src: string;
  alt: string;
  label: string;
  accent?: "amber" | "copper" | "gold" | (string & {});
};

type HeroShowcaseFrameProps = {
  items: HeroShowcaseItem[];
  interval?: number;
};

const accentClassMap: Record<NonNullable<HeroShowcaseItem["accent"]>, string> = {
  amber: "hero-frame--amber",
  copper: "hero-frame--copper",
  gold: "hero-frame--gold"
};

export function HeroShowcaseFrame({ items, interval = 8000 }: HeroShowcaseFrameProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((previous) => (previous + 1) % items.length);
    }, interval);

    return () => window.clearTimeout(timer);
  }, [activeIndex, items.length, interval]);

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[activeIndex];
  const frameAccentClass = activeItem.accent ? accentClassMap[activeItem.accent] ?? "" : "";

  return (
    <figure className={`hero-frame ${frameAccentClass}`}>
      <div className="hero-frame__media">
        {items.map((item, index) => (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 380px, 70vw"
            className={`hero-frame__image ${index === activeIndex ? "is-active" : ""}`}
            priority={index === 0}
            aria-hidden={index === activeIndex ? undefined : true}
          />
        ))}
      </div>
      <figcaption className="hero-frame__caption" aria-live="polite">
        <span className="hero-frame__label">{activeItem.label}</span>
      </figcaption>
      {items.length > 1 ? (
        <div className="hero-frame__controls" aria-label="Wybierz model do podglądu">
          {items.map((item, index) => (
            <button
              key={item.src}
              type="button"
              className={`hero-frame__control ${index === activeIndex ? "is-active" : ""}`}
              aria-label={`Pokaż model ${item.label}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span className="sr-only">{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </figure>
  );
}
