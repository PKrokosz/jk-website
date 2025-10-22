import { expect, test } from "@playwright/test";

type PageScenario = {
  path: string;
  heading: RegExp;
};

const pageScenarios: PageScenario[] = [
  {
    path: "/",
    heading: /Rzemieślnicze buty LARP/i,
  },
  {
    path: "/catalog",
    heading: /Katalog/i,
  },
  {
    path: "/about",
    heading: /Rzemiosło, które trwa dłużej niż moda/i,
  },
  {
    path: "/contact",
    heading: /Umów konsultację w JK Handmade Footwear/i,
  },
  {
    path: "/order/native",
    heading: /Zamów parę szytą w naszej pracowni/i,
  },
  {
    path: "/group-orders",
    heading: /Współpracujmy przy zamówieniach grupowych/i,
  },
];

test.describe("Nawigacja kluczowych stron", () => {
  for (const { path, heading } of pageScenarios) {
    test(`renderuje stronę ${path} z nagłówkiem H1`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `Status odpowiedzi dla ${path}`).toBe(200);

      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toContainText(heading);
    });
  }

  test("globalna nawigacja prowadzi do głównych sekcji", async ({ page }) => {
    await page.goto("/");

    const navigationLinks = [
      { name: "Katalog", href: "/catalog" },
      { name: "O nas", href: "/about" },
      { name: "Kontakt", href: "/contact" },
      { name: "Zamówienie", href: "/order" },
    ];

    for (const { name, href } of navigationLinks) {
      const link = page.getByRole("link", { name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    }
  });

  test("API katalogu zwraca dane referencyjne", async ({ request }) => {
    const endpoints = ["/api/products", "/api/styles", "/api/leather"];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status(), `Status dla ${endpoint}`).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("data");
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
    }
  });
});
