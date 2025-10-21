import {
  CatalogFunnelStage,
  CatalogLeather,
  CatalogOrderReference,
  CatalogProductCategory,
  CatalogProductDetail,
  CatalogProductSummary,
  CatalogProductVariants,
  CatalogStyle
} from "./types";
import { ORDER_ACCESSORIES } from "@/config/orderAccessories";
import { ORDER_MODELS } from "@/config/orderModels";

const CATEGORY_LABELS: Record<CatalogProductCategory, string> = {
  footwear: "Buty",
  accessories: "Akcesoria",
  hydration: "Bukłaki",
  care: "Pielęgnacja"
};

const FUNNEL_LABELS: Record<CatalogFunnelStage, string> = {
  TOFU: "TOFU — inspiracja i rozpoznanie potrzeb",
  MOFU: "MOFU — konfiguracja i porównanie oferty",
  BOFU: "BOFU — finalizacja zamówienia w warsztacie"
};

const ORDER_MODEL_MAP = new Map(ORDER_MODELS.map((model) => [model.id, model]));
const ORDER_ACCESSORY_MAP = new Map(ORDER_ACCESSORIES.map((accessory) => [accessory.id, accessory]));

const STANDARD_SIZES = Array.from({ length: 10 }, (_, index) => 36 + index);

const PRODUCT_GALLERY_IMAGES: Record<string, readonly string[]> = {
  szpic: ["/image/models/1.jfif", "/image/models/2.jfif", "/image/models/3.jfif"],
  klamry: ["/image/models/4.jfif", "/image/models/5.jfif", "/image/models/6.jfif"],
  "wysokie-szpice": ["/image/models/7.jfif", "/image/models/8.jfif", "/image/models/9.jfif"],
  tamer: ["/image/models/10.jfif", "/image/models/11.jfif", "/image/models/12.jfif"],
  "wysokie-cholewy": ["/image/models/13.jfif", "/image/models/14.jfif", "/image/models/15.jfif"],
  "przelotka-na-sabatony": ["/image/models/6.jfif", "/image/models/7.jfif", "/image/models/8.jfif"],
  trzewiki: ["/image/models/2.jfif", "/image/models/3.jfif", "/image/models/4.jfif"],
  obiezyswiat: ["/image/models/9.jfif", "/image/models/10.jfif", "/image/models/11.jfif"],
  dragonki: ["/image/models/12.jfif", "/image/models/13.jfif", "/image/models/14.jfif"],
  wonderer: ["/image/models/15.jfif", "/image/models/16.jfif", "/image/models/1.jfif"],
  "dedykowany-wosk": ["/image/models/16.jfif", "/image/models/1.jfif", "/image/models/2.jfif"],
  "impregnat-warsztatowy": ["/image/models/3.jfif", "/image/models/4.jfif", "/image/models/5.jfif"],
  "rzemienie-do-buty": ["/image/models/5.jfif", "/image/models/6.jfif", "/image/models/7.jfif"],
  "buklak-podrozny": ["/image/models/8.jfif", "/image/models/9.jfif", "/image/models/10.jfif"],
  "prawidla-sosnowe": ["/image/models/11.jfif", "/image/models/12.jfif", "/image/models/13.jfif"]
};

const PRODUCT_GALLERY_FALLBACK = "/image/models/placeholder.svg";

function mapOrderReference(
  type: CatalogOrderReference["type"],
  id: string,
  fallback: string
): CatalogOrderReference {
  if (type === "model") {
    const model = ORDER_MODEL_MAP.get(id);
    return {
      type,
      id,
      label: model ? `Model ${model.name}` : fallback
    };
  }

  if (type === "accessory") {
    const accessory = ORDER_ACCESSORY_MAP.get(id);
    return {
      type,
      id,
      label: accessory ? `Akcesorium ${accessory.name}` : fallback
    };
  }

  return {
    type,
    id,
    label: fallback
  };
}

