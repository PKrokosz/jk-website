"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AboutSlide = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  detail: string;
  video: string;
};

type AboutCarouselProps = {
  slides: AboutSlide[];
};

export function AboutCarousel({ slides }: AboutCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback(
    (index: number) => {
      const target = slideRefs.current[index];

      if (target) {
        target.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    },
    []
  );

  const handleNext = useCallback(() => {
    scrollToIndex((activeIndex + 1) % slides.length);
  }, [activeIndex, scrollToIndex, slides.length]);

  const handlePrev = useCallback(() => {
    scrollToIndex((activeIndex - 1 + slides.length) % slides.length);
  }, [activeIndex, scrollToIndex, slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    const slideElements = slideRefs.current.filter((slide): slide is HTMLElement => Boolean(slide));

    if (!track || !slideElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = slideElements.indexOf(visible.target as HTMLElement);

          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      },
      {
        root: track,
        threshold: [0.4, 0.6, 0.8],
      }
    );

    slideElements.forEach((slide) => observer.observe(slide));

    return () => {
      slideElements.forEach((slide) => observer.unobserve(slide));
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={trackRef} className="about-track">
      {slides.map((slide, index) => {
        const offset = Math.max(-2, Math.min(2, index - activeIndex));

        return (
          <section
            key={slide.id}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
            className="about-slide"
            data-position={offset}
            aria-labelledby={`${slide.id}-title`}
          >
            <div className="about-media" aria-hidden="true">
              <video
                className="about-video"
                src={slide.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
            <div className="about-content">
              <p className="about-kicker">{slide.kicker}</p>
              <h2 id={`${slide.id}-title`} className="about-title">
                {slide.title}
              </h2>
              <p className="about-description">{slide.description}</p>
              <p className="about-detail">{slide.detail}</p>
            </div>
          </section>
        );
      })}
      <div className="about-controls" aria-live="polite">
        <button
          type="button"
          className="about-control"
          onClick={handlePrev}
          aria-label="Poprzedni slajd"
        >
          Poprzedni
        </button>
        <span className="about-progress" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="about-control"
          onClick={handleNext}
          aria-label="Następny slajd"
        >
          Dalej
        </button>
      </div>
    </div>
  );
}
