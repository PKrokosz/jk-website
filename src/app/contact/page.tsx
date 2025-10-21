import Image from "next/image";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Umów konsultację w pracowni JK Handmade Footwear. Skontaktuj się z nami telefonicznie, mailowo lub przez formularz."
};

export default function ContactPage() {
  return (
    <main className="page contact-page" aria-labelledby="contact-heading">
      <section className="section hero hero--immersive contact-hero" aria-labelledby="contact-heading">
        <div className="hero__background" aria-hidden="true">
          <div className="hero__background-image">
            <Image
              src="/image/models/12.jfif"
              alt=""
              fill
              sizes="(max-width: 1024px) 140vw, 100vw"
              priority
            />
          </div>
          <div className="hero__background-overlay" />
        </div>
        <div className="container hero__layout">
          <div className="hero__intro">
            <p className="eyebrow">Warszawska pracownia bespoke</p>
            <h1 id="contact-heading">Skontaktuj się z mistrzem</h1>
            <p className="lead">
              Opowiedz nam o swojej wizji obuwia i scenariuszu LARP. Odpowiemy z terminem konsultacji oraz rekomendacją
              personalizacji.
            </p>
            <p>
              Spotkania prowadzimy w pracowni oraz online. Zadzwoń, napisz lub umów się przez formularz — wrócimy z
              konkretnymi krokami zamówienia.
            </p>
            <dl className="contact-info contact-info--hero" aria-label="Sposoby kontaktu">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:pracownia@jk-footwear.pl">pracownia@jk-footwear.pl</a>
                </dd>
              </div>
              <div>
                <dt>Telefon</dt>
                <dd>
                  <a href="tel:+48555123456">+48 555 123 456</a>
                </dd>
              </div>
            </dl>
            <div className="hero__actions">
              <a className="button button--primary" href="#contact-form">
                Wyślij wiadomość
              </a>
              <a className="button button--ghost" href="tel:+48555123456">
                Zadzwoń do nas
              </a>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__glow" />
            <div className="contact-hero__card" aria-labelledby="contact-details-heading">
              <h2 id="contact-details-heading">Godziny i lokalizacja</h2>
              <p className="contact-hero__summary">
                Mistrz szycia czeka na Ciebie w sercu Warszawy. Uprzedź nas o wizycie, a przygotujemy próbki skór i modele z
                katalogu.
              </p>
              <dl className="contact-hero__details">
                <div>
                  <dt>Adres pracowni</dt>
                  <dd>ul. Mirowska 12/3, Warszawa</dd>
                </div>
                <div>
                  <dt>Godziny konsultacji</dt>
                  <dd>
                    <ul>
                      <li>Poniedziałek – Piątek: 10:00 – 18:00</li>
                      <li>Sobota: 10:00 – 14:00</li>
                      <li>Niedziela: zamknięte</li>
                    </ul>
                  </dd>
                </div>
              </dl>
              <div className="contact-hero__socials" aria-label="Profile społecznościowe">
                <a href="https://instagram.com/jkfootwear" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href="https://facebook.com/jkfootwear" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-form" className="section contact-form-section" aria-labelledby="contact-form-heading">
        <div className="container contact-layout">
          <div className="contact-panel">
            <h2 id="contact-form-heading">Wyślij wiadomość</h2>
            <p className="lead">
              Opisz wydarzenie, styl ubioru i preferowany termin odbioru. Odezwiesz się – my zaproponujemy rozwiązanie.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