interface ProductTemplate {
  id: string;
  slug: string;
  name: string;
  styleId: number;
  leatherId: number;
  description: string;
  highlight: string;
  galleryCaptions: string[];
  variantLeatherIds: number[];
  sizes: number[];
  craftProcess: string[];
  seo: CatalogProductDetail["seo"];
  category: CatalogProductCategory;
  funnelStage: CatalogFunnelStage;
  orderReference?: CatalogOrderReference;
  priceOverrideGrosz?: number;
}

const productTemplates: ProductTemplate[] = [
  {
    id: "model-szpic",
    slug: "szpic",
    name: "Szpic",
    styleId: 2,
    leatherId: 1,
    description:
      "Klasyczny model z ostrym noskiem, który zgrabnie wydłuża sylwetkę postaci i sprawdza się w historycznych stylizacjach dworskich.",
    highlight: "Profilowany nosek chroniący przed zagięciami",
    galleryCaptions: ["profil boczny", "detal noska", "podeszwa"],
    variantLeatherIds: [1, 2, 3],
    sizes: STANDARD_SIZES,
    craftProcess: [
      "Modelowanie ostrych nosków według indywidualnej miary",
      "Szycie cholewki z licowej skóry na kopycie natywnym",
      "Ręczne pastowanie dla uzyskania satynowego połysku"
    ],
    seo: {
      title: "Szpic — klasyczne obuwie dworskie",
      description:
        "Model Szpic z katalogu JK Handmade Footwear to klasyczne obuwie dworskie z ostrym noskiem i ręcznym wykończeniem.",
      keywords: ["szpic", "buty dworskie", "made to order"]
    },
    category: "footwear",
    funnelStage: "MOFU",
    orderReference: mapOrderReference("model", "szpic", "Model Szpic")
  },
  {
    id: "model-klamry",
    slug: "klamry",
    name: "Klamry",
    styleId: 4,
    leatherId: 2,
    description:
      "Niskie buty z klamrami inspirowanymi XIV-wiecznymi odlewami, łatwe w zakładaniu i stabilne podczas długich wydarzeń LARP.",
    highlight: "Klamry z warsztatowego stopu mosiądzu",
    galleryCaptions: ["zapięcie na klamrę", "profil boczny", "podpodeszwa"],
    variantLeatherIds: [2, 1, 4],
    sizes: STANDARD_SIZES,
    craftProcess: [
      "Dobór pary klamer z kolekcji rekonstrukcyjnej",
      "Formowanie paska zapinanego na klamrę",
      "Montaż podeszwy z podzelowaniem na życzenie"
    ],
    seo: {
      title: "Klamry — wsuwane buty z epoki",
      description:
        "Model Klamry oferuje szybkie zakładanie dzięki metalowym sprzączkom oraz personalizowane wykończenie cholewki.",
      keywords: ["klamry", "buty historyczne", "LARP"]
    },
    category: "footwear",
    funnelStage: "MOFU",
    orderReference: mapOrderReference("model", "klamry", "Model Klamry")
  },
  {
    id: "model-wysokie-szpice",
    slug: "wysokie-szpice",
    name: "Wysokie Szpice",
    styleId: 1,
    leatherId: 3,
    description:
      "Wysoka cholewka zakończona ostrym noskiem zapewnia stabilność w siodle oraz atrakcyjny profil sylwetki w stroju dworskim.",
    highlight: "Wydłużony nosek ze wzmocnionym rdzeniem",
    galleryCaptions: ["pełna sylwetka", "detal noska", "wiązanie łydki"],
    variantLeatherIds: [3, 1],
    sizes: [...STANDARD_SIZES, 46, 47],
    craftProcess: [
      "Skan łydki i przygotowanie indywidualnego kopyta",
      "Szycie wysokiej cholewki z cielęcej skóry",
      "Wykończenie i zabezpieczenie długiego noska"
    ],
    seo: {
      title: "Wysokie Szpice — buty jeździeckie",
      description:
        "Wysokie Szpice to rzemieślnicze buty jeździeckie z ostrym noskiem i pełną personalizacją obwodu łydki.",
      keywords: ["wysokie szpice", "buty jeździeckie", "personalizacja"]
    },
    category: "footwear",
    funnelStage: "BOFU",
    orderReference: mapOrderReference("model", "wysokie-szpice", "Model Wysokie Szpice")
  },
  {
    id: "model-tamer",
    slug: "tamer",
    name: "Tamer",
    styleId: 3,
    leatherId: 4,
    description:
      "Trzewik o wzmocnionej konstrukcji inspirowany pustynnymi wyprawami, ze stabilizacją kostki i miękkim wnętrzem.",
    highlight: "Wymienne rzemienie na szybkie sznurowanie",
    galleryCaptions: ["profil terenowy", "detal rzemieni", "pięta"],
    variantLeatherIds: [4, 2, 1],
    sizes: [...STANDARD_SIZES, 46],
    craftProcess: [
      "Cięcie nubuku o zwiększonej odporności na piasek",
      "Wszywanie miękkiej podszewki z filcu",
      "Impregnacja woskiem pszczelim"
    ],
    seo: {
      title: "Tamer — trzewiki na wyprawy",
      description:
        "Model Tamer to wytrzymałe trzewiki JK Handmade Footwear przygotowane na intensywne treningi i pustynne scenariusze.",
      keywords: ["tamer", "trzewiki", "larp"]
    },
    category: "footwear",
    funnelStage: "MOFU",
    orderReference: mapOrderReference("model", "tamer", "Model Tamer")
  },
  {
    id: "model-wysokie-cholewy",
    slug: "wysokie-cholewy",
    name: "Wysokie Cholewy",
    styleId: 1,
    leatherId: 1,
    description:
      "Model o pełnej wysokości do kolana, projektowany dla rekonstruktorów potrzebujących wsparcia łydki podczas jazdy.",
    highlight: "Profil łydki tworzony na podstawie pomiarów",
    galleryCaptions: ["wysoka cholewka", "detal obszycia", "wiązanie"],
    variantLeatherIds: [1, 3, 4],
    sizes: [...STANDARD_SIZES, 46, 47],
    craftProcess: [
      "Pomiary łydki i przygotowanie szablonów",
      "Szycie cholewki z podwójnej warstwy skóry",
      "Montaż podeszw z dodatkowym obcasem"
    ],
    seo: {
      title: "Wysokie Cholewy — wysokie buty jeździeckie",
      description:
        "Wysokie Cholewy z katalogu JK Handmade Footwear to ręcznie szyte buty jeździeckie dopasowane do obwodu łydki.",
      keywords: ["wysokie cholewy", "buty jeździeckie", "na miarę"]
    },
    category: "footwear",
    funnelStage: "BOFU",
    orderReference: mapOrderReference("model", "wysokie-cholewy", "Model Wysokie Cholewy")
  },
  {
    id: "model-przelotka-na-sabatony",
    slug: "przelotka-na-sabatony",
    name: "Przelotka na Sabatony",
    styleId: 3,
    leatherId: 2,
    description:
      "Model zaprojektowany dla rycerzy w zbroi — posiada system przelotek do montażu sabatonów i wzmocnioną podeszwę.",
    highlight: "Zbrojne przelotki montowane ręcznie",
    galleryCaptions: ["system przelotek", "wzmocniona pięta", "sznurowanie"],
    variantLeatherIds: [2, 4, 1],
    sizes: [...STANDARD_SIZES, 46],
    craftProcess: [
      "Zbrojenie przelotek ze stali nierdzewnej",
      "Podszywanie dodatkowej warstwy skóry",
      "Test dopasowania do sabatonów klienta"
    ],
    seo: {
      title: "Przelotka na sabatony — model bojowy",
      description:
        "Buty z przelotką na sabatony zapewniają kompatybilność z elementami zbroi i stabilność podczas walki.",
      keywords: ["sabatony", "buty do zbroi", "rekonstrukcja"]
    },
    category: "footwear",
    funnelStage: "MOFU",
    orderReference: mapOrderReference("model", "przelotka-na-sabatony", "Model Przelotka na sabatony")
  },
  {
    id: "model-trzewiki",
    slug: "trzewiki",
    name: "Trzewiki",
    styleId: 3,
    leatherId: 4,
    description:
      "Uniwersalne trzewiki do codziennego noszenia w terenie i mieście, z amortyzacją i łatwym sznurowaniem.",
    highlight: "Wyściółka z naturalnego filcu",
    galleryCaptions: ["widok z góry", "detal języka", "podeszwa"],
    variantLeatherIds: [4, 2, 1],
    sizes: STANDARD_SIZES,
    craftProcess: [
      "Cięcie cholewki z nubuku o wysokiej gęstości",
      "Szycie języka z miękką podszewką",
      "Montaż podeszwy z amortyzacją"
    ],
    seo: {
      title: "Trzewiki — uniwersalne obuwie terenowe",
      description:
        "Trzewiki JK Handmade Footwear to komfortowe obuwie terenowe do codziennych zadań i lekkich wypraw.",
      keywords: ["trzewiki", "buty terenowe", "komfort"]
    },
    category: "footwear",
    funnelStage: "MOFU",
    orderReference: mapOrderReference("model", "trzewiki", "Model Trzewiki")
  },
  {
    id: "model-obiezyswiat",
    slug: "obiezyswiat",
    name: "Obieżyświat",
    styleId: 3,
    leatherId: 2,
    description:
      "Buty podróżnika projektowane na wielodniowe marsze — posiadają elastyczną cholewkę i mocne sznurowanie.",
    highlight: "Wymienne sznurowadła ze skóry bydlęcej",
    galleryCaptions: ["sznurowanie", "profil terenowy", "detal pięty"],
    variantLeatherIds: [2, 4, 1],
    sizes: [...STANDARD_SIZES, 46],
    craftProcess: [
      "Dobór skóry pull-up odpornej na zarysowania",
      "Szycie cholewki z dodatkową zakładką przeciw wilgoci",
      "Impregnacja olejami ziołowymi"
    ],
    seo: {
      title: "Obieżyświat — buty na długie wyprawy",
      description:
        "Model Obieżyświat powstał dla podróżników i zwiadowców, którzy potrzebują trwałych butów na długie dystanse.",
      keywords: ["obiezyswiat", "buty podróżne", "larp"]
    },
    category: "footwear",
    funnelStage: "MOFU",
    orderReference: mapOrderReference("model", "obiezyswiat", "Model Obieżyświat")
  },
  {
    id: "model-dragonki",
    slug: "dragonki",
    name: "Dragonki",
    styleId: 1,
    leatherId: 3,
    description:
      "Spektakularne buty o inspirowanym smokami wykroju, tworzone na potrzeby pokazów, konwentów i scen filmowych.",
    highlight: "Dekoracyjne przeszycia przypominające łuski",
    galleryCaptions: ["detal łusek", "profil boczny", "podeszwa scenicza"],
    variantLeatherIds: [3, 1],
    sizes: [...STANDARD_SIZES, 46],
    craftProcess: [
      "Projektowanie dekoracyjnych paneli zgodnie z koncepcją postaci",
      "Tłoczenie wzorów łusek na mokrej skórze",
      "Barwienie gradientowe i zabezpieczenie lakierem"
    ],
    seo: {
      title: "Dragonki — sceniczne buty premium",
      description:
        "Dragonki to rzemieślnicze buty sceniczne z detalami przypominającymi łuski smoka, idealne na pokazy i cosplay.",
      keywords: ["dragonki", "buty sceniczne", "cosplay"]
    },
    category: "footwear",
    funnelStage: "TOFU",
    orderReference: mapOrderReference("model", "dragonki", "Model Dragonki")
  },
  {
    id: "model-wonderer",
    slug: "wonderer",
    name: "Wonderer",
    styleId: 2,
    leatherId: 1,
    description:
      "Eleganckie buty miejskie inspirowane wędrówkami mieszczan, z subtelną perforacją i miękkim wnętrzem.",
    highlight: "Ręcznie frezowane perforacje",
    galleryCaptions: ["widok z góry", "detal perforacji", "podeszwa miejska"],
    variantLeatherIds: [1, 2, 3],
    sizes: STANDARD_SIZES,
    craftProcess: [
      "Wykrawanie perforacji według wzoru rzemieślniczego",
      "Szycie cholewki z licowej skóry",
      "Pastowanie i polerowanie do satynowego połysku"
    ],
    seo: {
      title: "Wonderer — buty miejskie",
      description:
        "Wonderer to elegancki model miejski JK Handmade Footwear z perforacją i personalizowanym wykończeniem.",
      keywords: ["wonderer", "buty miejskie", "perforacja"]
    },
    category: "footwear",
    funnelStage: "TOFU",
    orderReference: mapOrderReference("model", "wonderer", "Model Wonderer")
  },
  {
    id: "accessory-wax",
    slug: "dedykowany-wosk",
    name: "Dedykowany wosk pielęgnacyjny",
    styleId: 5,
    leatherId: 5,
    description:
      "Warsztatowy wosk na bazie naturalnych żywic, dostępny jako akcesorium w formularzu zamówienia natywnego.",
    highlight: "Chroni skórę przed wilgocią i zabrudzeniami",
    galleryCaptions: ["opakowanie", "aplikacja wosku", "połysk skóry"],
    variantLeatherIds: [],
    sizes: [],
    craftProcess: [
      "Dobór mieszanki wosków i olejów",
      "Testy aplikacji na próbkach warsztatowych",
      "Dołączenie instrukcji pielęgnacji do przesyłki"
    ],
    seo: {
      title: "Dedykowany wosk do butów",
      description:
        "Dedykowany wosk JK Handmade Footwear podtrzymuje kondycję skóry i jest częścią pakietu pielęgnacyjnego.",
      keywords: ["wosk do butów", "pielęgnacja", "akcesoria"]
    },
    category: "accessories",
    funnelStage: "BOFU",
    orderReference: mapOrderReference("accessory", "wax", "Wosk pielęgnacyjny"),
    priceOverrideGrosz: 6_000
  },
  {
    id: "accessory-impregnation",
    slug: "impregnat-warsztatowy",
    name: "Impregnat warsztatowy",
    styleId: 5,
    leatherId: 5,
    description:
      "Spray hydrofobowy zabezpieczający skórę przed wodą — rekomendowany do terenowych modeli obuwia.",
    highlight: "Warstwa ochronna na 6 miesięcy intensywnego użycia",
    galleryCaptions: ["aplikacja impregnatu", "detal kropli", "zestaw pielęgnacyjny"],
    variantLeatherIds: [],
    sizes: [],
    craftProcess: [
      "Dobór aktywnych składników impregnujących",
      "Testy odporności na deszcz w warsztacie",
      "Pakowanie z instrukcją użytkowania"
    ],
    seo: {
      title: "Impregnat warsztatowy do skóry",
      description:
        "Impregnat warsztatowy JK Handmade Footwear zabezpiecza obuwie przed wodą i utrwala kolor skóry.",
      keywords: ["impregnat", "akcesoria", "pielęgnacja"]
    },
    category: "accessories",
    funnelStage: "BOFU",
    orderReference: mapOrderReference("accessory", "impregnation", "Impregnat do skóry"),
    priceOverrideGrosz: 7_500
  },
  {
    id: "accessory-leather-straps",
    slug: "rzemienie-do-buty",
    name: "Para rzemieni skórzanych",
    styleId: 5,
    leatherId: 5,
    description:
      "Mocne rzemienie o długości 120 cm, używane jako zapasowe sznurowadła lub mocowania do akcesoriów.",
    highlight: "Ręcznie cięte paski ze skóry bydlęcej",
    galleryCaptions: ["rzemienie", "detal zakończeń", "wiązanie"],
    variantLeatherIds: [],
    sizes: [],
    craftProcess: [
      "Cięcie pasków na gilotynie warsztatowej",
      "Woskowanie zakończeń dla trwałości",
      "Kontrola jakości i kompletowanie pary"
    ],
    seo: {
      title: "Rzemienie skórzane do butów",
      description:
        "Para rzemieni JK Handmade Footwear służy jako zapasowe sznurowadła lub mocowanie dodatkowych elementów.",
      keywords: ["rzemienie", "akcesoria", "sznurowadła"]
    },
    category: "accessories",
    funnelStage: "BOFU",
    orderReference: mapOrderReference("accessory", "leather-straps", "Para rzemieni"),
    priceOverrideGrosz: 4_000
  },
  {
    id: "service-waterskin",
    slug: "buklak-podrozny",
    name: "Bukłak podróżny",
    styleId: 5,
    leatherId: 5,
    description:
      "Ręcznie szyty bukłak z tej samej skóry co obuwie — możesz dodać własny symbol lub herb w formularzu.",
    highlight: "Wewnętrzna powłoka zabezpieczająca napoje",
    galleryCaptions: ["bukłak w terenie", "detal tłoczenia", "system mocowania"],
    variantLeatherIds: [],
    sizes: [],
    craftProcess: [
      "Dobór skóry o odpowiedniej szczelności",
      "Szycie bukłaka specjalnym szwem wodoodpornym",
      "Tłoczenie symbolu lub herbu na życzenie"
    ],
    seo: {
      title: "Bukłak podróżny do zestawu butów",
      description:
        "Bukłak podróżny JK Handmade Footwear to dodatek szyty na zamówienie z możliwością personalizacji symbolu.",
      keywords: ["bukłak", "akcesoria", "personalizacja"]
    },
    category: "hydration",
    funnelStage: "MOFU",
    orderReference: mapOrderReference("service", "waterskin", "Bukłak podróżny"),
    priceOverrideGrosz: 25_000
  },
  {
    id: "service-shoe-trees",
    slug: "prawidla-sosnowe",
    name: "Prawidła sosnowe",
    styleId: 5,
    leatherId: 5,
    description:
      "Para prawideł wykonanych z drewna sosnowego, które utrzymują kształt butów i absorbują wilgoć po treningu.",
    highlight: "Wymienne sprężyny dopasowane do rozmiaru butów",
    galleryCaptions: ["prawidła w butach", "detal drewna", "mechanizm sprężynowy"],
    variantLeatherIds: [],
    sizes: [],
    craftProcess: [
      "Toczenie kopyt z litego drewna",
      "Szlifowanie i olejowanie powierzchni",
      "Montaż sprężyn dopasowanych do rozmiaru"
    ],
    seo: {
      title: "Prawidła sosnowe do pielęgnacji obuwia",
      description:
        "Prawidła sosnowe JK Handmade Footwear utrzymują kształt butów i przedłużają ich żywotność.",
      keywords: ["prawidła", "pielęgnacja", "akcesoria"]
    },
    category: "care",
    funnelStage: "BOFU",
    orderReference: mapOrderReference("service", "shoeTrees", "Prawidła sosnowe"),
    priceOverrideGrosz: 15_000
  }
];

