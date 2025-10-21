import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "JK Made-to-Order",
  description: "Crafted footwear tailored to every client."
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
