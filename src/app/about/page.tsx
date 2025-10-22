import Link from "next/link";
import type { Metadata } from "next";

import { AboutCarousel, type AboutSlide } from "./about-carousel";

export const metadata: Metadata = {
  title: "O pracowni"
};

const slides: AboutSlide[] = [
  {
    id: "atelier",
    kicker: "Rozmowa z mistrzem",
    title: "Każda para zaczyna się od spotkania",
    description:
      "Zanim sięgniemy po kopyto, słuchamy historii i oczekiwań osoby zamawiającej. Konsultacja wyznacza kierunek całego projektu.",
    detail:
      "Spotkanie w pracowni lub online pozwala ustalić przeznaczenie obuwia, styl oraz termin odbioru. Dopiero wtedy przechodzimy do miar.",
    video: "/vid/1.mp4"
  },
  {
    id: "materials",
    kicker: "Materiały i detale",
    title: "Naturalne skóry garbowane roślinnie",
    description:
      "Pracujemy wyłącznie na skórach, które znamy z wizyt w garbarniach. Dzięki temu wiemy, jak zachowają się po latach użytkowania.",
    detail:
      "Każdą partię selekcjonujemy ręcznie, testując elastyczność i nasycenie pigmentu. Dobieramy nici, podpodeszwy i dodatki pod konkretny projekt.",
    video: "/vid/2.mp4"
  },
  {
    id: "craft",
    kicker: "Proces rzemieślniczy",
    title: "Każdy szew wykonujemy ręcznie",
    description:
      "Od modelowania kopyta po finalne polerowanie buty powstają w jednym miejscu. Jeden mistrz odpowiada za całą parę.",
    detail:
      "Stosujemy klasyczne techniki szycia pasowego, woskowane krawędzie i ręczne wykończenie, aby buty służyły latami.",
    video: "/vid/4.mp4"
  },
  {
    id: "legacy",
    kicker: "Efekt końcowy",
    title: "Obuwie, które nabiera charakteru razem z Tobą",
    description:
      "Nie produkujemy serii. Każda para jest projektowana pod konkretną osobę, styl życia i wydarzenia, w których bierze udział.",
    detail:
      "Otrzymujesz buty przygotowane do renowacji i pielęgnacji. Z czasem nabierają patyny i opowiadają Twoją historię.",
    video: "/vid/7.mp4"
  }
];

export default function AboutPage() {
  return (
    <main className="page about-page" aria-labelledby="about-heading">
      <header className="about-hero" aria-labelledby="about-heading">
        <div className="container about-hero__content">
          <p className="eyebrow">Poznaj JK Handmade Footwear</p>
          <h1 id="about-heading">Rzemiosło, które trwa dłużej niż moda.</h1>
          <p className="lead">
            W naszej warszawskiej pracowni tworzymy buty, które łączą dawną technikę z nowoczesną precyzją.
          </p>
        </div>
      </header>

      <section className="section about-story" aria-labelledby="about-story-heading">
        <div className="container about-story__container">
          <div className="about-story__intro">
            <h2 id="about-story-heading">Historia naszej pracowni</h2>
            <p>
              JK Handmade Footwear to pracownia, w której każde zamówienie zaczyna się od rozmowy, a kończy parą butów skrojonych dokładnie na Ciebie.
            </p>
            <p>
              Używamy naturalnych skór garbowanych roślinnie, ręcznie szytych pasów i klasycznych kopyt. Każdy szew, każdy detal ma znaczenie.
            </p>
            <p>
              Nie produkujemy serii. Tworzymy pojedyncze egzemplarze – tak, by służyły latami i nabierały charakteru razem z właścicielem.
            </p>
            <p>
              Nasz warsztat to połączenie tradycji mistrzów szewskich i nowoczesnego designu. Tu powstaje obuwie, które nie tylko wygląda, ale też opowiada historię – Twoją.
            </p>
          </div>
        </div>
      </section>

      <AboutCarousel slides={slides} />

      <section className="section about-cta" aria-labelledby="about-cta-heading">
        <div className="container">
          <h2 id="about-cta-heading" className="visually-hidden">
            Kolejne kroki po zapoznaniu się z pracownią
          </h2>
          <nav className="page-navigation about-navigation" aria-label="Kolejne kroki po sekcji o pracowni">
            <Link className="button button--primary" href="/contact">
              Umów wizytę w pracowni
            </Link>
            <Link className="button button--ghost" href="/catalog">
              Przeglądaj katalog modeli
            </Link>
            <Link className="button button--ghost" href="/order/native">
              Złóż zamówienie
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
