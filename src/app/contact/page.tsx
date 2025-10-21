import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Umów konsultację w pracowni JK Handmade Footwear. Skontaktuj się z nami telefonicznie, mailowo lub przez formularz."
};

export default function ContactPage() {
  return (
    <main className="page" aria-labelledby="contact-heading">
      <section className="section section--muted" aria-labelledby="contact-heading">
        <div className="container">
          <div className="section-header">
            <p className="section-header__kicker">Warszawska pracownia bespoke</p>
            <h1 id="contact-heading">Skontaktuj się z mistrzem</h1>
            <p>
              Opowiedz nam o swojej wizji obuwia. Odpowiemy z propozycją terminu konsultacji oraz sugerowanym zakresem
              personalizacji.
            </p>
          </div>
          <dl className="contact-info" aria-label="Sposoby kontaktu">
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
            <div>
              <dt>Adres pracowni</dt>
              <dd>ul. Mirowska 12/3, Warszawa</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="contact-form-heading">
        <div className="container contact-layout">
          <div>
            <h2 id="contact-form-heading">Wyślij wiadomość</h2>
            <p className="lead">
              Opisz wydarzenie, styl ubioru i preferowany termin odbioru. Odezwiesz się – my zaproponujemy rozwiązanie.
            </p>
            <ContactForm />
          </div>

          <aside className="contact-sidebar" aria-labelledby="contact-details-heading">
            <h2 id="contact-details-heading">Godziny konsultacji</h2>
            <p className="lead">Spotkania prowadzimy w pracowni oraz online po wcześniejszym umówieniu.</p>
            <ul>
              <li>Poniedziałek – Piątek: 10:00 – 18:00</li>
              <li>Sobota: 10:00 – 14:00</li>
              <li>Niedziela: zamknięte</li>
            </ul>
            <h3>Sociale</h3>
            <ul>
              <li>
                <a href="https://instagram.com/jkfootwear" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com/jkfootwear" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
