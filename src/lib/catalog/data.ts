import { CatalogLeather, CatalogStyle } from "./types";

export const catalogStyles: CatalogStyle[] = [
  {
    id: 1,
    slug: "courtly-riding-boot",
    name: "Courtly Riding Boot",
    era: "15th century",
    description:
      "Wysokie buty jeździeckie z dopasowaną cholewką i delikatnym zdobieniem inspirowanym dworskimi freskami.",
    basePriceGrosz: 289_000
  },
  {
    id: 2,
    slug: "artisan-oxford",
    name: "Artisan Oxford",
    era: "Early modern",
    description:
      "Szykowny fason wiązany inspirowany obuwiem cechów rzemieślniczych, z subtelną perforacją na nosku.",
    basePriceGrosz: 259_000
  },
  {
    id: 3,
    slug: "pilgrim-field-boot",
    name: "Pilgrim Field Boot",
    era: "13th century",
    description:
      "Wytrzymałe trzewiki terenowe o podwyższonym profilu, stworzone z myślą o długich wędrówkach.",
    basePriceGrosz: 274_000
  },
  {
    id: 4,
    slug: "guild-monk",
    name: "Guild Monk Shoe",
    era: "Late medieval",
    description:
      "Wsuwane obuwie z pojedynczą klamrą, hołd dla wczesnych modeli butów cechowych mistrzów szewstwa.",
    basePriceGrosz: 248_000
  },
  {
    id: 5,
    slug: "workshop-essentials",
    name: "Warsztatowe dodatki",
    era: "Pracownia JK",
    description:
      "Linia akcesoriów, bukłaków i usług pielęgnacyjnych dostępnych jako uzupełnienie zamówienia natywnego.",
    basePriceGrosz: 0
  }
];

export const catalogLeathers: CatalogLeather[] = [
  {
    id: 1,
    name: "Kasztanowa licowa",
    color: "Kasztan",
    finish: "Matowa",
    priceModGrosz: 18_000,
    description: "Naturalnie garbowana skóra roślinna o głębokim kasztanowym odcieniu i satynowym połysku."
  },
  {
    id: 2,
    name: "Bursztynowy pull-up",
    color: "Miód",
    finish: "Woskowana",
    priceModGrosz: 24_000,
    description: "Skóra pull-up z woskowaną powłoką, która ujawnia jaśniejsze tony podczas zginania."
  },
  {
    id: 3,
    name: "Obsydianowa cielęca",
    color: "Heban",
    finish: "Polerowana",
    priceModGrosz: 32_000,
    description: "Precyzyjnie wykończona cielęca skóra o głębokiej czerni i lustrzanym połysku."
  },
  {
    id: 4,
    name: "Wrzoścowy nubuk",
    color: "Mech",
    finish: "Miękka",
    priceModGrosz: 12_000,
    description: "Miękka skóra nubukowa o ziemistym, zielonkawym odcieniu przypominającym poranne mgły na wrzosowiskach."
  },
  {
    id: 5,
    name: "Warsztatowy mix",
    color: "Neutralny",
    finish: "Techniczna",
    priceModGrosz: 0,
    description: "Materiał warsztatowy stosowany w akcesoriach, bukłakach i prawidłach uzupełniających zamówienie."
  }
];
