"use client";

import React from "react";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode
} from "react";

import { ORDER_FORM_EMBED_URL } from "@/lib/order-form";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

const focusableSelectors = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

type OrderButtonMode = "auto" | "modal" | "link";

type DataAttributes = Partial<Record<`data-${string}`, string | number | boolean | undefined>>;

export type OrderButtonProps = {
  children?: ReactNode;
  className?: string;
  mode?: OrderButtonMode;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> &
    DataAttributes;
};

const resolveResponsiveMode = (mode: OrderButtonMode, setMode: (value: OrderButtonMode) => void) => {
  if (mode !== "auto" || typeof window === "undefined") {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(DESKTOP_MEDIA_QUERY);
  const updateMode = (event?: MediaQueryListEvent) => {
    const matches = event ? event.matches : mediaQueryList.matches;
    setMode(matches ? "modal" : "link");
  };

  updateMode();

  if (typeof mediaQueryList.addEventListener === "function") {
    mediaQueryList.addEventListener("change", updateMode);
  } else if (typeof mediaQueryList.addListener === "function") {
    mediaQueryList.addListener(updateMode);
  }

  return () => {
    if (typeof mediaQueryList.removeEventListener === "function") {
      mediaQueryList.removeEventListener("change", updateMode);
    } else if (typeof mediaQueryList.removeListener === "function") {
      mediaQueryList.removeListener(updateMode);
    }
  };
};

export function OrderButton({
  children = "Zamów teraz",
  className,
  mode = "auto",
  buttonProps
}: OrderButtonProps) {
  const [resolvedMode, setResolvedMode] = useState<OrderButtonMode>(mode === "auto" ? "link" : mode);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const titleId = useId();
  const descriptionId = useId();
  const dialogId = useId();

  useEffect(() => {
    if (mode === "auto") {
      return resolveResponsiveMode(mode, setResolvedMode);
    }

    setResolvedMode(mode);
    return undefined;
  }, [mode]);

  const updateFocusableElements = useCallback(() => {
    if (!dialogRef.current) return;

    const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
      (element) => element.tabIndex !== -1 && !element.hasAttribute("data-focus-guard")
    );

    focusableElementsRef.current = elements;
  }, []);

  const trapFocus = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusableElementsRef.current.length === 0) {
        return;
      }

      const focusable = focusableElementsRef.current;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === first || !dialogRef.current?.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    []
  );

  useEffect(() => {
    if (resolvedMode !== "modal" || !isOpen) {
      return;
    }

    const dialogNode = dialogRef.current;
    if (!dialogNode) {
      return;
    }

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
    updateFocusableElements();

    const firstFocusable = focusableElementsRef.current[0] ?? dialogNode;

    requestAnimationFrame(() => {
      firstFocusable.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => trapFocus(event);

    document.addEventListener("keydown", onKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;

      const elementToRestore = previouslyFocusedElement.current;
      previouslyFocusedElement.current = null;

      if (elementToRestore) {
        requestAnimationFrame(() => {
          elementToRestore.focus();
        });
      }
    };
  }, [isOpen, resolvedMode, trapFocus, updateFocusableElements]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updateFocusableElements();
  }, [isOpen, updateFocusableElements]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const observer = new MutationObserver(() => {
      updateFocusableElements();
    });

    if (dialogRef.current) {
      observer.observe(dialogRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [isOpen, updateFocusableElements]);

  useEffect(() => {
    if (resolvedMode !== "modal" && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, resolvedMode]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const buttonClassName = useMemo(() => {
    const classes = ["order-button"];

    if (isOpen && resolvedMode === "modal") {
      classes.push("order-button--active");
    }

    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  }, [className, isOpen, resolvedMode]);

  if (resolvedMode === "link") {
    return (
      <Link className={buttonClassName} href="/order">
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        {...buttonProps}
        type="button"
        className={buttonClassName}
        onClick={openModal}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
      >
        {children}
      </button>

      {isOpen ? (
        <div className="order-modal" role="presentation">
          <div className="order-modal__backdrop" aria-hidden="true" onClick={closeModal} />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            id={dialogId}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="order-modal__panel"
            tabIndex={-1}
          >
            <div className="order-modal__header">
              <h2 className="order-modal__title" id={titleId}>
                Formularz zamówienia
              </h2>
              <p className="order-modal__description" id={descriptionId}>
                Wypełnij formularz, aby rozpocząć zamówienie personalizowanych butów.
              </p>
              <button
                type="button"
                className="order-modal__close"
                onClick={closeModal}
                aria-label="Zamknij formularz zamówienia"
              >
                Zamknij
              </button>
            </div>
            <div className="order-modal__body">
              <iframe
                className="order-form__iframe"
                src={ORDER_FORM_EMBED_URL}
                title="Formularz zamówienia JK Handmade Footwear"
                loading="lazy"
                allow="encrypted-media"
              />
              <p className="order-modal__fallback">
                Jeśli nie widzisz formularza, otwórz go w nowej karcie: {" "}
                <a
                  className="order-modal__fallback-link"
                  href={ORDER_FORM_EMBED_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Formularz zamówienia JK Handmade Footwear
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
