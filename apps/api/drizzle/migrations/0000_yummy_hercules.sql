CREATE TABLE "papers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"abstract" text,
	"authors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"published_at" timestamp with time zone,
	"journal" varchar(255),
	"doi" varchar(255),
	"keywords" jsonb,
	"source_url" text NOT NULL,
	"source" varchar(100),
	"source_id" varchar(255),
	"citation_count" integer DEFAULT 0 NOT NULL,
	"embedding_stored" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "journal_idx" ON "papers" USING btree ("journal");--> statement-breakpoint
CREATE INDEX "published_at_idx" ON "papers" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "source_idx" ON "papers" USING btree ("source");--> statement-breakpoint
CREATE INDEX "embedding_stored_idx" ON "papers" USING btree ("embedding_stored");