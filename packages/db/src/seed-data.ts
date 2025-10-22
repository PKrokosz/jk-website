export interface ReferenceStyleSeed {
  id: number;
  slug: string;
  name: string;
  era?: string;
  description: string;
  basePriceGrosz: number;
  active?: boolean;
}

export interface ReferenceLeatherSeed {
  id: number;
  name: string;
  color: string;
  finish?: string;
  priceModGrosz: number;
  description: string;
  active?: boolean;
}

export interface ReferenceSoleSeed {
  id: number;
  type: string;
  material?: string;
  color?: string;
  priceModGrosz?: number;
  active?: boolean;
}

export interface ReferenceOptionSeed {
  id: number;
  kind: string;
  label: string;
  priceModGrosz?: number;
  active?: boolean;
}

export type ReferenceProductCategory = "footwear" | "accessories" | "hydration" | "care";

export type ReferenceProductFunnelStage = "TOFU" | "MOFU" | "BOFU";

export interface ReferenceProductOrderReference {
  type: "model" | "accessory" | "service";
  id: string;
  label: string;
}

export interface ReferenceProductTemplateSeed {
  templateId: string;
  slug: string;
  name: string;
  styleId: number;
  leatherId: number;
  description: string;
  highlight: string;
  galleryImages: readonly string[];
  galleryCaptions: readonly string[];
  variantLeatherIds: readonly number[];
  sizes: readonly number[];
  craftProcess: readonly string[];
  seo: {
    title: string;
    description: string;
    keywords: readonly string[];
  };
  category: ReferenceProductCategory;
  funnelStage: ReferenceProductFunnelStage;
  orderReference?: ReferenceProductOrderReference;
  priceOverrideGrosz?: number;
}

export const referenceStyles = [
  {
    id: 1,
    slug: "courtly-riding-boot",
    name: "Courtly Riding Boot",
    era: "15th century",
    description:
      "Wysokie buty jeździeckie z dopasowaną cholewką i delikatnym zdobieniem inspirowanym dworskimi freskami.",
    basePriceGrosz: 289_000,
    active: true
  },
  {
    id: 2,
    slug: "artisan-oxford",
    name: "Artisan Oxford",
    era: "Early modern",
    description:
      "Szykowny fason wiązany inspirowany obuwiem cechów rzemieślniczych, z subtelną perforacją na nosku.",
    basePriceGrosz: 259_000,
    active: true
  },
  {
    id: 3,
    slug: "pilgrim-field-boot",
    name: "Pilgrim Field Boot",
    era: "13th century",
    description:
      "Wytrzymałe trzewiki terenowe o podwyższonym profilu, stworzone z myślą o długich wędrówkach.",
    basePriceGrosz: 274_000,
    active: true
  },
  {
    id: 4,
    slug: "guild-monk",
    name: "Guild Monk Shoe",
    era: "Late medieval",
    description:
      "Wsuwane obuwie z pojedynczą klamrą, hołd dla wczesnych modeli butów cechowych mistrzów szewstwa.",
    basePriceGrosz: 248_000,
    active: true
  },
  {
    id: 5,
    slug: "workshop-essentials",
    name: "Warsztatowe dodatki",
    era: "Pracownia JK",
    description:
      "Linia akcesoriów, bukłaków i usług pielęgnacyjnych dostępnych jako uzupełnienie zamówienia natywnego.",
    basePriceGrosz: 0,
    active: true
  }
] satisfies readonly ReferenceStyleSeed[];

