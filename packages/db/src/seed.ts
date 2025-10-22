import { sql } from "drizzle-orm";

import { db, pool } from "./lib/db";
import { leather, option, sole, style } from "./schema";

const baseStyles = [
  {
    slug: "courtly-riding-boot",
    name: "Courtly Riding Boot",
    era: "15th century",
    descriptionMd:
      "Wysokie buty jeździeckie z dopasowaną cholewką i delikatnym zdobieniem inspirowanym dworskimi freskami.",
    basePriceGrosz: 289_000
  },
  {
    slug: "artisan-oxford",
    name: "Artisan Oxford",
    era: "Early modern",
    descriptionMd:
      "Szykowny fason wiązany inspirowany obuwiem cechów rzemieślniczych, z subtelną perforacją na nosku.",
    basePriceGrosz: 259_000
  },
  {
    slug: "pilgrim-field-boot",
    name: "Pilgrim Field Boot",
    era: "13th century",
    descriptionMd:
      "Wytrzymałe trzewiki terenowe o podwyższonym profilu, stworzone z myślą o długich wędrówkach.",
    basePriceGrosz: 274_000
  },
  {
    slug: "guild-monk",
    name: "Guild Monk Shoe",
    era: "Late medieval",
    descriptionMd:
      "Wsuwane obuwie z pojedynczą klamrą, hołd dla wczesnych modeli butów cechowych mistrzów szewstwa.",
    basePriceGrosz: 248_000
  },
  {
    slug: "workshop-essentials",
    name: "Warsztatowe dodatki",
    era: "Pracownia JK",
    descriptionMd:
      "Linia akcesoriów, bukłaków i usług pielęgnacyjnych dostępnych jako uzupełnienie zamówienia natywnego.",
    basePriceGrosz: 0
  }
] satisfies (typeof style.$inferInsert)[];

const baseLeathers = [
  {
    name: "Kasztanowa licowa",
    color: "Kasztan",
    finish: "Matowa",
    priceModGrosz: 18_000
  },
  {
    name: "Bursztynowy pull-up",
    color: "Miód",
    finish: "Woskowana",
    priceModGrosz: 24_000
  },
  {
    name: "Obsydianowa cielęca",
    color: "Heban",
    finish: "Polerowana",
    priceModGrosz: 32_000
  },
  {
    name: "Wrzoścowy nubuk",
    color: "Mech",
    finish: "Miękka",
    priceModGrosz: 12_000
  },
  {
    name: "Warsztatowy mix",
    color: "Neutralny",
    finish: "Techniczna",
    priceModGrosz: 0
  }
] satisfies (typeof leather.$inferInsert)[];

const baseSoles = [
  {
    type: "leather",
    material: "Vegetable-tanned leather",
    color: "Natural",
    priceModGrosz: 12_000
  },
  {
    type: "dainite",
    material: "Rubber",
    color: "Black",
    priceModGrosz: 8_000
  },
  {
    type: "wood",
    material: "Oak",
    color: "Amber",
    priceModGrosz: 15_000
  }
] satisfies (typeof sole.$inferInsert)[];

const baseOptions = [
  {
    kind: "toe-cap",
    label: "Wzmocniony nosek",
    priceModGrosz: 25_000
  },
  {
    kind: "buckle",
    label: "Mosiężna klamra",
    priceModGrosz: 18_000
  },
  {
    kind: "lining",
    label: "Filcowa podszewka",
    priceModGrosz: 10_000
  },
  {
    kind: "laces",
    label: "Rzemienie 120 cm",
    priceModGrosz: 4_000
  }
] satisfies (typeof option.$inferInsert)[];

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
