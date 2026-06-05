package storage

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/th-herve/cycling-app/backend/internal/common/db"
	"github.com/th-herve/cycling-app/backend/pkg/domain"
)

type RiderStorage struct {
	db *sqlx.DB
}

func NewRiderStorage(db *sqlx.DB) *RiderStorage {
	return &RiderStorage{db: db}
}

func (s *RiderStorage) FindByID(ctx context.Context, riderID uuid.UUID) (domain.Rider, error) {
	query, args, err := db.Q.Select("*").From("riders").Where(squirrel.Eq{"id": riderID.String()}).ToSql()

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

func (s *RiderStorage) FindManyIDs(ctx context.Context, ridersID []uuid.UUID) ([]*domain.Rider, error) {
	query, args, err := db.Q.Select("*").From("riders").Where(squirrel.Eq{"id": ridersID}).ToSql()

	if err != nil {
		return nil, err
	}

	var riders []*domain.Rider

	err = s.db.Select(&riders, query, args...)

	if err != nil {
		return nil, err
	}

	return riders, nil
}
