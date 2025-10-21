"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import type { PricingBreakdownItem } from "@/lib/pricing/calc";

export interface CartItemContactDetails {
  fullName: string;
  email: string;
  preferredDelivery?: string;
  notes?: string;
}

export interface CartItemOptionSummary {
  id: string;
  label: string;
  priceGrosz: number;
}

export interface CartItem {
  id: string;
  createdAt: string;
  modelId: string;
  modelLabel: string;
  basePriceGrosz: number;
  accessories: CartItemOptionSummary[];
  extras: CartItemOptionSummary[];
  totalNetGrosz: number;
  totalVatGrosz: number;
  totalGrossGrosz: number;
  breakdown: PricingBreakdownItem[];
  contact: CartItemContactDetails;
}

export type CartItemInput = Omit<CartItem, "id" | "createdAt">;

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItemInput) => CartItem;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "jk-handmade-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        setItems(parsed);
      }
    } catch (error) {
      console.warn("Nie udało się odczytać koszyka z localStorage", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("Nie udało się zapisać koszyka w localStorage", error);
    }
  }, [items, isHydrated]);

  const addItem = useCallback((input: CartItemInput): CartItem => {
    const item: CartItem = {
      ...input,
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `cart-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setItems((prev) => [...prev, item]);
    return item;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      clear
    }),
    [items, addItem, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
