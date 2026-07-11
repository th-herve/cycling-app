-- +goose Up
-- +goose StatementBegin

-- Classification for the stages.
CREATE TYPE "classifications" AS ENUM (
  'flat',
  'tt',
  'ttt',
  'prologue',
  'hilly',
  'medium_mountain',
  'high_mountain'
);


-- 
CREATE TYPE "genders" AS ENUM (
  'men',
  'women'
);


-- Distance units for the distances.
CREATE TYPE "distance_units" AS ENUM (
  'km',
  'mi'
);


-- Type for an event.
-- race: for one day event, or multiday main event
-- stage: for multiday events's stages
-- ex: tour de france = race (main event), tour de france stage 1 = stage (stage 1 of a main event)
CREATE TYPE "event_types" AS ENUM (
  'race',
  'stage'
);


-- Possible type of results.
-- stage_*: result for one stage
-- overall_*: standing result after a stage
-- other: final result
CREATE TYPE "result_types" AS ENUM (
  'stage_general',
  'stage_mountain',
  'stage_point',
  'stage_young',
  'stage_team',
  'overall_general',
  'overall_mountain',
  'overall_point',
  'overall_young',
  'overall_team',
  'general',
  'mountain',
  'point',
  'young',
  'team'
);


-- Special status for result.
-- DNF: Did Not Finish
-- DNS: Did Not Start
-- OTL: Outside Time Limit
-- DSQ: Disqualified
CREATE TYPE "result_status" AS ENUM (
  'DNF',
  'DNS',
  'OTL',
  'DSQ'
);


-- Status of an event.
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


