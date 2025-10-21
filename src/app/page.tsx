import Image from "next/image";
import Link from "next/link";

import { OrderModalTrigger } from "@/components/ui/order/OrderModalTrigger";

import { PricingCalculator } from "./components/PricingCalculator";

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

const galleryItems = [
  {
    title: "Oxford nocna skóra",
    description: "Lakierowana czerń z ręcznym polerem.",
    image: "/image/models/1.jfif",
    alt: "Lakierowane oksfordy na tle warsztatu"
  },
  {
    title: "Derby kasztan",
    description: "Przeznaczone do codziennej pracy w biurze.",
    image: "/image/models/4.jfif",
    alt: "Kasztanowe derby z ręcznym wykończeniem"
  },
  {
    title: "Monk zamszowy",
    description: "Podwójna klamra w kolorze espresso.",
    image: "/image/models/7.jfif",
    alt: "Zamszowe monki z metalową klamrą"
  },
  {
    title: "Trzewik bespoke",
    description: "Skórzana podszewka i kontrastowe sznurowanie.",
    image: "/image/models/12.jfif",
    alt: "Trzewiki bespoke w trakcie polerowania"
  }
];

export default function Home() {
  return (
    <main className="page home-page">
      <section className="section hero hero--immersive" aria-labelledby="hero-heading">
        <div className="hero__background" aria-hidden="true">
          <div className="hero__background-video">
            <iframe
              title="Proces tworzenia obuwia JK Handmade Footwear"
              src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FJkarelus%2Fvideos%2F1935319520426934%2F&show_text=false&width=560&t=0&mute=1"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
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
              Nasz katalog zawiera te same warianty, które wybierzesz w formularzu zamówienia
              natywnego. Dobierz sylwetkę, skórę i akcesoria zanim wypełnisz zamówienie.
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
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__glow" />
            <div className="hero__showcase">
              {heroShowcase.map((item, index) => (
                <figure key={item.src} className={`hero-card hero-card--${item.accent}`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={420}
                    height={520}
                    className="hero-card__image"
                    sizes="(min-width: 1024px) 320px, 45vw"
                    priority={index === 0}
                  />
                  <figcaption>{item.label}</figcaption>
                </figure>
              ))}
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
              nim dostępne — a kalkulator wyceny poniżej pokaże orientacyjną cenę końcową.
            </p>
          </div>
          <ul className="selling-points" role="list">
            {sellingPoints.map((point) => (
              <li key={point.title} className="selling-point">
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </li>
            ))}
          </ul>
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
        <div className="container">
          <div className="section-header">
            <h2 id="portfolio-heading">Portfolio realizacji</h2>
            <p>Wybrane projekty, które pokazują różnorodność sylwetek i wykończeń.</p>
          </div>
          <div className="gallery-grid" role="list">
            {galleryItems.map((item) => (
              <article key={item.title} role="listitem" className="gallery-card">
                <div className="gallery-card__media" aria-hidden="true">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={480}
                    height={320}
                    className="gallery-card__image"
                    sizes="(min-width: 1024px) 260px, 80vw"
                  />
                </div>
                <div className="gallery-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PricingCalculator />

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
