package storage

import (
	"context"
	"cycling-backend/internal/common"
	"cycling-backend/internal/common/db"
	"cycling-backend/pkg/domain"

	"github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
)

type seasonStorage struct {
	db *sqlx.DB
}

func NewSeasonStorage(db *sqlx.DB) domain.SeasonStorage {
	return &seasonStorage{db: db}
}

func (s *seasonStorage) FindOne(ctx context.Context, year int, gender common.Gender) (*domain.Season, error) {

	var season domain.Season
	query, args, err := db.Q.Select("*").From("seasons").Where(squirrel.Eq{"year": year, "gender": gender}).ToSql()

	if err != nil {
		return nil, err
	}

	err = s.db.Get(&season, query, args...)

	if err != nil {
		return nil, err
	}

	return &season, nil
}
