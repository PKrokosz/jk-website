import { expect, test } from "@playwright/test";

test.describe("Flow zamówienia natywnego", () => {
  test("użytkownik przechodzi z modala zamówienia do koszyka z poprawną walidacją", async ({ page }) => {
    const homeResponse = await page.goto("/");
    expect(homeResponse?.status(), "Status odpowiedzi dla strony głównej").toBe(200);

    const orderButton = page.getByRole("button", { name: "Zamów buty" });
    await orderButton.click();

    const dialog = page.getByRole("dialog", { name: "Złóż zamówienie online" });
    await expect(dialog).toBeVisible();

    const ctaLink = dialog.getByRole("link", { name: "Przejdź do formularza" });
    await expect(ctaLink).toHaveAttribute("href", "/order/native");

    await Promise.all([
      page.waitForURL(/\/order\/native$/),
      ctaLink.click()
    ]);

    const nativeResponse = await page.request.get("/order/native");
    expect(nativeResponse.status(), "Status odpowiedzi dla /order/native").toBe(200);

    const heading = page.getByRole("heading", { level: 1, name: /Zamów parę szytą w naszej pracowni/i });
    await expect(heading).toBeVisible();

    const fullNameField = page.getByLabel("Imię i nazwisko");
    await expect(fullNameField).toBeEmpty();

    const submitButton = page.getByRole("button", { name: "Przejdź do koszyka" });
    const errorMessage = page.locator("#fullName-error");

    await submitButton.click();
    await expect(errorMessage).toHaveText("Wpisz imię i nazwisko, aby kontynuować.");

    await fullNameField.fill("Jan Kowalski");
    await expect(errorMessage).toBeEmpty();

    await Promise.all([
      page.waitForURL(/\/order\/cart\?name=Jan\+Kowalski/),
      submitButton.click()
    ]);

    const cartResponse = await page.request.get("/order/cart");
    expect(cartResponse.status(), "Status odpowiedzi dla /order/cart").toBe(200);

    const cartHeading = page.getByRole("heading", { level: 1, name: "Twoja konfiguracja jest gotowa do finalizacji" });
    await expect(cartHeading).toBeVisible();
    await expect(page.getByText(/Dziękujemy, Jan Kowalski\./)).toBeVisible();
    await expect(page.getByLabel("Imię i nazwisko")).toHaveValue("Jan Kowalski");
  });
});
