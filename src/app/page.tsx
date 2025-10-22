import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { ORDER_MODELS } from "@/config/orderModels";
import { listProductSlugs } from "@/lib/catalog/products";
import { OrderModalTrigger } from "@/components/ui/order/OrderModalTrigger";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroShowcaseFrame } from "./components/HeroShowcaseFrame";
import { SellingPointsCarousel } from "./components/SellingPointsCarousel";

const siteUrl = "https://jk-footwear.pl";

const PricingCalculator = dynamic(
  () => import("./components/PricingCalculator").then((module) => module.PricingCalculator),
  {
    loading: () => (
      <section className="section" aria-labelledby="calculator-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="calculator-heading">Kalkulator wyceny</h2>
            <p>Ładujemy kalkulator wyceny butów JK Handmade Footwear…</p>
          </div>
          <div className="loading-placeholder" role="status" aria-live="polite">
            Trwa przygotowywanie danych o modelach…
          </div>
        </div>
      </section>
    ),
    ssr: false
  }
);

type FaqLinkSegment = {
  type: "link";
  href: string;
  label: string;
};

type FaqParagraph = Array<string | FaqLinkSegment>;

interface FaqEntry {
  question: string;
  paragraphs: FaqParagraph[];
}

const heroShowcase = [
  {
    src: "/image/models/10.jfif",
    alt: "Ciemnobrązowy model Obieżyświat o wydłużonej cholewce",
    label: "Obieżyświat",
    accent: "amber"
  },
  {
    src: "/image/models/6.jfif",
    alt: "Granatowe buty Tamer na drewnianym kopycie",
    label: "Tamer",
    accent: "copper"
  },
  {
    src: "/image/models/15.jfif",
    alt: "Czarne trzewiki Wysokie Krowie Pyski z kontrastowym sznurowaniem",
    label: "Wysokie Krowie Pyski",
    accent: "gold"
  }
];

const sellingPoints = [
  {
    title: "Podwójna licowa skóra",
    description:
      "Każda para powstaje z dwóch warstw najlepszej skóry, dzięki czemu buty są trwałe, a stopa oddycha nawet podczas wielogodzinnych gier."
  },
  {
    title: "Wzmocnienia pod scenariusze",
    description:
      "Noski i pięty zabezpieczamy dodatkowym usztywnieniem, żeby wytrzymały trening walki, jazdę konną i dynamiczne rekonstrukcje."
  },
  {
    title: "Stabilność i amortyzacja",
    description:
      "Wyważona podeszwa amortyzuje każdy krok, a konstrukcja cholewki utrzymuje pewną sylwetkę niezależnie od terenu."
  },
  {
    title: "Pracownia rękodzielnicza",
    description:
      "Projektujemy i szyjemy w Warszawie. Jeden mistrz odpowiada za całą parę, od kopyta po polerowanie."
  },
  {
    title: "Indywidualne dopasowanie",
    description:
      "Szyjemy w rozmiarach 36–49 i pod konkretne pomiary, dlatego możesz wybrać dowolny model z katalogu natywnego i dopasować go do swojej postaci."
  },
  {
    title: "Pielęgnacja i ochrona",
    description:
      "Woskowana skóra chroni przed deszczem i rosą, a dodatkowe woski oraz bukłaki możesz dodać prosto z formularza."
  }
];

const portfolioSlugs = new Set(listProductSlugs());

const portfolioItems = ORDER_MODELS.filter(
  (model) => !model.image.endsWith("placeholder.svg") && portfolioSlugs.has(model.id)
)
  .slice(0, 8)
  .map((model) => ({
    id: model.id,
    title: model.name,
    priceLabel: model.googleValue.replace(/\s*-\s*/, " – "),
    image: model.image,
    alt: `Model ${model.name} z katalogu JK Handmade Footwear`
  }));

