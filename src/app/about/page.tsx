import Link from "next/link";
import type { Metadata } from "next";

import { AboutCarousel, type AboutSlide } from "./about-carousel";

export const metadata: Metadata = {
  title: "O pracowni"
};

const slides: AboutSlide[] = [
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
    <main className="page about-page" aria-labelledby="about-heading">
      <header className="about-hero" aria-labelledby="about-heading">
        <div className="container about-hero__content">
          <p className="eyebrow">Poznaj JK Handmade Footwear</p>
          <h1 id="about-heading">O pracowni JK Handmade Footwear</h1>
          <p className="lead">
            Od rekonstrukcji historycznych po współczesne produkcje filmowe — od lat rozwijamy warsztat,
            który prowadzi Cię przez cały proces tworzenia butów bespoke.
          </p>
          <p>
            Przejdź przez kolejne etapy naszego rzemiosła, a następnie wybierz ścieżkę: katalog modeli,
            formularz zamówień lub bezpośrednią konsultację z mistrzem.
          </p>
        </div>
      </header>

      <AboutCarousel slides={slides} />

      <div className="container">
        <nav className="page-navigation about-navigation" aria-label="Kolejne kroki po sekcji o pracowni">
          <Link className="button button--primary" href="/catalog">
            Przeglądaj katalog modeli
          </Link>
          <Link className="button button--ghost" href="/order/native">
            Złóż zamówienie natywne
          </Link>
          <Link className="button button--ghost" href="/contact">
            Umów konsultację
          </Link>
        </nav>
      </div>
    </main>
  );
}
