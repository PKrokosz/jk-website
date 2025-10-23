import "dotenv/config";

import { sql } from "drizzle-orm";

import { createDbClient, type Database } from "./lib/db";
import { leather, option, productTemplate, sole, style } from "./schema";
import {
  referenceLeathers,
  referenceOptions,
  referenceProductTemplates,
  referenceSoles,
  referenceStyles
} from "./seed-data";

const baseStyles = referenceStyles.map(({ id: _id, description, ...styleSeed }) => ({
  ...styleSeed,
  descriptionMd: description
})) satisfies (typeof style.$inferInsert)[];

const baseLeathers = referenceLeathers.map(({ id: _id, ...leatherSeed }) => leatherSeed) satisfies (
  typeof leather.$inferInsert
)[];

const baseSoles = referenceSoles.map(({ id: _id, ...soleSeed }) => soleSeed) satisfies (
  typeof sole.$inferInsert
)[];

const baseOptions = referenceOptions.map(({ id: _id, ...optionSeed }) => optionSeed) satisfies (
  typeof option.$inferInsert
)[];

const baseProductTemplates = referenceProductTemplates.map(
  ({ description, orderReference, ...template }) => ({
    templateId: template.templateId,
    slug: template.slug,
    name: template.name,
    styleId: template.styleId,
    leatherId: template.leatherId,
    descriptionMd: description,
    highlight: template.highlight,
    galleryImages: [...template.galleryImages],
    galleryCaptions: [...template.galleryCaptions],
    variantLeatherIds: [...template.variantLeatherIds],
    sizes: [...template.sizes],
    craftProcess: [...template.craftProcess],
    seo: {
      title: template.seo.title,
      description: template.seo.description,
      keywords: [...template.seo.keywords]
    },
    category: template.category,
    funnelStage: template.funnelStage,
    orderReference: orderReference ?? null,
    priceOverrideGrosz: template.priceOverrideGrosz
  })
) satisfies (typeof productTemplate.$inferInsert)[];

async function seedReferenceData(database: Database) {
  console.info("🔄 Resetting reference tables...");

  await database.transaction(async (trx) => {
    await trx.execute(sql`TRUNCATE TABLE "product_template" RESTART IDENTITY CASCADE;`);
    await trx.execute(sql`TRUNCATE TABLE "option" RESTART IDENTITY CASCADE;`);
    await trx.execute(sql`TRUNCATE TABLE "sole" RESTART IDENTITY CASCADE;`);
    await trx.execute(sql`TRUNCATE TABLE "leather" RESTART IDENTITY CASCADE;`);
    await trx.execute(sql`TRUNCATE TABLE "style" RESTART IDENTITY CASCADE;`);

    await trx.insert(style).values(baseStyles);
    await trx.insert(leather).values(baseLeathers);
    await trx.insert(sole).values(baseSoles);
    await trx.insert(option).values(baseOptions);
    await trx.insert(productTemplate).values(baseProductTemplates);
  });

  console.info("✅ Reference tables seeded");
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL must be defined to run the seed script."
    );
  }

  const { db, pool } = createDbClient(connectionString);

  try {
    await seedReferenceData(db);
  } catch (error) {
    console.error("❌ Seeding failed", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