const faqEntries: FaqEntry[] = [
  {
    question: "Jak zamówić buty na miarę JK Handmade Footwear?",
    paragraphs: [
      [
        "Wypełnij ",
        { type: "link", href: "/order/native", label: "formularz zamówienia natywnego" },
        ", aby przejść przez proces wyboru modelu, skóry i dodatków."
      ],
      [
        "Jeżeli potrzebujesz konsultacji, skorzystaj ze strony ",
        { type: "link", href: "/contact", label: "kontakt" },
        " i ustal termin wizyty w warszawskiej pracowni."
      ]
    ]
  },
  {
    question: "Ile trwa proces wykonania butów na miarę?",
    paragraphs: [
      [
        "Standardowo przygotowanie pary obejmuje cztery etapy opisane powyżej i zajmuje średnio od ośmiu do dwunastu tygodni."
      ],
      [
        "Po konsultacji otrzymasz harmonogram przymiarek oraz aktualizacje e-mailowe na każdym etapie produkcji."
      ]
    ]
  },
  {
    question: "Czy mogę zobaczyć dostępne modele i ceny przed złożeniem zamówienia?",
    paragraphs: [
      [
        "Tak. Przeglądaj ",
        { type: "link", href: "/catalog", label: "katalog modeli" },
        ", aby porównać stylistykę, warianty skóry i dodatki dostępne w ofercie."
      ],
      [
        "Następnie użyj ",
        { type: "link", href: "#calculator-heading", label: "kalkulatora wyceny" },
        ", aby sprawdzić orientacyjny koszt i dobrać akcesoria."
      ]
    ]
  },
  {
    question: "Czy realizujecie zamówienia grupowe lub produkcje filmowe?",
    paragraphs: [
      [
        "Tak, przygotowujemy kolekcje dla grup rekonstrukcyjnych, ekip filmowych oraz wydarzeń LARP."
      ],
      [
        "Dowiedz się więcej na stronie ",
        { type: "link", href: "/group-orders", label: "zamówień grupowych" },
        " lub napisz, aby otrzymać dedykowaną wycenę."
      ]
    ]
  }
];

const isLinkSegment = (segment: string | FaqLinkSegment): segment is FaqLinkSegment =>
  typeof segment !== "string";

const getParagraphText = (paragraph: FaqParagraph) =>
  paragraph.map((segment) => (isLinkSegment(segment) ? segment.label : segment)).join("");

