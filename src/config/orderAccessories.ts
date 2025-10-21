export interface OrderAccessory {
  id: string;
  name: string;
  price: number;
  googleValue: string;
  description?: string;
}

export const ORDER_ACCESSORIES: OrderAccessory[] = [
  {
    id: "wax",
    name: "Wosk",
    price: 60,
    googleValue: "Dedykowany wosk do butów - 60 zł",
    description: "Dedykowany wosk do pielęgnacji skóry."
  },
  {
    id: "sponge",
    name: "Gąbka",
    price: 70,
    googleValue: "Gąbka z koralowca do nakładania pasty - 70 zł"
  },
  {
    id: "insoles",
    name: "Wkładki",
    price: 100,
    googleValue: "Wkładki antybakteryjne - 100 zł"
  },
  {
    id: "silver",
    name: "Srebro",
    price: 80,
    googleValue: "Srebro do dezynfekcji i odgrzybiania butów - 80 zł"
  },
  {
    id: "impregnation",
    name: "Impregnat",
    price: 75,
    googleValue: "Impregnat w spreju do zabezpieczenia skóry przed wodą - 75 zł"
  },
  {
    id: "laces",
    name: "Sznurówki",
    price: 15,
    googleValue: "Sznurówki woskowane - 15 zł"
  },
  {
    id: "leather-soles",
    name: "Spody skórzane",
    price: 200,
    googleValue: "Spody skórzane -200zł"
  },
  {
    id: "double-leather-soles",
    name: "Spody podzelowane",
    price: 200,
    googleValue: "Spody skórzane podzelowane - 200 zł"
  },
  {
    id: "leather-straps",
    name: "Para rzemieni",
    price: 40,
    googleValue: "Para rzemieni skórzanych 120 cm mocnych - 40 zł"
  }
];

export const ORDER_ACCESSORY_MAP = Object.fromEntries(
  ORDER_ACCESSORIES.map((accessory) => [accessory.id, accessory])
) as Record<string, OrderAccessory>;
