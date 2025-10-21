export const ORDER_COLORS = [
  { id: "brown", label: "Brązowy" },
  { id: "black", label: "Czarny" },
  { id: "burgundy", label: "Bordo" }
] as const;

export const ORDER_SIZES = Array.from({ length: 14 }, (_, index) => {
  const value = 36 + index;
  return { id: String(value), label: `EU ${value}` };
});

export type OrderColorId = (typeof ORDER_COLORS)[number]["id"];
export type OrderSizeId = (typeof ORDER_SIZES)[number]["id"];

export const ORDER_COLOR_IDS = ORDER_COLORS.map((color) => color.id) as OrderColorId[];
export const ORDER_SIZE_IDS = ORDER_SIZES.map((size) => size.id) as OrderSizeId[];
