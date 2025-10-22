import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer" aria-labelledby="site-footer-heading">
      <div className="container site-footer__container">
        <div className="site-footer__legal">
          <p id="site-footer-heading">© 2025 JK Handmade Footwear. Wszelkie prawa zastrzeżone.</p>
          <nav className="site-footer__links" aria-label="Dokumenty i regulaminy">
            <Link href="/privacy-policy">Polityka prywatności</Link>
            <span aria-hidden="true">•</span>
            <Link href="/terms">Regulamin sklepu</Link>
          </nav>
        </div>
        <address className="site-footer__address">
          <p>JK Handmade Footwear – Pracownia Butów Na Miarę</p>
          <p>ul. Miedziana 12, Warszawa</p>
          <p>NIP: 525-000-00-00 | REGON: 012345678</p>
        </address>
      </div>
    </footer>
  );
}