function buildProductGallery(template: ProductTemplate) {
  const assets = PRODUCT_GALLERY_IMAGES[template.slug];

  if (assets && assets.length > 0) {
    return template.galleryCaptions.map((caption, index) => {
      const src = assets[index] ?? assets[assets.length - 1] ?? PRODUCT_GALLERY_FALLBACK;
      return createGalleryImage(template.name, caption, src);
    });
  }

  return template.galleryCaptions.map((caption) => createPlaceholderImage(template.name, caption));
}

function createGalleryImage(name: string, caption: string, src: string) {
  const normalizedCaption = caption.charAt(0).toUpperCase() + caption.slice(1);

  return {
    alt: `Model ${name} — ${normalizedCaption}`,
    src
  };
}

function createPlaceholderImage(name: string, caption: string) {
  const normalizedCaption = caption.charAt(0).toUpperCase() + caption.slice(1);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' role='img'><rect width='600' height='400' rx='24' fill='%23171829'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='%23f7f2e8' font-family='serif' font-size='32'>${name}</text><text x='50%' y='65%' dominant-baseline='middle' text-anchor='middle' fill='%23c9b37c' font-family='serif' font-size='20'>${normalizedCaption}</text></svg>`;

  return {
    alt: `Model ${name} — ${normalizedCaption} (placeholder)`,
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  };
}

