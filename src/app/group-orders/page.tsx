import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zamówienia grupowe i współpraca",
  description:
    "Poznaj ofertę zamówień grupowych JK Handmade Footwear. Zorganizuj obuwie dla oddziału, drużyny lub eventu i skontaktuj się z nami, aby ustalić szczegóły współpracy.",
};

const partnershipHighlights = [
  {
    title: "Personalizowane projekty",
    description:
      "Dopasowujemy modele do barw i heraldyki Twojej drużyny. Otrzymasz dedykowane próbki skór, zdobień i badge'y oddziału.",
  },
  {
    title: "Wsparcie logistyczne",
    description:
      "Koordynujemy pobieranie miar, harmonogram produkcji oraz wysyłki, aby każdy członek oddziału otrzymał gotowy komplet na czas.",
  },
  {
    title: "Dedykowana opiekunka projektu",
    description:
      "Jedna osoba kontaktowa prowadzi zamówienie od briefu po odbiór. Zapewnia transparentne wyceny i statusy prac.",
  },
] as const;

const orderSteps = [
  {
    title: "Opowiedz o wydarzeniu",
    description: "Przygotuj listę potrzeb oddziału: styl, liczba uczestników, termin oraz zakres personalizacji.",
  },
  {
    title: "Dobierzemy wzornik",
    description: "Spotykamy się stacjonarnie lub online, prezentujemy propozycje modeli i potwierdzamy budżet projektu.",
  },
  {
    title: "Start produkcji",
    description: "Po akceptacji harmonogramu szyjemy serie w sprintach i raportujemy postęp w uzgodnionych checkpointach.",
  },
] as const;

export default function GroupOrdersPage() {
  return (
    <main className="page group-orders-page" aria-labelledby="group-orders-heading">
      <section className="section hero hero--immersive group-orders-hero" aria-labelledby="group-orders-heading">
        <div className="hero__background" aria-hidden="true">
          <div className="hero__background-image">
            <Image src="/image/models/15.jfif" alt="" fill sizes="(max-width: 1024px) 140vw, 100vw" priority />
          </div>
          <div className="hero__background-overlay" />
        </div>
        <div className="container hero__layout">
          <div className="hero__intro">
            <p className="eyebrow">Program zamówień dla zespołów</p>
            <h1 id="group-orders-heading">Współpracujmy przy zamówieniach grupowych</h1>
            <p className="lead">
              Tworzymy obuwie bespoke dla oddziałów wojskowych, drużyn rekonstrukcyjnych i ekip eventowych. Zaprojektujemy wspólny
              wygląd, który podkreśli charakter Waszej formacji.
            </p>
            <p>
              Zbierz potrzeby zespołu, a my przygotujemy warianty modeli, harmonogram pobrań miar i wycenę dla całej grupy.
              Zadbamy o personalizację, logistykę i opiekę posprzedażową.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="mailto:pracownia@jk-footwear.pl?subject=Zam%C3%B3wienie%20grupowe">
                Napisz do nas
              </a>
              <a className="button button--ghost" href="/contact#contact-form">
                Złóż brief online
              </a>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__glow" />
            <div className="group-orders-card" aria-labelledby="group-orders-details-heading">
              <h2 id="group-orders-details-heading">Dlaczego warto współpracować?</h2>
              <ul className="group-orders-card__list">
                {partnershipHighlights.map((highlight) => (
                  <li key={highlight.title}>
                    <h3>{highlight.title}</h3>
                    <p>{highlight.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section group-orders-process" aria-labelledby="group-orders-process-heading">
        <div className="container">
          <header className="section__header">
            <p className="eyebrow">Jak współpracujemy</p>
            <h2 id="group-orders-process-heading">Trzy kroki do seryjnego zamówienia bespoke</h2>
            <p className="lead">
              Przeprowadzimy Cię przez proces od pierwszego szkicu po dostawę. Każdy etap kończymy krótkim raportem i checklistą
              zatwierdzeń.
            </p>
          </header>

          <ol className="group-orders-step-list" aria-label="Etapy realizacji zamówienia grupowego">
            {orderSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section group-orders-cta" aria-labelledby="group-orders-cta-heading">
        <div className="container">
          <div className="group-orders-cta-panel">
            <h2 id="group-orders-cta-heading">Umów konsultację dla swojego oddziału</h2>
            <p>
              Wyślij krótką wiadomość z liczbą osób, zakresem wydarzenia i oczekiwanym terminem dostawy. Przygotujemy dedykowaną
              ofertę i zaplanujemy spotkanie w pracowni lub online.
            </p>
            <div className="group-orders-cta-panel__actions">
              <a className="button button--primary" href="mailto:pracownia@jk-footwear.pl?subject=Brief%20wsp%C3%B3%C5%82pracy">
                Skontaktuj się z nami
              </a>
              <a className="button button--ghost" href="tel:+48555123456">
                Zadzwoń do opiekuna projektu
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
