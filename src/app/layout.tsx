import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "../components/Header";
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
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JK Handmade Footwear — Buty miarowe z Warszawy",
    description:
      "Umów konsultację i poznaj proces zamówienia obuwia miarowego w JK Handmade Footwear.",
    creator: "@jkfootwear"
  },
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body className="site-body">
        <Header />
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
