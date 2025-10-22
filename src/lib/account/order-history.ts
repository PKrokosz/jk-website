export type AccountOrderStatus =
  | "in_production"
  | "awaiting_measurements"
  | "ready_for_pickup"
  | "completed";

export interface AccountOrder {
  id: string;
  model: string;
  finish: string;
  status: AccountOrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  totalPrice: string;
  progressNotes: string;
}

export const accountOrderStatusLabels: Record<AccountOrderStatus, string> = {
  in_production: "W produkcji",
  awaiting_measurements: "Oczekuje na pomiary",
  ready_for_pickup: "Gotowe do odbioru",
  completed: "Zrealizowane"
};

export const accountOrderHistory: AccountOrder[] = [
  {
    id: "ORD-2024-1042",
    model: "Sabatony LARP — model Wiking",
    finish: "Czarna skóra licowa, ręczne patynowanie",
    status: "in_production",
    placedAt: "12 lutego 2024",
    estimatedDelivery: "5 kwietnia 2024",
    totalPrice: "4 200 zł",
    progressNotes:
      "Trwa ręczne szycie cholewek i dopasowywanie szwów do metalowych elementów. Zdjęcia z warsztatu prześlemy po weekendzie."
  },
  {
    id: "ORD-2023-987",
    model: "Oficerki sceniczne — model Husarz",
    finish: "Ciemny brąz, zdobione tłoczenia",
    status: "ready_for_pickup",
    placedAt: "3 listopada 2023",
    estimatedDelivery: "15 marca 2024",
    totalPrice: "3 800 zł",
    progressNotes:
      "Para przeszła finalne pastowanie i czeka na przymiarkę w pracowni. Możemy również zorganizować wysyłkę kurierską."
  },
  {
    id: "ORD-2022-552",
    model: "Trzewiki podróżne — model Wędrowiec",
    finish: "Naturalna skóra olejowana",
    status: "completed",
    placedAt: "21 czerwca 2022",
    estimatedDelivery: "8 września 2022",
    totalPrice: "2 950 zł",
    progressNotes:
      "Zamówienie zrealizowane wraz z zestawem pielęgnacyjnym. Ostatni przegląd wykonany w lutym 2023 — rekomendujemy olejowanie przed sezonem."
  }
];
