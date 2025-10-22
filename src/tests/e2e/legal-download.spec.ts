import { expect, test } from "@playwright/test";

type LegalDocumentScenario = {
  name: string;
  path: string;
  apiPath: string;
  expectedFilename: string;
};

const documents: LegalDocumentScenario[] = [
  {
    name: "polityki prywatności",
    path: "/privacy-policy",
    apiPath: "/api/legal/privacy-policy",
    expectedFilename: "jk-polityka-prywatnosci.pdf"
  },
  {
    name: "regulaminu",
    path: "/terms",
    apiPath: "/api/legal/terms",
    expectedFilename: "jk-regulamin.pdf"
  }
];

test.describe("Pobieranie dokumentów prawnych", () => {
  for (const { name, path, apiPath, expectedFilename } of documents) {
    test(`powinno umożliwiać pobranie pliku PDF (${path})`, async ({ page }) => {
      await page.goto(path);

      const downloadLink = page.getByRole("link", { name: "Pobierz wersję PDF" });
      await expect(downloadLink).toBeVisible();

      const downloadPromise = page.waitForEvent("download");

      await downloadLink.click();

      const download = await downloadPromise;

      expect(new URL(download.url()).pathname).toBe(apiPath);

      const response = await page.request.get(apiPath);

      expect(response.status(), "Status odpowiedzi").toBe(200);

      const headers = response.headers();
      expect(headers["content-type"]).toContain("application/pdf");
      expect(headers["content-disposition"]).toContain(`filename="${expectedFilename}"`);

      expect(download.suggestedFilename()).toBe(expectedFilename);

      // Opcjonalna weryfikacja, że URL odpowiada oczekiwanemu endpointowi.
      expect(new URL(response.url()).pathname).toBe(apiPath);
    });
  }
});
