"use client";

import React from "react";

import { CartProvider } from "@/components/cart/CartProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