export const referenceLeathers = [
  {
    id: 1,
    name: "Kasztanowa licowa",
    color: "Kasztan",
    finish: "Matowa",
    priceModGrosz: 18_000,
    description: "Naturalnie garbowana skóra roślinna o głębokim kasztanowym odcieniu i satynowym połysku.",
    active: true
  },
  {
    id: 2,
    name: "Bursztynowy pull-up",
    color: "Miód",
    finish: "Woskowana",
    priceModGrosz: 24_000,
    description: "Skóra pull-up z woskowaną powłoką, która ujawnia jaśniejsze tony podczas zginania.",
    active: true
  },
  {
    id: 3,
    name: "Obsydianowa cielęca",
    color: "Heban",
    finish: "Polerowana",
    priceModGrosz: 32_000,
    description: "Precyzyjnie wykończona cielęca skóra o głębokiej czerni i lustrzanym połysku.",
    active: true
  },
  {
    id: 4,
    name: "Wrzoścowy nubuk",
    color: "Mech",
    finish: "Miękka",
    priceModGrosz: 12_000,
    description: "Miękka skóra nubukowa o ziemistym, zielonkawym odcieniu przypominającym poranne mgły na wrzosowiskach.",
    active: true
  },
  {
    id: 5,
    name: "Warsztatowy mix",
    color: "Neutralny",
    finish: "Techniczna",
    priceModGrosz: 0,
    description: "Materiał warsztatowy stosowany w akcesoriach, bukłakach i prawidłach uzupełniających zamówienie.",
    active: true
  }
] satisfies readonly ReferenceLeatherSeed[];

export const referenceSoles = [
  {
    id: 1,
    type: "leather",
    material: "Vegetable-tanned leather",
    color: "Natural",
    priceModGrosz: 12_000,
    active: true
  },
  {
    id: 2,
    type: "dainite",
    material: "Rubber",
    color: "Black",
    priceModGrosz: 8_000,
    active: true
  },
  {
    id: 3,
    type: "wood",
    material: "Oak",
    color: "Amber",
    priceModGrosz: 15_000,
    active: true
  }
] satisfies readonly ReferenceSoleSeed[];

export const referenceOptions = [
  {
    id: 1,
    kind: "toe-cap",
    label: "Wzmocniony nosek",
    priceModGrosz: 25_000,
    active: true
  },
  {
    id: 2,
    kind: "buckle",
    label: "Mosiężna klamra",
    priceModGrosz: 18_000,
    active: true
  },
  {
    id: 3,
    kind: "lining",
    label: "Filcowa podszewka",
    priceModGrosz: 10_000,
    active: true
  },
  {
    id: 4,
    kind: "laces",
    label: "Rzemienie 120 cm",
    priceModGrosz: 4_000,
    active: true
  }
] satisfies readonly ReferenceOptionSeed[];

