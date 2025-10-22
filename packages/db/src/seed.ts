import { sql } from "drizzle-orm";

import { db, pool } from "./lib/db";
import { leather, option, sole, style } from "./schema";
import {
  referenceLeathers,
  referenceOptions,
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

async function seedReferenceData() {
  console.info("🔄 Resetting reference tables...");

  await db.transaction(async (trx) => {
    await trx.execute(sql`TRUNCATE TABLE "option" RESTART IDENTITY CASCADE;`);
    await trx.execute(sql`TRUNCATE TABLE "sole" RESTART IDENTITY CASCADE;`);
    await trx.execute(sql`TRUNCATE TABLE "leather" RESTART IDENTITY CASCADE;`);
    await trx.execute(sql`TRUNCATE TABLE "style" RESTART IDENTITY CASCADE;`);

    await trx.insert(style).values(baseStyles);
    await trx.insert(leather).values(baseLeathers);
    await trx.insert(sole).values(baseSoles);
    await trx.insert(option).values(baseOptions);
  });

  console.info("✅ Reference tables seeded");
}

async function main() {
  try {
    await seedReferenceData();
  } catch (error) {
    console.error("❌ Seeding failed", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
