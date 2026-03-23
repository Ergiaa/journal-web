CREATE TABLE "crawl_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar(255) NOT NULL,
	"source" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"papers_found" integer DEFAULT 0 NOT NULL,
	"papers_inserted" integer DEFAULT 0 NOT NULL,
	"papers_skipped" integer DEFAULT 0 NOT NULL,
	"errors" jsonb,
	"duration_ms" integer,
	"options" jsonb
);
--> statement-breakpoint
CREATE INDEX "crawl_history_source_idx" ON "crawl_history" USING btree ("source");--> statement-breakpoint
CREATE INDEX "crawl_history_started_at_idx" ON "crawl_history" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "crawl_history_status_idx" ON "crawl_history" USING btree ("status");--> statement-breakpoint
ALTER TABLE "papers" ADD CONSTRAINT "papers_doi_unique" UNIQUE("doi");