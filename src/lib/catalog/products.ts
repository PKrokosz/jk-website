import {
  CatalogLeather,
  CatalogProductDetail,
  CatalogProductSummary,
  CatalogProductVariants,
  CatalogStyle
} from "./types";

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
}

const productTemplates: ProductTemplate[] = [
  {
    id: "prod-1",
    slug: "regal-huntsman-boots",
    name: "Regal Huntsman Boots",
    styleId: 1,
    leatherId: 1,
    description:
      "Wysoki model jeździecki z profilem dopasowanym do łydki, ręcznie barwiony i wykończony woskiem pszczelim.",
    highlight: "Ręcznie malowane krawędzie i złocone klamry",
    galleryCaptions: ["profil boczny", "detal klamry", "sznurowanie"],
    variantLeatherIds: [1, 3, 4],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    craftProcess: [
      "Formowanie cholewki z kasztanowej skóry wegetalnej",
      "Ręczne barwienie z laserunkowym wykończeniem",
      "Montaż obcasa z wielowarstwowej skóry bydlęcej"
    ],
    seo: {
      title: "Regal Huntsman Boots — dworskie buty jeździeckie",
      description:
        "Ręcznie szyte buty jeździeckie Regal Huntsman łączą dworską elegancję z funkcjonalnością wypraw terenowych.",
      keywords: ["buty jeździeckie", "miarowe", "dworskie obuwie"]
    }
  },
  {
    id: "prod-2",
    slug: "obsidian-court-boots",
    name: "Obsidian Court Boots",
    styleId: 1,
    leatherId: 3,
    description:
      "Elegancka sylwetka stworzona na dworskie audiencje, z podszewką z miękkiej skóry koziej.",
    highlight: "Podwójna krawędź dekoracyjna inspirowana renesansem",
    galleryCaptions: ["ujęcie frontalne", "detal obcasa", "profil cholewki"],
    variantLeatherIds: [3, 1],
    sizes: [39, 40, 41, 42, 43, 44],
    craftProcess: [
      "Dobór skóry cielęcej o wysokim połysku",
      "Wykonanie dekoracyjnego przeszycia na nosku",
      "Polerowanie i wykończenie woskiem carnauba"
    ],
    seo: {
      title: "Obsidian Court Boots — dworskie botki z połyskiem",
      description:
        "Model Obsidian Court Boots to kwintesencja elegancji: połyskliwa skóra, miękka podszewka i renesansowe detale.",
      keywords: ["botki dworskie", "czarne buty", "made to order"]
    }
  },
  {
    id: "prod-3",
    slug: "amber-guild-oxfords",
    name: "Amber Guild Oxfords",
    styleId: 2,
    leatherId: 2,
    description:
      "Klasyczne oksfordy z zamkniętą przyszwą, perforacją w kształcie rozety i zbalansowaną podeszwą.",
    highlight: "Ręcznie nakłuwana perforacja rozety",
    galleryCaptions: ["profil boczny", "perforacja", "podeszwa"],
    variantLeatherIds: [2, 1, 4],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    craftProcess: [
      "Cięcie cholewki z woskowanej skóry pull-up",
      "Nakłuwanie rozety według wzoru cechowego",
      "Ręczne barwienie i pastowanie na ciepło"
    ],
    seo: {
      title: "Amber Guild Oxfords — oksfordy cechowe",
      description:
        "Amber Guild Oxfords to klasyczne oksfordy z bursztynowej skóry, idealne na codzienne uroczystości cechowe.",
      keywords: ["oksfordy", "skóra bursztynowa", "cech szewski"]
    }
  },
  {
    id: "prod-4",
    slug: "moorland-travel-oxfords",
    name: "Moorland Travel Oxfords",
    styleId: 2,
    leatherId: 4,
    description:
      "Model dzienny z miękką cholewką i dodatkową amortyzacją w podeszwie na długie marsze po mieście.",
    highlight: "Miękka wyściółka z filcu wełnianego",
    galleryCaptions: ["widok z góry", "detal przeszyć", "podpodeszwa"],
    variantLeatherIds: [4, 2],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    craftProcess: [
      "Szczotkowanie nubuku dla uzyskania miękkiej faktury",
      "Wszywanie wkładek z naturalnego filcu",
      "Montaż elastycznej podeszwy skórzanej"
    ],
    seo: {
      title: "Moorland Travel Oxfords — miejskie oksfordy",
      description:
        "Moorland Travel Oxfords oferują komfort długich spacerów dzięki nubukowej cholewce i filcowej wyściółce.",
      keywords: ["oksfordy", "nubuk", "komfort"]
    }
  },
  {
    id: "prod-5",
    slug: "pilgrim-ember-boots",
    name: "Pilgrim Ember Boots",
    styleId: 3,
    leatherId: 2,
    description:
      "Trzewiki terenowe z szeroką cholewką, wzmacnianym noskiem i ręcznie wiązanym rzemieniem.",
    highlight: "Wymienne pętle na rzemienie z mosiądzu",
    galleryCaptions: ["profil terenowy", "detal noska", "wiązanie"],
    variantLeatherIds: [2, 4, 1],
    sizes: [40, 41, 42, 43, 44, 45, 46, 47],
    craftProcess: [
      "Wykuwanie okuć z mosiądzu",
      "Podszywanie podwójnej warstwy skóry dla wzmocnienia",
      "Impregnacja na gorąco woskiem pszczelim"
    ],
    seo: {
      title: "Pilgrim Ember Boots — buty na wyprawy",
      description:
        "Pilgrim Ember Boots to solidne trzewiki gotowe na długie pielgrzymki i wyboiste szlaki.",
      keywords: ["buty terenowe", "pielgrzym", "trzewiki"]
    }
  },
  {
    id: "prod-6",
    slug: "pilgrim-moor-boots",
    name: "Pilgrim Moor Boots",
    styleId: 3,
    leatherId: 4,
    description:
      "Miękko wyściełane buty na wyprawy, z podeszwą trzymającą się nawet wilgotnych nawierzchni.",
    highlight: "Podwójne przeszycie i woskowana nić lniana",
    galleryCaptions: ["ujęcie w ruchu", "detal przeszycia", "podeszwa terenowa"],
    variantLeatherIds: [4, 2],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    craftProcess: [
      "Szycie podwójnym ściegiem dla trwałości",
      "Zabezpieczenie cholewki naturalnymi olejami",
      "Formowanie podeszwy o zwiększonej przyczepności"
    ],
    seo: {
      title: "Pilgrim Moor Boots — trzewiki na mokre tereny",
      description:
        "Pilgrim Moor Boots łączą nubukową miękkość z solidną podeszwą odporną na wilgoć.",
      keywords: ["trzewiki", "nubuk", "wyprawy"]
    }
  },
  {
    id: "prod-7",
    slug: "guildmaster-monks",
    name: "Guildmaster Monks",
    styleId: 4,
    leatherId: 1,
    description:
      "Model z pojedynczą klamrą i skośnym paskiem, który idealnie dopasowuje się do podbicia.",
    highlight: "Klamry odlewane według XIV-wiecznych wzorów",
    galleryCaptions: ["ujęcie boczne", "detal klamry", "profil podeszwy"],
    variantLeatherIds: [1, 2, 3],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    craftProcess: [
      "Odlane na zamówienie klamry cechowe",
      "Formowanie paska z pojedynczym przeszyciem",
      "Ręczne wygładzanie krawędzi skórzanych"
    ],
    seo: {
      title: "Guildmaster Monks — klasyczne monki",
      description:
        "Guildmaster Monks to hołd dla cechowych mistrzów: pojedyncza klamra i dopracowane detale.",
      keywords: ["monki", "klamra", "cech"]
    }
  },
  {
    id: "prod-8",
    slug: "midnight-guild-monks",
    name: "Midnight Guild Monks",
    styleId: 4,
    leatherId: 3,
    description:
      "Czarny wariant z połyskliwej skóry cielęcej, dedykowany wieczornym koncertom dworskim.",
    highlight: "Podszycie z naturalnego jedwabiu",
    galleryCaptions: ["widok frontalny", "detal jedwabnej podszewki", "klamra"],
    variantLeatherIds: [3, 1],
    sizes: [39, 40, 41, 42, 43, 44],
    craftProcess: [
      "Wykrawanie cholewki z połyskliwej skóry cielęcej",
      "Obszywanie wnętrza jedwabną podszewką",
      "Polerowanie do lustrzanego połysku"
    ],
    seo: {
      title: "Midnight Guild Monks — wieczorowe monki",
      description:
        "Midnight Guild Monks to eleganckie monki z jedwabną podszewką i lustrzanym połyskiem na specjalne okazje.",
      keywords: ["monki", "wieczorowe", "czarne buty"]
    }
  }
];

