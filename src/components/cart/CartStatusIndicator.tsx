"use client";

import Link from "next/link";
import React, { useMemo } from "react";

import { useCart } from "./CartProvider";

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0
});

export function CartStatusIndicator() {
  const { items } = useCart();
  const itemCount = items.length;

  const totalGrossLabel = useMemo(() => {
    if (itemCount === 0) {
      return null;
    }

    const gross = items.reduce((sum, item) => sum + item.totalGrossGrosz, 0);
    return currencyFormatter.format(gross / 100);
  }, [itemCount, items]);

  return (
    <Link className="cart-status" href="/cart" aria-label="Przejdź do koszyka">
      <span className="cart-status__label">Koszyk</span>
      <span className="cart-status__badge" aria-hidden="true">
        {itemCount}
      </span>
      {totalGrossLabel ? <span className="cart-status__total">{totalGrossLabel}</span> : null}
    </Link>
  );
}
