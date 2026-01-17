package event

import (
	"context"
	"cycling-backend/internal/common/db"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type Storage interface {
	FindAllBySeason(ctx context.Context, seasonId uuid.UUID) ([]*Event, error)
}

type storage struct {
	db *sqlx.DB
}

func NewEventStorage(db *sqlx.DB) Storage {
	return &storage{db: db}
}

func (s *storage) FindAllBySeason(ctx context.Context, seasonId uuid.UUID) ([]*Event, error) {

	query, args, err := db.Q.Select("*").From("events").Where(squirrel.Eq{"season_id": seasonId}).OrderBy("start").ToSql()

	if err != nil {
		return nil, err
	}

	var events []*Event

	err = s.db.Select(&events, query, args...)

	if err != nil {
		return nil, err
	}

	return events, nil
}
