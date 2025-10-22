import type { Metadata } from "next";
import React, { type ReactNode } from "react";

import { Header } from "../components/Header";
import { AnalyticsConsentGate } from "@/components/analytics/AnalyticsConsentGate";
import { Footer } from "../components/Footer";
import { AppProviders } from "./providers";
import { MarketingScriptsManager } from "../components/MarketingScriptsManager";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jk-footwear.pl"),
  title: {
    default: "JK Handmade Footwear — Buty miarowe z Warszawy",
    template: "%s | JK Handmade Footwear"
  },
  description:
    "JK Handmade Footwear tworzy miarowe obuwie w warszawskiej pracowni. Transparentny proces MTO, ręczne wykończenia i wsparcie na każdym etapie.",
  keywords: [
    "buty miarowe",
    "warsztat szewski",
    "made to order",
    "obuwie na wymiar",
    "Warszawa"
  ],
  openGraph: {
    title: "JK Handmade Footwear — Buty miarowe z Warszawy",
    description:
      "Warszawski warsztat JK Handmade Footwear prowadzi przez kompletny proces made-to-order: konsultację, pomiary, szycie i odbiór.",
    url: "https://jk-footwear.pl",
    siteName: "JK Handmade Footwear",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "https://jk-footwear.pl/image/models/10.jfif",
        width: 1200,
        height: 900,
        alt: "Model Obieżyświat szyty w JK Handmade Footwear"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JK Handmade Footwear — Buty miarowe z Warszawy",
    description:
      "Umów konsultację i poznaj proces zamówienia obuwia miarowego w JK Handmade Footwear.",
    creator: "@jkfootwear",
    images: ["https://jk-footwear.pl/image/models/10.jfif"]
  },
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/favicon.svg"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body className="site-body">
        <MarketingScriptsManager />
        <AppProviders>
          <a className="skip-link" href="#main-content">
            Przejdź do głównej treści
          </a>
          <Header />
          <div className="site-content" id="main-content">
            {children}
          </div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
