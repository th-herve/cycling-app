-- +goose Up
-- +goose StatementBegin
CREATE TYPE "classifications" AS ENUM (
  'flat',
  'tt',
  'ttt',
  'prologue',
  'hilly',
  'medium_mountain',
  'high_mountain'
);

CREATE TYPE "genders" AS ENUM (
  'men',
  'women'
);

CREATE TYPE "distance_units" AS ENUM (
  'km',
  'mi'
);

CREATE TYPE "event_types" AS ENUM (
  'race',
  'stage'
);

CREATE TYPE "result_types" AS ENUM (
  -- stage results
  'stage_general',
  'stage_mountain',
  'stage_point',
  'stage_young',
  'stage_team',

  -- overall after a stage
  'overall_general',
  'overall_mountain',
  'overall_point',
  'overall_young',
  'overall_team',

  -- final results
  'general',
  'mountain',
  'point',
  'young',
  'team'
);

CREATE TYPE "result_status" AS ENUM (
  'DNF',
  'DNS',
  'OTL'
);

CREATE TYPE "event_status" AS ENUM (
  'canceled',
  'finished',
  'postponed',
  'not_started',
  'on_going'
);

CREATE TYPE "uci_ranking_types" AS ENUM (
  'individual',
  'team',
  'nation'
);

CREATE TYPE "country_regions" AS ENUM (
  'Europe',
  'Africa',
  'Americas',
  'Oceania',
  'Asia'
);

