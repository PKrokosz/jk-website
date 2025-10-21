import type { Metadata } from "next";
import type { CSSProperties } from "react";


type SlideStyle = CSSProperties & { "--delay"?: string };

type Slide = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  detail: string;
  video: string;
};

export const metadata: Metadata = {
  title: "O pracowni"
};

const slides: Slide[] = [
  {
    id: "origins",
    kicker: "Geneza pracowni",
    title: "Warsztat, który wyrósł z rodzinnego stołu",
    description:
      "Zaczynaliśmy od naprawiania butów rycerskich na zamkowych dziedzińcach. Dziś projektujemy całe kolekcje inspirowane średniowiecznym kunsztem.",
    detail:
      "Nasz założyciel, Jan K., przejął narzędzia po dziadku i przerobił pierwszy stół stolarski w warszawski atelier JK Handmade Footwear.",
    video: "/vid/1.mp4"
  },
  {
    id: "materials",
    kicker: "Materiały premium",
    title: "Skóry z garbarni, które znamy po imieniu",
    description:
      "Selekcjonujemy krupony z włoskich i polskich garbarni, żeby każda para mogła przyjąć wodę, napięcia i setki kilometrów marszu.",
    detail:
      "Każdą partię testujemy na giętkość i odporność pigmentu. To dlatego nasze obuwie zachowuje kolor nawet pod sceniczne reflektory.",
    video: "/vid/2.mp4"
  },
  {
    id: "design",
    kicker: "Projektowanie",
    title: "Kroje tworzone jak scenariusz przygody",
    description:
      "Zanim powstanie kopyto, rozrysowujemy historię bohatera — jego ruch, klimat świata i wymagania ekipy kostiumowej.",
    detail:
      "Od szkicu na pergaminie po cyfrowy model — w każdym etapie biorą udział projektant, rekonstruktor i rzemieślnik.",
    video: "/vid/3.mp4"
  },
  {
    id: "craft",
    kicker: "Ręczna produkcja",
    title: "Szycie i montaż prowadzone bez pośpiechu",
    description:
      "Każdy szewnik prowadzi swoją parę od pierwszego cięcia po końcowe polerowanie, dlatego znamy każdą nitkę z imienia.",
    detail:
      "Ręczne przeszycia wzmocnione lnianą nicią, podpodeszwy z dębowo garbowanej skóry i woskowane krawędzie to nasz standard.",
    video: "/vid/4.mp4"
  },
  {
    id: "experience",
    kicker: "Doświadczenie klienta",
    title: "Przymiarki, które prowadzą przez cały proces",
    description:
      "W studiu lub online prowadzimy konsultacje, nagrywamy wskazówki wideo i wysyłamy próbne cholewki, by dopracować komfort.",
    detail:
      "Na platformie zamówień śledzisz status, otrzymujesz zdjęcia z warsztatu i rekomendacje pielęgnacji dopasowane do scenariusza.",
    video: "/vid/6.mp4"
  },
  {
    id: "future",
    kicker: "Horyzont",
    title: "Plan na kolejne sezony rekonstrukcji",
    description:
      "Rozwijamy katalog o modele dla łuczników, sokolników i ekip filmowych, zachowując miarowy charakter naszych butów.",
    detail:
      "W 2025 roku startujemy z programem renowacji MTO, aby każda para mogła wrócić na szlak z nową energią.",
    video: "/vid/7.mp4"
  }
];

export default function AboutPage() {
  return (
    <main className="about-page" aria-labelledby="about-heading">
      <h1 id="about-heading" className="sr-only">
        O pracowni JK Handmade Footwear
      </h1>
      <div className="about-track">
        {slides.map((slide, index) => {
          const style: SlideStyle = { "--delay": `${index * 0.45}s` };

          return (
            <section key={slide.id} className="about-slide" aria-labelledby={`${slide.id}-title`} style={style}>
              <div className="about-media" aria-hidden="true">
                <video
                  className="about-video"
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="about-overlay" />
              </div>
              <div className="about-content">
                <p className="about-kicker">{slide.kicker}</p>
                <h2 id={`${slide.id}-title`} className="about-title">
                  {slide.title}
                </h2>
                <p className="about-description">{slide.description}</p>
                <p className="about-detail">{slide.detail}</p>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
