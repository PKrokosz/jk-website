import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactForm } from "../contact/ContactForm";

describe("ContactForm product prefill", () => {
  it("prefills the product field when query param is provided", () => {
    render(<ContactForm initialProduct="Oxford No.8" />);

    expect(
      screen.getByLabelText(/Model lub referencja \(opcjonalnie\)/i)
    ).toHaveValue("Oxford No.8");
  });

  it("renders an empty product field when query param is missing", () => {
    render(<ContactForm />);

    expect(
      screen.getByLabelText(/Model lub referencja \(opcjonalnie\)/i)
    ).toHaveValue("");
  });

  it("allows overriding the prefilled product value", () => {
    render(<ContactForm initialProduct="Oxford No.8" />);

    const input = screen.getByLabelText(
      /Model lub referencja \(opcjonalnie\)/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Custom projekt" } });

    expect(input).toHaveValue("Custom projekt");
  });

  it("keeps the manual override until the prop changes", () => {
    const { rerender } = render(<ContactForm initialProduct="Oxford No.8" />);

    const input = screen.getByLabelText(
      /Model lub referencja \(opcjonalnie\)/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "" } });

    expect(input).toHaveValue("");

    rerender(<ContactForm initialProduct="Oxford No.8" />);

    expect(input).toHaveValue("");
  });

  it("updates the value when the initial product changes", () => {
    const { rerender } = render(<ContactForm initialProduct="Oxford No.8" />);

    const input = screen.getByLabelText(
      /Model lub referencja \(opcjonalnie\)/i
    ) as HTMLInputElement;

    expect(input).toHaveValue("Oxford No.8");

    rerender(<ContactForm initialProduct="Derby Classic" />);

    expect(input).toHaveValue("Derby Classic");
  });
});

