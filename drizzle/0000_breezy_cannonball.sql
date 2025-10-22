CREATE TABLE "customer" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"phone" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leather" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"finish" text,
	"price_mod_grosz" integer DEFAULT 0,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "measurements" (
	"id" serial PRIMARY KEY NOT NULL,
	"foot_length_mm_left" integer,
	"foot_length_mm_right" integer,
	"foot_width_mm_left" integer,
	"foot_width_mm_right" integer,
	"ankle_circ_mm_left" integer,
	"ankle_circ_mm_right" integer,
	"calf_circ_mm_left" integer,
	"calf_circ_mm_right" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "option" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"label" text NOT NULL,
	"price_mod_grosz" integer DEFAULT 0,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"customer_id" integer NOT NULL,
	"style_id" integer NOT NULL,
	"leather_id" integer NOT NULL,
	"sole_id" integer NOT NULL,
	"measurements_id" integer,
	"size" integer,
	"width" text,
	"status" text DEFAULT 'pending',
	"options_json" jsonb,
	"photos_json" jsonb,
	"notes" text,
	"totals_json" jsonb,
	"accept_terms" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "order_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "sole" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"material" text,
	"color" text,
	"price_mod_grosz" integer DEFAULT 0,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "style" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"base_price_grosz" integer NOT NULL,
	"era" text,
	"description_md" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "style_slug_unique" UNIQUE("slug")
);
