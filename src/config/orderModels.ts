export interface OrderModel {
  id: string;
  name: string;
  price: number;
  image: string;
  googleValue: string;
  requiresCalfMeasurement?: boolean;
}

const placeholderImage = "placeholder.svg";

const MODEL_IMAGE_MAP = {
  szpic: "1.jfif",
  owal: "2.jfif",
  klamry: "3.jfif",
  "wysokie-szpice": "4.jfif",
  "krowie-pyski": "5.jfif",
  tamer: "6.jfif",
  "wysokie-cholewy": "7.jfif",
  "przelotka-na-sabatony": "8.jfif",
  trzewiki: "9.jfif",
  zakladki: "16.jfif",
  obiezyswiat: "10.jfif",
  "obiezyswiat-szyta-warga": "11.jfif",
  dragonki: "12.jfif",
  wonderer: "13.jfif",
  "kamienny-przodek": "14.jfif",
  "wysokie-krowie-pyski": "15.jfif"
} as const;

const MODEL_IMAGE_ALIAS_MAP = {
  "krowie-pyski-za-kostke": "krowie-pyski"
} as const;

const resolveModelImage = (id: string) => {
  const aliasTarget = (MODEL_IMAGE_ALIAS_MAP as Record<string, keyof typeof MODEL_IMAGE_MAP>)[id];
  const lookupId = aliasTarget ?? (id as keyof typeof MODEL_IMAGE_MAP);
  const filename = (MODEL_IMAGE_MAP as Record<string, string>)[lookupId];
  return `/image/models/${filename ?? placeholderImage}`;
};

export const ORDER_MODELS: OrderModel[] = [
  {
    id: "szpic",
    name: "Szpic",
    price: 750,
    image: resolveModelImage("szpic"),
    googleValue: "Szpic - 750 zł"
  },
  {
    id: "owal",
    name: "Owal",
    price: 750,
    image: resolveModelImage("owal"),
    googleValue: "Owal - 750 zł"
  },
  {
    id: "klamry",
    name: "Klamry",
    price: 1100,
    image: resolveModelImage("klamry"),
    googleValue: "Klamry - 1100 zł"
  },
  {
    id: "wysokie-szpice",
    name: "Wysokie szpice",
    price: 1150,
    image: resolveModelImage("wysokie-szpice"),
    googleValue: "Wysokie szpice - 1150 zł",
    requiresCalfMeasurement: true
  },
  {
    id: "krowie-pyski",
    name: "Krowie pyski",
    price: 600,
    image: resolveModelImage("krowie-pyski"),
    googleValue: "Krowie pyski - 600 zł"
  },
  {
    id: "tamer",
    name: "Tamer",
    price: 1200,
    image: resolveModelImage("tamer"),
    googleValue: "Tamer - 1200 zł"
  },
  {
    id: "wysokie-cholewy",
    name: "Wysokie Cholewy",
    price: 1300,
    image: resolveModelImage("wysokie-cholewy"),
    googleValue: "Wysokie Cholewy - 1300 zł",
    requiresCalfMeasurement: true
  },
  {
    id: "przelotka-na-sabatony",
    name: "Przelotka na sabatony",
    price: 700,
    image: resolveModelImage("przelotka-na-sabatony"),
    googleValue: "Przelotka na sabatony - 700 zł"
  },
  {
    id: "trzewiki",
    name: "Trzewiki",
    price: 550,
    image: resolveModelImage("trzewiki"),
    googleValue: "Trzewiki - 550 zł"
  },
  {
    id: "zakladki",
    name: "Zakładki",
    price: 700,
    image: resolveModelImage("zakladki"),
    googleValue: "Zakładki - 700 zł"
  },
  {
    id: "obiezyswiat",
    name: "Obieżyświat",
    price: 1150,
    image: resolveModelImage("obiezyswiat"),
    googleValue: "Obieżyświat - 1150 zł"
  },
  {
    id: "obiezyswiat-szyta-warga",
    name: "Obieżyświat, szyta warga",
    price: 1150,
    image: resolveModelImage("obiezyswiat-szyta-warga"),
    googleValue: "Obieżyświat, szyta warga - 1150 zł"
  },
  {
    id: "dragonki",
    name: "Dragonki",
    price: 1600,
    image: resolveModelImage("dragonki"),
    googleValue: "Dragonki - 1600 zł"
  },
  {
    id: "wonderer",
    name: "Wonderer",
    price: 1300,
    image: resolveModelImage("wonderer"),
    googleValue: "Wonderer - 1300 zł"
  },
  {
    id: "kamienny-przodek",
    name: "Kamienny przodek",
    price: 1800,
    image: resolveModelImage("kamienny-przodek"),
    googleValue: "Kamienny przodek - 1800 zł"
  },
  {
    id: "wysokie-krowie-pyski",
    name: "Wysokie Krowie Pyski",
    price: 1600,
    image: resolveModelImage("wysokie-krowie-pyski"),
    googleValue: "Wysokie Krowie Pyski - 1600 zł",
    requiresCalfMeasurement: true
  },
  {
    id: "krowie-pyski-za-kostke",
    name: "Krowie Pyski za kostkę",
    price: 700,
    image: resolveModelImage("krowie-pyski-za-kostke"),
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
    googleValue: "Ciżmy Artur - 750 zł"
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
