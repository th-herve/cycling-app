package storage

import (
	"context"

	"github.com/Masterminds/squirrel"
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

	query, args, err := db.Q.Select("*").From("events").Where(squirrel.Eq{"season_year": seasonYear, "season_gender": seasonGender}).OrderBy("start").ToSql()

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
