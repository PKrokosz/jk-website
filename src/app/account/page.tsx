import type { Metadata } from "next";

import { AccountRegisterForm } from "./components/AccountRegisterForm";
import { AccountLoginForm } from "./components/AccountLoginForm";
import { OrderHistoryList } from "./components/OrderHistoryList";
import { NewsletterSignupForm } from "./components/NewsletterSignupForm";

export const metadata: Metadata = {
  title: "Moje konto",
  description:
    "Zarejestruj konto klienta JK Handmade Footwear, śledź historię zamówień i zapisz się na newsletter pracowni."
};

export default function AccountPage() {
  return (
    <main className="page account-page" aria-labelledby="account-heading">
      <section className="section account-hero" aria-labelledby="account-heading">
        <div className="container account-hero__layout">
          <div className="account-hero__intro">
            <p className="eyebrow">Panel klienta JK Handmade Footwear</p>
            <h1 id="account-heading">Twoje konto i historia zamówień</h1>
            <p className="lead">
              Załóż konto, zaloguj się i sprawdzaj status swoich butów bespoke. Tutaj zapisz się również na newsletter z nowościami
              pracowni.
            </p>
            <p>
              Panel pozwala śledzić każdy etap zamówienia — od pobrania miary po gotowość do odbioru. Przygotowaliśmy także
              skrzynkę z poradnikami pielęgnacyjnymi oraz zaproszeniami na warsztaty.
            </p>
          </div>
          <aside className="account-hero__summary" aria-label="Korzyści z założenia konta">
            <ul>
              <li>Historia zamówień z komentarzami mistrza rzemiosła.</li>
              <li>Alerty o terminach przymiarek i odbioru.</li>
              <li>Wcześniejszy dostęp do warsztatów i premier modeli.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section account-section" aria-labelledby="register-heading">
        <div className="container account-layout">
          <div className="account-panel">
            <h2 id="register-heading">Załóż konto klienta</h2>
            <p className="lead">
              Utwórz profil, abyśmy mogli zapamiętać Twoje pomiary i ulubione wykończenia. Po rejestracji zaprosimy Cię do panelu
              z indywidualnym kalendarzem.
            </p>
            <AccountRegisterForm />
          </div>

          <div className="account-panel account-panel--secondary" aria-labelledby="login-heading">
            <h2 id="login-heading">Masz już konto? Zaloguj się</h2>
            <p>
              Dostaniesz dostęp do aktualnych etapów zamówienia, rekomendacji konserwacji i materiałów dla Twojego scenariusza.
            </p>
            <AccountLoginForm />
          </div>
        </div>
      </section>

      <section className="section account-section" aria-labelledby="history-heading" id="order-history">
        <div className="container account-panel">
          <h2 id="history-heading">Historia Twoich zamówień</h2>
          <p className="lead">
            Poniżej znajdziesz przykładowe zamówienia. W docelowej wersji po zalogowaniu pokażemy Twoje projekty wraz z notatkami
            z warsztatu, zdjęciami i rekomendacjami pielęgnacji.
          </p>
          <OrderHistoryList />
        </div>
      </section>

      <section className="section account-section" aria-labelledby="newsletter-heading">
        <div className="container account-panel">
          <h2 id="newsletter-heading">Dołącz do newslettera pracowni</h2>
          <p>
            Newsletter wysyłamy raz w miesiącu. Znajdziesz w nim zaproszenia na konsultacje, premiery nowych modeli oraz wskazówki
            dotyczące pielęgnacji obuwia bespoke.
          </p>
          <NewsletterSignupForm />
        </div>
      </section>
    </main>
  );
}