CREATE TABLE IF NOT EXISTS "seasons" (
  "id" UUID PRIMARY KEY,
  "year" SMALLINT NOT NULL,
  "gender" genders NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "event_series" (
  "id" UUID PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "events" (
  "id" UUID PRIMARY KEY,
  "event_series_id" UUID,
  "parent_event_id" UUID,
  "category_id" UUID,
  "season_id" UUID NOT NULL,
  "classification" classifications,
  "type" event_types NOT NULL,
  "status" event_status NOT NULL,
  "name" VARCHAR NOT NULL,
  "start" TIMESTAMPTZ NOT NULL,
  "end" TIMESTAMPTZ,
  "departure_city" VARCHAR,
  "arrival_city" VARCHAR,
  "distance" DOUBLE PRECISION,
  "distance_unit" distance_units,
  "is_single_day" BOOLEAN NOT NULL,
  "country_code" VARCHAR,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "discipline_id" UUID NOT NULL,
  "code" VARCHAR NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "disciplines" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "code" VARCHAR,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "riders" (
  "id" UUID PRIMARY KEY,
  "first_name" VARCHAR NOT NULL,
  "last_name" VARCHAR NOT NULL,
  "birth_date" DATE,
  "gender" genders NOT NULL,
  "nationality" VARCHAR,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "countries" (
  "alpha_3_code" VARCHAR(3) PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "alpha_2_code" VARCHAR(2),
  "numeric_code" VARCHAR(3),
  "ioc_code" VARCHAR(3),
  "region" country_regions,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "team_categories" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "code" VARCHAR NOT NULL,
  "discipline_id" UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS "teams" (
  "id" UUID PRIMARY KEY,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "team_season" (
  "id" UUID PRIMARY KEY,
  "team_id" UUID NOT NULL,
  "season_id" UUID NOT NULL,
  "team_category_id" UUID NOT NULL,
  "name" VARCHAR NOT NULL,
  "abbreviation" VARCHAR NOT NULL,
  "country_code" VARCHAR,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "team_rosters" (
  "team_season_id" UUID,
  "rider_id" UUID,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,
  PRIMARY KEY ("team_season_id", "rider_id")
);

CREATE TABLE IF NOT EXISTS "results" (
  "id" UUID PRIMARY KEY,
  "type" result_types NOT NULL,
  "event_id" UUID NOT NULL,
  "rider_id" UUID,
  "team_season_id" UUID,
  "rank" SMALLINT,
  "status" result_status,
  "time_seconds" INTEGER,
  "points" SMALLINT,
  "uci_points" SMALLINT,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "uci_rankings" (
  "id" UUID PRIMARY KEY,
  "season_id" UUID NOT NULL,
  "discipline_id" UUID NOT NULL,
  "rider_id" UUID,
  "team_id" UUID,
  "nation_code" VARCHAR,
  "type" uci_ranking_types NOT NULL DEFAULT 'individual',
  "rank" SMALLINT NOT NULL,
  "points" INT NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "event_teams" (
  "event_id" UUID,
  "team_season_id" UUID,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,
  PRIMARY KEY ("event_id", "team_season_id")
);

CREATE TABLE IF NOT EXISTS "event_riders" (
  "event_id" UUID,
  "rider_id" UUID,
  "team_season_id" UUID,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,
  PRIMARY KEY ("event_id", "rider_id")
);

CREATE UNIQUE INDEX "idx_seasons_year_gender" ON "seasons" ("year", "gender");

CREATE INDEX "idx_events_season_id" ON "events" ("season_id");

CREATE INDEX "idx_events_parent_event_id" ON "events" ("parent_event_id");

CREATE INDEX "idx_events_event_series_id" ON "events" ("event_series_id");

CREATE UNIQUE INDEX "uniq_rider_identity" ON "riders" ("first_name", "last_name", "birth_date", "gender");

CREATE UNIQUE INDEX ON "team_season" ("team_id", "season_id");

CREATE INDEX "idx_results_event_id" ON "results" ("event_id");

CREATE INDEX "idx_results_rider_id" ON "results" ("rider_id");

CREATE UNIQUE INDEX ON "uci_rankings" ("season_id", "discipline_id", "rider_id");

CREATE INDEX "idx_uci_rankings_season_id" ON "uci_rankings" ("season_id");

CREATE INDEX "idx_event_team_event_id" ON "event_teams" ("event_id");

CREATE INDEX "idx_event_team_team_season_id" ON "event_teams" ("team_season_id");

CREATE INDEX "idx_event_rider_event_id" ON "event_riders" ("event_id");

CREATE INDEX "idx_event_rider_rider_id" ON "event_riders" ("rider_id");

COMMENT ON TABLE "event_series" IS 'id to group recurring event together ex: tour de france 2025, 2024, 2023... handle the fact that the name can change over the year (ex: GP plouay)';

COMMENT ON COLUMN "events"."type" IS 'race for one day event and tour or stage';

COMMENT ON COLUMN "disciplines"."name" IS 'road, cx, mtb, track...';

COMMENT ON COLUMN "riders"."nationality" IS 'FK of coutries.code';

COMMENT ON COLUMN "countries"."ioc_code" IS 'Olympic code used by some org, e.g. NED, FRA, USA';

COMMENT ON TABLE "team_categories" IS 'world tour, pro tour...';

COMMENT ON COLUMN "results"."type" IS 'influence which field ''time_second'' or ''points'' to use (unused one should be null)';

COMMENT ON COLUMN "results"."time_seconds" IS 'used for time based result depending on the result''s type';

COMMENT ON COLUMN "results"."points" IS 'used for points based result depending on the result''s type';

COMMENT ON COLUMN "results"."uci_points" IS 'uci point attributed for this result';

COMMENT ON TABLE "uci_rankings" IS 'Depending on the type, either the rider, team or nation id should be used';

ALTER TABLE "categories" ADD CONSTRAINT "fk_category_discipline_id" FOREIGN KEY ("discipline_id") REFERENCES "disciplines" ("id") ON DELETE CASCADE;

ALTER TABLE "results" ADD CONSTRAINT "fk_result_event" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE;

ALTER TABLE "results" ADD CONSTRAINT "fk_result_rider" FOREIGN KEY ("rider_id") REFERENCES "riders" ("id") ON DELETE SET NULL;

ALTER TABLE "results" ADD CONSTRAINT "fk_result_team" FOREIGN KEY ("team_season_id") REFERENCES "team_season" ("id") ON DELETE SET NULL;

ALTER TABLE "uci_rankings" ADD CONSTRAINT "fk_uci_rankings_season" FOREIGN KEY ("season_id") REFERENCES "seasons" ("id") ON DELETE CASCADE;

ALTER TABLE "uci_rankings" ADD CONSTRAINT "fk_uci_rankings_rider" FOREIGN KEY ("rider_id") REFERENCES "riders" ("id") ON DELETE CASCADE;

ALTER TABLE "uci_rankings" ADD CONSTRAINT "fk_uci_rankings_discipline_id" FOREIGN KEY ("discipline_id") REFERENCES "disciplines" ("id") ON DELETE CASCADE;

ALTER TABLE "team_rosters" ADD CONSTRAINT "fk_team_roster_teamseason" FOREIGN KEY ("team_season_id") REFERENCES "team_season" ("id") ON DELETE CASCADE;

ALTER TABLE "team_rosters" ADD CONSTRAINT "fk_team_rosters_rider" FOREIGN KEY ("rider_id") REFERENCES "riders" ("id") ON DELETE CASCADE;

ALTER TABLE "team_season" ADD CONSTRAINT "fk_teamseason_team" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE CASCADE;

ALTER TABLE "team_season" ADD CONSTRAINT "fk_teamseason_season" FOREIGN KEY ("season_id") REFERENCES "seasons" ("id") ON DELETE CASCADE;

ALTER TABLE "team_season" ADD CONSTRAINT "fk_teamseason_country" FOREIGN KEY ("country_code") REFERENCES "countries" ("alpha_3_code") ON DELETE SET NULL;

ALTER TABLE "team_season" ADD CONSTRAINT "fk_teamseason_category" FOREIGN KEY ("team_category_id") REFERENCES "team_categories" ("id") ON DELETE CASCADE;

ALTER TABLE "events" ADD CONSTRAINT "fk_event_country" FOREIGN KEY ("country_code") REFERENCES "countries" ("alpha_3_code") ON DELETE SET NULL;

ALTER TABLE "riders" ADD CONSTRAINT "fk_riders_country" FOREIGN KEY ("nationality") REFERENCES "countries" ("alpha_3_code") ON DELETE SET NULL;

ALTER TABLE "events" ADD CONSTRAINT "fk_event_season" FOREIGN KEY ("season_id") REFERENCES "seasons" ("id") ON DELETE CASCADE;

ALTER TABLE "events" ADD CONSTRAINT "fk_event_category" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE SET NULL;

ALTER TABLE "events" ADD CONSTRAINT "fk_stage_event" FOREIGN KEY ("parent_event_id") REFERENCES "events" ("id") ON DELETE CASCADE;

ALTER TABLE "events" ADD CONSTRAINT "fk_event_event_series" FOREIGN KEY ("event_series_id") REFERENCES "event_series" ("id") ON DELETE CASCADE;

ALTER TABLE "event_teams" ADD CONSTRAINT "fk_event_teams_event_id" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE;

ALTER TABLE "event_teams" ADD CONSTRAINT "fk_event_teams_team_season_id" FOREIGN KEY ("team_season_id") REFERENCES "team_season" ("id") ON DELETE CASCADE;

ALTER TABLE "event_riders" ADD CONSTRAINT "fk_event_riders_event_id" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE;

ALTER TABLE "event_riders" ADD CONSTRAINT "fk_event_riders_rider_id" FOREIGN KEY ("rider_id") REFERENCES "riders" ("id") ON DELETE CASCADE;

ALTER TABLE "event_riders" ADD CONSTRAINT "fk_event_riders_teamseason_id" FOREIGN KEY ("team_season_id") REFERENCES "team_season" ("id") ON DELETE SET NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS uci_rankings;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS event_riders;
DROP TABLE IF EXISTS event_teams;
DROP TABLE IF EXISTS team_rosters;
DROP TABLE IF EXISTS team_season;
DROP TABLE IF EXISTS team_categories;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS riders;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS disciplines;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS event_series;
DROP TABLE IF EXISTS seasons;


DROP TYPE IF EXISTS classifications;
DROP TYPE IF EXISTS genders;
DROP TYPE IF EXISTS distance_units;
DROP TYPE IF EXISTS event_types;
DROP TYPE IF EXISTS result_types;
DROP TYPE IF EXISTS result_status;
DROP TYPE IF EXISTS event_status;
DROP TYPE IF EXISTS uci_ranking_types;
DROP TYPE IF EXISTS country_regions;
-- +goose StatementEnd
