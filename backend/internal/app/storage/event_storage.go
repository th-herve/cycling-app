package storage

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/th-herve/cycling-app/backend/internal/common/db"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type EventStorage struct {
	db *sqlx.DB
}

func NewEventStorage(db *sqlx.DB) *EventStorage {
	return &EventStorage{db: db}
}

func (s *EventStorage) FindAllBySeason(ctx context.Context, seasonYear int, seasonGender domain.Gender) ([]*domain.Event, error) {

	// Stages don't have an event_series_id. They inherit the public series
	// (and therefore slug) from their parent event. Thus all the joining required and the COALESCE.
	query, args, err :=
		db.Q.Select("events.*, COALESCE(event_series.name, parent_series.name) as slug").
			From("events").
			LeftJoin("event_series ON events.event_series_id = event_series.id").
			LeftJoin("events parent_event ON events.parent_event_id = parent_event.id").
			LeftJoin("event_series parent_series ON parent_event.event_series_id = parent_series.id").
			Where(squirrel.Eq{"events.season_year": seasonYear, "events.season_gender": seasonGender}).
			OrderBy("start").
			ToSql()

	if err != nil {
		return nil, err
	}

	var events []*domain.Event

	err = s.db.Select(&events, query, args...)

	if err != nil {
		return nil, err
	}

	return events, nil
}

func (s *EventStorage) FindByID(ctx context.Context, id uuid.UUID) (domain.Event, error) {

	var event domain.Event

	query, args, err :=
		db.Q.Select("events.*, event_series.name as slug").
			From("events").
			Join("event_series ON events.event_series_id = event_series.id").
			Where(squirrel.Eq{"events.id": id.String()}).
			ToSql()

	if err != nil {
		return event, err
	}

	err = s.db.GetContext(ctx, &event, query, args...)

	if err != nil {
		return event, err
	}

	return event, nil
}

func (s *EventStorage) FindBySlug(ctx context.Context, slug string, seasonYear int) (domain.Event, error) {

	var event domain.Event

	query, args, err :=
		db.Q.Select("events.*, event_series.name as slug").
			From("events").
			Join("event_series ON events.event_series_id = event_series.id").
			Where(squirrel.Eq{"event_series.name": slug, "events.season_year": seasonYear}).
			ToSql()

	if err != nil {
		return event, err
	}

	err = s.db.GetContext(ctx, &event, query, args...)

	if err != nil {
		return event, err
	}

	return event, nil
}

func (s *EventStorage) FindStages(ctx context.Context, parentEventID uuid.UUID) ([]*domain.Event, error) {

	query, args, err :=
		db.Q.Select("*").
			From("events").
			Where(squirrel.Eq{"parent_event_id": parentEventID.String()}).
			OrderBy("start").
			ToSql()

	if err != nil {
		return nil, err
	}

	var stages []*domain.Event

	err = s.db.Select(&stages, query, args...)

	if err != nil {
		return nil, err
	}

	return stages, nil
}
