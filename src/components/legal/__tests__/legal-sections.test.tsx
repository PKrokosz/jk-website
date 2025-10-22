import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LegalSections } from "../legal-sections";

describe("LegalSections", () => {
  it("renders headings, paragraphs and inline links", () => {
    const sections = [
      {
        id: "legal-intro",
        title: "1. Zakres dokumentu",
        blocks: [
          {
            type: "paragraph" as const,
            content: [
              { type: "text" as const, text: "Niniejszy dokument określa zasady korzystania z serwisu." },
              { type: "link" as const, text: "Pobierz PDF", href: "/api/legal/terms" }
            ]
          }
        ]
      },
      {
        id: "legal-list",
        title: "2. Kluczowe definicje",
        blocks: [
          {
            type: "list" as const,
            variant: "unordered" as const,
            items: [
              [{ type: "text" as const, text: "\"Użytkownik\" – osoba korzystająca z serwisu." }],
              [{ type: "strong" as const, text: "\"Operator\"" }, { type: "text" as const, text: " – JK Handmade Footwear." }]
            ]
          }
        ]
      }
    ];

    render(<LegalSections sections={sections} />);

    expect(screen.getByRole("heading", { name: "1. Zakres dokumentu" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2. Kluczowe definicje" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pobierz PDF" })).toHaveAttribute("href", "/api/legal/terms");
    expect(screen.getByText(/Użytkownik/)).toBeInTheDocument();
    expect(screen.getByText(/Operator/).tagName).toBe("STRONG");
  });
});