function createPlaceholderImage(name: string, caption: string) {
  const alt = `Placeholder zdjęcia modelu ${name} — ${caption}`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' role='img'><rect width='600' height='400' rx='24' fill='%23171829'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='%23f7f2e8' font-family='serif' font-size='32'>${name}</text><text x='50%' y='65%' dominant-baseline='middle' text-anchor='middle' fill='%23c9b37c' font-family='serif' font-size='20'>${caption}</text></svg>`;
  return {
    alt,
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  };
}

function computePrice(
  style: CatalogStyle | undefined,
  leather: CatalogLeather | undefined
) {
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

    return {
      id: template.id,
      slug: template.slug,
      name: template.name,
      styleId: style?.id ?? template.styleId,
      leatherId: leather?.id ?? template.leatherId,
      description: template.description,
      highlight: template.highlight,
      priceGrosz: computePrice(style, leather)
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

  const gallery = template.galleryCaptions.map((caption) =>
    createPlaceholderImage(template.name, caption)
  );

  return {
    id: template.id,
    slug: template.slug,
    name: template.name,
    styleId: style?.id ?? template.styleId,
    leatherId: leather?.id ?? template.leatherId,
    description: template.description,
    highlight: template.highlight,
    priceGrosz: computePrice(style, leather),
    gallery,
    variants: buildVariants(template, leatherById),
    craftProcess: template.craftProcess,
    seo: template.seo
  } satisfies CatalogProductDetail;
}
