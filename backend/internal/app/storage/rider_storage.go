package storage

import (
	"context"
	"cycling-backend/internal/common/db"
	"cycling-backend/pkg/domain"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type riderStorage struct {
	db *sqlx.DB
}

func NewRiderStorage(db *sqlx.DB) domain.RiderStorage {
	return &riderStorage{db: db}
}

func (s *riderStorage) FindById(ctx context.Context, riderId uuid.UUID) (domain.Rider, error) {
	query, args, err := db.Q.Select("*").From("riders").Where(squirrel.Eq{"id": riderId.String()}).ToSql()

	if err != nil {
		return domain.Rider{}, err
	}

	var rider domain.Rider

	err = s.db.QueryRow(query, args...).Scan(rider)

	if err != nil {
		return domain.Rider{}, err
	}

	return rider, nil
}

func (s *riderStorage) FindManyIds(ctx context.Context, ridersId []uuid.UUID) ([]domain.Rider, error) {
	query, args, err := db.Q.Select("*").From("riders").Where(squirrel.Eq{"id": ridersId}).ToSql()

	if err != nil {
		return nil, err
	}

	var riders []domain.Rider

	err = s.db.Select(&riders, query, args...)

	if err != nil {
		return nil, err
	}

	return riders, nil
}
