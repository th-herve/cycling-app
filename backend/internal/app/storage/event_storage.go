package storage

import (
	"context"
	"cycling-backend/internal/common/db"
	"cycling-backend/pkg/domain"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type eventStorage struct {
	db *sqlx.DB
}

func NewEventStorage(db *sqlx.DB) domain.EventStorage {
	return &eventStorage{db: db}
}

func (s *eventStorage) FindAllBySeason(ctx context.Context, seasonId uuid.UUID) ([]*domain.Event, error) {

	query, args, err := db.Q.Select("*").From("events").Where(squirrel.Eq{"season_id": seasonId}).OrderBy("start").ToSql()

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
