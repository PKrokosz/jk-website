import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NativeModelShowcase } from "../NativeModelShowcase";
import { ORDER_MODELS } from "@/config/orderModels";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  )
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...rest }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} {...rest} />
  )
}));

describe("NativeModelShowcase", () => {
  it("renderuje listę modeli z poprawnym formatowaniem ceny i CTA", () => {
    render(<NativeModelShowcase />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Modele z formularza natywnego" })
    ).toBeInTheDocument();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(ORDER_MODELS.length);

    const firstModel = ORDER_MODELS[0];
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
    const expectedPrice = new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 2
    }).format(firstModel.price);
    const expectedDetail = firstModel.googleValue.replace(/-\s*(\d)/, " – $1");
    const firstCard = within(items[0]);
    expect(firstCard.getByRole("heading", { level: 3, name: firstModel.name })).toBeVisible();
    expect(
      firstCard.getByRole("img", {
        name: `Model ${firstModel.name} z katalogu JK Handmade Footwear`,
        hidden: true
      })
    ).toHaveAttribute("src", firstModel.image);
    expect(
      firstCard.getByText((content) => normalize(content) === normalize(expectedPrice))
    ).toBeInTheDocument();
    expect(
      firstCard.getByText((content) => normalize(content) === normalize(expectedDetail))
    ).toBeInTheDocument();

    const cta = screen.getByRole("link", { name: "Przejdź do zamówienia natywnego" });
    expect(cta).toHaveAttribute("href", "/order/native");
  });
});
