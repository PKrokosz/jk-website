export interface OrderModel {
  id: string;
  name: string;
  price: number;
  image: string;
  googleValue: string;
  requiresCalfMeasurement?: boolean;
}

const modelImages = [
  "1.jfif",
  "2.jfif",
  "3.jfif",
  "4.jfif",
  "5.jfif",
  "6.jfif",
  "7.jfif",
  "8.jfif",
  "9.jfif",
  "10.jfif",
  "11.jfif",
  "12.jfif",
  "13.jfif",
  "14.jfif",
  "15.jfif",
  "16.jfif"
];

const placeholderImage = "placeholder.svg";

const imageForIndex = (index: number) => {
  const value = modelImages[index];
  return `/image/models/${value ?? placeholderImage}`;
};

export const ORDER_MODELS: OrderModel[] = [
  {
    id: "szpic",
    name: "Szpic",
    price: 750,
    image: imageForIndex(0),
    googleValue: "Szpic - 750 zł"
  },
  {
    id: "owal",
    name: "Owal",
    price: 750,
    image: imageForIndex(1),
    googleValue: "Owal - 750 zł"
  },
  {
    id: "klamry",
    name: "Klamry",
    price: 1100,
    image: imageForIndex(2),
    googleValue: "Klamry -1100 zł"
  },
  {
    id: "wysokie-szpice",
    name: "Wysokie szpice",
    price: 1150,
    image: imageForIndex(3),
    googleValue: "Wysokie szpice - 1150 zł",
    requiresCalfMeasurement: true
  },
  {
    id: "krowie-pyski",
    name: "Krowie pyski",
    price: 600,
    image: imageForIndex(4),
    googleValue: "Krowie pyski - 600 zł"
  },
  {
    id: "tamer",
    name: "Tamer",
    price: 1200,
    image: imageForIndex(5),
    googleValue: "Tamer - 1200 zł"
  },
  {
    id: "wysokie-cholewy",
    name: "Wysokie Cholewy",
    price: 1300,
    image: imageForIndex(6),
    googleValue: "Wysokie Cholewy - 1300 zł",
    requiresCalfMeasurement: true
  },
  {
    id: "przelotka-na-sabatony",
    name: "Przelotka na sabatony",
    price: 700,
    image: imageForIndex(7),
    googleValue: "Przelotka na sabatony - 700 zł"
  },
  {
    id: "trzewiki",
    name: "Trzewiki",
    price: 550,
    image: imageForIndex(8),
    googleValue: "Trzewiki - 550 zł"
  },
  {
    id: "zakladki",
    name: "Zakładki",
    price: 700,
    image: imageForIndex(9),
    googleValue: "Zakładki - 700 zł"
  },
  {
    id: "obiezyswiat",
    name: "Obieżyświat",
    price: 1150,
    image: imageForIndex(10),
    googleValue: "Obieżyświat 1150 zł"
  },
  {
    id: "obiezyswiat-szyta-warga",
    name: "Obieżyświat, szyta warga",
    price: 1150,
    image: imageForIndex(11),
    googleValue: "Obieżyświat, szyta warga 1150 zł"
  },
  {
    id: "dragonki",
    name: "Dragonki",
    price: 1600,
    image: imageForIndex(12),
    googleValue: "Dragonki - 1600 zł"
  },
  {
    id: "wonderer",
    name: "Wonderer",
    price: 1300,
    image: imageForIndex(13),
    googleValue: "Wonderer - 1300 zł"
  },
  {
    id: "kamienny-przodek",
    name: "Kamienny przodek",
    price: 1800,
    image: imageForIndex(14),
    googleValue: "Kamienny przodek - 1800 zł"
  },
  {
    id: "wysokie-krowie-pyski",
    name: "Wysokie Krowie Pyski",
    price: 1600,
    image: imageForIndex(15),
    googleValue: "Wysokie Krowie Pyski - 1600 zł",
    requiresCalfMeasurement: true
  },
  {
    id: "krowie-pyski-za-kostke",
    name: "Krowie Pyski za kostkę",
    price: 700,
    image: `/image/models/${placeholderImage}`,
    googleValue: "Krowie Pyski za kostkę - 700 zł"
  },
  {
    id: "mary-jane",
    name: "Mary Jane",
    price: 550,
    image: `/image/models/${placeholderImage}`,
    googleValue: "Mary Jane - 550 zł"
  },
  {
    id: "odkupiciel",
    name: "Odkupiciel",
    price: 1500,
    image: `/image/models/${placeholderImage}`,
    googleValue: "Odkupiciel - 1500 zł"
  },
  {
    id: "cizmy",
    name: "Ciżmy",
    price: 750,
    image: `/image/models/${placeholderImage}`,
    googleValue: "Ciżmy - 750 zł"
  },
  {
    id: "cizmy-ulryk",
    name: "Ciżmy Ulryk",
    price: 700,
    image: `/image/models/${placeholderImage}`,
    googleValue: "Ciżmy Ulryk - 700 zł"
  },
  {
    id: "cizmy-artur",
    name: "Ciżmy Artur",
    price: 750,
    image: `/image/models/${placeholderImage}`,
    googleValue: "Ciżmy Artur -750 zł"
  },
  {
    id: "xvii-wiek",
    name: "XVII wiek",
    price: 600,
    image: `/image/models/${placeholderImage}`,
    googleValue: "XVII wiek - 600 zł"
  },
  {
    id: "ranger",
    name: "Ranger",
    price: 1450,
    image: `/image/models/${placeholderImage}`,
    googleValue: "Ranger - 1450 zł"
  }
];

export const ORDER_MODEL_MAP = Object.fromEntries(
  ORDER_MODELS.map((model) => [model.id, model])
) as Record<string, OrderModel>;
