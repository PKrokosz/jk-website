import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";

import { ContactForm } from "../contact/ContactForm";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

const mockedUseSearchParams = useSearchParams as unknown as Mock;

function createSearchParams(query: string): ReadonlyURLSearchParams {
  return new URLSearchParams(query) as unknown as ReadonlyURLSearchParams;
}

describe("ContactForm product prefill", () => {
  let currentSearchParams: ReadonlyURLSearchParams;

  const setSearchParams = (query: string) => {
    currentSearchParams = createSearchParams(query);
    mockedUseSearchParams.mockImplementation(() => currentSearchParams);
  };

  beforeEach(() => {
    setSearchParams("");
  });

  afterEach(() => {
    mockedUseSearchParams.mockReset();
  });

  it("prefills the product field when query param is provided", () => {
    setSearchParams("product=Oxford%20No.8");

    render(<ContactForm />);

    expect(
      screen.getByLabelText(/Model lub referencja \(opcjonalnie\)/i)
    ).toHaveValue("Oxford No.8");
  });

  it("renders an empty product field when query param is missing", () => {
    setSearchParams("");

    render(<ContactForm />);

    expect(
      screen.getByLabelText(/Model lub referencja \(opcjonalnie\)/i)
    ).toHaveValue("");
  });

  it("allows overriding the prefilled product value", () => {
    setSearchParams("product=Oxford%20No.8");

    render(<ContactForm />);

    const input = screen.getByLabelText(
      /Model lub referencja \(opcjonalnie\)/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Custom projekt" } });

    expect(input).toHaveValue("Custom projekt");
  });

  it("clears the product field when the query param is removed", () => {
    setSearchParams("product=Oxford%20No.8");

    const { rerender } = render(<ContactForm />);

    const input = screen.getByLabelText(
      /Model lub referencja \(opcjonalnie\)/i
    ) as HTMLInputElement;

    expect(input).toHaveValue("Oxford No.8");

    act(() => {
      setSearchParams("");
      rerender(<ContactForm />);
    });

    expect(input).toHaveValue("");
  });

  it("keeps the user-entered value when the query param is removed", () => {
    setSearchParams("product=Oxford%20No.8");

    const { rerender } = render(<ContactForm />);

    const input = screen.getByLabelText(
      /Model lub referencja \(opcjonalnie\)/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Custom projekt" } });

    act(() => {
      setSearchParams("");
      rerender(<ContactForm />);
    });

    expect(input).toHaveValue("Custom projekt");
  });
});

