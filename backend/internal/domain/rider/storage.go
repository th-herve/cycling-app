package rider

import (
	"context"
	"cycling-backend/internal/common/db"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type Storage interface {
	FindById(ctx context.Context, riderId uuid.UUID) (Rider, error)
	FindManyIds(ctx context.Context, ridersId []uuid.UUID) ([]Rider, error)
}

type storage struct {
	db *sqlx.DB
}

func NewResultStorage(db *sqlx.DB) Storage {
	return &storage{db: db}
}

func (s *storage) FindById(ctx context.Context, riderId uuid.UUID) (Rider, error) {
	query, args, err := db.Q.Select("*").From("riders").Where(squirrel.Eq{"id": riderId.String()}).ToSql()

	if err != nil {
		return Rider{}, err
	}

	var rider Rider

	err = s.db.QueryRow(query, args...).Scan(rider)

	if err != nil {
		return Rider{}, err
	}

	return rider, nil
}

func (s *storage) FindManyIds(ctx context.Context, ridersId []uuid.UUID) ([]Rider, error) {
	query, args, err := db.Q.Select("*").From("riders").Where(squirrel.Eq{"id": ridersId}).ToSql()

	if err != nil {
		return nil, err
	}

	var riders []Rider

	err = s.db.Select(&riders, query, args...)

	if err != nil {
		return nil, err
	}

	return riders, nil
}
