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
              alt="Skórzane buty męskie typu derby szyte ręcznie w warszawskiej pracowni JK Handmade."
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
            <h1 id="contact-heading">Umów konsultację w JK Handmade Footwear</h1>
            <p className="lead">
              Opowiedz nam o projekcie, wydarzeniu i oczekiwanym terminie. Odpowiemy z propozycją konsultacji oraz listą kroków do zamówienia.
            </p>
            <p>
              Przyjmujemy w pracowni i online. Zadzwoń, napisz lub zostaw wiadomość przez formularz — odezwiemy się z rekomendacją dopasowaną do Twojego projektu.
            </p>
            <dl className="contact-info contact-info--hero" aria-label="Sposoby kontaktu">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:kontakt@jkhandmade.pl">kontakt@jkhandmade.pl</a>
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
                Uprzedź nas o wizycie, a przygotujemy próbki skór, kopyta i wybrane modele z katalogu.
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
                      <li>Poniedziałek – Piątek: 10:00–18:00 (po wcześniejszym umówieniu)</li>
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

      <section className="section contact-workshop" aria-labelledby="contact-workshop-heading">
        <div className="container contact-workshop__container">
          <div className="contact-workshop__content">
            <h2 id="contact-workshop-heading">Odwiedź nasz warsztat</h2>
            <p>
              Pracownia mieści się w Warszawie, w spokojnej okolicy, gdzie zapach skóry miesza się z aromatem wosku i kawy.
            </p>
            <p>
              Tu obejrzysz próbki skór, dopasujesz kopyta i zobaczysz, jak powstają Twoje buty – krok po kroku.
            </p>
            <dl className="contact-workshop__hours" aria-label="Godziny przyjęć">
              <div>
                <dt>Godziny przyjęć</dt>
                <dd>pon.–pt. 10:00–18:00 (po wcześniejszym umówieniu)</dd>
              </div>
            </dl>
            <div className="contact-workshop__reasons" aria-label="Dlaczego warto wpaść">
              <h3>Dlaczego warto wpaść:</h3>
              <ul>
                <li>zobaczysz rzemiosło z bliska</li>
                <li>omówisz projekt z mistrzem</li>
                <li>przymierzysz próbne formy</li>
                <li>otrzymasz wstępną wycenę i termin realizacji</li>
              </ul>
            </div>
            <a className="button button--primary" href="#contact-form">
              Umów konsultację
            </a>
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
