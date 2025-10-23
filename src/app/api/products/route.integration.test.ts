import { NextRequest } from "next/server";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it
} from "vitest";

import { catalogProductDetailResponseSchema, catalogProductListResponseSchema } from "@/lib/catalog/schemas";
import { findActiveStyles } from "@/lib/catalog/repository";
import {
  closeIntegrationTestClient,
  ensureIntegrationTestMigrations,
  getIntegrationTestClient,
  loadIntegrationTestEnv,
  resetCachedNextDbClient
} from "@/tests/integration/db";
import { eq } from "@jk/db";
import { leather, style } from "@jk/db/schema";

import { GET } from "./route";

const TEST_STYLE_SLUG = "artisan-oxford";
const TEST_LEATHER_NAME = "Kasztanowa licowa";
const TEST_PRODUCT_SLUG = "szpic";

async function ensureIntegrationDatabaseAvailability(): Promise<{
  available: boolean;
  reason?: string;
}> {
  try {
    loadIntegrationTestEnv();
  } catch (error) {
    return {
      available: false,
      reason:
        "Pomijam testy integracyjne — nie udało się załadować konfiguracji .env.test."
    };
  }

  try {
    const client = getIntegrationTestClient();
    const connection = await client.pool.connect();
    connection.release();
    return { available: true };
  } catch (error) {
    await closeIntegrationTestClient().catch(() => {});
    const details = formatIntegrationConnectionError(error);
    const recoveryHint =
      "Uruchom `docker compose up -d jkdb` oraz zweryfikuj konfigurację `.env.test`.";
    return {
      available: false,
      reason: `Pomijam testy integracyjne — brak połączenia z bazą danych (${details}). ${recoveryHint}`
    };
  }
}

function formatIntegrationConnectionError(error: unknown): string {
  if (error instanceof AggregateError) {
    const messages = Array.from(
      new Set(
        error.errors
          .map((entry) => {
            if (entry instanceof Error) {
              return entry.message.trim();
            }
            return String(entry).trim();
          })
          .filter((message) => message.length > 0)
      )
    );

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return String(error);
}

const { available: integrationDbAvailable, reason: integrationSkipReason } =
  await ensureIntegrationDatabaseAvailability();

if (integrationSkipReason) {
  console.warn(integrationSkipReason);
}

const describeIntegration = integrationDbAvailable ? describe : describe.skip;

describeIntegration("GET /api/products (integration)", () => {
  let originalBasePrice: number;
  let originalActive: boolean;
  let leatherPriceMod: number;

  beforeAll(async () => {
    loadIntegrationTestEnv();
    await ensureIntegrationTestMigrations();

    const { db } = getIntegrationTestClient();
    const [styleRow] = await db
      .select()
      .from(style)
      .where(eq(style.slug, TEST_STYLE_SLUG))
      .limit(1);

    if (!styleRow) {
      throw new Error(`Style with slug ${TEST_STYLE_SLUG} not found in integration database.`);
    }

    originalBasePrice = styleRow.basePriceGrosz;
    originalActive = styleRow.active ?? true;

    const [leatherRow] = await db
      .select()
      .from(leather)
      .where(eq(leather.name, TEST_LEATHER_NAME))
      .limit(1);

    leatherPriceMod = leatherRow?.priceModGrosz ?? 0;
  });

  beforeEach(async () => {
    await resetCachedNextDbClient();
  });

  afterEach(async () => {
    const { db } = getIntegrationTestClient();

    await db
      .update(style)
      .set({ basePriceGrosz: originalBasePrice, active: originalActive })
      .where(eq(style.slug, TEST_STYLE_SLUG));

    await resetCachedNextDbClient();
  });

  afterAll(async () => {
    await closeIntegrationTestClient();
    await resetCachedNextDbClient();
  });

  it("calculates product pricing using live database values", async () => {
    const updatedBasePrice = originalBasePrice + 50_000;
    const { db } = getIntegrationTestClient();

    await db
      .update(style)
      .set({ basePriceGrosz: updatedBasePrice })
      .where(eq(style.slug, TEST_STYLE_SLUG));

    const request = new NextRequest(
      `https://jkhandmade.pl/api/products?slug=${TEST_PRODUCT_SLUG}`
    );
    const response = await GET(request);

    expect(response.status).toBe(200);

    const detailPayload = catalogProductDetailResponseSchema.parse(await response.json());

    expect(detailPayload.data.priceGrosz).toBe(updatedBasePrice + leatherPriceMod);

    const listResponse = await GET(new NextRequest("https://jkhandmade.pl/api/products"));
    expect(listResponse.status).toBe(200);

    const listPayload = catalogProductListResponseSchema.parse(await listResponse.json());
    const updatedProduct = listPayload.data.find((product) => product.slug === TEST_PRODUCT_SLUG);

    expect(updatedProduct?.priceGrosz).toBe(updatedBasePrice + leatherPriceMod);
  });

  it("returns only active styles when querying repository with database client", async () => {
    const { db } = getIntegrationTestClient();

    await db
      .update(style)
      .set({ active: false })
      .where(eq(style.slug, TEST_STYLE_SLUG));

    const styles = await findActiveStyles(db);

    expect(styles.some((entry) => entry.slug === TEST_STYLE_SLUG)).toBe(false);
  });
});