export const referenceProductTemplates =
  [

    {
      templateId: "model-szpic",
      slug: "szpic",
      name: "Szpic",
      styleId: 2,
      leatherId: 1,
      description: "Klasyczny model z ostrym noskiem, który zgrabnie wydłuża sylwetkę postaci i sprawdza się w historycznych stylizacjach dworskich.",
      highlight: "Profilowany nosek chroniący przed zagięciami",
      galleryImages: [
        "/image/models/1.jfif",
        "/image/models/2.jfif",
        "/image/models/3.jfif"
      ],
      galleryCaptions: [
        "profil boczny",
        "detal noska",
        "podeszwa"
      ],
      variantLeatherIds: [1, 2, 3],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
      craftProcess: [
        "Modelowanie ostrych nosków według indywidualnej miary",
        "Szycie cholewki z licowej skóry na kopycie natywnym",
        "Ręczne pastowanie dla uzyskania satynowego połysku"
      ],
      seo: {
        title: "Szpic — klasyczne obuwie dworskie",
        description: "Model Szpic z katalogu JK Handmade Footwear to klasyczne obuwie dworskie z ostrym noskiem i ręcznym wykończeniem.",
        keywords: [
          "szpic",
          "buty dworskie",
          "made to order"
        ]
      },
      category: "footwear",
      funnelStage: "MOFU",
      orderReference: {
        type: "model",
        id: "szpic",
        label: "Model Szpic",
      },
    },

    {
      templateId: "model-klamry",
      slug: "klamry",
      name: "Klamry",
      styleId: 4,
      leatherId: 2,
      description: "Niskie buty z klamrami inspirowanymi XIV-wiecznymi odlewami, łatwe w zakładaniu i stabilne podczas długich wydarzeń LARP.",
      highlight: "Klamry z warsztatowego stopu mosiądzu",
      galleryImages: [
        "/image/models/4.jfif",
        "/image/models/5.jfif",
        "/image/models/6.jfif"
      ],
      galleryCaptions: [
        "zapięcie na klamrę",
        "profil boczny",
        "podpodeszwa"
      ],
      variantLeatherIds: [2, 1, 4],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
      craftProcess: [
        "Dobór pary klamer z kolekcji rekonstrukcyjnej",
        "Formowanie paska zapinanego na klamrę",
        "Montaż podeszwy z podzelowaniem na życzenie"
      ],
      seo: {
        title: "Klamry — wsuwane buty z epoki",
        description: "Model Klamry oferuje szybkie zakładanie dzięki metalowym sprzączkom oraz personalizowane wykończenie cholewki.",
        keywords: [
          "klamry",
          "buty historyczne",
          "LARP"
        ]
      },
      category: "footwear",
      funnelStage: "MOFU",
      orderReference: {
        type: "model",
        id: "klamry",
        label: "Model Klamry",
      },
    },

    {
      templateId: "model-wysokie-szpice",
      slug: "wysokie-szpice",
      name: "Wysokie Szpice",
      styleId: 1,
      leatherId: 3,
      description: "Wysoka cholewka zakończona ostrym noskiem zapewnia stabilność w siodle oraz atrakcyjny profil sylwetki w stroju dworskim.",
      highlight: "Wydłużony nosek ze wzmocnionym rdzeniem",
      galleryImages: [
        "/image/models/7.jfif",
        "/image/models/8.jfif",
        "/image/models/9.jfif"
      ],
      galleryCaptions: [
        "pełna sylwetka",
        "detal noska",
        "wiązanie łydki"
      ],
      variantLeatherIds: [3, 1],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
      craftProcess: [
        "Skan łydki i przygotowanie indywidualnego kopyta",
        "Szycie wysokiej cholewki z cielęcej skóry",
        "Wykończenie i zabezpieczenie długiego noska"
      ],
      seo: {
        title: "Wysokie Szpice — buty jeździeckie",
        description: "Wysokie Szpice to rzemieślnicze buty jeździeckie z ostrym noskiem i pełną personalizacją obwodu łydki.",
        keywords: [
          "wysokie szpice",
          "buty jeździeckie",
          "personalizacja"
        ]
      },
      category: "footwear",
      funnelStage: "BOFU",
      orderReference: {
        type: "model",
        id: "wysokie-szpice",
        label: "Model Wysokie szpice",
      },
    },

    {
      templateId: "model-tamer",
      slug: "tamer",
      name: "Tamer",
      styleId: 3,
      leatherId: 4,
      description: "Trzewik o wzmocnionej konstrukcji inspirowany pustynnymi wyprawami, ze stabilizacją kostki i miękkim wnętrzem.",
      highlight: "Wymienne rzemienie na szybkie sznurowanie",
      galleryImages: [
        "/image/models/10.jfif",
        "/image/models/11.jfif",
        "/image/models/12.jfif"
      ],
      galleryCaptions: [
        "profil terenowy",
        "detal rzemieni",
        "pięta"
      ],
      variantLeatherIds: [4, 2, 1],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
      craftProcess: [
        "Cięcie nubuku o zwiększonej odporności na piasek",
        "Wszywanie miękkiej podszewki z filcu",
        "Impregnacja woskiem pszczelim"
      ],
      seo: {
        title: "Tamer — trzewiki na wyprawy",
        description: "Model Tamer to wytrzymałe trzewiki JK Handmade Footwear przygotowane na intensywne treningi i pustynne scenariusze.",
        keywords: [
          "tamer",
          "trzewiki",
          "larp"
        ]
      },
      category: "footwear",
      funnelStage: "MOFU",
      orderReference: {
        type: "model",
        id: "tamer",
        label: "Model Tamer",
      },
    },

    {
      templateId: "model-wysokie-cholewy",
      slug: "wysokie-cholewy",
      name: "Wysokie Cholewy",
      styleId: 1,
      leatherId: 1,
      description: "Model o pełnej wysokości do kolana, projektowany dla rekonstruktorów potrzebujących wsparcia łydki podczas jazdy.",
      highlight: "Profil łydki tworzony na podstawie pomiarów",
      galleryImages: [
        "/image/models/13.jfif",
        "/image/models/14.jfif",
        "/image/models/15.jfif"
      ],
      galleryCaptions: [
        "wysoka cholewka",
        "detal obszycia",
        "wiązanie"
      ],
      variantLeatherIds: [1, 3, 4],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
      craftProcess: [
        "Pomiary łydki i przygotowanie szablonów",
        "Szycie cholewki z podwójnej warstwy skóry",
        "Montaż podeszw z dodatkowym obcasem"
      ],
      seo: {
        title: "Wysokie Cholewy — wysokie buty jeździeckie",
        description: "Wysokie Cholewy z katalogu JK Handmade Footwear to ręcznie szyte buty jeździeckie dopasowane do obwodu łydki.",
        keywords: [
          "wysokie cholewy",
          "buty jeździeckie",
          "na miarę"
        ]
      },
      category: "footwear",
      funnelStage: "BOFU",
      orderReference: {
        type: "model",
        id: "wysokie-cholewy",
        label: "Model Wysokie Cholewy",
      },
    },

    {
      templateId: "model-przelotka-na-sabatony",
      slug: "przelotka-na-sabatony",
      name: "Przelotka na Sabatony",
      styleId: 3,
      leatherId: 2,
      description: "Model zaprojektowany dla rycerzy w zbroi — posiada system przelotek do montażu sabatonów i wzmocnioną podeszwę.",
      highlight: "Zbrojne przelotki montowane ręcznie",
      galleryImages: [
        "/image/models/6.jfif",
        "/image/models/7.jfif",
        "/image/models/8.jfif"
      ],
      galleryCaptions: [
        "system przelotek",
        "wzmocniona pięta",
        "sznurowanie"
      ],
      variantLeatherIds: [2, 4, 1],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
      craftProcess: [
        "Zbrojenie przelotek ze stali nierdzewnej",
        "Podszywanie dodatkowej warstwy skóry",
        "Test dopasowania do sabatonów klienta"
      ],
      seo: {
        title: "Przelotka na sabatony — model bojowy",
        description: "Buty z przelotką na sabatony zapewniają kompatybilność z elementami zbroi i stabilność podczas walki.",
        keywords: [
          "sabatony",
          "buty do zbroi",
          "rekonstrukcja"
        ]
      },
      category: "footwear",
      funnelStage: "MOFU",
      orderReference: {
        type: "model",
        id: "przelotka-na-sabatony",
        label: "Model Przelotka na sabatony",
      },
    },

    {
      templateId: "model-trzewiki",
      slug: "trzewiki",
      name: "Trzewiki",
      styleId: 3,
      leatherId: 4,
      description: "Uniwersalne trzewiki do codziennego noszenia w terenie i mieście, z amortyzacją i łatwym sznurowaniem.",
      highlight: "Wyściółka z naturalnego filcu",
      galleryImages: [
        "/image/models/2.jfif",
        "/image/models/3.jfif",
        "/image/models/4.jfif"
      ],
      galleryCaptions: [
        "widok z góry",
        "detal języka",
        "podeszwa"
      ],
      variantLeatherIds: [4, 2, 1],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
      craftProcess: [
        "Cięcie cholewki z nubuku o wysokiej gęstości",
        "Szycie języka z miękką podszewką",
        "Montaż podeszwy z amortyzacją"
      ],
      seo: {
        title: "Trzewiki — uniwersalne obuwie terenowe",
        description: "Trzewiki JK Handmade Footwear to komfortowe obuwie terenowe do codziennych zadań i lekkich wypraw.",
        keywords: [
          "trzewiki",
          "buty terenowe",
          "komfort"
        ]
      },
      category: "footwear",
      funnelStage: "MOFU",
      orderReference: {
        type: "model",
        id: "trzewiki",
        label: "Model Trzewiki",
      },
    },

    {
      templateId: "model-obiezyswiat",
      slug: "obiezyswiat",
      name: "Obieżyświat",
      styleId: 3,
      leatherId: 2,
      description: "Buty podróżnika projektowane na wielodniowe marsze — posiadają elastyczną cholewkę i mocne sznurowanie.",
      highlight: "Wymienne sznurowadła ze skóry bydlęcej",
      galleryImages: [
        "/image/models/9.jfif",
        "/image/models/10.jfif",
        "/image/models/11.jfif"
      ],
      galleryCaptions: [
        "sznurowanie",
        "profil terenowy",
        "detal pięty"
      ],
      variantLeatherIds: [2, 4, 1],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
      craftProcess: [
        "Dobór skóry pull-up odpornej na zarysowania",
        "Szycie cholewki z dodatkową zakładką przeciw wilgoci",
        "Impregnacja olejami ziołowymi"
      ],
      seo: {
        title: "Obieżyświat — buty na długie wyprawy",
        description: "Model Obieżyświat powstał dla podróżników i zwiadowców, którzy potrzebują trwałych butów na długie dystanse.",
        keywords: [
          "obiezyswiat",
          "buty podróżne",
          "larp"
        ]
      },
      category: "footwear",
      funnelStage: "MOFU",
      orderReference: {
        type: "model",
        id: "obiezyswiat",
        label: "Model Obieżyświat",
      },
    },

    {
      templateId: "model-dragonki",
      slug: "dragonki",
      name: "Dragonki",
      styleId: 1,
      leatherId: 3,
      description: "Spektakularne buty o inspirowanym smokami wykroju, tworzone na potrzeby pokazów, konwentów i scen filmowych.",
      highlight: "Dekoracyjne przeszycia przypominające łuski",
      galleryImages: [
        "/image/models/12.jfif",
        "/image/models/13.jfif",
        "/image/models/14.jfif"
      ],
      galleryCaptions: [
        "detal łusek",
        "profil boczny",
        "podeszwa scenicza"
      ],
      variantLeatherIds: [3, 1],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
      craftProcess: [
        "Projektowanie dekoracyjnych paneli zgodnie z koncepcją postaci",
        "Tłoczenie wzorów łusek na mokrej skórze",
        "Barwienie gradientowe i zabezpieczenie lakierem"
      ],
      seo: {
        title: "Dragonki — sceniczne buty premium",
        description: "Dragonki to rzemieślnicze buty sceniczne z detalami przypominającymi łuski smoka, idealne na pokazy i cosplay.",
        keywords: [
          "dragonki",
          "buty sceniczne",
          "cosplay"
        ]
      },
      category: "footwear",
      funnelStage: "TOFU",
      orderReference: {
        type: "model",
        id: "dragonki",
        label: "Model Dragonki",
      },
    },

    {
      templateId: "model-wonderer",
      slug: "wonderer",
      name: "Wonderer",
      styleId: 2,
      leatherId: 1,
      description: "Eleganckie buty miejskie inspirowane wędrówkami mieszczan, z subtelną perforacją i miękkim wnętrzem.",
      highlight: "Ręcznie frezowane perforacje",
      galleryImages: [
        "/image/models/15.jfif",
        "/image/models/16.jfif",
        "/image/models/1.jfif"
      ],
      galleryCaptions: [
        "widok z góry",
        "detal perforacji",
        "podeszwa miejska"
      ],
      variantLeatherIds: [1, 2, 3],
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
      craftProcess: [
        "Wykrawanie perforacji według wzoru rzemieślniczego",
        "Szycie cholewki z licowej skóry",
        "Pastowanie i polerowanie do satynowego połysku"
      ],
      seo: {
        title: "Wonderer — buty miejskie",
        description: "Wonderer to elegancki model miejski JK Handmade Footwear z perforacją i personalizowanym wykończeniem.",
        keywords: [
          "wonderer",
          "buty miejskie",
          "perforacja"
        ]
      },
      category: "footwear",
      funnelStage: "TOFU",
      orderReference: {
        type: "model",
        id: "wonderer",
        label: "Model Wonderer",
      },
    },

    {
      templateId: "accessory-wax",
      slug: "dedykowany-wosk",
      name: "Dedykowany wosk pielęgnacyjny",
      styleId: 5,
      leatherId: 5,
      description: "Warsztatowy wosk na bazie naturalnych żywic, dostępny jako akcesorium w formularzu zamówienia natywnego.",
      highlight: "Chroni skórę przed wilgocią i zabrudzeniami",
      galleryImages: [
        "/image/models/16.jfif",
        "/image/models/1.jfif",
        "/image/models/2.jfif"
      ],
      galleryCaptions: [
        "opakowanie",
        "aplikacja wosku",
        "połysk skóry"
      ],
      variantLeatherIds: [],
      sizes: [],
      craftProcess: [
        "Dobór mieszanki wosków i olejów",
        "Testy aplikacji na próbkach warsztatowych",
        "Dołączenie instrukcji pielęgnacji do przesyłki"
      ],
      seo: {
        title: "Dedykowany wosk do butów",
        description: "Dedykowany wosk JK Handmade Footwear podtrzymuje kondycję skóry i jest częścią pakietu pielęgnacyjnego.",
        keywords: [
          "wosk do butów",
          "pielęgnacja",
          "akcesoria"
        ]
      },
      category: "accessories",
      funnelStage: "BOFU",
      orderReference: {
        type: "accessory",
        id: "wax",
        label: "Akcesorium Wosk",
      },
      priceOverrideGrosz: 6000,
    },

    {
      templateId: "accessory-impregnation",
      slug: "impregnat-warsztatowy",
      name: "Impregnat warsztatowy",
      styleId: 5,
      leatherId: 5,
      description: "Spray hydrofobowy zabezpieczający skórę przed wodą — rekomendowany do terenowych modeli obuwia.",
      highlight: "Warstwa ochronna na 6 miesięcy intensywnego użycia",
      galleryImages: [
        "/image/models/3.jfif",
        "/image/models/4.jfif",
        "/image/models/5.jfif"
      ],
      galleryCaptions: [
        "aplikacja impregnatu",
        "detal kropli",
        "zestaw pielęgnacyjny"
      ],
      variantLeatherIds: [],
      sizes: [],
      craftProcess: [
        "Dobór aktywnych składników impregnujących",
        "Testy odporności na deszcz w warsztacie",
        "Pakowanie z instrukcją użytkowania"
      ],
      seo: {
        title: "Impregnat warsztatowy do skóry",
        description: "Impregnat warsztatowy JK Handmade Footwear zabezpiecza obuwie przed wodą i utrwala kolor skóry.",
        keywords: [
          "impregnat",
          "akcesoria",
          "pielęgnacja"
        ]
      },
      category: "accessories",
      funnelStage: "BOFU",
      orderReference: {
        type: "accessory",
        id: "impregnation",
        label: "Akcesorium Impregnat",
      },
      priceOverrideGrosz: 7500,
    },

    {
      templateId: "accessory-leather-straps",
      slug: "rzemienie-do-buty",
      name: "Para rzemieni skórzanych",
      styleId: 5,
      leatherId: 5,
      description: "Mocne rzemienie o długości 120 cm, używane jako zapasowe sznurowadła lub mocowania do akcesoriów.",
      highlight: "Ręcznie cięte paski ze skóry bydlęcej",
      galleryImages: [
        "/image/models/5.jfif",
        "/image/models/6.jfif",
        "/image/models/7.jfif"
      ],
      galleryCaptions: [
        "rzemienie",
        "detal zakończeń",
        "wiązanie"
      ],
      variantLeatherIds: [],
      sizes: [],
      craftProcess: [
        "Cięcie pasków na gilotynie warsztatowej",
        "Woskowanie zakończeń dla trwałości",
        "Kontrola jakości i kompletowanie pary"
      ],
      seo: {
        title: "Rzemienie skórzane do butów",
        description: "Para rzemieni JK Handmade Footwear służy jako zapasowe sznurowadła lub mocowanie dodatkowych elementów.",
        keywords: [
          "rzemienie",
          "akcesoria",
          "sznurowadła"
        ]
      },
      category: "accessories",
      funnelStage: "BOFU",
      orderReference: {
        type: "accessory",
        id: "leather-straps",
        label: "Akcesorium Para rzemieni",
      },
      priceOverrideGrosz: 4000,
    },

    {
      templateId: "service-waterskin",
      slug: "buklak-podrozny",
      name: "Bukłak podróżny",
      styleId: 5,
      leatherId: 5,
      description: "Ręcznie szyty bukłak z tej samej skóry co obuwie — możesz dodać własny symbol lub herb w formularzu.",
      highlight: "Wewnętrzna powłoka zabezpieczająca napoje",
      galleryImages: [
        "/image/models/8.jfif",
        "/image/models/9.jfif",
        "/image/models/10.jfif"
      ],
      galleryCaptions: [
        "bukłak w terenie",
        "detal tłoczenia",
        "system mocowania"
      ],
      variantLeatherIds: [],
      sizes: [],
      craftProcess: [
        "Dobór skóry o odpowiedniej szczelności",
        "Szycie bukłaka specjalnym szwem wodoodpornym",
        "Tłoczenie symbolu lub herbu na życzenie"
      ],
      seo: {
        title: "Bukłak podróżny do zestawu butów",
        description: "Bukłak podróżny JK Handmade Footwear to dodatek szyty na zamówienie z możliwością personalizacji symbolu.",
        keywords: [
          "bukłak",
          "akcesoria",
          "personalizacja"
        ]
      },
      category: "hydration",
      funnelStage: "MOFU",
      orderReference: {
        type: "service",
        id: "waterskin",
        label: "Bukłak podróżny",
      },
      priceOverrideGrosz: 25000,
    },

    {
      templateId: "service-shoe-trees",
      slug: "prawidla-sosnowe",
      name: "Prawidła sosnowe",
      styleId: 5,
      leatherId: 5,
      description: "Para prawideł wykonanych z drewna sosnowego, które utrzymują kształt butów i absorbują wilgoć po treningu.",
      highlight: "Wymienne sprężyny dopasowane do rozmiaru butów",
      galleryImages: [
        "/image/models/11.jfif",
        "/image/models/12.jfif",
        "/image/models/13.jfif"
      ],
      galleryCaptions: [
        "prawidła w butach",
        "detal drewna",
        "mechanizm sprężynowy"
      ],
      variantLeatherIds: [],
      sizes: [],
      craftProcess: [
        "Toczenie kopyt z litego drewna",
        "Szlifowanie i olejowanie powierzchni",
        "Montaż sprężyn dopasowanych do rozmiaru"
      ],
      seo: {
        title: "Prawidła sosnowe do pielęgnacji obuwia",
        description: "Prawidła sosnowe JK Handmade Footwear utrzymują kształt butów i przedłużają ich żywotność.",
        keywords: [
          "prawidła",
          "pielęgnacja",
          "akcesoria"
        ]
      },
      category: "care",
      funnelStage: "BOFU",
      orderReference: {
        type: "service",
        id: "shoeTrees",
        label: "Prawidła sosnowe",
      },
      priceOverrideGrosz: 15000,
    },
  ] satisfies readonly ReferenceProductTemplateSeed[];