const getAnswerText = (entry: FaqEntry) =>
  entry.paragraphs.map((paragraph) => getParagraphText(paragraph)).join("\n\n");

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${siteUrl}#organization`,
        name: "JK Handmade Footwear",
        url: siteUrl,
        logo: `${siteUrl}/favicon.svg`,
        image: heroShowcase.map((item) => `${siteUrl}${item.src}`),
        description:
          "JK Handmade Footwear tworzy miarowe obuwie w warszawskiej pracowni. Transparentny proces MTO, ręczne wykończenia i wsparcie na każdym etapie.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Warszawa",
          addressCountry: "PL"
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "pracownia@jk-footwear.pl",
            availableLanguage: ["pl", "en"]
          }
        ],
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Polska"
        },
        hasOfferCatalog: {
          "@id": `${siteUrl}#portfolio`
        }
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}#portfolio`,
        name: "Katalog modeli JK Handmade Footwear",
        itemListElement: portfolioItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/catalog/${item.id}`,
          name: item.title,
          image: `${siteUrl}${item.image}`,
          description: "Model miarowy dostępny w formularzu zamówienia JK Handmade Footwear."
        }))
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}#faq`,
        mainEntity: faqEntries.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: getAnswerText(entry)
          }
        }))
      }
    ]
  };

  return (
    <main className="page home-page">
      <JsonLd data={structuredData} id="home-structured-data" />
      <section className="section hero hero--immersive" aria-labelledby="hero-heading">
        <div className="hero__background" aria-hidden="true">
          <div className="hero__background-video">
            <video
              aria-hidden="true"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/image/models/10.jfif"
              title="Proces szycia butów JK Handmade Footwear"
            >
              <source src="/vid/1.mp4" type="video/mp4" />
              Twoja przeglądarka nie obsługuje elementu wideo.
            </video>
          </div>
          <div className="hero__background-overlay" />
        </div>
        <div className="container hero__layout">
          <div className="hero__intro">
            <p className="eyebrow">JK Handmade Footwear</p>
            <h1 id="hero-heading">Rzemieślnicze buty LARP, które wybierzesz w naszym katalogu</h1>
            <p className="lead">
              Masz problem ze znalezieniem wygodnych butów LARP o wysokim standardzie? Od 16 lat
              projektujemy modele dla rekonstruktorów, jeźdźców i ekip filmowych — w tym Netflixa i
              rycerzy bitwy pod Grunwaldem.
            </p>
            <p>
              Nasz {" "}
              <Link href="/catalog">katalog modeli</Link>
              {" "}
              zawiera te same warianty, które wybierzesz w formularzu zamówienia natywnego.
              Dobierz sylwetkę, skórę i akcesoria zanim wypełnisz zamówienie.
            </p>
            <div className="hero__actions">
              <OrderModalTrigger
                className="button button--primary order-modal__trigger"
                triggerLabel="Zamów buty"
                ctaLabel="Przejdź do formularza"
              />
              <a className="button button--ghost" href="mailto:pracownia@jk-footwear.pl">
                Umów konsultację
              </a>
              <Link className="button button--ghost" href="/api/pricing/quote">
                Zobacz API wyceny
              </Link>
              <Link className="button button--primary order-modal__mobile-link" href="/order/native">
                Zamów buty
              </Link>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__glow" />
            <div className="hero__showcase">
              <HeroShowcaseFrame items={heroShowcase} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="craft-heading">
        <div className="container craft-overview">
          <div className="craft-overview__intro">
            <h2 id="craft-heading">Co wyróżnia nasze buty</h2>
            <p>
              Każdy model z katalogu powstaje w warszawskiej pracowni i może zostać dostosowany do
              Twoich wymiarów, scenariusza i preferowanych dodatków.
            </p>
            <p>
              Wybierając model w formularzu natywnym, dokładnie wiesz, jakie cechy i dodatki są w
              nim dostępne — a {" "}
              <Link href="#calculator-heading">kalkulator wyceny</Link>
              {" "}
              poniżej pokaże orientacyjną cenę końcową.
            </p>
          </div>
          <div className="craft-overview__features">
            <SellingPointsCarousel points={sellingPoints} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="process-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="process-heading">Proces made-to-order w 4 krokach</h2>
            <p>
              Transparentnie komunikujemy każdą fazę powstawania butów, abyś wiedział, kiedy
              możesz spodziewać się przymiarek i odbioru.
            </p>
          </div>
          <ol className="process">
            <li>
              <h3>Konsultacja w pracowni</h3>
              <p>Analizujemy styl życia, przeznaczenie obuwia i Twoje inspiracje wizualne.</p>
            </li>
            <li>
              <h3>Pomiary i kopyto</h3>
              <p>Tworzymy indywidualne kopyto oraz prototyp, który testujemy razem z Tobą.</p>
            </li>
            <li>
              <h3>Ręczne szycie</h3>
              <p>Dobieramy skórę, szyjemy cholewkę i montujemy podeszwę przy użyciu tradycyjnych technik.</p>
            </li>
            <li>
              <h3>Finisz i odbiór</h3>
              <p>Polerujemy, dopasowujemy wkładki oraz przekazujemy instrukcję pielęgnacji.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section section--muted" aria-labelledby="portfolio-heading">
        <div className="container portfolio">
          <div className="section-header">
            <h2 id="portfolio-heading">Portfolio realizacji</h2>
            <p>Wybrane projekty prosto z katalogu natywnego — wszystkie dostępne w formularzu.</p>
          </div>
          <div className="portfolio-showcase" role="list">
            {portfolioItems.map((item) => (
              <Link
                key={item.id}
                role="listitem"
                href={`/catalog/${item.id}`}
                className="portfolio-card"
                aria-label={`Zobacz model ${item.title} w katalogu`}
                prefetch={false}
              >
                <div className="portfolio-card__media">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={640}
                    height={480}
                    className="portfolio-card__image"
                    sizes="(min-width: 1280px) 320px, (min-width: 768px) 38vw, 80vw"
                  />
                </div>
                <div className="portfolio-card__body">
                  <p className="portfolio-card__eyebrow">{item.priceLabel}</p>
                  <h3>{item.title}</h3>
                  <p>Model dostępny w formularzu natywnym — zobacz detale i dobierz dodatki.</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PricingCalculator />

      <section className="section" aria-labelledby="faq-heading">
        <div className="container faq">
          <div className="section-header">
            <h2 id="faq-heading">Najczęstsze pytania o buty na miarę</h2>
            <p>
              Zebraliśmy odpowiedzi, które najczęściej pojawiają się przed pierwszą wizytą w
              pracowni JK Handmade Footwear.
            </p>
          </div>
          <div className="faq__items">
            {faqEntries.map((entry) => (
              <article key={entry.question} className="faq-item">
                <h3>{entry.question}</h3>
                {entry.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={`${entry.question}-${paragraphIndex}`}>
                    {paragraph.map((segment, segmentIndex) =>
                      typeof segment === "string" ? (
                        segment
                      ) : (
                        <Link key={`${segment.href}-${segmentIndex}`} href={segment.href}>
                          {segment.label}
                        </Link>
                      )
                    )}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cta-heading">
        <div className="container callout">
          <div>
            <h2 id="cta-heading">Gotowy na pierwszy krok?</h2>
            <p>
              Napisz do nas i umów termin konsultacji w pracowni. Sprawdzisz status aplikacji pod
              kątem wdrożenia MVP w zakładce zdrowia systemu.
            </p>
          </div>
          <div className="callout__actions">
            <a className="button button--primary" href="mailto:pracownia@jk-footwear.pl">
              Rezerwuj termin
            </a>
            <Link className="button button--ghost" href="/healthz">
              Status aplikacji
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
