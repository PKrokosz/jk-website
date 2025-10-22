import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NewsletterSignupForm } from "../NewsletterSignupForm";

describe("NewsletterSignupForm", () => {
  it("subscribes the visitor to the newsletter", async () => {
    render(<NewsletterSignupForm />);

    fireEvent.change(screen.getByLabelText("Adres e-mail"), { target: { value: "osoba@example.com" } });
    fireEvent.change(screen.getByLabelText("Najbardziej interesują mnie"), {
      target: { value: "workshop" }
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: /Wyrażam zgodę na przesyłanie newslettera/i })
    );

    fireEvent.click(screen.getByRole("button", { name: "Zapisz się" }));

    expect(
      await screen.findByText(/Witamy w newsletterze! Najbliższa wysyłka zawiera zaproszenie na konsultacje online/i)
    ).toBeInTheDocument();
  });

  it("requires consent before subscribing", async () => {
    render(<NewsletterSignupForm />);

    fireEvent.change(screen.getByLabelText("Adres e-mail"), { target: { value: "osoba@example.com" } });

    fireEvent.click(screen.getByRole("button", { name: "Zapisz się" }));

    expect(await screen.findByText("Potrzebujemy zgody, aby wysyłać Ci newsletter.")).toBeInTheDocument();
  });
});