CREATE TABLE "countries" (
  "alpha_3_code" VARCHAR(3) PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "alpha_2_code" VARCHAR(2),
  "numeric_code" VARCHAR(3),
  "ioc_code" VARCHAR(3),
  "region" country_regions,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

COMMENT ON COLUMN "countries"."ioc_code" IS 'Olympic code used by some org.';


CREATE TABLE "seasons" (
  "year" SMALLINT NOT NULL,
  "gender" genders NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  PRIMARY KEY ("year", "gender")
);


-- Group event together across season.
-- ex: tour de france 2024, 2025...
-- Usefull to track event that change name (ex: GP Plouay->Bretagne classique).
CREATE TABLE "event_series" (
  "id" UUID PRIMARY KEY,
  "slug" varchar,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

CREATE UNIQUE INDEX ON "event_series" ("slug");
COMMENT ON TABLE "event_series" IS 'Id to group recurring event together ex: tour de france 2025, 2024, 2023... Handle the fact that the name can change over the year (ex: GP plouay).';


-- Road, bmx...
CREATE TABLE "disciplines" (
  "code" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

COMMENT ON COLUMN "disciplines"."name" IS 'road, cx, mtb, track...';


-- 1.UWT, 2.UWT...
CREATE TABLE "categories" (
  "code" varchar PRIMARY KEY,
  "discipline_code" varchar NOT NULL,
  "name" VARCHAR NOT NULL,
  "gender" genders,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  FOREIGN KEY ("discipline_code") REFERENCES disciplines("code")
);


CREATE TABLE "events" (
  "id" UUID PRIMARY KEY,
  "event_series_id" UUID,
  "parent_event_id" UUID,
  "category_code" varchar,
  "season_year" smallint NOT NULL,
  "season_gender" genders NOT NULL,
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
  "country_code" VARCHAR(3),
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  FOREIGN KEY ("parent_event_id") REFERENCES events("id") ON DELETE CASCADE,
  FOREIGN KEY("event_series_id") REFERENCES event_series("id") ON DELETE CASCADE,
  FOREIGN KEY("category_code") REFERENCES categories("code"),
  FOREIGN KEY ("season_year", "season_gender") REFERENCES seasons("year", "gender") ON DELETE CASCADE,
  FOREIGN KEY("country_code") REFERENCES countries("alpha_3_code"),

  CONSTRAINT CHK_event_end_null_or_sup_equal_start CHECK ( "end" is null OR "end" >= "start" ),
  CONSTRAINT CHK_event_type_correct CHECK (
    (type = 'stage' AND is_single_day = true AND parent_event_id IS NOT NULL)
    OR
    (type = 'race' AND parent_event_id IS NULL)
  )
);

CREATE INDEX "idx_events_season" ON "events" ("season_year", "season_gender");
CREATE INDEX "idx_events_parent_event_id" ON "events" ("parent_event_id");
CREATE INDEX "idx_events_event_series_id" ON "events" ("event_series_id");

COMMENT ON COLUMN "events"."type" IS 'Race for one day event and main multistage event, stage for stage of multiday races. (ex: tour de france = race because main event. And tour de france stage 1 = stage)';


CREATE TABLE "riders" (
  "id" UUID PRIMARY KEY,
  "first_name" VARCHAR NOT NULL,
  "last_name" VARCHAR NOT NULL,
  "birth_date" DATE,
  "gender" genders NOT NULL,
  "nationality" VARCHAR(3),
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  FOREIGN KEY("nationality") REFERENCES countries("alpha_3_code")
);

CREATE UNIQUE INDEX "uniq_rider_identity" ON "riders" ("first_name", "last_name", "nationality", "birth_date");


-- World tour, Pro tour...
CREATE TABLE "team_categories" (
  "code" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "discipline_code" varchar NOT NULL,
  "gender" genders,

  FOREIGN KEY("discipline_code") REFERENCES disciplines("code")
);

COMMENT ON TABLE "team_categories" IS 'World tour, Pro tour...';


-- Group team together across season.
-- Ex: Visma 2024, 2025...
-- The "name" here is a helper and should not be used in the app. Use "team_seasons"."name" to get the real name.
CREATE TABLE "teams" (
  "id" UUID PRIMARY KEY,
  "name" varchar,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ
);

COMMENT ON COLUMN "teams"."name" IS 'This is only a helper to identify what team it references. Use team_seasons.name for the actual name.';


-- Instance of a team for one season.
CREATE TABLE "team_seasons" (
  "id" UUID PRIMARY KEY,
  "team_id" UUID NOT NULL,
  "season_year" smallint NOT NULL,
  "season_gender" genders NOT NULL,
  "team_category_code" varchar NOT NULL,
  "name" VARCHAR NOT NULL,
  "abbreviation" VARCHAR NOT NULL,
  "country_code" VARCHAR(3),
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  FOREIGN KEY("team_id") REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY("season_year", "season_gender") REFERENCES seasons("year", "gender") ON DELETE CASCADE,
  FOREIGN KEY("team_category_code") REFERENCES team_categories("code"),
  FOREIGN KEY("country_code") REFERENCES countries("alpha_3_code")
);

CREATE UNIQUE INDEX ON "team_seasons" ("name", "season_year", "season_gender", "team_category_code");



-- Team roster for one season.
CREATE TABLE "team_rosters" (
  "team_season_id" UUID,
  "rider_id" UUID,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  PRIMARY KEY ("team_season_id", "rider_id"),
  FOREIGN KEY("team_season_id") REFERENCES team_seasons("id") ON DELETE CASCADE,
  FOREIGN KEY("rider_id") REFERENCES riders("id") ON DELETE CASCADE
);


-- Result for an event.
-- Can be for a rider or team depending on the type or if it's for a TTT.
-- This can be determine from the event it's link to or if a rider id is present or not.
-- The team_id can be for either the rider's team, or the team result if it's for a TTT or team result.
CREATE TABLE "results" (
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
  "updated_at" TIMESTAMPTZ,

  FOREIGN KEY("event_id") REFERENCES events("id") ON DELETE CASCADE,
  FOREIGN KEY("rider_id") REFERENCES riders("id") ON DELETE CASCADE,
  FOREIGN KEY("team_season_id") REFERENCES team_seasons("id") ON DELETE CASCADE,

  -- If there is no rank, it must mean a special status is applied.
  CONSTRAINT CHK_result_status_or_rank_not_null CHECK (
    status IS NOT NULL
    OR rank IS NOT NULL
  )
);

CREATE INDEX "idx_results_event_id" ON "results" ("event_id");
CREATE INDEX "idx_results_rider_id" ON "results" ("rider_id");

COMMENT ON COLUMN "results"."type" IS 'Influence which field ''time_second'' or ''points'' to use (unused one should be null).';
COMMENT ON COLUMN "results"."time_seconds" IS 'Used for time based result depending on the result''s type.';
COMMENT ON COLUMN "results"."points" IS 'Used for points based result depending on the result''s type.';
COMMENT ON COLUMN "results"."uci_points" IS 'Uci point attributed for this result.';


-- Standing UCI ranking for a given season.
-- Can be for: riders, teams or nations.
-- 
CREATE TABLE "uci_rankings" (
  "id" UUID PRIMARY KEY,
  "season_year" smallint NOT NULL,
  "season_gender" genders NOT NULL,
  "discipline_code" varchar NOT NULL,
  "rider_id" UUID,
  "team_season_id" UUID,
  "nation_code" VARCHAR(3),
  "type" uci_ranking_types NOT NULL DEFAULT 'individual',
  "rank" SMALLINT NOT NULL,
  "points" INT NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  FOREIGN KEY ("season_year", "season_gender") REFERENCES seasons("year", "gender") ON DELETE CASCADE,
  FOREIGN KEY("rider_id") REFERENCES riders("id") ON DELETE CASCADE,
  FOREIGN KEY("discipline_code") REFERENCES disciplines("code"),
  FOREIGN KEY("team_season_id") REFERENCES team_seasons("id") ON DELETE CASCADE,
  FOREIGN KEY("nation_code") REFERENCES countries("alpha_3_code"),

  CONSTRAINT CHK_uci_ranking_valid_type CHECK (
    ("type" = 'individual' AND "rider_id" IS NOT NULL AND "team_season_id" IS NULL AND "nation_code" IS NULL)
    OR
    ("type" = 'team' AND "team_season_id" IS NOT NULL AND "rider_id" IS NULL AND "nation_code" IS NULL)
    OR
    ("type" = 'nation' AND "nation_code" IS NOT NULL AND "rider_id" IS NULL AND "team_season_id" IS NULL)
  )
);

CREATE INDEX "idx_uci_rankings_season" ON "uci_rankings" ("season_year", "season_gender");

COMMENT ON TABLE "uci_rankings" IS 'Depending on the type, either the rider, team or nation id should be used.';


-- List of teams that will be present at an event
CREATE TABLE "event_teams" (
  "event_id" UUID,
  "team_season_id" UUID,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  PRIMARY KEY ("event_id", "team_season_id"),

  FOREIGN KEY("event_id") REFERENCES events("id") ON DELETE CASCADE,
  FOREIGN KEY("team_season_id") REFERENCES team_seasons("id") ON DELETE CASCADE
);


-- List of riders that will be present at an event
CREATE TABLE "event_riders" (
  "event_id" UUID,
  "rider_id" UUID,
  "created_at" TIMESTAMPTZ DEFAULT (now()),
  "updated_at" TIMESTAMPTZ,

  PRIMARY KEY ("event_id", "rider_id"),

  FOREIGN KEY("event_id") REFERENCES events("id") ON DELETE CASCADE,
  FOREIGN KEY("rider_id") REFERENCES riders("id") ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS uci_rankings;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS event_riders;
DROP TABLE IF EXISTS event_teams;
DROP TABLE IF EXISTS team_rosters;
DROP TABLE IF EXISTS team_seasons;
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