function computePrice(
  template: ProductTemplate,
  style: CatalogStyle | undefined,
  leather: CatalogLeather | undefined
) {
  if (typeof template.priceOverrideGrosz === "number") {
    return Math.max(0, template.priceOverrideGrosz);
  }

  const basePrice = style?.basePriceGrosz ?? 0;
  const leatherMod = leather?.priceModGrosz ?? 0;
  return Math.max(0, basePrice + leatherMod);
}

function buildVariants(
  template: ProductTemplate,
  leathers: Map<number, CatalogLeather>
): CatalogProductVariants {
  const uniqueLeatherIds = Array.from(new Set(template.variantLeatherIds));

  const colors = uniqueLeatherIds.map((id, index) => {
    const leather = leathers.get(id);
    const resolvedId = leather?.id ?? id;
    return {
      id: `${template.id}-color-${resolvedId ?? index}`,
      leatherId: resolvedId,
      name: leather?.name ?? "Nieznana skóra"
    };
  });

  return {
    colors,
    sizes: template.sizes
  };
}

export function listProductSlugs() {
  return productTemplates.map((template) => template.slug);
}

export function createMockProducts(
  styles: CatalogStyle[],
  leathers: CatalogLeather[]
): CatalogProductSummary[] {
  const styleById = new Map(styles.map((style) => [style.id, style]));
  const leatherById = new Map(leathers.map((leather) => [leather.id, leather]));

  return productTemplates.map((template, index) => {
    const style = styleById.get(template.styleId) ?? styles[index % styles.length];
    const leather =
      leatherById.get(template.leatherId) ?? leathers[index % leathers.length];
    const priceGrosz = computePrice(template, style, leather);
    const categoryLabel = CATEGORY_LABELS[template.category] ?? template.category;
    const funnelLabel = FUNNEL_LABELS[template.funnelStage] ?? template.funnelStage;

    return {
      id: template.id,
      slug: template.slug,
      name: template.name,
      styleId: style?.id ?? template.styleId,
      leatherId: leather?.id ?? template.leatherId,
      description: template.description,
      highlight: template.highlight,
      priceGrosz,
      category: template.category,
      categoryLabel,
      funnelStage: template.funnelStage,
      funnelLabel,
      orderReference: template.orderReference
    } satisfies CatalogProductSummary;
  });
}

export function getProductBySlug(
  slug: string,
  styles: CatalogStyle[],
  leathers: CatalogLeather[]
): CatalogProductDetail | undefined {
  const template = productTemplates.find((item) => item.slug === slug);
  if (!template) {
    return undefined;
  }

  const styleById = new Map(styles.map((style) => [style.id, style]));
  const leatherById = new Map(leathers.map((leather) => [leather.id, leather]));
  const style = styleById.get(template.styleId);
  const leather = leatherById.get(template.leatherId);

  const gallery = buildProductGallery(template);

  return {
    id: template.id,
    slug: template.slug,
    name: template.name,
    styleId: style?.id ?? template.styleId,
    leatherId: leather?.id ?? template.leatherId,
    description: template.description,
    highlight: template.highlight,
    priceGrosz: computePrice(template, style, leather),
    gallery,
    variants: buildVariants(template, leatherById),
    craftProcess: template.craftProcess,
    seo: template.seo,
    category: template.category,
    categoryLabel: CATEGORY_LABELS[template.category] ?? template.category,
    funnelStage: template.funnelStage,
    funnelLabel: FUNNEL_LABELS[template.funnelStage] ?? template.funnelStage,
    orderReference: template.orderReference
  } satisfies CatalogProductDetail;
}
