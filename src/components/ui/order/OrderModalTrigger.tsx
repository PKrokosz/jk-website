"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface OrderModalTriggerProps {
  triggerLabel?: string;
  className?: string;
  ctaLabel?: string;
}

export function OrderModalTrigger({
  triggerLabel = "Zamów buty",
  className,
  ctaLabel = "Przejdź do formularza"
}: OrderModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      <button type="button" className={className} onClick={() => setIsOpen(true)}>
        {triggerLabel}
      </button>

      {isOpen ? (
        <div
          className="order-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-modal-title"
          ref={dialogRef}
          tabIndex={-1}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="order-modal__content">
            <div className="order-modal__body">
              <h2 id="order-modal-title">Złóż zamówienie online</h2>
              <p>
                Nasi rzemieślnicy potrzebują kilku danych, aby rozpocząć proces szycia. Wypełnij formularz, a wrócimy do Ciebie
                z potwierdzeniem terminu i doprecyzowaniem detali.
              </p>
            </div>
            <div className="order-modal__actions">
              <Link className="button button--primary" href="/order/native">
                {ctaLabel}
              </Link>
              <button type="button" className="button button--ghost" onClick={() => setIsOpen(false)}>
                Zamknij
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
