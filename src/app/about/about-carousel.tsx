"use client";

import { useEffect, useRef, useState } from "react";

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
              <div className="about-overlay" />
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
    </div>
  );
}
