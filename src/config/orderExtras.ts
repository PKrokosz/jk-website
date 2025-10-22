export interface OrderExtra {
  id: "waterskin" | "bracer" | "shoeTrees";
  name: string;
  price: number;
  description: string;
  googleValue: string;
}

export const ORDER_EXTRAS: OrderExtra[] = [
  {
    id: "waterskin",
    name: "Bukłak podróżny",
    price: 250,
    description: "Ręcznie szyty bukłak z naszej skóry — 250 zł",
    googleValue: "Bukłak - 250 zł"
  },
  {
    id: "bracer",
    name: "Karwasz ochronny",
    price: 280,
    description: "Kompletowany z butami, wzmacniany filcem — 280 zł",
    googleValue: "Dodaj karwasz - 280 zł"
  },
  {
    id: "shoeTrees",
    name: "Prawidła sosnowe",
    price: 150,
    description: "Para drzewiaków zabezpieczająca kształt — 150 zł",
    googleValue: "Dokup prawidła sosnowe do swoich butów - 150 zł"
  }
];

export const ORDER_EXTRA_MAP = Object.fromEntries(
  ORDER_EXTRAS.map((extra) => [extra.id, extra])
) as Record<OrderExtra["id"], OrderExtra>;
