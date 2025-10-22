CREATE TABLE IF NOT EXISTS "quote_requests" (
    "id" serial PRIMARY KEY,
    "ip_address" text NOT NULL,
    "user_agent" text,
    "payload" jsonb NOT NULL,
    "quote" jsonb NOT NULL,
    "requested_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "quote_requests_ip_requested_at_idx"
  ON "quote_requests" ("ip_address", "requested_at");
