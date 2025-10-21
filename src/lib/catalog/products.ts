import { CatalogLeather, CatalogProduct, CatalogStyle } from "./types";

interface ProductTemplate {
  id: string;
  name: string;
  styleId: number;
  leatherId: number;
  description: string;
  highlight: string;
}

const productTemplates: ProductTemplate[] = [
  {
    id: "prod-1",
    name: "Regal Huntsman Boots",
    styleId: 1,
    leatherId: 1,
    description:
      "Wysoki model jeździecki z profilem dopasowanym do łydki, ręcznie barwiony i wykończony woskiem pszczelim.",
    highlight: "Ręcznie malowane krawędzie i złocone klamry"
  },
  {
    id: "prod-2",
    name: "Obsidian Court Boots",
    styleId: 1,
    leatherId: 3,
    description:
      "Elegancka sylwetka stworzona na dworskie audiencje, z podszewką z miękkiej skóry koziej.",
    highlight: "Podwójna krawędź dekoracyjna inspirowana renesansem"
  },
  {
    id: "prod-3",
    name: "Amber Guild Oxfords",
    styleId: 2,
    leatherId: 2,
    description:
      "Klasyczne oksfordy z zamkniętą przyszwą, perforacją w kształcie rozety i zbalansowaną podeszwą.",
    highlight: "Ręcznie nakłuwana perforacja rozety"
  },
  {
    id: "prod-4",
    name: "Moorland Travel Oxfords",
    styleId: 2,
    leatherId: 4,
    description:
      "Model dzienny z miękką cholewką i dodatkową amortyzacją w podeszwie na długie marsze po mieście.",
    highlight: "Miękka wyściółka z filcu wełnianego"
  },
  {
    id: "prod-5",
    name: "Pilgrim Ember Boots",
    styleId: 3,
    leatherId: 2,
    description:
      "Trzewiki terenowe z szeroką cholewką, wzmacnianym noskiem i ręcznie wiązanym rzemieniem.",
    highlight: "Wymienne pętle na rzemienie z mosiądzu"
  },
  {
    id: "prod-6",
    name: "Pilgrim Moor Boots",
    styleId: 3,
    leatherId: 4,
    description:
      "Miękko wyściełane buty na wyprawy, z podeszwą trzymającą się nawet wilgotnych nawierzchni.",
    highlight: "Podwójne przeszycie i woskowana nić lniana"
  },
  {
    id: "prod-7",
    name: "Guildmaster Monks",
    styleId: 4,
    leatherId: 1,
    description:
      "Model z pojedynczą klamrą i skośnym paskiem, który idealnie dopasowuje się do podbicia.",
    highlight: "Klamry odlewane według XIV-wiecznych wzorów"
  },
  {
    id: "prod-8",
    name: "Midnight Guild Monks",
    styleId: 4,
    leatherId: 3,
    description:
      "Czarny wariant z połyskliwej skóry cielęcej, dedykowany wieczornym koncertom dworskim.",
    highlight: "Podszycie z naturalnego jedwabiu"
  }
];

export function createMockProducts(
  styles: CatalogStyle[],
  leathers: CatalogLeather[]
): CatalogProduct[] {
  const styleById = new Map(styles.map((style) => [style.id, style]));
  const leatherById = new Map(leathers.map((leather) => [leather.id, leather]));

  return productTemplates.map((template, index) => {
    const style = styleById.get(template.styleId) ?? styles[index % styles.length];
    const leather =
      leatherById.get(template.leatherId) ?? leathers[index % leathers.length];

    const basePrice = style?.basePriceGrosz ?? 0;
    const leatherMod = leather?.priceModGrosz ?? 0;
    const priceGrosz = Math.max(0, basePrice + leatherMod);

    return {
      id: template.id,
      name: template.name,
      styleId: style?.id ?? template.styleId,
      leatherId: leather?.id ?? template.leatherId,
      description: template.description,
      highlight: template.highlight,
      priceGrosz
    } satisfies CatalogProduct;
  });
}
