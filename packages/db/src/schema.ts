import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb
} from "drizzle-orm/pg-core";

/** Słowniki */
export const style = pgTable("style", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  basePriceGrosz: integer("base_price_grosz").notNull(),
  era: text("era"),                          // np. "13th", "15th"
  descriptionMd: text("description_md"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const leather = pgTable("leather", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),              // np. Veg-tan, Pull-up
  color: text("color").notNull(),            // np. Brown
  finish: text("finish"),                    // np. Matte, Waxed
  description: text("description"),
  priceModGrosz: integer("price_mod_grosz").default(0),
  active: boolean("active").default(true)
});

export const sole = pgTable("sole", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),              // leather | dainite | rubber | wood
  material: text("material"),
  color: text("color"),
  priceModGrosz: integer("price_mod_grosz").default(0),
  active: boolean("active").default(true)
});

export const option = pgTable("option", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull(),              // toe-cap | broguing | buckle | lacing | etc.
  label: text("label").notNull(),
  priceModGrosz: integer("price_mod_grosz").default(0),
  active: boolean("active").default(true)
});

export const productTemplate = pgTable("product_template", {
  id: serial("id").primaryKey(),
  templateId: text("template_id").notNull().unique(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  styleId: integer("style_id")
    .notNull()
    .references(() => style.id),
  leatherId: integer("leather_id")
    .notNull()
    .references(() => leather.id),
  descriptionMd: text("description_md").notNull(),
  highlight: text("highlight").notNull(),
  galleryImages: jsonb("gallery_images").$type<string[]>().notNull(),
  galleryCaptions: jsonb("gallery_captions").$type<string[]>().notNull(),
  variantLeatherIds: jsonb("variant_leather_ids").$type<number[]>().notNull(),
  sizes: jsonb("sizes").$type<number[]>().notNull(),
  craftProcess: jsonb("craft_process").$type<string[]>().notNull(),
  seo: jsonb("seo").$type<{
    title: string;
    description: string;
    keywords: string[];
  }>().notNull(),
  category: text("category").notNull(),
  funnelStage: text("funnel_stage").notNull(),
  orderReference: jsonb("order_reference").$type<
    | {
        type: "model" | "accessory" | "service";
        id: string;
        label: string;
      }
    | null
  >(),
  priceOverrideGrosz: integer("price_override_grosz")
});

/** Klient + pomiary */
export const customer = pgTable("customer", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow()
});

export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  footLengthMmLeft: integer("foot_length_mm_left"),
  footLengthMmRight: integer("foot_length_mm_right"),
  footWidthMmLeft: integer("foot_width_mm_left"),
  footWidthMmRight: integer("foot_width_mm_right"),
  ankleCircMmLeft: integer("ankle_circ_mm_left"),
  ankleCircMmRight: integer("ankle_circ_mm_right"),
  calfCircMmLeft: integer("calf_circ_mm_left"),
  calfCircMmRight: integer("calf_circ_mm_right"),
  notes: text("notes")
});

/** Zamówienie */
export const order = pgTable("order", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),           // np. JK-2025-0001
  customerId: integer("customer_id").notNull(),
  styleId: integer("style_id").notNull(),
  leatherId: integer("leather_id").notNull(),
  soleId: integer("sole_id").notNull(),
  measurementsId: integer("measurements_id"),
  size: integer("size"),                                // EU
  width: text("width"),                                 // N/D/E/EE (opcjonalnie)
  status: text("status").default("pending"),            // pending | confirmed | in-progress | shipped | completed
  optionsJson: jsonb("options_json").$type<number[]>(), // lista option.id (MVP: JSON; później: order_option)
  photosJson: jsonb("photos_json").$type<string[]>(),   // linki do inspiracji/reference
  notes: text("notes"),
  totalsJson: jsonb("totals_json"),                     // breakdown ceny
  acceptTerms: boolean("accept_terms").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

/** Logi zapytań o wycenę */
export const quoteRequest = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  quote: jsonb("quote").$type<Record<string, unknown>>().notNull(),
  requestedAt: timestamp("requested_at").defaultNow().notNull()
});
